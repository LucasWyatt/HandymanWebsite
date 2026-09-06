'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Neighborhood } from '../../../sanity.types';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Polygon = dynamic(
  () => import('react-leaflet').then(mod => mod.Polygon),
  { ssr: false }
);
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
  ssr: false,
});

interface ServiceAreaMapProps {
  neighborhoods: Neighborhood[];
}

export function ServiceAreaMap({ neighborhoods }: ServiceAreaMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-96 mb-12 rounded-lg bg-neutral-100 flex items-center justify-center">
        <div className="text-neutral-500">Loading map...</div>
      </div>
    );
  }

  // Filter active neighborhoods and get primary service areas
  const activeNeighborhoods = neighborhoods.filter(n => n.active !== false);
  const primaryAreas = activeNeighborhoods.filter(
    n => n.priority === 'primary'
  );

  // Accurate service area boundary for primary ZIP codes:
  // 45202, 45206, 45208, 45209, 45219, 45226, 45227, 45236, 45242, 45243, 12345, 45249, 45150, 45174
  // This polygon encompasses downtown Cincinnati east to Terrace Park
  const serviceAreaBoundary = [
    // Start at downtown Cincinnati (45202) - northwest corner
    [39.115, -84.52],
    [39.105, -84.515],

    // Follow Ohio River south boundary
    [39.095, -84.51],
    [39.09, -84.5],
    [39.085, -84.49],

    // Continue east along southern boundary (including 45226, 45227)
    [39.08, -84.47],
    [39.075, -84.45],
    [39.07, -84.43],
    [39.065, -84.41],

    // Eastern boundary toward 45236, 12345, 45249 areas
    [39.06, -84.39],
    [39.055, -84.37],
    [39.05, -84.35],
    [39.045, -84.33],

    // Far eastern boundary (45150, 45174 - Terrace Park area)
    [39.04, -84.31],
    [39.04, -84.29],
    [39.045, -84.27],
    [39.05, -84.26],
    [39.06, -84.25],

    // Turn north along eastern edge
    [39.075, -84.245],
    [39.09, -84.24],
    [39.105, -84.24],
    [39.12, -84.245],
    [39.135, -84.25],

    // Northern boundary (including 45242, 45243 - Indian Hill area)
    [39.15, -84.26],
    [39.165, -84.28],
    [39.18, -84.3],
    [39.195, -84.32],
    [39.21, -84.34],

    // Continue west along northern boundary (45208, 45209 areas)
    [39.215, -84.36],
    [39.22, -84.38],
    [39.225, -84.4],
    [39.23, -84.42],
    [39.235, -84.44],

    // Northwest boundary back to downtown (45206, 45219 areas)
    [39.23, -84.46],
    [39.22, -84.48],
    [39.205, -84.49],
    [39.185, -84.5],
    [39.165, -84.51],
    [39.145, -84.515],
    [39.125, -84.518],
    [39.115, -84.52], // Close polygon
  ] as [number, number][];

  // Get ZIP codes from primary areas for display
  const primaryZipCodes = primaryAreas.flatMap(area => area.zipCodes || []);

  // Create a "world" polygon with a hole for the service area (inverse mask)
  const worldBounds = [
    [85, -180], // North pole, date line west
    [85, 180], // North pole, date line east
    [-85, 180], // South pole, date line east
    [-85, -180], // South pole, date line west
    [85, -180], // Close outer boundary
  ] as [number, number][];

  // The hole (service area) - reverse winding order for hole
  const serviceAreaHole = [...serviceAreaBoundary].reverse();

  // Combine world bounds with service area hole
  const darkenedAreaPolygon = [worldBounds, serviceAreaHole];

  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Service Area Coverage</h2>

      <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border relative">
        {/* Toggle Button - Upper Right Corner */}
        <button
          onClick={e => {
            e.stopPropagation();
            setIsInteractive(!isInteractive);
          }}
          className="absolute top-3 right-3 p-2 rounded-lg shadow-md bg-white text-neutral-700 hover:bg-neutral-100 transition-colors"
          style={{ zIndex: 1000 }}
          title={
            isInteractive
              ? 'Lock map (make static)'
              : 'Unlock map (enable interaction)'
          }
        >
          {isInteractive ? '🔓' : '🔒'}
        </button>
        {/* Static overlay when not interactive */}
        {!isInteractive && (
          <div className="absolute inset-0 z-10 bg-transparent flex items-center justify-center">
            <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-md">
              <p className="text-sm text-neutral-600 font-medium">
                Click to enable map interaction
              </p>
            </div>
          </div>
        )}

        <MapContainer
          key={isInteractive ? 'interactive' : 'static'}
          center={[39.14, -84.38]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          className="leaflet-container map-container"
          zoomControl={isInteractive}
          dragging={isInteractive}
          touchZoom={isInteractive}
          doubleClickZoom={isInteractive}
          scrollWheelZoom={isInteractive}
          boxZoom={isInteractive}
          keyboard={isInteractive}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Service Area Boundary - subtle outline */}
          <Polygon
            positions={serviceAreaBoundary}
            pathOptions={{
              color: '#C34B44', // Keep as hex for Leaflet compatibility
              weight: 3,
              opacity: 0.8,
              fillColor: 'transparent',
              fillOpacity: 0,
            }}
          >
            {isInteractive && (
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">
                    Hometown Handyman Service Area
                  </h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    Primary Service Zone
                  </p>
                  {primaryAreas.length > 0 && (
                    <p className="text-sm mb-2">
                      <strong>Areas:</strong>{' '}
                      {primaryAreas.map(area => area.name).join(', ')}
                    </p>
                  )}
                  {primaryZipCodes.length > 0 && (
                    <p className="text-sm mb-2">
                      <strong>ZIP Codes:</strong> {primaryZipCodes.join(', ')}
                    </p>
                  )}
                  <p className="text-sm">
                    <strong>Phone:</strong> (555) 555-0100
                  </p>
                </div>
              </Popup>
            )}
          </Polygon>

          {/* Darkened overlay for areas outside service area */}
          <Polygon
            positions={darkenedAreaPolygon}
            pathOptions={{
              color: 'transparent',
              weight: 0,
              fillColor: '#000000',
              fillOpacity: 0.3,
            }}
          />
        </MapContainer>
      </div>

      <div className="mt-4 bg-neutral-50 px-4 py-3 rounded-lg text-center">
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-600 rounded"></div>
            <span>Service Area Boundary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black bg-opacity-30 rounded"></div>
            <span>Areas Outside Service Zone</span>
          </div>
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          {isInteractive
            ? 'Click the service area boundary for more details about our coverage'
            : 'Enable map interaction to explore details and navigate the map'}
        </p>
      </div>
    </div>
  );
}
