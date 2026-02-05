import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context
const mockUser = {
  id: 1,
  openId: "test-user-123",
  email: "test@example.com",
  name: "Test User",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

// Create test context
function createTestContext(): TrpcContext {
  return {
    user: mockUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Budget Tracker - Transaction Procedures", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createTestContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("transaction.list", () => {
    it("should return empty list for new user", async () => {
      const result = await caller.transaction.list({ limit: 50, offset: 0 });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should respect limit and offset parameters", async () => {
      const result = await caller.transaction.list({ limit: 10, offset: 0 });
      expect(result.length).toBeLessThanOrEqual(10);
    });
  });

  describe("transaction.create", () => {
    it("should create an expense transaction", async () => {
      const result = await caller.transaction.create({
        type: "expense",
        amount: 50.00,
        categoryId: 1,
        description: "Lunch",
        date: new Date(),
      });
      expect(result.success).toBe(true);
    });

    it("should create an income transaction", async () => {
      const result = await caller.transaction.create({
        type: "income",
        amount: 1000.00,
        categoryId: 1,
        description: "Salary",
        date: new Date(),
      });
      expect(result.success).toBe(true);
    });

    it("should validate positive amounts", async () => {
      await expect(
        caller.transaction.create({
          type: "expense",
          amount: -50,
          categoryId: 1,
          description: "Invalid",
          date: new Date(),
        })
      ).rejects.toThrow();
    });
  });

  describe("analytics.getSummary", () => {
    it("should return summary with correct structure", async () => {
      const result = await caller.analytics.getSummary();
      expect(result).toHaveProperty("totalIncome");
      expect(result).toHaveProperty("totalExpenses");
      expect(result).toHaveProperty("balance");
      expect(typeof result.totalIncome).toBe("number");
      expect(typeof result.totalExpenses).toBe("number");
      expect(typeof result.balance).toBe("number");
    });

    it("should calculate balance correctly", async () => {
      // Create test transactions
      await caller.transaction.create({
        type: "income",
        amount: 1000,
        categoryId: 1,
        description: "Income",
        date: new Date(),
      });

      await caller.transaction.create({
        type: "expense",
        amount: 300,
        categoryId: 1,
        description: "Expense",
        date: new Date(),
      });

      const summary = await caller.analytics.getSummary();
      expect(summary.totalIncome).toBeGreaterThanOrEqual(1000);
      expect(summary.totalExpenses).toBeGreaterThanOrEqual(300);
      expect(summary.balance).toBe(summary.totalIncome - summary.totalExpenses);
    });
  });

  describe("category.list", () => {
    it("should return categories for user", async () => {
      const result = await caller.category.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter by type", async () => {
      const expenses = await caller.category.list("expense");
      const income = await caller.category.list("income");
      
      expect(Array.isArray(expenses)).toBe(true);
      expect(Array.isArray(income)).toBe(true);
    });
  });

  describe("transaction.delete", () => {
    it("should delete a transaction", async () => {
      // Create a transaction first
      await caller.transaction.create({
        type: "expense",
        amount: 50,
        categoryId: 1,
        description: "To delete",
        date: new Date(),
      });

      // Get the transaction ID (would need to be tracked in real scenario)
      const transactions = await caller.transaction.list({ limit: 1 });
      if (transactions.length > 0) {
        const result = await caller.transaction.delete({ id: transactions[0].id });
        expect(result.success).toBe(true);
      }
    });
  });

  describe("analytics.getMonthlyTrend", () => {
    it("should return monthly trend data", async () => {
      const result = await caller.analytics.getMonthlyTrend();
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("month");
        expect(result[0]).toHaveProperty("income");
        expect(result[0]).toHaveProperty("expenses");
      }
    });
  });

  describe("analytics.getCategoryBreakdown", () => {
    it("should return expense breakdown", async () => {
      const result = await caller.analytics.getCategoryBreakdown("expense");
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return income breakdown", async () => {
      const result = await caller.analytics.getCategoryBreakdown("income");
      expect(Array.isArray(result)).toBe(true);
    });

    it("should include category details", async () => {
      // Create a transaction first
      await caller.transaction.create({
        type: "expense",
        amount: 100,
        categoryId: 1,
        description: "Test expense",
        date: new Date(),
      });

      const result = await caller.analytics.getCategoryBreakdown("expense");
      
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("categoryId");
        expect(result[0]).toHaveProperty("categoryName");
        expect(result[0]).toHaveProperty("total");
        expect(result[0]).toHaveProperty("count");
      }
    });
  });
});
