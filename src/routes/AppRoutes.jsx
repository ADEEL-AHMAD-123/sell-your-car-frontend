import { Routes, Route } from 'react-router-dom';
import MainLayout from '../Layouts/MainLayout';
import AdminLayout from '../Layouts/AdminLayout';

import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import Contact from '../pages/contact/Contact'; 
import HowItWorks from '../pages/HowItsWorks/HowItWorks';
import FaqsPage from '../pages/FaqsPage/FaqsPage';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import QuoteResult from '../pages/QuoteResult/QuoteResult';
import Dashboard from '../pages/Dashboard/Dashboard';
import NotFound from '../pages/NotFound/NotFound';
import ManualValuationPage from '../pages/ManualValuationPage/ManualValuationPage';
import AdminDashboard from '../pages/AdminPages/AdminDashboard';
import ManageUsers from '../pages/AdminPages/ManageUsers';
import ManageQuotes from '../pages/AdminPages/ManageQuotes';
import QuoteConfirmation from '../pages/QuoteConfirmation/QuoteConfirmation'
import ProtectedRoute from './Protectedroute';
import AdminRoute from './AdminRoute';

const AppRoutes = () => (
  <Routes>
    {/* Public routes with Main Layout */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/faqs" element={<FaqsPage />} />
      <Route path="/quote-result" element={<ProtectedRoute><QuoteResult /></ProtectedRoute>} />
      <Route path="/quote-confirmation" element={<ProtectedRoute><QuoteConfirmation /></ProtectedRoute>} />
      <Route path="/manual-valuation" element={<ManualValuationPage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Admin routes with Admin Layout */}
    <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard/users" element={<ManageUsers />} />
      <Route path="/dashboard/quotes" element={<ManageQuotes />} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
