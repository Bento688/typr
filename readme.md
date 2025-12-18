# Typr

Typr is a modern typing speed test application built to help users improve their typing efficiency. It features real-time statistics, user authentication, and progress tracking.

## 🚀 Tech Stack

**Frontend:**

- React (Vite)
- TailwindCSS & DaisyUI (Styling)
- Zustand (State Management)
- Recharts (Data Visualization)

**Backend:**

- Node.js & Express
- MongoDB & Mongoose
- Passport.js (Google OAuth & Local Auth)
- Nodemailer (Email Verification)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A [MongoDB](https://www.mongodb.com/) database (Local or Atlas)
- A Google Cloud Project (for OAuth)

## 📥 Installation

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/Bento688/typr.git](https://github.com/Bento688/typr.git)
    cd typr
    ```

2.  **Install dependencies**
    You can install dependencies for both the frontend and backend from the root folder:

    ```bash
    # Install backend dependencies
    cd backend && npm install

    # Install frontend dependencies
    cd ../frontend && npm install

    # Return to root
    cd ..
    ```

## ⚙️ Environment Configuration

You need to set up environment variables for the backend to work correctly.

1.  Create a `.env` file in the `backend/` directory:

    ```bash
    cd backend
    touch .env
    ```

2.  Add the following variables to `backend/.env`:

    ```env
    # Server Configuration
    PORT=3000
    NODE_ENV=development
    SESSION_SECRET=your_super_secret_session_key

    # Database
    MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/typr_db

    # Google OAuth (for Login)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # Email Service (Nodemailer - Gmail)
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_gmail_app_password
    ```

    > **Note:** For `EMAIL_PASS`, if you are using Gmail, you must generate an [App Password](https://myaccount.google.com/apppasswords), not your regular email password.

## 🏃‍♂️ Running Locally (Development)

To run the app in development mode with hot-reloading, you will need two terminal instances.

**Terminal 1: Start the Backend**

```bash
cd backend
npm run dev
```

Server will run on http://localhost:3000

**Terminal 2: Start the Frontend**

```bash
cd frontend
npm run dev
```

Client will run on http://localhost:5173 (or similar)

## 🏗️ Production Build

To build the frontend and serve it through the backend (as configured in your deployment scripts):

```bash
# From the root directory
npm run build   # Installs deps and builds frontend
npm start       # Starts the backend (which serves the built frontend)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

    Fork the Project

    Create your Feature Branch (git checkout -b feature/AmazingFeature)

    Commit your Changes (git commit -m 'Add some AmazingFeature')

    Push to the Branch (git push origin feature/AmazingFeature)

    Open a Pull Request

## 📄 License

Distributed under the ISC License.
