import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Workspace from './pages/Workspace';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Header from './components/Header';
import Footer from './components/Footer';

export default function AppRoutes({ userToken, emotionalState, setEmotionalState }) {
  const navigate = useNavigate();

  const handleSelectState = (state) => {
    setEmotionalState(state);
    navigate('/workspace');
  };
  const onBack = () => {
    navigate('/');
  };
 return (
  <>
    <Header />
    <Routes>
      <Route
        path="/"
        element={<Home onSelectEmotionalState={handleSelectState} />}
      />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/login"
        element={userToken ? <Navigate to="/workspace" /> : <Login />}
      />
      <Route
        path="/register"
        element={userToken ? <Navigate to="/workspace" /> : <Register />}
      />
      <Route
        path="/workspace"
        element={
          userToken ? (
            <Workspace
              emotionalState={emotionalState}
              onBack={onBack} // ✅ Esto habilita el botón ←
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
      
      <Route path="/workspace/:id" element={<Workspace />} />

    </Routes>
    <Footer />
  </>
);

}
