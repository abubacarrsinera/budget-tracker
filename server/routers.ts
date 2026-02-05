import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  transaction: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ ctx, input }) => {
        const transactions = await db.getTransactions(ctx.user.id, input.limit, input.offset);
        return transactions.map(t => ({
          ...t,
          amount: t.amount / 100,
        }));
      }),

    create: protectedProcedure
      .input(
        z.object({
          type: z.enum(["income", "expense"]),
          amount: z.number().positive(),
          categoryId: z.number(),
          description: z.string().optional(),
          date: z.date(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createTransaction(ctx.user.id, {
          type: input.type,
          amount: Math.round(input.amount * 100),
          categoryId: input.categoryId,
          description: input.description,
          date: input.date,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          type: z.enum(["income", "expense"]).optional(),
          amount: z.number().positive().optional(),
          categoryId: z.number().optional(),
          description: z.string().optional(),
          date: z.date().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: Record<string, any> = {};
        if (data.type) updateData.type = data.type;
        if (data.amount) updateData.amount = Math.round(data.amount * 100);
        if (data.categoryId) updateData.categoryId = data.categoryId;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.date) updateData.date = data.date;

        await db.updateTransaction(ctx.user.id, id, updateData);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteTransaction(ctx.user.id, input.id);
        return { success: true };
      }),

    getByDateRange: protectedProcedure
      .input(z.object({ startDate: z.date(), endDate: z.date() }))
      .query(async ({ ctx, input }) => {
        const transactions = await db.getTransactionsByDateRange(
          ctx.user.id,
          input.startDate,
          input.endDate
        );
        return transactions.map(t => ({
          ...t,
          amount: t.amount / 100,
        }));
      }),
  }),

  analytics: router({
    getSummary: protectedProcedure.query(async ({ ctx }) => {
      const stats = await db.getTransactionStats(ctx.user.id);
      const income = stats.find(s => s.type === "income")?.total ?? 0;
      const expenses = stats.find(s => s.type === "expense")?.total ?? 0;
      return {
        totalIncome: income / 100,
        totalExpenses: expenses / 100,
        balance: (income - expenses) / 100,
      };
    }),

    getCategoryBreakdown: protectedProcedure
      .input(z.enum(["income", "expense"]))
      .query(async ({ ctx, input }) => {
        const breakdown = await db.getCategoryBreakdown(ctx.user.id, input);
        return breakdown.map(item => ({
          ...item,
          total: item.total / 100,
        }));
      }),

    getMonthlyTrend: protectedProcedure.query(async ({ ctx }) => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const transactions = await db.getTransactionsByDateRange(ctx.user.id, startDate, endDate);

      const monthlyData: Record<string, { income: number; expenses: number }> = {};

      transactions.forEach(t => {
        const month = new Date(t.date).toLocaleDateString("en-US", { year: "numeric", month: "short" });
        if (!monthlyData[month]) {
          monthlyData[month] = { income: 0, expenses: 0 };
        }
        const amount = t.amount / 100;
        if (t.type === "income") {
          monthlyData[month].income += amount;
        } else {
          monthlyData[month].expenses += amount;
        }
      });

      return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data,
      }));
    }),
  }),

  category: router({
    list: protectedProcedure
      .input(z.enum(["income", "expense"]).optional())
      .query(async ({ ctx, input }) => {
        let categories = await db.getCategories(ctx.user.id, input);
        if (categories.length === 0) {
          await db.getOrCreateDefaultCategories(ctx.user.id);
          categories = await db.getCategories(ctx.user.id, input);
        }
        return categories;
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          type: z.enum(["income", "expense"]),
          color: z.string().default("#3B82F6"),
          icon: z.string().default("tag"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createCategory(ctx.user.id, input);
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          color: z.string().optional(),
          icon: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateCategory(ctx.user.id, id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteCategory(ctx.user.id, input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
