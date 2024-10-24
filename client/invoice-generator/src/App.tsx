import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import AddProductPage from './pages/AddProductPage.js';

function App() {
  

  return (
    <>
    <Router>
      <Routes>
      <Route path="/" element={<LoginPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/AddProductPage" element={<AddProductPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
