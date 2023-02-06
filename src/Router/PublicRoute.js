import { useContext, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { AuthContext } from '../App';

const Public = ({ component: Component }) => {
  const Auth = useContext(AuthContext);
  useEffect(() => {
    Auth.setThemeMode(false);
  });

  return Auth.Auth ? <Navigate to="/" /> : <Component /> ;
}

export default Public;