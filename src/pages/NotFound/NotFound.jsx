import { useNavigate } from 'react-router-dom';
import './NotFound.scss';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="not-found">
      <div className="content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you’re looking for doesn’t exist or has been moved.</p>
        <button onClick={() => navigate('/')}>Go to Homepage</button>
      </div>
    </section>
  );
};

export default NotFound;
