import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header/Header';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Footer from './components/Footer/Footer';

const App = () => (
  <BrowserRouter> 
  <Header />
    <AppRoutes />
  <Footer/>  
  </BrowserRouter>
);

export default App;
