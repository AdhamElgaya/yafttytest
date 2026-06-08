'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import MapGL, { Source, Layer, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
import { Plus } from 'lucide-react';
import BannerDetailsPanel from '../components/BannerDetailsPanel';
import BookingCartFab from '../components/BookingCartFab';
import MapFiltersPanel from '../components/MapFiltersPanel';
import { fetchApprovedBanners } from '../lib/banners';
import { isSupabaseConfigured } from '../lib/supabase';
import { applyBannerFilters } from '../lib/mapFilters';
import { getCityById } from '../lib/egyptCities';
import {
  loadCityBoundary,
  getCachedCityBoundary,
  boundaryToHighlightGeoJson,
  geometryBounds,
} from '../lib/cityBoundaries';

import { MAPBOX_TOKEN } from '../lib/mapboxToken';

const Map = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const accountType = user && user.accountType;
  const showAddBanner = user && (accountType === 'bannerOwner' || accountType === 'banner_owner') && user.isVerified;
  const showFilters = isAuthenticated;

  const [filters, setFilters] = useState({
    city: '',
    types: [],
    sizeCategories: [],
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [viewport, setViewport] = useState({
    latitude: 26.8206, // Egypt center
    longitude: 30.8025,
    zoom: 5.2,
    bearing: 0,
    pitch: 0,
  });

  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mapRef = useRef(null);
  const MIN_ICON_ZOOM = 12;

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('map-route-active');
    return () => document.documentElement.classList.remove('map-route-active');
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const data = await fetchApprovedBanners();
        if (data.success) {
          setBanners(Array.isArray(data.banners) ? data.banners : []);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };
    load();
  }, []);

  const [cityHighlight, setCityHighlight] = useState(null);
  const [cityBoundaryReady, setCityBoundaryReady] = useState(0);

  const filteredBanners = useMemo(
    () => applyBannerFilters(banners, filters),
    [banners, filters, cityBoundaryReady]
  );

  useEffect(() => {
    if (!filters.city) {
      setCityHighlight(null);
      return;
    }

    const city = getCityById(filters.city);
    if (!city) {
      setCityHighlight(null);
      return;
    }

    let cancelled = false;

    loadCityBoundary(filters.city).then((geometry) => {
      if (cancelled) return;
      const highlight = boundaryToHighlightGeoJson(
        city.id,
        city.nameEn,
        geometry || city.polygon
      );
      setCityHighlight(highlight);
      setCityBoundaryReady((n) => n + 1);

      const bounds = geometryBounds(geometry);
      const map = mapRef.current?.getMap();
      if (map && bounds) {
        map.fitBounds(
          [
            [bounds.west, bounds.south],
            [bounds.east, bounds.north],
          ],
          { padding: 48, duration: 800, maxZoom: city.zoom }
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [filters.city]);

  useEffect(() => {
    if (!filters.city) return;
    const city = getCityById(filters.city);
    if (!city) return;
    const bounds = geometryBounds(getCachedCityBoundary(filters.city));
    if (bounds) return;
    setViewport((v) => ({
      ...v,
      latitude: city.center.latitude,
      longitude: city.center.longitude,
      zoom: city.zoom,
    }));
  }, [filters.city, cityBoundaryReady]);

  const handleBannerClick = (banner) => {
    setSelectedBanner(banner);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedBanner(null);
  };

  // Build GeoJSON for clustering
  const geojson = useMemo(() => ({
    type: 'FeatureCollection',
    features: filteredBanners
      .filter(b => b?.coordinates && typeof b.coordinates.latitude === 'number' && typeof b.coordinates.longitude === 'number')
      .map(b => ({
        type: 'Feature',
        properties: {
          id: b._id,
          location: b.location || '',
          pricePerMonth: b.pricePerMonth || null,
          type: b.type || '',
          size: b.size || ''
        },
        geometry: {
          type: 'Point',
          coordinates: [b.coordinates.longitude, b.coordinates.latitude]
        }
      }))
  }), [filteredBanners]);

  const cityFillLayer = {
    id: 'city-highlight-fill',
    type: 'fill',
    paint: {
      'fill-color': '#123a8f',
      'fill-opacity': 0.12,
    },
  };

  const cityLineLayer = {
    id: 'city-highlight-line',
    type: 'line',
    paint: {
      'line-color': '#123a8f',
      'line-width': 2.5,
      'line-opacity': 0.85,
    },
  };

  // Cluster layers
  const clusterLayer = {
    id: 'clusters',
    type: 'circle',
    source: 'banners',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#123a8f', 10,
        '#123a8f', 25,
        '#123a8f'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        18, 10,
        24, 25,
        32
      ],
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 3
    }
  };

  const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'banners',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 14
    },
    paint: {
      'text-color': '#ffffff'
    }
  };

  const unclusteredLayer = {
    id: 'unclustered-point',
    type: 'circle',
    source: 'banners',
    filter: ['all', ['!', ['has', 'point_count']], ['<', ['zoom'], MIN_ICON_ZOOM]],
    paint: {
      'circle-color': '#123a8f',
      'circle-radius': 8,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2
    }
  };

  const onMapClick = (e) => {
    const feature = e.features && e.features[0];
    if (!feature) return;

    const map = mapRef.current?.getMap();
    if (!map) return;

    if (feature.layer?.id === 'clusters') {
      const clusterId = feature.properties.cluster_id;
      const source = map.getSource('banners');
      if (!source) return;
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        setViewport(v => ({ ...v, longitude: feature.geometry.coordinates[0], latitude: feature.geometry.coordinates[1], zoom }));
      });
    } else if (feature.layer?.id === 'unclustered-point') {
      const id = feature.properties.id;
      const banner = filteredBanners.find(b => b._id === id);
      if (banner) handleBannerClick(banner);
    }
  };

  return (
    <div className="map-page">
      <div className="map-container">
      <MapGL
        {...viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onMove={evt => setViewport(evt.viewState)}
        onClick={onMapClick}
        interactiveLayerIds={['clusters', 'unclustered-point']}
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {cityHighlight && (
          <Source id="city-highlight" type="geojson" data={cityHighlight}>
            <Layer {...cityFillLayer} />
            <Layer {...cityLineLayer} />
          </Source>
        )}

        {/* Clustered banners source */}
        <Source
          id="banners"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={13}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredLayer} />
        </Source>

        {/* High-zoom custom markers with banner icon */}
        {viewport.zoom >= MIN_ICON_ZOOM && filteredBanners.map((banner) => (
          <Marker
            key={banner._id}
            latitude={banner.coordinates.latitude}
            longitude={banner.coordinates.longitude}
            anchor="bottom"
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <div style={{ overflow: 'visible' }} onClick={() => handleBannerClick(banner)}>
              {/* Reuse existing styled pin */}
              {/* We keep component lazy by inline import to avoid large re-renders */}
              {/* Using require to avoid top-level circular deps */}
              {React.createElement(require('../components/BannerPin').default, { banner, onClick: handleBannerClick })}
            </div>
          </Marker>
        ))}
      </MapGL>

      {showFilters && (
        <MapFiltersPanel
          filters={filters}
          onChange={setFilters}
          resultCount={filteredBanners.length}
          isMobile={isMobile}
          isOpen={filtersOpen}
          onToggleOpen={() => setFiltersOpen((open) => !open)}
        />
      )}

      {showFilters && filteredBanners.length === 0 && banners.length > 0 && (
        <div className="map-no-results">{t('map.noResults')}</div>
      )}

      {/* Add Banner FAB */}
      {showAddBanner && (
        <button
          type="button"
          className="map-add-banner-fab"
          onClick={() => router.push('/banner-verification')}
          title="Add New Banner"
          aria-label="Add New Banner"
        >
          <Plus size={32} aria-hidden />
        </button>
      )}

      {user?.accountType === 'advertiser' && <BookingCartFab />}

      {/* Banner Details Panel */}
      <BannerDetailsPanel
        banner={selectedBanner}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        isMobile={isMobile}
      />

      {/* Removed Available Banners count indicator */}
      </div>
    </div>
  );
};

export default Map;