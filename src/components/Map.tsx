'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box, Text, VStack } from '@chakra-ui/react';
import { Place, PlaceType } from '@/types';
import { places as allPlaces, placeTypeLabels, placeTypeIcons } from '@/data/places';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapProps {
  selectedTypes: PlaceType[];
  onPlaceClick: (place: Place) => void;
}

export default function Map({ selectedTypes, onPlaceClick }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredPlaces = selectedTypes.length === 0
    ? allPlaces
    : allPlaces.filter(place => selectedTypes.includes(place.type));

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [151.2093, -33.8688],
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    map.current.on('error', (e) => {
      console.error('Mapbox error:', e);
      setError(e.error?.message || 'Map error');
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: 13,
          });
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
        }
      );
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    filteredPlaces.forEach(place => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.cssText = `
        width: 36px;
        height: 36px;
        background: white;
        border-radius: 50%;
        border: 2px solid #3b82f6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      el.title = place.name;

      const innerEl = document.createElement('div');
      innerEl.style.cssText = `
        transition: transform 0.2s;
        transform-origin: center;
      `;
      innerEl.innerHTML = placeTypeIcons[place.type];

      el.appendChild(innerEl);

      el.addEventListener('mouseenter', () => {
        innerEl.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        innerEl.style.transform = 'scale(1)';
      });

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="font-family: system-ui, sans-serif; padding: 8px;">
          <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: 600;">${place.name}</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">${placeTypeLabels[place.type]}</p>
          ${place.rating ? `<p style="margin: 4px 0 0; font-size: 12px;">⭐ ${place.rating}</p>` : ''}
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(place.coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onPlaceClick(place);
      });

      markers.current.push(marker);
    });
  }, [filteredPlaces, mapLoaded, onPlaceClick]);

  if (error) {
    return (
      <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" bg="gray.100">
        <VStack>
          <Text color="red.500">Error: {error}</Text>
        </VStack>
      </Box>
    );
  }

  return <Box ref={mapContainer} w="100%" h="100%" style={{ height: '100%', width: '100%' }} />;
}
