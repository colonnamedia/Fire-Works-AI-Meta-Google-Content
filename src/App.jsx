import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Public pages
import Landing from '@/pages/Landing';
import Pricing from '@/pages/Pricing';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Support from '@/pages/Support';

// App pages (inside layout)
import UserDashboard from '@/pages/UserDashboard';
import NewAdIdea from '@/pages/NewAdIdea';
import SavedIdeas from '@/pages/SavedIdeas';
import AdIdeaDetail from '@/pages/AdIdeaDetail';
import BillingPage from '@/pages/BillingPage';
import AccountSettings from '@/pages/AccountSettings';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminUsers from '@/pages/AdminUsers';
import AdAssets from '@/pages/AdAssets';

import AppLayout from '@/components/layout/AppLayout';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/support" element={<Support />} />

      {/* App routes (with layout) */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/new-idea" element={<NewAdIdea />} />
        <Route path="/saved-ideas" element={<SavedIdeas />} />
        <Route path="/idea/:id" element={<AdIdeaDetail />} />
        <Route path="/assets" element={<AdAssets />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App