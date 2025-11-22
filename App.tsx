
import React, { useState, useEffect, Suspense } from 'react';
import StreamingApp from './StreamingApp';
import AdminLayout from './AdminLayout';

const Player = React.lazy(() => import('./pages/Player'));
const MatchPage = React.lazy(() => import('./pages/MatchPage'));

const AppLoader = () => (
    <div className="h-screen w-screen bg-[#141414] flex flex-col items-center justify-center gap-6">
        <img 
            src="https://chemorena.com/redfliz.png" 
            alt="RedFlix" 
            className="h-12 md:h-16 object-contain animate-pulse"
        />
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
);

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', onLocationChange);
    
    // Intercept pushState to detect navigation
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      onLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', onLocationChange);
      history.pushState = originalPushState;
    };
  }, []);

  const handleNavigate = (newPath: string) => {
    window.history.pushState({}, '', newPath);
    setPath(newPath);
  };

  // Provide a way for child components to navigate
  const renderCurrentPage = () => {
      if (path.startsWith('/admin')) {
        return <AdminLayout />;
      }
      
      if (path.startsWith('/watch')) {
        return (
            <Suspense fallback={<AppLoader />}>
                <Player />
            </Suspense>
        );
      }
      
      if (path.startsWith('/futebol/partida/')) {
        return (
            <Suspense fallback={<AppLoader />}>
                <MatchPage />
            </Suspense>
        );
      }

      return <StreamingApp />;
  }

  return renderCurrentPage();
}
