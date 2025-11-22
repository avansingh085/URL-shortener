# 🔗 TinyLink URL Shortener Backend

This is the backend service for the **TinyLink** URL Shortener application. It is built using **Node.js**, the **Express.js** framework, and **MongoDB** (via Mongoose) to provide robust and scalable link short-coding and redirection capabilities.

### 🌟 Key Features

* **Efficient Redirection:** Utilizes a unique index on the short code for extremely fast lookups.
* **Unique Code Generation:** Uses Node's built-in `crypto` module to generate random, unique, and URL-safe short codes.
* **Click Tracking:** Increments a `TotalClicks` counter on every successful link redirect.
* **Health Check:** Dedicated `/healthz` endpoint for monitoring and deployment verification.

---

## ⚙️ Installation and Setup

Follow these steps to get the project running locally.

### 1. Prerequisites

* **Node.js** (v18+)
* **npm** (Node Package Manager)
* **MongoDB** instance (local or cloud)

### 2. Project Setup

1.  **Install Dependencies:**
    ```bash
    npm install express cors mongoose
    ```
    *(Note: Assuming `crypto` is used from the standard Node library.)*

2.  **Database Configuration**

    * Ensure your MongoDB connection string is correctly passed to the `connectToDatabase()` function (typically via environment variables in a `.env` file).

    ```
    # Example (in a .env file)
    DB_URI="mongodb://localhost:27017/tinylinkdb"
    ```

3.  **Run the Server:**
    The application listens on **port 5000**.
    ```bash
    node app.js
    ```
    (You should see: `Server is running on port 5000`)

---

## 💡 API Endpoints

The core API routes are mounted under `/api/links`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/:code` | **REDIRECT:** Finds the link by code, increments `TotalClicks`, and redirects the client to the `TargetURL`. |
| `GET` | `/healthz` | **HEALTH CHECK:** Returns service status (`{"ok": true, "version": "1.0"}`). |
| `POST` | `/api/links` | **CREATE LINK:** Shortens a new URL. **Body:** JSON with `TargetURL`. |
| `GET` | `/api/links` | **GET ALL LINKS:** Retrieves a list of all short links and their metrics. |
| `DELETE` | `/api/links/:code` | **DELETE LINK:** Removes a short link from the database using its unique code. |

### Example Request (Creating a Link)

| Detail | Value |
| :--- | :--- |
| **Endpoint** | `POST http://localhost:5000/api/links` |
| **Body (JSON)**| `{"TargetURL": "https://www.google.com"}` |

---

## 🚀 Optimization Focus for Job Assignment

### Query Optimization via Indexing

The schema is optimized to handle high redirection traffic efficiently. The following unique index is applied to the Mongoose model:

```javascript
tinyLinkSchema.index({ ShortCode: 1 }, { unique: true });
