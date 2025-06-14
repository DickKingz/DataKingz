import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RedirectHandler: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        login().then(() => {
          window.location.replace('/');
        });
      } else {
        window.location.replace('/');
      }
    }
  }, [isLoading, isAuthenticated, login]);

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
      Completing login...
    </div>
  );
};

export default RedirectHandler; 