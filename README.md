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

## Screenshots

<img width="1919" height="1079" alt="Screenshot 2026-04-29 120539" src="https://github.com/user-attachments/assets/646207e3-4bd6-4f7d-9de5-7ba77320220e" />
<img width="1919" height="1079" alt="Screenshot 2026-04-29 120712" src="https://github.com/user-attachments/assets/e8198a3d-91f4-4b7a-bd5e-254b826aecc7" />
<img width="1919" height="1079" alt="Screenshot 2026-04-29 120311" src="https://github.com/user-attachments/assets/03eabe30-0a96-4a39-a597-8b78b9f8421f" />
<img width="1919" height="1079" alt="Screenshot 2026-04-29 120333" src="https://github.com/user-attachments/assets/68daf549-2f1f-42ae-a076-55056949535d" />
<img width="1919" height="1079" alt="Screenshot 2026-04-29 120356" src="https://github.com/user-attachments/assets/52278e81-3839-4d87-8a42-d6827177ab3c" />
<img width="1919" height="1079" alt="Screenshot 2026-04-29 120420" src="https://github.com/user-attachments/assets/8b910903-c483-4255-bb57-41993fd39b03" />
<img width="1919" height="1079" alt="Screenshot 2026-04-29 120452" src="https://github.com/user-attachments/assets/32819bdb-6daa-4884-80d9-1fddec1db7ae" />
<img width="1919" height="1079" alt="Screenshot 2026-04-29 120511" src="https://github.com/user-attachments/assets/5a29321a-a2db-4ce3-9625-49c8b97b0100" />

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


License


This project is developed as part of the final year undergraduate project.
