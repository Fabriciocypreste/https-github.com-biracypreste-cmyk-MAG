import React from 'react';
import { Sidebar } from './components/layout/Sidebar';

// Dynamically import pages to avoid loading them in the main app bundle
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const SerieAPage = React.lazy(() => import('./pages/admin/futebol/SerieA'));
const TeamProfile = React.lazy(() => import('./pages/admin/futebol/TeamProfile'));
const MatchDetails = React.lazy(() => import('./pages/admin/futebol/MatchDetails'));
const JsonGenerator = React.lazy(() => import('./pages/admin/futebol/JsonGenerator'));
const Settings = React.lazy(() => import('./pages/admin/Settings'));
const VODLibrary = React.lazy(() => import('./pages/admin/VODLibrary'));
const M3UPlaylistPage = React.lazy(() => import('./pages/admin/M3UPlaylist'));


const AdminPageLoader = () => (
    <div className="flex-1 p-8 bg-[#121212] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
);

const renderPage = (path: string) => {
    if (path.startsWith('/admin/futebol/times/')) return <TeamProfile />;
    if (path.startsWith('/admin/futebol/partidas/')) return <MatchDetails />;
    if (path.startsWith('/admin/futebol/serie-a')) return <SerieAPage />;
    if (path.startsWith('/admin/futebol/json-generator')) return <JsonGenerator />;
    if (path.startsWith('/admin/settings')) return <Settings />;
    if (path.startsWith('/admin/vod')) return <VODLibrary />;
    if (path.startsWith('/admin/m3u-playlist')) return <M3UPlaylistPage />;
    if (path.startsWith('/admin/dashboard')) return <Dashboard />;
    
    // Fallback to dashboard for unknown /admin routes
    return <Dashboard />;
};

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-full bg-[#121212]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <React.Suspense fallback={<AdminPageLoader />}>
            {renderPage(window.location.pathname)}
        </React.Suspense>
      </main>
    </div>
  );
}