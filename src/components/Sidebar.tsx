'use client';

import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Link,
  Image,
} from '@chakra-ui/react';
import { Place, PlaceType } from '@/types';
import { placeTypeLabels, placeTypeIcons } from '@/data/places';

interface SidebarProps {
  selectedTypes: PlaceType[];
  onTypeToggle: (type: PlaceType) => void;
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place | null) => void;
}

export default function Sidebar({ selectedTypes, onTypeToggle, selectedPlace, onPlaceSelect }: SidebarProps) {
  const placeTypes: PlaceType[] = ['park', 'cafe', 'pet_store', 'vet', 'dog_park', 'beach'];

  return (
    <Box w="320px" h="100%" bg="white" borderRight="1px solid" borderColor="gray.200" display="flex" flexDirection="column" overflow="hidden">
      <Box p={4} borderBottom="1px solid" borderColor="gray.200">
        <VStack align="stretch" gap={3}>
          <HStack gap={3}>
            <Image src="/logo.webp" alt="Dog-Friendly Map" w="56px" h="56px" borderRadius="lg" objectFit="cover" />
            <Heading size="lg" color="gray.900">Dog-Friendly Map</Heading>
          </HStack>
          <Text fontSize="sm" color="gray.500">Find dog-friendly places on a map, fast.</Text>
        </VStack>
      </Box>

      <Box p={4} borderBottom="1px solid" borderColor="gray.200">
        <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={3}>Filter by type</Text>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {placeTypes.map(type => (
            <Button
              key={type}
              size="sm"
              px={1.5}
              onClick={() => onTypeToggle(type)}
              bg={selectedTypes.includes(type) ? 'blue.500' : 'gray.100'}
              color={selectedTypes.includes(type) ? 'white' : 'gray.700'}
              _hover={{ bg: selectedTypes.includes(type) ? 'blue.600' : 'gray.200' }}
              borderRadius="full"
            >
              {placeTypeIcons[type]} {placeTypeLabels[type]}
            </Button>
          ))}
        </Box>
      </Box>

      <Box flex={1} overflowY="auto" p={4}>
        {selectedPlace ? (
          <VStack align="stretch" gap={4}>
            <Button
              size="sm"
              variant="ghost"
              color="blue.500"
              onClick={() => onPlaceSelect(null)}
              alignSelf="flex-start"
            >
              ← Back to list
            </Button>
            <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={4} boxShadow="sm">
              <HStack justify="space-between" align="flex-start">
                <Heading size="md" color="gray.900">{selectedPlace.name}</Heading>
                <Text fontSize="2xl">{placeTypeIcons[selectedPlace.type]}</Text>
              </HStack>
              <Text fontSize="sm" color="gray.500" mt={1}>{placeTypeLabels[selectedPlace.type]}</Text>
              
              {selectedPlace.rating && (
                <Text fontSize="sm" mt={2}>⭐ {selectedPlace.rating}/5</Text>
              )}
              
              {selectedPlace.description && (
                <Text fontSize="sm" color="gray.700" mt={3}>{selectedPlace.description}</Text>
              )}
              
              <VStack align="stretch" mt={4} gap={2}>
                <Text fontSize="sm" color="gray.600">📍 {selectedPlace.address}</Text>
                {selectedPlace.phone && (
                  <Text fontSize="sm" color="gray.600">📞 {selectedPlace.phone}</Text>
                )}
                {selectedPlace.website && (
                  <Link href={selectedPlace.website} target="_blank" rel="noopener noreferrer" fontSize="sm" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                    🌐 Visit website
                  </Link>
                )}
              </VStack>
            </Box>
          </VStack>
        ) : (
          <Text fontSize="sm" color="gray.500">
            {selectedTypes.length === 0 ? 'Showing all places' : `${selectedTypes.length} filter(s) active`}
          </Text>
        )}
      </Box>

      <Box p={4} borderTop="1px solid" borderColor="gray.200" bg="gray.50">
        <Text fontSize="xs" color="gray.500" textAlign="center">
          {selectedTypes.length === 0 ? 'Showing all places' : `Showing ${selectedTypes.length} filter(s)`}
        </Text>
      </Box>
    </Box>
  );
}
