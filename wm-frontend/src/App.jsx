import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import MainView from './components/MainView';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/main" 
          element={
            <ProtectedRoute>
              <MainView />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;