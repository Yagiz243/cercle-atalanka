import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminProvider>
          <RouterProvider router={router} />
        </AdminProvider>
      </CartProvider>
    </AuthProvider>
  );
}
