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
import NotFound from '../pages/NotFound/NotFound';
import ManualValuationPage from '../pages/ManualValuationPage/ManualValuationPage';
import AdminDashboard from '../pages/AdminPages/AdminDashboard/AdminDashboard';
import AdminUserManagement from '../pages/AdminPages/AdminUserManagement/AdminUserManagement';
import QuoteConfirmation from '../pages/QuoteConfirmation/QuoteConfirmation'
import ProtectedRoute from './Protectedroute';
import AdminRoute from './AdminRoute';
import AllManualQuotes from '../pages/AdminPages/AllManualQuotes/AllManualQuotes';
import AcceptedQuotes from '../pages/AdminPages/AcceptedQuotes/AcceptedQuotes';
import CollectedQuotesPage from '../pages/AdminPages/CollectedQuotesPage/CollectedQuotes';
import AdminAnalyticsPage from '../pages/AdminPages/AdminAnalytics/AdminAnalyticsPage';
import AdminQuoteSearchPage from '../pages/AdminPages/AdminQuoteSearchPage/AdminQuoteSearchPage';
import AdminSettingsPage from '../pages/AdminPages/AdminSettingsPage/AdminSettingsPage';
import TermsOfService from '../pages/TermsOfService/TermsOfService';
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy';
import ForgotPassword from '../pages/ForgotPasswordPage/ForgotPassword';
import ResetPassword from '../pages/ResetPasswordPage/ResetPassword';
import EmailVerification from '../pages/EmailVerificationPage/EmailVerification';
import UnsubscribePage from '../pages/promoEmailUnsubscribe/UnsubscribeSuccess';

import BlogPage from '../pages/Blog/BlogPage';
import BlogPost from '../pages/Blog/BlogPost';
import AdminBlogManagement from '../pages/AdminPages/AdminBlogManagement/AdminBlogManagement';
import AdminBlogForm from '../pages/AdminPages/AdminBlogManagement/AdminBlogForm';

import PendingAutoQuotes from '../pages/AdminPages/PendingAutoQuotes/PendingAutoQuotes';
import RejectedQuotes from '../pages/AdminPages/RejectedQuotes/RejectedQuotes';
import AdminPromoEmail from '../pages/AdminPages/AdminPromoEmail/AdminPromoEmail';

const AppRoutes = () => (
  <Routes>
    {/* Public routes with Main Layout */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/faqs" element={<FaqsPage />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/quote-result" element={<ProtectedRoute><QuoteResult /></ProtectedRoute>} />
      <Route path="/quote-confirmation" element={<ProtectedRoute><QuoteConfirmation /></ProtectedRoute>} />
      <Route path="/manual-valuation" element={<ManualValuationPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<EmailVerification />} />

      {/* Blog Routes */}
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPost />} />

      {/* Unsubscribe route now uses the query parameter */}
      <Route path="/unsubscribe" element={<UnsubscribePage />} />
    </Route>

    {/* Admin routes with Admin Layout */}
    <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard/analytics" element={<AdminAnalyticsPage />} />
      <Route path="/dashboard/users" element={<AdminUserManagement />} />
      <Route path="/dashboard/quotes" element={<AdminQuoteSearchPage />} />
      <Route path="/dashboard/manual-quotes" element={<AllManualQuotes />} />
      <Route path="/dashboard/accepted-quotes" element={<AcceptedQuotes />} />
      <Route path="/dashboard/collected-quotes" element={<CollectedQuotesPage />} />
      <Route path="/dashboard/settings" element={<AdminSettingsPage />} />
      <Route path="/dashboard/pending-auto-quotes" element={<PendingAutoQuotes />} />
      <Route path="/dashboard/rejected-quotes" element={<RejectedQuotes />} />
      {/* Blog Admin Routes */}
      <Route path="/dashboard/blog" element={<AdminBlogManagement />} />
      <Route path="/dashboard/blog/create" element={<AdminBlogForm />} />
      <Route path="/dashboard/blog/edit/:id" element={<AdminBlogForm />} />
      {/* New Route for Promotional Emails */}
      <Route path="/dashboard/promo-email" element={<AdminPromoEmail />} /> {/* <-- NEW ROUTE */}
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
