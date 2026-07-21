# 🌱 OptiCrop

> **OptiCrop** is a state-of-the-art agricultural platform that uses Machine Learning and Artificial Intelligence to provide farmers with data-driven crop recommendations, real-time climate integration, and a conversational AI advisory assistant. 

---

## ✨ Features

- **🎯 Predictive Crop Recommendations**: Enter soil metrics (Nitrogen, Phosphorous, Potassium, pH, rainfall) to receive highly accurate crop suggestions powered by a custom Random Forest Machine Learning model.
- **☁️ Live Climate Integration**: Simply type your city, and OptiCrop automatically fetches real-time temperature and humidity data using the OpenWeatherMap API to feed into the prediction engine.
- **🤖 OptiCrop AI Assistant**: A built-in, ChatGPT-style conversational assistant powered by **Google Gemini**. It retains session history and provides expert, agriculture-specific advice (disease management, soil health, farming practices).
- **🔒 Secure User Authentication**: Full user account management with secure login/registration, JWT-based sessions, and encrypted passwords.
- **📊 Personalized Dashboard & History**: Users can view their past prediction results and manage their account details.
- **🎨 Stunning UI/UX**: A highly polished, responsive React frontend featuring smooth scroll-triggered micro-animations, glassmorphism design cues, and dynamic layouts.

---

## 🛠️ Technology Stack

**Frontend (Client):**
- React.js (Vite)
- React Router DOM
- Bootstrap 5 & Vanilla CSS (Custom Design System)
- React Markdown & Rehype Raw (For parsing AI responses)
- Axios

**Backend (Server):**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Google Generative AI SDK (Gemini)
- Python (Child Process) + Scikit-Learn + Pandas (For ML predictions)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+) with `scikit-learn` and `pandas` installed.
- MongoDB (Local or Atlas)
- OpenWeatherMap API Key
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harish81-k/OptiCrop.git
   cd OptiCrop
   ```

2. **Setup the Backend**
   ```bash
   cd mern-app/server
   npm install
   ```
   - Create a `.env` file in the `server` directory and add your keys:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     GEMINI_API_KEY=your_gemini_api_key
     WEATHER_API_KEY=your_openweathermap_api_key
     ```
   - Run the server:
     ```bash
     npm start
     ```

3. **Setup the Frontend**
   ```bash
   cd ../client
   npm install
   ```
   - Create a `.env` file in the `client` directory:
     ```env
     VITE_API_URL=http://localhost:5000
     ```
   - Run the development server:
     ```bash
     npm run dev
     ```

4. **Open in Browser**
   Navigate to `http://localhost:5173` to explore OptiCrop.

---

## 📸 Screenshots

*(You can add screenshots of the beautiful Home, Predict, and AI Assistant pages here)*

---

## 📄 License
This project is licensed under the MIT License.
