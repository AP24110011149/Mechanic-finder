# MechaFind

A comprehensive platform for connecting vehicle owners with trusted mechanics across India. Built with modern web technologies to provide seamless, real-time service requests and verified professional networks.

## 🚀 Features

- **User Authentication**: Secure JWT-based login for both users and mechanics
- **Mechanic Discovery**: Search and locate mechanics by location, specialization, and services
- **Real-time Communication**: Socket.io-powered live updates for service requests
- **Interactive Maps**: Leaflet-powered map integration for location-based services
- **Profile Management**: Comprehensive profiles for users and mechanics with ratings and specialties
- **Service Requests**: Create, track, and manage maintenance requests with status updates
- **Emergency Services**: Priority handling for urgent mechanical issues
- **Responsive Design**: Mobile-first UI built with Tailwind CSS and Framer Motion animations

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Socket.io** for real-time features
- **CORS** for cross-origin requests

### Frontend
- **React 19** with Vite build tool
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Leaflet** for map integration
- **Framer Motion** for animations
- **React Hot Toast** for notifications

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/AP24110011149/Mechanic-finder.git
   cd mechafind
   ```

2. Run the automated setup script:
   ```bash
   setup.bat
   ```
   Or manually install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `backend` directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/mechafind
   JWT_SECRET=your_jwt_secret_here
   PORT=3000
   ```

4. Seed the database (optional):
   ```bash
   cd backend
   node run-seed.js
   ```

## 🚀 Usage

### Development
1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Production Build
```bash
cd frontend
npm run build
npm run preview
```

## 📡 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/mechanics/register` - Mechanic registration
- `POST /api/mechanics/login` - Mechanic login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile

### Mechanics
- `GET /api/mechanics` - List all mechanics
- `GET /api/mechanics/:id` - Get mechanic details
- `PUT /api/mechanics/:id` - Update mechanic profile

### Requests
- `POST /api/requests` - Create service request
- `GET /api/requests` - Get user requests
- `PUT /api/requests/:id` - Update request status

## 🏗 Project Structure

```
mechafind/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Mechanic.js
│   │   └── Request.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── mechanicRoutes.js
│   │   └── requestRoutes.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   └── Map.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── setup.bat
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Contact

For questions or support, please open an issue on GitHub.</content>
<filePath">c:\Users\ANSHUL\Downloads\mechafind\mechafind\README.md