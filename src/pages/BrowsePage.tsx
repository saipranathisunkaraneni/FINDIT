import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFindIt } from '../context';
import { ItemCard } from '../components/common/ItemCard';
import { Button } from '../components/common/Button';
import { KITSW_BLOCKS } from '../services/campusLocations';
import { Search, X, RotateCcw, Package } from 'lucide-react';

export const BrowsePage: React.FC = () => {
  const { reports } = useFindIt();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [selectedType, setSelectedType] = useState<string>(() => searchParams.get('type') || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => searchParams.get('category') || 'All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Extract distinct locations and colors with KITSW blocks
  const locations = useMemo(() => {
    const reportLocs = reports.map((r) => r.location).filter(Boolean);
    const blockNames = KITSW_BLOCKS.map((b) => b.name);
    const combined = Array.from(new Set([...reportLocs, ...blockNames]));
    return ['All', ...combined.sort()];
  }, [reports]);

  const colors = useMemo(() => {
    const cols = Array.from(new Set(reports.map((r) => r.color).filter(Boolean)));
    return ['All', ...cols.sort()];
  }, [reports]);

  const categories = [
    'All',
    'Electronics',
    'ID Cards',
    'Bags',
    'Keys',
    'Books',
    'Accessories',
    'Clothing',
    'Other',
  ];

  // Multi-factor filtering & sorting
  const filteredItems = useMemo(() => {
    return reports
      .filter((item) => {
        if (item.status === 'hidden') return false;

        // Type filter (Lost / Found)
        if (selectedType !== 'all' && item.type !== selectedType) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        // Color filter
        if (selectedColor !== 'All' && item.color?.toLowerCase() !== selectedColor.toLowerCase()) {
          return false;
        }

        // Location filter
        if (selectedLocation !== 'All' && item.location !== selectedLocation) {
          return false;
        }

        // Search text matching title, description, color, distinguishing features, location
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchColor = item.color?.toLowerCase().includes(q);
          const matchFeatures = item.distinguishingFeatures?.toLowerCase().includes(q);
          const matchLoc = item.location.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);

          if (!matchTitle && !matchDesc && !matchColor && !matchFeatures && !matchLoc && !matchCat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [reports, selectedType, selectedCategory, selectedColor, selectedLocation, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('All');
    setSelectedColor('All');
    setSelectedLocation('All');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedType !== 'all' ||
    selectedCategory !== 'All' ||
    selectedColor !== 'All' ||
    selectedLocation !== 'All';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-bold text-[#242923]">Browse Campus Reports</h1>
        <p className="text-xs sm:text-sm text-[#72766F]">
          Explore lost items and found belongings with or without photographs.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-[#72766F] pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords, color, model, or marks..."
            className="w-full bg-[#FFFFFF] border border-[#E5E2D9] rounded-xl pl-10 pr-9 py-2.5 text-sm text-[#242923] placeholder-[#9CA099] focus:outline-none focus:ring-2 focus:ring-[#174B3A]/20 focus:border-[#174B3A]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-[#72766F] hover:text-[#242923] p-1 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Toggle & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="inline-flex p-1 bg-[#F2EFE7] rounded-xl border border-[#E5E2D9]">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-[#FFFEFA] text-[#174B3A] font-semibold shadow-2xs'
                  : 'text-[#72766F] hover:text-[#242923]'
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('lost')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedType === 'lost'
                  ? 'bg-[#FBE9E7] text-[#C62828] font-semibold shadow-2xs'
                  : 'text-[#72766F] hover:text-[#242923]'
              }`}
            >
              Lost Only
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('found')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedType === 'found'
                  ? 'bg-[#E8F5E9] text-[#1B5E20] font-semibold shadow-2xs'
                  : 'text-[#72766F] hover:text-[#242923]'
              }`}
            >
              Found Only
            </button>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-[#72766F] hover:text-[#C62828] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid - 4 cols on desktop, 2 cols on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-[#E5E2D9]/70">
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#72766F] uppercase">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E5E2D9] rounded-lg px-2.5 py-2 text-xs text-[#242923] focus:outline-none focus:ring-1 focus:ring-[#174B3A]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#72766F] uppercase">Color</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E5E2D9] rounded-lg px-2.5 py-2 text-xs text-[#242923] focus:outline-none focus:ring-1 focus:ring-[#174B3A]"
            >
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Colors' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#72766F] uppercase">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E5E2D9] rounded-lg px-2.5 py-2 text-xs text-[#242923] focus:outline-none focus:ring-1 focus:ring-[#174B3A]"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#72766F] uppercase">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
              className="w-full bg-[#FFFFFF] border border-[#E5E2D9] rounded-lg px-2.5 py-2 text-xs text-[#242923] focus:outline-none focus:ring-1 focus:ring-[#174B3A]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#72766F]">
        <p>
          Showing <strong className="text-[#242923]">{filteredItems.length}</strong>{' '}
          {filteredItems.length === 1 ? 'report' : 'reports'}
        </p>

        {hasActiveFilters && (
          <span className="text-[11px] bg-[#EBF2ED] text-[#174B3A] font-medium px-2 py-0.5 rounded-full">
            Filters Active
          </span>
        )}
      </div>

      {/* Responsive Cards Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F2EFE7] text-[#9CA099] flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 stroke-1" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#242923]">No matching reports found</h3>
            <p className="text-xs text-[#72766F] max-w-sm mx-auto">
              We couldn't find any reports matching your active filters. Try clearing your filters or
              broadening your search terms.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleResetFilters} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};
