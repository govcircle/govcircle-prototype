
import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Plus } from 'lucide-react';
import { opinionData } from '../data/opinions';
import { OpinionCard } from '../components/Opinion/OpinionCard';
import { Button } from '../components/Button/Button';
import { Opinion } from '../types';
import { useUser } from '../contexts/UserContext';

type SortKey = 'created' | 'updated';
type SortDirection = 'asc' | 'desc';

interface OpinionListPageProps {
  onSelectOpinion?: (opinion: Opinion) => void;
  onCreateOpinion?: () => void;
}

export const OpinionListPage: React.FC<OpinionListPageProps> = ({ onSelectOpinion, onCreateOpinion }) => {
  const { isConnected } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  const ITEMS_PER_PAGE = 10;

  // --- Filtering & Sorting Logic ---
  const processedData = useMemo(() => {
    let data = [...opinionData];

    // 1. Search
    if (searchTerm) {
        const isNumeric = /^\d+$/.test(searchTerm);
        const shouldSearch = (isNumeric && searchTerm.length >= 3) || (!isNumeric && searchTerm.length >= 5);

        if (shouldSearch) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(op => 
                op.owner.username.toLowerCase().includes(lowerTerm) ||
                op.owner.handle.toLowerCase().includes(lowerTerm) ||
                op.intent.toLowerCase().includes(lowerTerm) ||
                op.status.toLowerCase().includes(lowerTerm) ||
                op.id.toLowerCase().includes(lowerTerm)
            );
        }
    }

    // 2. Sort
    if (sortConfig) {
        data.sort((a, b) => {
            const valA = sortConfig.key === 'created' ? a.createdTimestamp : a.updatedTimestamp;
            const valB = sortConfig.key === 'created' ? b.createdTimestamp : b.updatedTimestamp;
            
            return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        });
    }

    return data;
  }, [searchTerm, sortConfig]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const currentItems = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (key: SortKey) => {
    setSortConfig(current => {
        if (current?.key === key) {
            return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
        }
        return { key, direction: 'desc' }; // Default to newest first
    });
  };

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  return (
    <div className="w-full mx-auto p-5">
      {/* Page Header Area */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-8 gap-6">
        
        {/* Title Section */}
        <div className="flex-1">
            <h1 className="text-3xl font-bold text-textPrimary mb-2 tracking-tight">Opinion List</h1>
            <p className="text-textSecondary text-sm md:text-base max-w-2xl">
                Browse community sentiments, track voting intentions, and discover new governance proposals.
            </p>
        </div>
        
        {/* Controls Section: Search & Add Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-textSecondary group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search by user, handle, or intent..." 
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="
                        block w-full pl-10 pr-4 py-2.5 
                        bg-surface-secondary border border-border rounded-xl 
                        text-sm text-textPrimary placeholder-textSecondary/70
                        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary 
                        hover:border-textSecondary/50
                        transition-all duration-200 shadow-sm
                    "
                />
            </div>

            {/* Add Opinion Button - Hidden if not connected */}
            {isConnected && (
                <button 
                    onClick={onCreateOpinion}
                    className="
                        relative w-full sm:w-auto flex items-center justify-center gap-2 
                        bg-primary hover:bg-primary/90 text-white font-semibold 
                        py-2.5 px-5 rounded-xl 
                        shadow-lg shadow-primary/20 hover:shadow-primary/40
                        transition-all duration-100
                        whitespace-nowrap group
                    "
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>New Opinion</span>
                </button>
            )}
        </div>
      </div>

      {/* Grid Headers */}
      <div className="hidden md:flex items-center p-0 mb-4 text-xs font-bold uppercase tracking-wider text-textSecondary bg-surface-primary rounded-lg">
         <div className="w-[25%] px-4 py-4 flex items-center justify-center gap-1 text-center">
            Opinion owner
         </div>
         <div className="w-[35%] px-4 py-4 text-center">Intent</div>
         
         <div className="flex-1 flex">
             <div 
                className="flex-1 px-4 py-4 cursor-pointer hover:text-textPrimary transition-colors flex items-center justify-center gap-1 text-center"
                onClick={() => handleSort('created')}
             >
                Created Date
                <ArrowUpDown size={12} className={sortConfig?.key === 'created' ? 'text-primary' : 'opacity-50'} />
             </div>
             <div 
                className="flex-1 px-4 py-4 cursor-pointer hover:text-textPrimary transition-colors flex items-center justify-center gap-1 text-center"
                onClick={() => handleSort('updated')}
             >
                Last Update
                <ArrowUpDown size={12} className={sortConfig?.key === 'updated' ? 'text-primary' : 'opacity-50'} />
             </div>
         </div>

         <div className="w-[15%] px-4 py-4 flex items-center justify-center gap-1 text-center">
             Status
         </div>
      </div>

      {/* List Items */}
      <div className="space-y-4 mb-8">
        {currentItems.map(opinion => (
           <OpinionCard 
                key={opinion.id} 
                opinion={opinion} 
                onClick={onSelectOpinion}
           />
        ))}
        
        {processedData.length === 0 && (
            <div className="text-center py-16 text-textSecondary bg-surface-primary/30 rounded-xl border border-border border-dashed flex flex-col items-center justify-center gap-3">
                <Search size={48} className="opacity-20" />
                <p>No opinions found matching "{searchTerm}".</p>
                <button 
                    onClick={() => setSearchTerm('')} 
                    className="text-primary hover:underline text-sm font-medium"
                >
                    Clear Search
                </button>
            </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
              <span className="text-sm text-textSecondary mr-4">
                  Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="secondary" 
                className="h-9 w-9 p-0 rounded-lg"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                  <ChevronLeft size={16} />
              </Button>
              <Button 
                variant="secondary" 
                className="h-9 w-9 p-0 rounded-lg"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                  <ChevronRight size={16} />
              </Button>
          </div>
      )}
    </div>
  );
};
