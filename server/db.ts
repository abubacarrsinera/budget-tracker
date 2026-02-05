import { and, between, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, transactions, categories, type Transaction, type Category, type InsertTransaction, type InsertCategory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Transaction queries
export async function createTransaction(userId: number, data: Omit<InsertTransaction, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(transactions).values({
    ...data,
    userId,
  });
  
  return result;
}

export async function getTransactions(userId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date))
    .limit(limit)
    .offset(offset);
}

export async function getTransactionsByDateRange(userId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        between(transactions.date, startDate, endDate)
      )
    )
    .orderBy(desc(transactions.date));
}

export async function updateTransaction(userId: number, transactionId: number, data: Partial<InsertTransaction>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .update(transactions)
    .set(data)
    .where(
      and(
        eq(transactions.id, transactionId),
        eq(transactions.userId, userId)
      )
    );
}

export async function deleteTransaction(userId: number, transactionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .delete(transactions)
    .where(
      and(
        eq(transactions.id, transactionId),
        eq(transactions.userId, userId)
      )
    );
}

export async function getTransactionStats(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const stats = await db
    .select({
      type: transactions.type,
      total: sql<number>`CAST(SUM(${transactions.amount}) AS UNSIGNED)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .groupBy(transactions.type);
  
  return stats;
}

export async function getCategoryBreakdown(userId: number, type: 'income' | 'expense') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .select({
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
      total: sql<number>`CAST(SUM(${transactions.amount}) AS UNSIGNED)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.type, type)
      )
    )
    .groupBy(transactions.categoryId, categories.name, categories.color);
}

// Category queries
export async function createCategory(userId: number, data: Omit<InsertCategory, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(categories).values({
    ...data,
    userId,
  });
}

export async function getCategories(userId: number, type?: 'income' | 'expense') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (type) {
    return db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.userId, userId),
          eq(categories.type, type)
        )
      );
  }
  
  return db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId));
}

export async function updateCategory(userId: number, categoryId: number, data: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .update(categories)
    .set(data)
    .where(
      and(
        eq(categories.id, categoryId),
        eq(categories.userId, userId)
      )
    );
}

export async function deleteCategory(userId: number, categoryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .delete(categories)
    .where(
      and(
        eq(categories.id, categoryId),
        eq(categories.userId, userId)
      )
    );
}

export async function getOrCreateDefaultCategories(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getCategories(userId);
  if (existing.length > 0) return existing;
  
  const defaultCategories = [
    // Income categories
    { name: 'Salary', type: 'income' as const, color: '#10B981', icon: 'briefcase' },
    { name: 'Freelance', type: 'income' as const, color: '#10B981', icon: 'code' },
    { name: 'Investment', type: 'income' as const, color: '#10B981', icon: 'trending-up' },
    { name: 'Gift', type: 'income' as const, color: '#10B981', icon: 'gift' },
    { name: 'Other Income', type: 'income' as const, color: '#10B981', icon: 'plus-circle' },
    // Expense categories
    { name: 'Food & Dining', type: 'expense' as const, color: '#F59E0B', icon: 'utensils' },
    { name: 'Transportation', type: 'expense' as const, color: '#F59E0B', icon: 'car' },
    { name: 'Shopping', type: 'expense' as const, color: '#F59E0B', icon: 'shopping-bag' },
    { name: 'Entertainment', type: 'expense' as const, color: '#F59E0B', icon: 'film' },
    { name: 'Utilities', type: 'expense' as const, color: '#F59E0B', icon: 'zap' },
    { name: 'Healthcare', type: 'expense' as const, color: '#F59E0B', icon: 'heart' },
    { name: 'Rent', type: 'expense' as const, color: '#F59E0B', icon: 'home' },
    { name: 'Other Expense', type: 'expense' as const, color: '#F59E0B', icon: 'minus-circle' },
  ];
  
  const created = await Promise.all(
    defaultCategories.map(cat => createCategory(userId, cat))
  );
  
  return created;
}
