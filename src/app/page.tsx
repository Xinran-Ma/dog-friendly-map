'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '@/components/Sidebar';
import { Place, PlaceType } from '@/types';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

export default function Home() {
  const [selectedTypes, setSelectedTypes] = useState<PlaceType[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handleTypeToggle = (type: PlaceType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    setSelectedPlace(null);
  };

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
  };

  return (
    <Flex h="100vh" w="100%" minH="100vh">
      <Sidebar
        selectedTypes={selectedTypes}
        onTypeToggle={handleTypeToggle}
        selectedPlace={selectedPlace}
        onPlaceSelect={setSelectedPlace}
      />
      <Box flex={1} position="relative" style={{ height: '100vh' }}>
        <Map
          selectedTypes={selectedTypes}
          onPlaceClick={handlePlaceClick}
        />
      </Box>
    </Flex>
  );
}
