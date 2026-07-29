import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import SubNav from './components/SubNav';
import Breadcrumbs from './components/Breadcrumbs';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import StatePage from './pages/StatePage';
import DistrictPage from './pages/DistrictPage';
import PlacePage from './pages/PlacePage';
import WishlistPage from './pages/WishlistPage';
import ComparePage from './pages/ComparePage';
import TimelinePage from './pages/TimelinePage';
import FestivalsPage from './pages/FestivalsPage';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-[200] focus:rounded-br-2xl focus:bg-indigo focus:px-[18px] focus:py-3 focus:font-bold focus:text-white">
          Skip to content
        </a>
        <Header />
        <SubNav />
        <Breadcrumbs />
        <main id="main" className="min-h-[70vh]">
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
        </main>
        <footer className="mt-16 flex flex-wrap justify-between gap-4 border-t border-black/10 px-[clamp(18px,4vw,48px)] py-10 text-[0.82rem] opacity-65 dark:border-white/10">
          <div>© Culture Click — an interactive prototype. Not a booking platform; a living atlas of India's culture.</div>
          <div>Made for wandering minds · {new Date().getFullYear()}</div>
        </footer>
        <Chatbot />
      </HashRouter>
    </AppProvider>
  );
}
