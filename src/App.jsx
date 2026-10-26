import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { ThemeProvider } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";

const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Home = lazy(() => import("@/pages/Home"));
const NewTrip = lazy(() => import("@/pages/NewTrip"));
const TripDetail = lazy(() => import("@/pages/TripDetail"));
const Unpack = lazy(() => import("@/pages/Unpack"));
const TripRecap = lazy(() => import("@/pages/TripRecap"));
const Settings = lazy(() => import("@/pages/Settings"));
const Closet = lazy(() => import("@/pages/Closet"));
const Landing = lazy(() => import("@/pages/Landing"));
const RetroLanding = lazy(() => import("@/pages/RetroLanding"));
const BrandBook = lazy(() => import("@/pages/BrandBook"));

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  );
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense key={location.pathname} fallback={<PageLoader />}>
        <Routes location={location}>
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
          <Route path="/landing" element={<PageTransition><Landing /></PageTransition>} />
          <Route path="/retro-landing" element={<PageTransition><RetroLanding /></PageTransition>} />
          <Route path="/brand-book" element={<PageTransition><BrandBook /></PageTransition>} />
          <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
            <Route element={<Layout />}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/new" element={<PageTransition><NewTrip /></PageTransition>} />
              <Route path="/trip/:id" element={<PageTransition><TripDetail /></PageTransition>} />
              <Route path="/trip/:id/unpack" element={<PageTransition><Unpack /></PageTransition>} />
              <Route path="/trip/:id/recap" element={<PageTransition><TripRecap /></PageTransition>} />
              <Route path="/closet" element={<PageTransition><Closet /></PageTransition>} />
              <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
            </Route>
          </Route>
          <Route path="*" element={<PageTransition><PageNotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};


function App() {

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App