import { Navigate, Outlet } from 'react-router-dom';

const RotaPrivada = () => {
  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RotaPrivada;