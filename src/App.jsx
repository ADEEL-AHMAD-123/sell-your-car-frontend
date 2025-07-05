import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header/Header';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const App = () => (
  <BrowserRouter> 
  <Header />
    <AppRoutes />
  </BrowserRouter>
);

export default App;
