# Agriscope - Tomato Excess Harvest Forecasting & Coordination System

**A web-based decision support system for agriculture officers to predict and manage tomato oversupply in Sri Lanka.**

## Project Overview

Agriscope is an intelligent web application developed to help agriculture officers at the Department of Agriculture forecast **excess tomato harvest** and coordinate planting, storage, transport, and loss management more effectively.

The system combines:
- A tuned Artificial Neural Network (ANN) model for excess harvest prediction
- A modern web dashboard for operational management
- Practical tools for planting schedules, storage allocation, vehicle management, loss reporting, and report generation

**Goal**: Reduce post-harvest waste and economic losses caused by seasonal tomato oversupply in Sri Lanka.


## Key Features

- **Excess Harvest Prediction** – Real-time forecasting using ANN model
- **Harvest Coordination** – Create, edit, and manage planting schedules
- **Storage & Transport Management** – Add facilities, allocate capacity, and manage vehicles
- **Seasonal Crop Calendar** – Record and track important seasonal events
- **Loss Reporting Module** – Document crop losses with detailed information
- **Interactive Data Visualization** – View historical loss trends and patterns
- **PDF Report Generation** – Professional reports for official use


## Technology Stack

### Frontend
- React.js (with React Router)
- Tailwind CSS + Lucide React icons

### Backend
- Node.js + Express.js
- MongoDB (MongoDB Atlas)
- JWT Authentication

### Machine Learning
- Python + FastAPI
- TensorFlow / Keras
- Hyperparameter tuning with Keras Tuner

### Other Tools
- Git & GitHub
- Jest + React Testing Library (Frontend Testing)
- Jest + Supertest (Backend Testing)
- Pytest (ML Service Testing)


## Quick Start (For Demonstration)

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
- git clone https://github.com/isuri54/agriscope.git
- cd agriscope
### 2. Backend Setup (web-backend)
- cd backend/web-backend
- npm install
- cp .env.example .env
- Configure MONGO_URI and JWT_SECRET in .env
- npm start
- Access the backend at: http://localhost:5000
### 3. ML Backend Setup (ml-backend)
- cd backend/ml-backend
- python -m venv venv
- .\venv\Scripts\activate
- pip install -r requirements.txt
- uvicorn main:app --reload --port 8000
### 4. Frontend Setup
- cd frontend
- npm install
- npm start
- Access the application at: http://localhost:3000
Default Login:

Username: officer1
Password: officer@2025


## Project Structure
agriscope/
├── frontend/               # React.js frontend
├── backend/
│   ├── web-backend/        # Node.js + Express + MongoDB
│   └── ml-backend/         # FastAPI + TensorFlow model
└── README.md

## Model Performance

- Mean Absolute Error (MAE): 521.6 tons
- Root Mean Squared Error (RMSE): 646.21 tons
- R² Score: 0.8598
- Accuracy (100 - MAPE): 88.48%


## Testing

- Frontend: Jest + React Testing Library
- Backend: Jest + Supertest
- ML Service: pytest
- Integration & Manual Testing


Author


Isuri


Final Year Computing Project


PUSL3190 - Computing Project

License


This project is developed as part of the final year undergraduate project.
