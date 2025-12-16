
import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { Drawer } from './components/Drawer/Drawer';
import { Breadcrumbs } from './components/Breadcrumbs/Breadcrumbs';
import type { BreadcrumbItem } from './components/Breadcrumbs/Breadcrumbs';
import { ConstitutionPage } from './pages/ConstitutionPage';
import { VersionHistoryPage } from './pages/VersionHistoryPage';
import { OpinionListPage } from './pages/OpinionListPage';
import { OpinionDetailPage } from './pages/OpinionDetailPage';
import { NewOpinionPage } from './pages/NewOpinionPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { versionHistoryData } from './data/versionHistory';
import { opinionData } from './data/opinions';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';

type ViewState = 'version-history' | 'version-detail' | 'opinion' | 'opinion-detail' | 'new-opinion' | 'changelog';

function AppContent() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [view, setView] = useState<ViewState>('version-history');
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [selectedOpinionId, setSelectedOpinionId] = useState<string | null>(null);

  // --- Router Logic ---

  useEffect(() => {
    const handleUrlChange = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const viewParam = params.get('view') as ViewState;
        const idParam = params.get('id');

        if (viewParam === 'version-history') {
          setView('version-history');
        } else if (viewParam === 'version-detail' && idParam) {
          setView('version-detail');
          setSelectedVersionId(idParam);
        } else if (viewParam === 'opinion') {
          setView('opinion');
        } else if (viewParam === 'opinion-detail' && idParam) {
          setView('opinion-detail');
          setSelectedOpinionId(idParam);
        } else if (viewParam === 'new-opinion') {
          setView('new-opinion');
        } else if (viewParam === 'changelog') {
          setView('changelog');
        } else {
          // Default to version-history (Root)
          setView('version-history');
        }
      } catch (e) {
        console.error("Router error:", e);
        setView('version-history');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange(); // Initial sync

    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const navigateTo = (newView: ViewState, id?: string) => {
    // 1. Update State First
    setView(newView);
    if (newView === 'version-detail') setSelectedVersionId(id || null);
    if (newView === 'opinion-detail') setSelectedOpinionId(id || null);
    
    setIsDrawerOpen(false);
    window.scrollTo(0, 0);

    // 2. Try to update URL
    try {
      const url = new URL(window.location.href);
      
      // Treat 'version-history' as the root path /
      if (newView === 'version-history') {
        url.searchParams.delete('view');
        url.searchParams.delete('id');
      } else {
        url.searchParams.set('view', newView);
        if (id) {
          url.searchParams.set('id', id);
        } else {
          url.searchParams.delete('id');
        }
      }

      window.history.pushState({}, '', url);
    } catch (e) {
      console.warn("Navigation URL update failed.", e);
    }
  };

  // --- Derived Data ---

  const selectedVersion = useMemo(() => {
    if (view === 'version-detail' && selectedVersionId) {
      return versionHistoryData.find(v => v.id === selectedVersionId);
    }
    return undefined;
  }, [view, selectedVersionId]);

  const selectedOpinion = useMemo(() => {
    if (view === 'opinion-detail' && selectedOpinionId) {
      return opinionData.find(o => o.id === selectedOpinionId);
    }
    return undefined;
  }, [view, selectedOpinionId]);

  // --- Breadcrumbs Logic ---

  const breadcrumbs = useMemo(() => {
    // Base Breadcrumb is now Home (which renders Version History)
    const items: BreadcrumbItem[] = [
      { 
        label: 'Version History', 
        action: () => navigateTo('version-history') 
      }
    ];

    if (view === 'version-history') {
      items[0].active = true;
    } else if (view === 'version-detail') {
      // Parent is Version History (Root)
      if (selectedVersion) {
        items.push({ 
          label: selectedVersion.meta.title, 
          active: true 
        });
      }
    } else if (view === 'opinion') {
       items.push({
         label: 'Opinion List',
         active: true
       });
    } else if (view === 'opinion-detail') {
      items.push({
        label: 'Opinion List',
        action: () => navigateTo('opinion')
      });
      if (selectedOpinion) {
        items.push({
          label: `${selectedOpinion.owner.username} Opinion`,
          active: true
        });
      }
    } else if (view === 'new-opinion') {
      items.push({
        label: 'Opinion List',
        action: () => navigateTo('opinion')
      });
      items.push({
        label: 'New Opinion',
        active: true
      });
    } else if (view === 'changelog') {
      items.push({
        label: 'Changelog',
        active: true
      });
    }

    return items;
  }, [view, selectedVersion, selectedOpinion]);

  return (
    <div className="min-h-screen bg-background text-textPrimary font-sans antialiased selection:bg-primary/30 transition-colors duration-300">
      <Navbar
          onMenuClick={() => setIsDrawerOpen(true)}
          onHomeClick={() => navigateTo('version-history')}
      />
      
      <Breadcrumbs items={breadcrumbs} />

      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onNavigate={(target) => {
           if (target === 'version-history') navigateTo('version-history');
           else if (target === 'opinion') navigateTo('opinion');
           else if (target === 'changelog') navigateTo('changelog');
           else navigateTo('version-history');
        }} 
      />
      
      <main>
        {view === 'version-history' && (
          <VersionHistoryPage 
            onSelectVersion={(v) => navigateTo('version-detail', v.id)} 
          />
        )}

        {view === 'version-detail' && selectedVersion && (
          <ConstitutionPage 
            customData={selectedVersion} 
            onOpinionClick={(id) => navigateTo('opinion-detail', id)}
          />
        )}

        {view === 'opinion' && (
          <OpinionListPage 
            onSelectOpinion={(o) => navigateTo('opinion-detail', o.id)} 
            onCreateOpinion={() => navigateTo('new-opinion')}
          />
        )}

        {view === 'opinion-detail' && selectedOpinion && (
          <OpinionDetailPage 
             opinion={selectedOpinion} 
             onNavigate={(view, id) => navigateTo(view as any, id)}
          />
        )}

        {view === 'new-opinion' && (
          <NewOpinionPage onPublish={() => navigateTo('opinion')} />
        )}

        {view === 'changelog' && (
          <ChangelogPage />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
