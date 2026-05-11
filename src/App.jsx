import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Toaster } from "@/components/ui/toaster";
import Landing from './pages/Landing';
import GetStarted from './pages/GetStarted';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/results" element={<Results />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </Router>
    </ClerkProvider>
  );
}

export default App;
