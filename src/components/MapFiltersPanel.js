'use client';

import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import { EGYPT_CITIES } from '../lib/mapFilters';

const TYPE_OPTIONS = [
  { id: 'rgb', labelKey: 'rgb' },
  { id: 'paper', labelKey: 'paper' },
];

const SIZE_CATEGORY_OPTIONS = [
  { id: 'horizontal-small', labelKey: 'horizontalSmall', hintKey: 'horizontalSmallHint' },
  { id: 'vertical-small', labelKey: 'verticalSmall', hintKey: 'verticalSmallHint' },
  { id: 'square-small', labelKey: 'squareSmall', hintKey: 'squareSmallHint' },
  { id: 'horizontal-large', labelKey: 'horizontalLarge', hintKey: 'horizontalLargeHint' },
  { id: 'vertical-large', labelKey: 'verticalLarge', hintKey: 'verticalLargeHint' },
];

function toggleInList(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

const MapFiltersPanel = ({
  filters,
  onChange,
  resultCount,
  isMobile,
  isOpen,
  onToggleOpen,
}) => {
  const { currentLanguage } = useLanguage();
  const { t, translation } = useTranslations(currentLanguage);
  const f = translation.map.filters;

  const hasActiveFilters =
    filters.city ||
    filters.types.length > 0 ||
    filters.sizeCategories.length > 0;

  const handleClear = () => {
    onChange({ city: '', types: [], sizeCategories: [] });
  };

  const panelContent = (
    <>
      <div className="map-filters-header">
        <div className="map-filters-title-row">
          <Filter size={18} />
          <h3>{f.title}</h3>
        </div>
        {isMobile && (
          <button type="button" className="map-filters-close" onClick={onToggleOpen} aria-label="Close filters">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="map-filters-body">
        <div className="map-filter-group">
          <label htmlFor="map-filter-city">{f.city}</label>
          <select
            id="map-filter-city"
            value={filters.city}
            onChange={(e) => onChange({ ...filters, city: e.target.value })}
          >
            <option value="">{f.allCities}</option>
            {EGYPT_CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {currentLanguage === 'ar' ? city.nameAr : city.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div className="map-filter-group">
          <span className="map-filter-label">{f.type}</span>
          <div className="map-filter-chips">
            {TYPE_OPTIONS.map(({ id, labelKey }) => (
              <button
                key={id}
                type="button"
                className={`map-filter-chip${filters.types.includes(id) ? ' active' : ''}`}
                onClick={() => onChange({ ...filters, types: toggleInList(filters.types, id) })}
              >
                {f.types[labelKey]}
              </button>
            ))}
          </div>
        </div>

        <div className="map-filter-group">
          <span className="map-filter-label">{f.sizeCategory}</span>
          <div className="map-filter-chips">
            {SIZE_CATEGORY_OPTIONS.map(({ id, labelKey, hintKey }) => (
              <button
                key={id}
                type="button"
                className={`map-filter-chip${filters.sizeCategories.includes(id) ? ' active' : ''}`}
                title={hintKey ? f.sizeCategories[hintKey] : undefined}
                onClick={() =>
                  onChange({ ...filters, sizeCategories: toggleInList(filters.sizeCategories, id) })
                }
              >
                {f.sizeCategories[labelKey]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="map-filters-footer">
        <span className="map-filters-count">
          {t('map.filters.showingCount', { count: resultCount })}
        </span>
        {hasActiveFilters && (
          <button type="button" className="map-filters-clear" onClick={handleClear}>
            <RotateCcw size={14} />
            {f.clearAll}
          </button>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          className={`map-filters-toggle${hasActiveFilters ? ' has-filters' : ''}`}
          onClick={onToggleOpen}
          title={f.title}
        >
          <Filter size={20} />
          {hasActiveFilters && <span className="map-filters-badge" />}
        </button>
        {isOpen && (
          <div className="map-filters-backdrop" onClick={onToggleOpen} role="presentation">
            <div className="map-filters-panel map-filters-panel-mobile" onClick={(e) => e.stopPropagation()}>
              {panelContent}
            </div>
          </div>
        )}
      </>
    );
  }

  return <div className="map-filters-panel">{panelContent}</div>;
};

export default MapFiltersPanel;
