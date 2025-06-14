import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RedirectHandler: React.FC = () => {
  const { loginCallback, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        loginCallback().then(() => {
          window.location.replace('/');
        });
      } else {
        window.location.replace('/');
      }
    }
  }, [isLoading, isAuthenticated, loginCallback]);

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
      Completing login...
    </div>
  );
};

export default RedirectHandler; 