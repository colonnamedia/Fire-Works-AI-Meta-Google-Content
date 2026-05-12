import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
          {/* Redirect old/unused routes to home */}
          <Route path="/pricing" element={<Navigate to="/" replace />} />
          <Route path="/terms" element={<Navigate to="/" replace />} />
          <Route path="/privacy" element={<Navigate to="/" replace />} />
          <Route path="/support" element={<Navigate to="/" replace />} />
          <Route path="/builder" element={<Navigate to="/get-started" replace />} />
          <Route path="/new-idea" element={<Navigate to="/get-started" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </ClerkProvider>
  );
}

export default App;
