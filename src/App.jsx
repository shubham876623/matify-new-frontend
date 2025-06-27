// src/App.jsx
import React from "react";
import AppRoutes from "./routes/Routes";
// import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <Router>
      {/* <AuthProvider> */}
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      {/* </AuthProvider> */}
    </Router>
  );
};

export default App;
  