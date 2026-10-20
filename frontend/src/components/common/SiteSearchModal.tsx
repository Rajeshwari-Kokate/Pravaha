import { useState, useEffect, useRef, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Layers, Sliders, FileText, Activity, ArrowRight } from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Pages' | 'Methodology' | 'Lessons' | 'Glossary' | 'Tools';
  path: string;
  icon: typeof Search;
}

const SEARCH_INDEX: SearchItem[] = [
  { id: '1', title: 'Interactive Flood Workspace', subtitle: 'Live map, timeline scrubber, and feature detail inspector', category: 'Pages', path: '/workspace', icon: Layers },
  { id: '2', title: 'Scenario Laboratory', subtitle: 'Design rainfall intensity, duration, and blockage presets', category: 'Pages', path: '/scenarios', icon: Sliders },
  { id: '3', title: 'Bottleneck Investigation', subtitle: 'Multi-factor ranking weights and intervention comparison', category: 'Pages', path: '/bottleneck', icon: Activity },
  { id: '4', title: 'Technical Investigation Reports', subtitle: 'Structured reporting synthesized by Google Gemma 4', category: 'Pages', path: '/reports', icon: FileText },
  { id: '5', title: 'Engineering Methodology', subtitle: 'Rational Method (Q=C·i·A/360) and topological routing', category: 'Methodology', path: '/methodology', icon: BookOpen },
  { id: '6', title: 'Dataset & Model Card', subtitle: 'flood_risk_dataset_india.csv profiling and held-out ROC AUC', category: 'Methodology', path: '/methodology#dataset', icon: FileText },
  { id: '7', title: 'Lesson 1: How Rain Becomes Runoff', subtitle: 'Surface imperviousness and Rational Method peak Q calculation', category: 'Lessons', path: '/learn', icon: BookOpen },
  { id: '8', title: 'Lesson 2: What Drainage Capacity Means', subtitle: 'Cross-section geometry and Manning conveyance equations', category: 'Lessons', path: '/learn', icon: BookOpen },
  { id: '9', title: 'Lesson 3: How Blockage Creates Backwater', subtitle: 'Debris factor and upstream surcharge propagation', category: 'Lessons', path: '/learn', icon: BookOpen },
  { id: '10', title: 'Glossary: Rational Method', subtitle: 'Peak discharge formula Q = (C·i·A)/360 in m³/s', category: 'Glossary', path: '/learn', icon: BookOpen },
  { id: '11', title: 'Glossary: Manning Roughness n', subtitle: 'Boundary friction resistance in open channel conduits', category: 'Glossary', path: '/learn', icon: BookOpen },
  { id: '12', title: 'Glossary: Effective Capacity', subtitle: 'Usable discharge capacity accounting for sediment blockage', category: 'Glossary', path: '/learn', icon: BookOpen },
  { id: '13', title: 'Technical Contact & Feedback', subtitle: 'Report data discrepancies or submit municipal inquiries', category: 'Pages', path: '/contact', icon: FileText },
  { id: '14', title: 'Privacy & Data Governance', subtitle: 'Local storage policies and telemetry transparency', category: 'Pages', path: '/privacy', icon: FileText },
  { id: '15', title: 'Terms & Conditions', subtitle: 'Engineering screening boundaries and limitation of liability', category: 'Pages', path: '/terms', icon: FileText },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SiteSearchModal: FC<Props> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const results = query.trim() === ''
    ? SEARCH_INDEX.slice(0, 6)
    : SEARCH_INDEX.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigate(results[selectedIndex].path);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#24302A]/60 dark:bg-black/75 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#25312A] rounded-2xl shadow-[6px_6px_0px_#24302A] dark:shadow-[6px_6px_0px_#0E1410] border-[1.5px] border-[#24302A] dark:border-[#3A4A40] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b-[1.5px] border-[#24302A] dark:border-[#3A4A40]">
          <Search className="w-5 h-5 text-[#4F6B52] dark:text-[#B8CFB3] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search documentation, routes, lessons, formulas..."
            className="w-full bg-transparent text-sm text-[#24302A] dark:text-[#FEFAF3] placeholder:text-[#55655B] dark:placeholder:text-[#B9C7BD] focus:outline-none font-sans"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[4px] border border-[#24302A]/20 dark:border-[#3A4A40] hover:bg-[#F6E2E9]/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#24302A] dark:text-[#FEFAF3]" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#24302A]/10 dark:divide-[#3A4A40]/60">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#55655B] font-mono">
              No matching terms or topics found for "{query}".
            </div>
          ) : (
            results.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F6E2E9] dark:bg-[#2F4A38] text-[#24302A] dark:text-[#FEFAF3] border border-[#24302A]'
                      : 'text-[#24302A] dark:text-[#FEFAF3] hover:bg-[#FEFAF3] dark:hover:bg-[#1C2620]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg border border-[#24302A] ${
                        isSelected
                          ? 'bg-[#84A282] text-[#24302A]'
                          : 'bg-[#FEFAF3] dark:bg-[#1C2620] text-[#4F6B52] dark:text-[#B8CFB3]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-heading text-sm text-[#24302A] dark:text-[#FEFAF3]">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] border border-[#24302A]/30 bg-white dark:bg-[#1C2620] text-[#55655B] dark:text-[#B9C7BD]">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#55655B] dark:text-[#B9C7BD] line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#55655B] dark:text-[#B9C7BD] shrink-0" />
                </button>
              );
            })
          )}
        </div>

        {/* Keyboard Footer */}
        <div className="px-4 py-2 border-t-[1.5px] border-[#24302A] dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#1C2620] flex items-center justify-between text-[10px] font-mono text-[#55655B] dark:text-[#B9C7BD]">
          <span>Use ↑ ↓ to navigate</span>
          <span>Press ↵ to select • ESC to close</span>
        </div>
      </div>
    </div>
  );
};
