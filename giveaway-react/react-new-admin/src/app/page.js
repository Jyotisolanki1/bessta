// project import
import MinimalLayout from 'layout/MinimalLayout';
// import Landing from 'views/landing';
import Login from 'views/authentication/auth1/login';

// ==============================|| HOME PAGE ||============================== //
export default function HomePage() {
  return (
    <MinimalLayout>
      <Login />
    </MinimalLayout>
  );
}
