#!/usr/bin/env python3
"""
Budget Tracker - Python Standalone Version
A simple command-line budget tracking application
"""

import json
import os
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path


class BudgetTracker:
    """Main Budget Tracker class for managing transactions and calculations."""
    
    def __init__(self, data_file: str = "budget_data.json"):
        self.data_file = data_file
        self.transactions: List[Dict] = []
        self.categories = {
            "income": ["Salary", "Freelance", "Investment", "Bonus", "Other Income"],
            "expense": ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Healthcare", "Education", "Other"]
        }
        self.load_data()
    
    def load_data(self):
        """Load transactions from JSON file."""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    self.transactions = data.get('transactions', [])
                    print(f"✅ Loaded {len(self.transactions)} transactions")
            except Exception as e:
                print(f"❌ Error loading data: {e}")
                self.transactions = []
        else:
            print("📝 Starting with empty transaction list")
            self.transactions = []
    
    def save_data(self):
        """Save transactions to JSON file."""
        try:
            with open(self.data_file, 'w') as f:
                json.dump({'transactions': self.transactions}, f, indent=2)
            print("✅ Data saved successfully")
        except Exception as e:
            print(f"❌ Error saving data: {e}")
    
    def add_transaction(self, transaction_type: str, amount: float, category: str, description: str = ""):
        """Add a new transaction."""
        if amount <= 0:
            print("❌ Amount must be positive")
            return False
        
        transaction = {
            "id": len(self.transactions) + 1,
            "type": transaction_type,
            "amount": amount,
            "category": category,
            "description": description,
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        self.transactions.append(transaction)
        self.save_data()
        print(f"✅ {transaction_type.capitalize()} of ${amount:.2f} added to {category}")
        return True
    
    def get_summary(self) -> Dict:
        """Get financial summary."""
        total_income = sum(t['amount'] for t in self.transactions if t['type'] == 'income')
        total_expenses = sum(t['amount'] for t in self.transactions if t['type'] == 'expense')
        balance = total_income - total_expenses
        
        return {
            "total_income": total_income,
            "total_expenses": total_expenses,
            "balance": balance,
            "transaction_count": len(self.transactions)
        }
    
    def get_category_breakdown(self, transaction_type: str) -> Dict:
        """Get spending/income breakdown by category."""
        breakdown = {}
        
        for transaction in self.transactions:
            if transaction['type'] == transaction_type:
                category = transaction['category']
                if category not in breakdown:
                    breakdown[category] = {'total': 0, 'count': 0}
                breakdown[category]['total'] += transaction['amount']
                breakdown[category]['count'] += 1
        
        return breakdown
    
    def list_transactions(self, transaction_type: Optional[str] = None, limit: int = 10):
        """List transactions with optional filtering."""
        transactions = self.transactions
        
        if transaction_type:
            transactions = [t for t in transactions if t['type'] == transaction_type]
        
        # Sort by date (newest first)
        transactions = sorted(transactions, key=lambda x: x['date'], reverse=True)[:limit]
        
        if not transactions:
            print("No transactions found")
            return
        
        print("\n" + "="*80)
        print(f"{'Date':<20} {'Type':<10} {'Category':<15} {'Amount':<12} {'Description':<20}")
        print("="*80)
        
        for t in transactions:
            date = t['date'][:10]
            trans_type = t['type'].upper()
            category = t['category']
            amount = f"${t['amount']:.2f}"
            description = t['description'][:20] if t['description'] else "-"
            
            print(f"{date:<20} {trans_type:<10} {category:<15} {amount:>12} {description:<20}")
        
        print("="*80 + "\n")
    
    def delete_transaction(self, transaction_id: int):
        """Delete a transaction by ID."""
        for i, t in enumerate(self.transactions):
            if t['id'] == transaction_id:
                removed = self.transactions.pop(i)
                self.save_data()
                print(f"✅ Deleted transaction: {removed['type']} of ${removed['amount']:.2f}")
                return True
        
        print(f"❌ Transaction with ID {transaction_id} not found")
        return False
    
    def display_dashboard(self):
        """Display the main dashboard."""
        summary = self.get_summary()
        
        print("\n" + "="*60)
        print("💰 BUDGET TRACKER DASHBOARD")
        print("="*60)
        print(f"Total Balance:      ${summary['balance']:>12.2f}")
        print(f"Total Income:       ${summary['total_income']:>12.2f}")
        print(f"Total Expenses:     ${summary['total_expenses']:>12.2f}")
        print(f"Total Transactions: {summary['transaction_count']:>12}")
        print("="*60 + "\n")
    
    def display_report(self):
        """Display detailed financial report."""
        summary = self.get_summary()
        
        print("\n" + "="*60)
        print("📊 FINANCIAL REPORT")
        print("="*60)
        
        # Summary
        print(f"\nSummary:")
        print(f"  Balance:    ${summary['balance']:.2f}")
        print(f"  Income:     ${summary['total_income']:.2f}")
        print(f"  Expenses:   ${summary['total_expenses']:.2f}")
        
        # Expense breakdown
        expenses = self.get_category_breakdown('expense')
        if expenses:
            print(f"\nExpense Breakdown:")
            for category, data in sorted(expenses.items(), key=lambda x: x[1]['total'], reverse=True):
                percentage = (data['total'] / summary['total_expenses'] * 100) if summary['total_expenses'] > 0 else 0
                print(f"  {category:<15} ${data['total']:>10.2f} ({percentage:>5.1f}%) - {data['count']} transactions")
        
        # Income breakdown
        income = self.get_category_breakdown('income')
        if income:
            print(f"\nIncome Breakdown:")
            for category, data in sorted(income.items(), key=lambda x: x[1]['total'], reverse=True):
                percentage = (data['total'] / summary['total_income'] * 100) if summary['total_income'] > 0 else 0
                print(f"  {category:<15} ${data['total']:>10.2f} ({percentage:>5.1f}%) - {data['count']} transactions")
        
        print("="*60 + "\n")


def main():
    """Main application loop."""
    tracker = BudgetTracker()
    
    while True:
        print("\n📋 BUDGET TRACKER MENU")
        print("1. View Dashboard")
        print("2. Add Income")
        print("3. Add Expense")
        print("4. View Transactions")
        print("5. View Report")
        print("6. Delete Transaction")
        print("7. Exit")
        
        choice = input("\nSelect option (1-7): ").strip()
        
        if choice == '1':
            tracker.display_dashboard()
        
        elif choice == '2':
            print("\nIncome Categories:", ", ".join(tracker.categories['income']))
            category = input("Category: ").strip()
            try:
                amount = float(input("Amount: $"))
                description = input("Description (optional): ").strip()
                tracker.add_transaction('income', amount, category, description)
            except ValueError:
                print("❌ Invalid amount")
        
        elif choice == '3':
            print("\nExpense Categories:", ", ".join(tracker.categories['expense']))
            category = input("Category: ").strip()
            try:
                amount = float(input("Amount: $"))
                description = input("Description (optional): ").strip()
                tracker.add_transaction('expense', amount, category, description)
            except ValueError:
                print("❌ Invalid amount")
        
        elif choice == '4':
            print("\nFilter by type:")
            print("1. All")
            print("2. Income only")
            print("3. Expense only")
            filter_choice = input("Select (1-3): ").strip()
            
            filter_type = None
            if filter_choice == '2':
                filter_type = 'income'
            elif filter_choice == '3':
                filter_type = 'expense'
            
            tracker.list_transactions(filter_type)
        
        elif choice == '5':
            tracker.display_report()
        
        elif choice == '6':
            try:
                trans_id = int(input("Enter transaction ID to delete: "))
                tracker.delete_transaction(trans_id)
            except ValueError:
                print("❌ Invalid ID")
        
        elif choice == '7':
            print("👋 Goodbye!")
            break
        
        else:
            print("❌ Invalid option")


if __name__ == "__main__":
    main()
