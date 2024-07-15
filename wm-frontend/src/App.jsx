import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import MainView from './components/MainView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<MainView />} />
      </Routes>
    </Router>
  );
};

export default App;