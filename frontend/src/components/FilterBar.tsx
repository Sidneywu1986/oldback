import { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date-range';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface FilterBarProps {
  fields: FilterField[];
  onFilter: (filters: Record<string, string>) => void;
  onSearch?: (keyword: string) => void;
  searchPlaceholder?: string;
  initialFilters?: Record<string, string>;
}

export default function FilterBar({
  fields,
  onFilter,
  onSearch,
  searchPlaceholder = '搜索...',
  initialFilters = {},
}: FilterBarProps) {
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const activeCount = Object.values(filters).filter((v) => v !== '').length;

  const updateFilter = (key: string, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilter(next);
  };

  const clearAll = () => {
    const cleared: Record<string, string> = {};
    fields.forEach((f) => (cleared[f.key] = ''));
    setFilters(cleared);
    onFilter(cleared);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {onSearch && (
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98]" />
          <Input
            className="pl-10 border-[rgba(0,0,0,0.1)] rounded-xl focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 h-10"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 border-[rgba(0,0,0,0.1)] rounded-xl gap-2 text-[#615d59] hover:bg-[rgba(0,0,0,0.03)]"
          >
            <Filter className="w-4 h-4" />
            筛选
            {activeCount > 0 && (
              <span className="bg-primary-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeCount}
              </span>
            )}
            <ChevronDown className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-white border-[rgba(0,0,0,0.1)] shadow-notion-deep rounded-xl" align="start">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-sm text-[rgba(0,0,0,0.95)]">高级筛选</h4>
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-primary-red hover:text-primary-red-dark font-medium"
              >
                清除全部
              </button>
            )}
          </div>

          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="text-xs font-medium text-[#615d59] mb-1.5 block">
                  {field.label}
                </label>
                {field.type === 'select' && field.options ? (
                  <select
                    value={filters[field.key] || ''}
                    onChange={(e) => updateFilter(field.key, e.target.value)}
                    className="w-full h-9 px-3 text-sm border border-[rgba(0,0,0,0.1)] rounded-lg bg-white focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 text-[rgba(0,0,0,0.95)]"
                  >
                    <option value="">全部</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'date-range' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={filters[`${field.key}_start`] || ''}
                      onChange={(e) => updateFilter(`${field.key}_start`, e.target.value)}
                      className="flex-1 h-9 px-2 text-sm border border-[rgba(0,0,0,0.1)] rounded-lg focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
                    />
                    <span className="text-[#a39e98] text-xs">至</span>
                    <input
                      type="date"
                      value={filters[`${field.key}_end`] || ''}
                      onChange={(e) => updateFilter(`${field.key}_end`, e.target.value)}
                      className="flex-1 h-9 px-2 text-sm border border-[rgba(0,0,0,0.1)] rounded-lg focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
                    />
                  </div>
                ) : (
                  <Input
                    className="h-9 border-[rgba(0,0,0,0.1)] rounded-lg text-sm"
                    placeholder={field.placeholder || `请输入${field.label}`}
                    value={filters[field.key] || ''}
                    onChange={(e) => updateFilter(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4 pt-3 border-t border-[rgba(0,0,0,0.06)]">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              关闭
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-primary-red hover:bg-primary-red-dark"
              onClick={() => setOpen(false)}
            >
              应用筛选
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
