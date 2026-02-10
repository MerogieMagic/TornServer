# 🛠️ Project Technologies & Tech Stack

This document provides a technical introduction to the core technologies powering the **Torn Server** project. It is designed to help developers understand *why* these tools were chosen and *how* they benefit the project.

## 1. Core Runtime & Language

### 🟢 Node.js & TypeScript
*   **What it is:** Node.js is the runtime that executes our backend code. TypeScript is a typed superset of JavaScript.
*   **Why we use it:**
    *   **Type Safety:** TypeScript catches errors at compile-time (e.g., trying to access `user.name` when `user` might be null), reducing runtime bugs in our complex war analytics.
    *   **Ecosystem:** Access to thousands of libraries (npm) for scheduling, API fetching, and data processing.
    *   **Performance:** Node.js's non-blocking I/O is ideal for handling concurrent API requests to Torn City.

## 2. Database & ORM

### 💎 Prisma ORM
*   **What it is:** A next-generation Object-Relational Mapper (ORM) for Node.js and TypeScript.
*   **Why we use it:**
    *   **Type-Safe Database Access:** Prisma generates a custom TypeScript client based on our schema. If we change the database structure, our code immediately knows about it.
    *   **Migrations:** We use `schema.prisma` to define our data model. Prisma manages the SQL migrations (`prisma migrate`) to keep our local and production databases in sync without writing raw Typescript SQL.
    *   **Intellisense:** Autocomplete for database queries in VS Code.

### 🗄️ Database (MySQL / PostgreSQL)
*   **What it is:** Relational database management systems.
*   **Role:**
    *   **War Analytics:** Stores millions of attack logs (`FactionAttack` table) for historical analysis.
    *   **Stock Predictor:** Stores time-series data of foreign stock levels.

## 3. Python Ecosystem (Foreign Stock Predictor)

### 🐍 Python 3.10+
*   **What it is:** A powerful scripting language used here for data science and specialized logic.
*   **Why we use it:**
    *   **Data Analysis:** Python excels at mathematical operations, making it the perfect choice for our "Restock Prediction" algorithm.
    *   **Separation of Concerns:** The stock predictor runs as a microservice, independent of the main Node.js server.

### 🤖 discord.py
*   **What it is:** The API wrapper for interacting with Discord.
*   **Role:** Powers the bot that monitors stock levels and sends real-time alerts to our faction channels.

## 4. Key Libraries

*   **`axios` / `aiohttp`:** For making HTTP requests to the Torn API and YATA API.
*   **`dotenv`:** Manages secrets (API Keys, DB Passwords) by loading them from a `.env` file, keeping them out of the source code.
*   **`fs` / `path`:** Standard Node.js modules for file manipulation (used in our logging and export scripts).
