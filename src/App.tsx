import { useAppStore } from './store/appStore';
import LoginScreen from './components/LoginScreen';
import StudentDashboard from './components/StudentDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const store = useAppStore();

  if (!store.session) return <LoginScreen store={store} />;
  if (store.session.role === 'student') return <StudentDashboard store={store} />;
  if (store.session.role === 'driver') return <DriverDashboard store={store} />;
  return <AdminDashboard store={store} />;
}
