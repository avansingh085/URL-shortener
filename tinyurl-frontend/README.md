#  TinyLink Frontend Application

This repository contains the frontend implementation for the **TinyLink URL Shortener**, built using **React** and styled with **Tailwind CSS**. The application features a **modular structure**, client-side routing, and dedicated components for handling core URL shortening features.

***

## Key Features & Technical Highlights

This project demonstrates several key features crucial for a scalable full-stack application:

* **Modular Architecture:** The codebase is cleanly separated into `components`, `pages`, and `services` for enhanced maintainability.
* **Hybrid Routing Strategy:**
    * **Path Routing (Redirect Handler):** The application uses the URL **pathname** (e.g., `/shortcode`) to render the **`<RedirectHandler />`**, allowing the frontend to intercept and process short links efficiently.
    * **Hash Routing (App Navigation):** Uses the URL **hash** (e.g., `#/dashboard`, `#/health`, `#/CODE`) for navigating the main application tabs.
* **Custom Link Creation:** Users can specify a **custom short code** during link creation, with client-side validation and dedicated handling for **409 Conflict** (code already in use) API responses.


***

##  Installation and Setup

Follow these steps to get the project running locally.

### 1. Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Frontend Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/avansingh085/URL-shortener.git
cd tinyurl-frontend
npm install   
