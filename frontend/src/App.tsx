import { RouterProvider } from 'react-router-dom';
import { FiltersProvider } from './context/FiltersContext';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { router } from './routes';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-xs text-slate-400">Checking session…</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Dashboard when authenticated
  return (
    <FiltersProvider>
      <RouterProvider router={router} />
    </FiltersProvider>
  );
}

export default App;

