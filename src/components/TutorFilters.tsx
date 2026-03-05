import { useState, useRef, useEffect } from 'react';
import {
  Wifi,
  MapPin,
  Calendar,
  Clock,
  GraduationCap,
  Users,
  ChevronDown,
  X,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import {
  ALL_CITIES,
  ALL_DAYS,
  ALL_HOURS,
  ALL_LEVELS,
  type SessionMode,
  type SessionType,
} from '../data/constants';

export interface FilterState {
  mode: SessionMode | '';
  city: string;
  days: string[];
  hours: string[];
  levels: string[];
  sessionType: SessionType | '';
}

const emptyFilters: FilterState = {
  mode: '',
  city: '',
  days: [],
  hours: [],
  levels: [],
  sessionType: '',
};

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

function SelectField({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-300"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function MultiSelectField({
  label,
  icon: Icon,
  selected,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  selected: string[];
  onChange: (vals: string[]) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const displayText =
    selected.length === 0
      ? placeholder
      : selected.length <= 2
        ? selected.join(', ')
        : `${selected.slice(0, 2).join(', ')} +${selected.length - 2}`;

  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between bg-white border rounded-xl px-4 py-2.5 text-sm text-left transition-all hover:border-gray-300 ${
            selected.length > 0
              ? 'border-primary-300 ring-2 ring-primary-500/10'
              : 'border-gray-200'
          }`}
        >
          <span className={selected.length === 0 ? 'text-gray-400' : 'text-gray-700'}>
            {displayText}
          </span>
          <div className="flex items-center gap-1">
            {selected.length > 0 && (
              <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 text-xs font-bold rounded-md">
                {selected.length}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {open && (
          <div className="absolute z-30 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 text-left border-b border-gray-100 transition-colors"
              >
                Sterge selectia ({selected.length})
              </button>
            )}
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                    isSelected
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export { emptyFilters };

export default function TutorFilters({ filters, onChange, resultCount }: Props) {
  const [expanded, setExpanded] = useState(false);

  const update = (partial: Partial<FilterState>) => {
    const next = { ...filters, ...partial };
    if (partial.mode !== undefined && partial.mode !== 'fizic') {
      next.city = '';
    }
    onChange(next);
  };

  const activeCount =
    (filters.mode ? 1 : 0) +
    (filters.city ? 1 : 0) +
    filters.days.length +
    filters.hours.length +
    filters.levels.length +
    (filters.sessionType ? 1 : 0);

  const modeOptions = [
    { value: 'online', label: 'Online' },
    { value: 'fizic', label: 'Fizic (fata in fata)' },
    { value: 'ambele', label: 'Ambele' },
  ];

  const cityOptions = ALL_CITIES.map((c) => ({ value: c, label: c }));
  const dayOptions = ALL_DAYS.map((d) => ({ value: d, label: d }));
  const hourOptions = ALL_HOURS.map((h) => ({ value: h, label: h }));
  const levelOptions = ALL_LEVELS.map((l) => ({ value: l, label: l }));
  const sessionTypeOptions = [
    { value: 'individual', label: 'Individual' },
    { value: 'grup', label: 'Grup' },
    { value: 'ambele', label: 'Nu conteaza' },
  ];

  const showCity = filters.mode === 'fizic' || filters.mode === 'ambele';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 lg:hidden"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-600" />
          <span className="font-semibold text-gray-900">Filtre</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div className={`${expanded ? 'block' : 'hidden'} lg:block`}>
        <div className="px-6 py-5 border-t border-gray-100 lg:border-t-0">
          <div className="hidden lg:flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-gray-900">Filtreaza profesorii</span>
            </div>
            {activeCount > 0 && (
              <button
                onClick={() => onChange(emptyFilters)}
                className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Sterge filtre
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectField
              label="Mod de predare"
              icon={Wifi}
              value={filters.mode}
              onChange={(val) => update({ mode: val as SessionMode | '' })}
              options={modeOptions}
              placeholder="Online sau fizic"
            />

            <SelectField
              label="Oras"
              icon={MapPin}
              value={filters.city}
              onChange={(val) => update({ city: val })}
              options={cityOptions}
              placeholder="Toate orasele"
              disabled={!showCity}
            />

            <MultiSelectField
              label="Zile disponibile"
              icon={Calendar}
              selected={filters.days}
              onChange={(vals) => update({ days: vals })}
              options={dayOptions}
              placeholder="Oricare zi"
            />

            <MultiSelectField
              label="Interval orar"
              icon={Clock}
              selected={filters.hours}
              onChange={(vals) => update({ hours: vals })}
              options={hourOptions}
              placeholder="Orice ora"
            />

            <MultiSelectField
              label="Nivel"
              icon={GraduationCap}
              selected={filters.levels}
              onChange={(vals) => update({ levels: vals })}
              options={levelOptions}
              placeholder="Toate nivelurile"
            />

            <SelectField
              label="Tip sedinta"
              icon={Users}
              value={filters.sessionType}
              onChange={(val) => update({ sessionType: val as SessionType | '' })}
              options={sessionTypeOptions}
              placeholder="Individual / Grup"
            />
          </div>

          {activeCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">
                {resultCount} {resultCount === 1 ? 'profesor gasit' : 'profesori gasiti'}
              </span>
              <div className="flex-1" />
              <button
                onClick={() => onChange(emptyFilters)}
                className="lg:hidden flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Sterge filtre
              </button>
              {filters.mode && (
                <FilterTag
                  label={filters.mode === 'online' ? 'Online' : filters.mode === 'fizic' ? 'Fizic' : 'Online + Fizic'}
                  onRemove={() => update({ mode: '' })}
                />
              )}
              {filters.city && (
                <FilterTag label={filters.city} onRemove={() => update({ city: '' })} />
              )}
              {filters.days.map((d) => (
                <FilterTag
                  key={d}
                  label={d}
                  onRemove={() => update({ days: filters.days.filter((v) => v !== d) })}
                />
              ))}
              {filters.hours.map((h) => (
                <FilterTag
                  key={h}
                  label={h}
                  onRemove={() => update({ hours: filters.hours.filter((v) => v !== h) })}
                />
              ))}
              {filters.levels.map((l) => (
                <FilterTag
                  key={l}
                  label={l}
                  onRemove={() => update({ levels: filters.levels.filter((v) => v !== l) })}
                />
              ))}
              {filters.sessionType && (
                <FilterTag
                  label={
                    filters.sessionType === 'individual'
                      ? 'Individual'
                      : filters.sessionType === 'grup'
                        ? 'Grup'
                        : 'Orice tip'
                  }
                  onRemove={() => update({ sessionType: '' })}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg">
      {label}
      <button onClick={onRemove} className="hover:text-primary-900 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
