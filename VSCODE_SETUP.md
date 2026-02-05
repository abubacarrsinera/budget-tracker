# How to Run Budget Tracker in VS Code

This is a **Node.js/React web application**, not a Python project. Here's how to run it:

## Step 1: Install Prerequisites

### Windows/Mac/Linux
1. **Install Node.js** (includes npm)
   - Download from: https://nodejs.org/
   - Choose LTS version (18+)
   - Run the installer

2. **Install pnpm** (package manager)
   - Open Terminal/Command Prompt
   - Run: `npm install -g pnpm`

3. **Install VS Code**
   - Download from: https://code.visualstudio.com/
   - Install the application

## Step 2: Open Project in VS Code

1. Extract the ZIP file to a folder
2. Open VS Code
3. Click **File → Open Folder**
4. Select the `budget_tracker_export` folder
5. Click **Open**

## Step 3: Install Dependencies

1. Open Terminal in VS Code
   - Press **Ctrl + `** (backtick) or go to **View → Terminal**

2. Run the install command:
   ```bash
   pnpm install
   ```
   
   This will download all required packages (may take 2-3 minutes)

## Step 4: Configure Database

1. Create a `.env.local` file in the project root
2. Add the following content:

```
DATABASE_URL=mysql://root:password@localhost:3306/budget_tracker
JWT_SECRET=your-secret-key-12345
VITE_APP_ID=test-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

**Note:** Replace `password` with your MySQL password

## Step 5: Set Up Database

1. Make sure MySQL is running on your computer
   - Windows: Start MySQL from Services
   - Mac: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`

2. Create the database:
   ```bash
   mysql -u root -p
   CREATE DATABASE budget_tracker;
   EXIT;
   ```

3. Run migrations:
   ```bash
   pnpm db:push
   ```

## Step 6: Start the Application

Run the development server:
```bash
pnpm dev
```

You should see output like:
```
Server running on http://localhost:3000/
```

## Step 7: Open in Browser

1. Open your web browser
2. Go to: `http://localhost:3000`
3. You should see the Budget Tracker dashboard!

## Useful VS Code Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm test` | Run tests |
| `pnpm check` | Check TypeScript errors |
| `Ctrl + C` | Stop the server |

## Troubleshooting

### Error: "pnpm: command not found"
**Solution:** Install pnpm globally
```bash
npm install -g pnpm
```

### Error: "Cannot find module"
**Solution:** Install dependencies
```bash
pnpm install
```

### Error: "Port 3000 already in use"
**Solution:** Use a different port
```bash
PORT=3001 pnpm dev
```
Then go to `http://localhost:3001`

### Error: "Cannot connect to database"
**Solution:** Check MySQL is running
```bash
mysql -u root -p
```
If it fails, install/start MySQL

### Error: "ENOENT: no such file or directory, open '.env.local'"
**Solution:** Create the `.env.local` file (see Step 4)

## Project Structure Explained

```
budget_tracker_export/
├── src/                    # React code (what you edit)
│   ├── pages/             # Page components
│   ├── components/        # UI components
│   └── App.tsx            # Main app file
├── server/                # Backend code
│   └── routers.ts         # API endpoints
├── public/                # Built files (don't edit)
│   ├── index.html         # Main HTML
│   └── assets/            # CSS & JS
├── drizzle/               # Database schema
├── package.json           # Dependencies list
└── .env.local             # Your config (create this)
```

## Making Changes

1. **Edit React code** in `src/` folder
2. **Save the file** (Ctrl + S)
3. **Browser auto-refreshes** with your changes
4. **Check terminal** for any errors

## Common Tasks

### Add a new page
1. Create file: `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`
3. Save and it will appear in the app

### Add a new API endpoint
1. Edit `server/routers.ts`
2. Add your procedure
3. Restart server (Ctrl + C, then `pnpm dev`)

### View database
1. Use MySQL Workbench or command line:
   ```bash
   mysql -u root -p budget_tracker
   SHOW TABLES;
   SELECT * FROM transactions;
   ```

## Next Steps

1. ✅ Get it running (follow steps above)
2. ✅ Add your first transaction
3. ✅ Check the Dashboard
4. ✅ View Analytics
5. ✅ Explore the code

## Need Help?

- Check `README.md` for detailed docs
- Check `QUICKSTART.md` for quick reference
- Check `DOCUMENTATION.html` in a browser
- Review error messages in the terminal

## Important Notes

- This is a **web application** (not desktop app)
- Runs in your **browser** (not in VS Code)
- Uses **Node.js** (not Python)
- Requires **MySQL database**
- All code is in **TypeScript/React**

Enjoy building your budget tracker! 💰
