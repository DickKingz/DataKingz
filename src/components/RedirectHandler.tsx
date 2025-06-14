import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RedirectHandler: React.FC = () => {
  const { login, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      login().then(() => {
        window.location.replace('/');
      });
    }
    // eslint-disable-next-line
  }, [isLoading, login]);

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
      Completing login...
    </div>
  );
};

export default RedirectHandler; 