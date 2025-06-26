import React, { useContext, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Workspace from './pages/Workspace';
import Contact from './pages/Contact';
import { UserContext } from './context/UserContext';
function App() {
  const [page, setPage] = useState('home');
  const [emotionalState, setEmotionalState] = useState(null);
  const { userToken } = useContext(UserContext);
  const changePage = (p) => setPage(p);

  return (
    <>    <BrowserRouter>
      <Routes>
        <Route path="/login" element={userToken ? <Navigate to="/workspace" /> : <Login />} />
        <Route path="/register" element={userToken ? <Navigate to="/workspace" /> : <Register />} />
        <Route path="/workspace" element={userToken ? <Workspace /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={userToken ? "/workspace" : "/login"} />} />
      </Routes>
    </BrowserRouter>
      <Header onNavigate={changePage} />
      {page === 'home' && (
        <Home
          onSelectEmotionalState={(state) => {
            setEmotionalState(state);
            setPage('workspace');
          }}
        />
      )}
      {page === 'workspace' && (
        <Workspace emotionalState={emotionalState} onBack={() => setPage('home')} />
      )}
      {page === 'contact' && <Contact onBack={() => setPage('home')} />}
      <Footer onNavigate={changePage} />
    </>
  );
}

export default App;
