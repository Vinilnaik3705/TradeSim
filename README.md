# TradeSimPro - Advanced Trading Simulation Platform

TradeSimPro is a comprehensive real-time trading simulation platform designed to help users master the markets without financial risk. Built with a modern tech stack, it offers advanced charting, real-time market data (Crypto, Stocks, ETFs), and a professional trading interface.

## 🚀 Features

-   **Real-time Market Data**: Live tracking of Cryptocurrencies, Stocks, and ETFs.
-   **Interactive Dashboard**: Portfolio tracking, P/L analysis, and asset allocation visualization.
-   **Advanced Charting**: Professional-grade charts with multiple timeframes and indicators.
-   **Trading Simulation**: Buy and sell assets with virtual currency.
-   **Watchlist**: Track your favorite assets.
-   **News Feed**: Real-time financial news updates.
-   **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

### Frontend
-   **React 18**: UI Library
-   **Vite**: Build Tool
-   **Tailwind CSS**: Styling
-   **Recharts**: Data Visualization
-   **Lucide React**: Icons
-   **Axios**: API Requests

### Backend
-   **Node.js**: Runtime Environment
-   **Express.js**: Web Framework
-   **MongoDB**: Database
-   **Mongoose**: ODM
-   **JWT**: Authentication
-   **Helmet & Compression**: Security & Performance

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas)
-   [Git](https://git-scm.com/)

## 🔧 Installation & Setup

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/Vinilnaik3705/TradeSim.git
    cd TradeSim
    ```

2.  **Backend Setup**

    Navigate to the backend directory and install dependencies:

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the `backend` directory:

    ```env
    PORT=5000
    NODE_ENV=development
    MONGO_URI=mongodb://localhost:27017/tradesim
    JWT_SECRET=your_jwt_secret_key_here
    FRONTEND_URL=http://localhost:5173
    NEWS_API_KEY=your_news_api_key
    ```
    *Note: Replace `your_news_api_key` with a valid key if required.*

    Start the backend server:

    ```bash
    npm start
    # OR for development with auto-reload
    npm run dev
    ```

3.  **Frontend Setup**

    Open a new terminal, navigate to the frontend directory, and install dependencies:

    ```bash
    cd frontend
    npm install
    ```

    Create a `.env` file in the `frontend` directory (optional if using defaults):

    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

    Start the development server:

    ```bash
    npm run dev
    ```

4.  **Access the Application**

    Open your browser and navigate to:
    `http://localhost:5173`

## 📦 Deployment

### Backend
The backend is configured to run on standard Node.js environments. Ensure environment variables are set in your production environment (e.g., Render, Railway, Heroku).

### Frontend
The frontend can be built for production using:

```bash
cd frontend
npm run build
```

This generates a `dist` folder which can be deployed to static hosting providers like Vercel, Netlify, or Cloudflare Pages.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
