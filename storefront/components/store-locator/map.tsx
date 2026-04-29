'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import L from 'leaflet';
import 'leaflet.markercluster';
import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

import type { Store } from '@/types';

// Fix the default marker icon URLs (Webpack/Turbopack rewrites them otherwise).
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const pinIcon = L.divIcon({
  className: 'store-pin-icon',
  html: '<div class="store-pin-bubble" aria-hidden="true"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
});

interface MarkersLayerProps {
  stores: Store[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

function MarkersLayer({ stores, activeId, onSelect }: MarkersLayerProps) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markerById = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    const cluster = (
      L as unknown as {
        markerClusterGroup: (
          options?: L.MarkerClusterGroupOptions
        ) => L.MarkerClusterGroup;
      }
    ).markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          className: 'store-cluster-icon',
          html: `<div class="store-cluster-bubble">${count}</div>`,
          iconSize: [44, 44]
        });
      }
    });

    const ids = new Map<string, L.Marker>();

    stores.forEach((store) => {
      if (!store.location) return;
      const marker = L.marker([store.location.lat, store.location.lng], {
        icon: pinIcon,
        title: store.retailer || store.title || ''
      });

      const lines = [
        store.retailer || store.title,
        store.address,
        store.addressLine2,
        [store.city, store.state, store.zip].filter(Boolean).join(', '),
        store.country
      ].filter(Boolean);

      marker.bindPopup(
        `<div class="store-popup"><strong>${escapeHtml(
          lines[0] ?? ''
        )}</strong>${lines
          .slice(1)
          .map((line) => `<div>${escapeHtml(line ?? '')}</div>`)
          .join('')}</div>`
      );

      marker.on('click', () => onSelect(store._id));
      cluster.addLayer(marker);
      ids.set(store._id, marker);
    });

    map.addLayer(cluster);
    clusterRef.current = cluster;
    markerById.current = ids;

    const valid = stores.filter(
      (s): s is Store & { location: { lat: number; lng: number } } =>
        Boolean(s.location)
    );
    if (valid.length > 0) {
      const bounds = L.latLngBounds(
        valid.map((s) => [s.location.lat, s.location.lng])
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    }

    return () => {
      map.removeLayer(cluster);
      clusterRef.current = null;
      markerById.current = new Map();
    };
  }, [map, stores, onSelect]);

  useEffect(() => {
    if (!activeId) return;
    const cluster = clusterRef.current;
    const marker = markerById.current.get(activeId);
    if (!cluster || !marker) return;

    const latLng = marker.getLatLng();
    map.flyTo(latLng, Math.max(map.getZoom(), 12), { duration: 0.6 });
    cluster.zoomToShowLayer(marker, () => marker.openPopup());
  }, [activeId, map]);

  return null;
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface StoreLocatorMapProps {
  stores: Store[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function StoreLocatorMap({
  stores,
  activeId,
  onSelect
}: StoreLocatorMapProps) {
  const initialCenter = useMemo<[number, number]>(() => {
    const first = stores.find((s) => s.location);
    return first?.location
      ? [first.location.lat, first.location.lng]
      : [39.5, -98.35];
  }, [stores]);

  return (
    <MapContainer
      center={initialCenter}
      zoom={4}
      scrollWheelZoom
      style={{ height: '100%', width: '100%', minHeight: '600px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkersLayer stores={stores} activeId={activeId} onSelect={onSelect} />
    </MapContainer>
  );
}
