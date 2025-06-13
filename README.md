# 🚗 Ride Booking Application

A modern ride-hailing platform built with **React**, featuring separate interfaces for **Passengers** and **Drivers**.

---

## Live-Link : https://ride-booking-com-akok.vercel.app/

## 🚀 Features

### 🔐 User Authentication
- Secure login and registration
- Role-based access (Passenger/Driver)
- Session management

### 🧍 Passenger Features
- Book rides
- Track ride status
- View ride history
- Real-time driver location
- Cancel rides

### 🚘 Driver Features
- Accept/reject ride requests
- View passenger details
- Manage active rides
- Complete rides
- View earnings

### 🌐 General Features
- Responsive design
- Real-time updates
- Interactive maps
- Secure payment integration

---

## 🛠️ Technologies Used

### 🖥 Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Axios

### 🗄 Backend
- Node.js
- Express.js
- Supabase
- PostgreSQL

### 🔐 Authentication
- Supabase Auth
- JWT

---

## 📦 Installation

### 1. Clone the repository
git clone https://github.com/omkar1705/RideBooking.com.git

### 2. Install dependencies
cd ride-booking-app
npm install

### 3. Configure environment variables
# Create a .env file in the root directory and add:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 4. Start the development server
npm run dev
🧱 Project Structure

### src/
### ├── assets/
###│   └── images/
### ├── components/
### │   ├── Header.jsx
### │   ├── HeroSection.jsx
### │   ├── LoadingButton.jsx
### │   └── LoadingSpinner.jsx
### ├── context/
### │   └── AuthContext.jsx
### ├── pages/
### │   ├── Login.jsx
### │   ├── Signup.jsx
### │   ├── PassengerDashboard.jsx
### │   └── DriverDashboard.jsx
### ├── services/
### │   └── api.js
### └── App.jsx



### 🔐 Authentication Flow
User signs up with email, password, and role (passenger/driver)
User logs in with credentials
JWT token is stored in localStorage
Protected routes verify token validity
Role-based navigation to respective dashboards




### 🤝 Contributing
Fork the repository
Create your feature branch: git checkout -b feature/AmazingFeature
Commit your changes: git commit -m 'Add some AmazingFeature'
Push to the branch: git push origin feature/AmazingFeature
Open a Pull Request



### 📄 License
This project is licensed under the MIT License – see the LICENSE file for details.



### 🙏 #Acknowledgments
Supabase for backend services
Tailwind CSS for styling
React Icons for icons


### 📞 #Contact
Your Name – Omkar Milind Tigade – omkartigade@gmail.com
Project Link: https://github.com/yourusername/ride-booking-app
