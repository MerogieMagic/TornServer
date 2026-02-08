# Production Server Setup Guide

This guide outlines the steps to initialize the Torn Server in a new production environment.

## 1. Prerequisites
Ensure the following are installed on your production server:
-   **Node.js** (v18 or higher recommended)
-   **Git**
-   **MySQL** or **MariaDB** (or a connection string to a remote DB)

## 2. Clone Repository
Clone the code from the git repository:
```bash
git clone https://github.com/MerogieMagic/TornServer.git
cd TornServer
```

## 3. Install Dependencies
Install the necessary Node.js packages:
```bash
npm install
```

## 4. Configuration (.env)
You must manually create the `.env` file since it is excluded from git for security.
Create a file named `.env` in the root directory and add the following content (replacing values with your actual secrets):

```ini
# Database Connection String
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"

# Torn API Key (for fetching data)
TORN_API_KEY="YOUR_TORN_API_KEY"
```

## 5. Database Initialization
Run the following commands to set up the database schema and generate the Prisma Client:

```bash
# Apply migrations to the database
npx prisma migrate deploy

# Generate the Prisma Client types
npx prisma generate
```

## 6. Backfill Historical Data
To fetch all historical attack logs starting from **January 1, 2026**, run the following command:

```bash
npm run backfill:attacks
```
*Note: This process may take some time depending on the number of attacks.*

## 7. Start the Server
Build and start the server:

```bash
# Build the project
npm run build

# Start the server (for production, consider using pm2)
npm start
```

### Using PM2 (Optional but Recommended)
```bash
npm install -g pm2
pm2 start dist/index.js --name "torn-server"
pm2 save
pm2 startup
```
