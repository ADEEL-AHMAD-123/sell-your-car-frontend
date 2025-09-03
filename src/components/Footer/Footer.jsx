// Footer.js
import './Footer.scss';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Logo from '../../components/common/Logo/Logo'; 
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__col">
          <Logo className="logo--in-footer" theme='dark' />
          <p>Sell your scrap car with ease. Instant quotes, free collection, and fast payments nationwide.</p>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service </Link></li>
            <li><Link to="#">Blog</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Follow Us</h4>
        <div className="social-icons">
  <a 
    href="https://www.facebook.com/share/1ZPnReZaL2/?mibextid=wwXIfr"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaFacebookF />
  </a>
  <a
    href="https://twitter.com/your-twitter-handle" 
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaTwitter />
  </a>
  <a
    href="https://www.instagram.com/sellyourcar.info/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaInstagram />
  </a>
  <a
    href="https://www.linkedin.com/company/your-linkedin-page"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaLinkedinIn />
  </a>
</div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} SellYourCar. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;