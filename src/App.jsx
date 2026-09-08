import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import SubNav from './components/SubNav';
import Breadcrumbs from './components/Breadcrumbs';

// Lazy-load pages for code splitting — only the main bundle loads initially
const HomePage = lazy(() => import('./pages/HomePage'));
const StatePage = lazy(() => import('./pages/StatePage'));
const DistrictPage = lazy(() => import('./pages/DistrictPage'));
const PlacePage = lazy(() => import('./pages/PlacePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const FestivalsPage = lazy(() => import('./pages/FestivalsPage'));

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-[200] focus:rounded-br-2xl focus:bg-indigo focus:px-[18px] focus:py-3 focus:font-bold focus:text-white">
          Skip to content
        </a>
        <Header />
        <SubNav />
        <Breadcrumbs />
        <main id="main" className="min-h-[70vh]">
          <Suspense fallback={<div className="flex items-center justify-center py-32"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo border-t-transparent"></div></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/state/:stateId" element={<StatePage />} />
              <Route path="/state/:stateId/:districtId" element={<DistrictPage />} />
              <Route path="/state/:stateId/:districtId/:placeId" element={<PlacePage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/festivals" element={<FestivalsPage />} />
            </Routes>
          </Suspense>
        </main>
        <footer className="mt-16 flex flex-wrap justify-between gap-4 border-t border-black/10 px-[clamp(18px,4vw,48px)] py-10 text-[0.82rem] opacity-65 dark:border-white/10">
          <div>© Culture Click — an interactive prototype. Not a booking platform; a living atlas of India's culture.</div>
          <div>Made for wandering minds · {new Date().getFullYear()}</div>
        </footer>
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  );
}
