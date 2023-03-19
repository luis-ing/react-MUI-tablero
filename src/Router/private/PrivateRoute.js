import { useContext, useEffect } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from '../../App';
import AppBarProvider from '../../Moduls/AppBar/';

const PrivateRoute = ({ children }) => {
  const Auth = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    // Auth.setThemeMode(false);
  });

  return Auth.Auth ? (
    <AppBarProvider>
      { children }
    </AppBarProvider>
  ) : <Navigate to="/login" state={{ from: location }} replace />;
}

export default PrivateRoute;