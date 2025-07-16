// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import NotFound from '../pages/NotFound/NotFound';
import About from '../pages/About/About';
import Contact from '../pages/contact/Contact'; 
import HowItWorks from '../pages/HowItsWorks/HowItWorks';
import FaqsPage from '../pages/FaqsPage/FaqsPage';
import QuoteResult from '../pages/QuoteResult/QuoteResult';

import ProtectedRoute from './Protectedroute';
import AdminRoute from './AdminRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/how-it-works" element={<HowItWorks />} />
    <Route path="/faqs" element={<FaqsPage />} />
    <Route path="/quote-result" element={<ProtectedRoute><QuoteResult /></ProtectedRoute>} />

    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Protected admin route */}
    <Route path="/dashboard" element={
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    } />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
