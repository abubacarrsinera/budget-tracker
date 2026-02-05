import { BudgetDashboardLayout } from "@/components/BudgetDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AddTransaction() {
  const [, navigate] = useLocation();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const utils = trpc.useUtils();
  const { data: categories } = trpc.category.list.useQuery(type);
  const createTransaction = trpc.transaction.create.useMutation({
    onSuccess: () => {
      utils.transaction.list.invalidate();
      utils.analytics.getSummary.invalidate();
      utils.analytics.getMonthlyTrend.invalidate();
      toast.success("Transaction added successfully");
      navigate("/transactions");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add transaction");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    createTransaction.mutate({
      type,
      amount: parseFloat(amount),
      categoryId: parseInt(categoryId),
      description,
      date: new Date(date),
    });
  };

  return (
    <BudgetDashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add Transaction</h1>
          <p className="text-gray-600 mt-2">Record a new income or expense</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Transaction Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setType("income");
                      setCategoryId("");
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      type === "income"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-green-600">Income</div>
                    <div className="text-sm text-gray-600">Money coming in</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType("expense");
                      setCategoryId("");
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      type === "expense"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-red-600">Expense</div>
                    <div className="text-sm text-gray-600">Money going out</div>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <Label htmlFor="amount" className="font-semibold">
                  Amount *
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 border-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="font-semibold">
                  Category *
                </Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger id="category" className="mt-2 border-gray-300">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date" className="font-semibold">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2 border-gray-300"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add notes about this transaction..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 border-gray-300"
                  rows={4}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={createTransaction.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {createTransaction.isPending ? "Adding..." : "Add Transaction"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/transactions")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </BudgetDashboardLayout>
  );
}
