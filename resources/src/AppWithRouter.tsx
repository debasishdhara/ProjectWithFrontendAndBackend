// src/AppWithRouter.tsx
import { useLocation } from 'react-router-dom';
import App from './App';

const AppWithRouter = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return <App isAdminRoute={isAdminRoute} />;
};

export default AppWithRouter;
