import React, { useContext, useState } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import AppRoutes from './AppRoutes';

function AppWrapper() {
  const { token: userToken } = useContext(UserContext);
  const [emotionalState, setEmotionalState] = useState('relaxed');
  const navigate = useNavigate();

  // Esta función se pasa como prop a Workspace
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <AppRoutes
      userToken={userToken}
      emotionalState={emotionalState}
      setEmotionalState={setEmotionalState}
      onBack={handleBackToHome}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
