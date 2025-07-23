import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header/Header';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Footer from './components/Footer/Footer';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
const App = () => (
  <BrowserRouter> 
  <Header />
    <AppRoutes />
    <ToastContainer position="top-right" autoClose={3000} />
  <Footer/>  
  </BrowserRouter>
);

export default App;
