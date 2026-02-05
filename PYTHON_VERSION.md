# Budget Tracker - Python Version

If you prefer a **simple Python command-line application** instead of the web version, use this standalone Python script!

## Features

✅ Add income and expense transactions
✅ View financial dashboard
✅ Categorize transactions
✅ Generate financial reports
✅ View transaction history
✅ Delete transactions
✅ Data persistence (saves to JSON)
✅ No database required
✅ No server needed
✅ Pure Python (3.8+)

## Installation

### Step 1: Install Python

1. Download Python from: https://www.python.org/downloads/
2. Choose version 3.8 or higher
3. Run the installer
4. **Important:** Check "Add Python to PATH"

### Step 2: Verify Installation

Open Command Prompt/Terminal and run:
```bash
python --version
```

You should see: `Python 3.x.x`

## Running the Application

### Option 1: From VS Code

1. Open the `budget_tracker_export` folder in VS Code
2. Open the Terminal (Ctrl + `)
3. Run:
   ```bash
   python budget_tracker_python.py
   ```

### Option 2: From Command Prompt/Terminal

1. Navigate to the folder:
   ```bash
   cd path/to/budget_tracker_export
   ```

2. Run:
   ```bash
   python budget_tracker_python.py
   ```

### Option 3: Double-click (Windows only)

1. Right-click `budget_tracker_python.py`
2. Select "Open with Python"

## Using the Application

### Main Menu

```
📋 BUDGET TRACKER MENU
1. View Dashboard
2. Add Income
3. Add Expense
4. View Transactions
5. View Report
6. Delete Transaction
7. Exit
```

### Example Usage

**Adding Income:**
```
Select option (1-7): 2
Income Categories: Salary, Freelance, Investment, Bonus, Other Income
Category: Salary
Amount: $5000
Description (optional): Monthly salary
✅ Income of $5000.00 added to Salary
```

**Adding Expense:**
```
Select option (1-7): 3
Expense Categories: Food, Transport, Entertainment, Utilities, Shopping, Healthcare, Education, Other
Category: Food
Amount: $150
Description (optional): Groceries
✅ Expense of $150.00 added to Food
```

**View Dashboard:**
```
Select option (1-7): 1

============================================================
💰 BUDGET TRACKER DASHBOARD
============================================================
Total Balance:          $4850.00
Total Income:           $5000.00
Total Expenses:         $150.00
Total Transactions:            2
============================================================
```

**View Report:**
```
Select option (1-7): 5

============================================================
📊 FINANCIAL REPORT
============================================================

Summary:
  Balance:    $4850.00
  Income:     $5000.00
  Expenses:   $150.00

Expense Breakdown:
  Food                  $150.00 (100.0%) - 1 transactions

Income Breakdown:
  Salary                $5000.00 (100.0%) - 1 transactions
============================================================
```

## Data Storage

All your data is saved in `budget_data.json` in the same folder.

Example:
```json
{
  "transactions": [
    {
      "id": 1,
      "type": "income",
      "amount": 5000,
      "category": "Salary",
      "description": "Monthly salary",
      "date": "2026-02-05 10:30:45"
    },
    {
      "id": 2,
      "type": "expense",
      "amount": 150,
      "category": "Food",
      "description": "Groceries",
      "date": "2026-02-05 11:15:22"
    }
  ]
}
```

## Categories

### Income Categories
- Salary
- Freelance
- Investment
- Bonus
- Other Income

### Expense Categories
- Food
- Transport
- Entertainment
- Utilities
- Shopping
- Healthcare
- Education
- Other

## Keyboard Shortcuts

| Action | Key |
|--------|-----|
| Exit menu | Press 7 then Enter |
| Stop application | Ctrl + C |
| Clear screen | Ctrl + L (Linux/Mac) or cls (Windows) |

## Troubleshooting

### Error: "python: command not found"
**Solution:** Python is not installed or not in PATH
- Install Python from https://www.python.org/
- Make sure to check "Add Python to PATH"

### Error: "No such file or directory"
**Solution:** You're in the wrong folder
- Use `cd` to navigate to the correct folder
- Example: `cd C:\Users\YourName\Desktop\budget_tracker_export`

### Data not saving
**Solution:** Check file permissions
- Make sure the folder is writable
- Try running as Administrator

### Application crashes
**Solution:** Check Python version
- Run: `python --version`
- Must be Python 3.8 or higher

## Backing Up Your Data

Your data is in `budget_data.json`. To backup:

1. Copy `budget_data.json` to another location
2. Or use cloud storage (Google Drive, Dropbox, etc.)

## Restoring Data

1. Copy your backup `budget_data.json` to the folder
2. Run the application
3. Your transactions will be restored

## Modifying the Code

You can edit `budget_tracker_python.py` to:
- Add new categories
- Change the menu
- Add new features
- Customize the display

Just save and run again!

## Python vs Web Version

| Feature | Python | Web |
|---------|--------|-----|
| Setup | Simple | Requires Node.js |
| Database | JSON file | MySQL |
| Interface | Command-line | Browser |
| Mobile | No | Yes |
| Features | Basic | Advanced |
| Charts | No | Yes |
| Authentication | No | Yes |
| Deployment | Local only | Can be hosted |

## Quick Commands Reference

```bash
# Run the application
python budget_tracker_python.py

# Check Python version
python --version

# View the data file
cat budget_data.json

# Delete all data (WARNING!)
rm budget_data.json
```

## Tips & Tricks

1. **Quick Backup:** Copy `budget_data.json` before making changes
2. **Export Data:** Open `budget_data.json` in Excel or Google Sheets
3. **Multiple Users:** Create separate folders for each person
4. **Automation:** Schedule the script to run at specific times

## Next Steps

1. ✅ Run the application
2. ✅ Add your first transaction
3. ✅ View the dashboard
4. ✅ Generate a report
5. ✅ Check the JSON file

## Need Help?

- Check the menu options
- Try each feature
- Review the example usage above
- Check the code comments

Enjoy tracking your budget! 💰
