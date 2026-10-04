import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import { AuthProvider } from './context/AuthProvider';
import { AtlasProvider } from './context/AtlasProvider';
import Header from './components/Header';
import SubNav from './components/SubNav';
import Breadcrumbs from './components/Breadcrumbs';
import PageSkeleton from './components/PageSkeleton';

// Lazy-load pages for code splitting — only the main bundle loads initially.
const HomePage = lazy(() => import('./pages/HomePage'));
const StatePage = lazy(() => import('./pages/StatePage'));
const DistrictPage = lazy(() => import('./pages/DistrictPage'));
const PlacePage = lazy(() => import('./pages/PlacePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const FestivalsPage = lazy(() => import('./pages/FestivalsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));

// Kept as thunks (not the lazy components) so prefetching cannot accidentally mount them.
const loaders = [
  () => import('./pages/HomePage'),
  () => import('./pages/StatePage'),
  () => import('./pages/DistrictPage'),
  () => import('./pages/PlacePage'),
  () => import('./pages/WishlistPage'),
  () => import('./pages/ComparePage'),
  () => import('./pages/TimelinePage'),
  () => import('./pages/FestivalsPage'),
  () => import('./pages/LoginPage'),
  () => import('./pages/ResetPasswordPage'),
  () => import('./pages/AccountPage'),
];

/**
 * Prefetch the remaining page chunks once the browser is idle. Navigations then resolve
 * from memory instead of waiting on a network round-trip, which is what made clicking
 * through from card to card feel like it had a pause in it.
 */
function useIdlePrefetch() {
  useEffect(() => {
    const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const handle = schedule(() => loaders.forEach((load) => load().catch(() => {})));
    return () => cancel(handle);
  }, []);
}

/** Scroll to the top whenever the route changes — previously duplicated in four pages. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  useIdlePrefetch();

  return (
    <AuthProvider>
      <AtlasProvider>
        <AppProvider>
          <BrowserRouter>
            <ScrollToTop />
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-[200] focus:rounded-br-2xl focus:bg-indigo focus:px-[18px] focus:py-3 focus:font-bold focus:text-white"
            >
              Skip to content
            </a>

            {/*
              One shell for every band — header, section nav, breadcrumbs, content, footer —
              centred and capped at a width a large monitor can actually read. Full-bleed at
              2560px produced metre-long lines of prose and card grids stretched until each card
              was wider than it was tall. Everything sits inside it, so the sticky header and the
              breadcrumb trail stay aligned with the content beneath them.
            */}
            <div className="mx-auto flex min-h-dvh w-full max-w-[1560px] flex-col">
              <Header />
              <SubNav />
              <Breadcrumbs />

              <main id="main" className="min-h-[70vh]">
                <Suspense fallback={<PageSkeleton />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/state/:stateId" element={<StatePage />} />
                    <Route path="/state/:stateId/:districtId" element={<DistrictPage />} />
                    <Route path="/state/:stateId/:districtId/:placeId" element={<PlacePage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/timeline" element={<TimelinePage />} />
                    <Route path="/festivals" element={<FestivalsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </Suspense>
              </main>

              <footer className="mt-auto flex flex-wrap justify-between gap-4 border-t border-black/10 px-[clamp(18px,4vw,48px)] py-10 pt-10 text-[0.82rem] opacity-65 dark:border-white/10">
                <div>
                  © Culture Click — an interactive prototype. Not a booking platform; a living atlas
                  of India&apos;s culture.
                </div>
                <div>Made for wandering minds · {new Date().getFullYear()}</div>
              </footer>
            </div>
          </BrowserRouter>
        </AppProvider>
      </AtlasProvider>
    </AuthProvider>
  );
}
