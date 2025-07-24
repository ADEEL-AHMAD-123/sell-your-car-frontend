import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const MainLayout = () => (
  <>
    <Header />
    <Outlet />
    <ToastContainer position="top-right" autoClose={3000} />
    <Footer />
  </>
);

export default MainLayout;
