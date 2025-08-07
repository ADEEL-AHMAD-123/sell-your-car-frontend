import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
const App = () => (
  <BrowserRouter> 

    <AppRoutes />
    <ToastContainer position="top-right" autoClose={3000} />

  </BrowserRouter>
);

export default App;
