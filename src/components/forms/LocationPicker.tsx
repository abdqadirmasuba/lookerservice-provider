import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';

interface LocationData {
  longitude: number;
  latitude: number;
  address: string;
  city: string;
  state_region: string;
  country: string;
  postal_code: string;
}

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: LocationData) => void;
  initialLocation?: LocationData | null;
}

export default function LocationPicker({
  visible,
  onClose,
  onSelect,
  initialLocation,
}: LocationPickerProps) {
  const webViewRef = useRef<WebView>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<LocationData | null>(
    initialLocation || null
  );
  const [currentPosition, setCurrentPosition] = useState({
    latitude: initialLocation?.latitude || 0.3476,
    longitude: initialLocation?.longitude || 32.5825,
  });

  useEffect(() => {
    if (visible && !initialLocation) {
      requestLocationPermission();
    }
  }, [visible]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use this feature'
        );
        return;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Update map position
      setCurrentPosition({ latitude, longitude });
      updateMapPosition(latitude, longitude);

      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const addr = addresses[0];
        const locationData: LocationData = {
          latitude,
          longitude,
          address: `${addr.street || ''} ${addr.name || ''}`.trim() || 'Unknown',
          city: addr.city || addr.subregion || 'Unknown',
          state_region: addr.region || 'Unknown',
          country: addr.country || 'Uganda',
          postal_code: addr.postalCode || '',
        };

        setSelectedAddress(locationData);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to get current location');
      console.error('Location error:', error);
    }
  };

  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      // Using Nominatim (OpenStreetMap) for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=ug`
      );
      const data = await response.json();

      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Search error:', error);
    }
  };

  const selectSearchResult = async (result: any) => {
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);

    // Parse address from display_name
    const displayParts = result.display_name.split(',').map((s: string) => s.trim());
    
    const locationData: LocationData = {
      latitude,
      longitude,
      address: displayParts[0] || 'Unknown',
      city: displayParts[1] || result.address?.city || result.address?.town || 'Unknown',
      state_region: result.address?.state || result.address?.county || 'Unknown',
      country: result.address?.country || 'Uganda',
      postal_code: result.address?.postcode || '',
    };

    setCurrentPosition({ latitude, longitude });
    updateMapPosition(latitude, longitude);
    setSelectedAddress(locationData);
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  const updateMapPosition = (lat: number, lon: number) => {
    // Send message to WebView to update map center
    webViewRef.current?.postMessage(
      JSON.stringify({
        type: 'updatePosition',
        latitude: lat,
        longitude: lon,
      })
    );
  };

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'markerMoved') {
        const { latitude, longitude } = data;
        
        // Reverse geocode the selected position
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (addresses && addresses.length > 0) {
          const addr = addresses[0];
          const locationData: LocationData = {
            latitude,
            longitude,
            address: `${addr.street || ''} ${addr.name || ''}`.trim() || 'Unknown',
            city: addr.city || addr.subregion || 'Unknown',
            state_region: addr.region || 'Unknown',
            country: addr.country || 'Uganda',
            postal_code: addr.postalCode || '',
          };
          setSelectedAddress(locationData);
          setCurrentPosition({ latitude, longitude });
        }
      }
    } catch (error) {
      console.error('WebView message error:', error);
    }
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      onSelect(selectedAddress);
      onClose();
    } else {
      Alert.alert('No Location Selected', 'Please select a location on the map');
    }
  };

  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([${currentPosition.latitude}, ${currentPosition.longitude}], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        const marker = L.marker([${currentPosition.latitude}, ${currentPosition.longitude}], {
          draggable: true
        }).addTo(map);

        marker.on('dragend', function(e) {
          const position = marker.getLatLng();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerMoved',
            latitude: position.lat,
            longitude: position.lng
          }));
        });

        // Listen for position updates from React Native
        window.addEventListener('message', function(event) {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'updatePosition') {
              const newLatLng = L.latLng(data.latitude, data.longitude);
              marker.setLatLng(newLatLng);
              map.setView(newLatLng, 15);
            }
          } catch (e) {
            console.error('Error parsing message:', e);
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <XMarkIcon size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Location</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MagnifyingGlassIcon size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                searchLocation(text);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={getCurrentLocation}
            style={styles.currentLocationBtn}
            disabled={loading}
          >
            <MapPinIcon size={20} color="#F57C1F" />
            <Text style={styles.currentLocationText}>Current</Text>
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <ScrollView style={styles.searchResults}>
            {searchResults.map((result, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchResultItem}
                onPress={() => selectSearchResult(result)}
              >
                <MapPinIcon size={20} color="#6B7280" />
                <Text style={styles.searchResultText}>{result.display_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Map */}
        <WebView
          ref={webViewRef}
          style={styles.map}
          source={{ html: mapHTML }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />

        {/* Selected Address Display */}
        {selectedAddress && (
          <View style={styles.addressDisplay}>
            <Text style={styles.addressTitle}>Selected Location:</Text>
            <Text style={styles.addressText}>{selectedAddress.address}</Text>
            <Text style={styles.addressSubtext}>
              {selectedAddress.city}, {selectedAddress.state_region}
            </Text>
          </View>
        )}

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#F57C1F" />
          </View>
        )}

        {/* Confirm Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleConfirm}
            style={styles.confirmButton}
            disabled={!selectedAddress}
          >
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  currentLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  currentLocationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F57C1F',
  },
  searchResults: {
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  searchResultText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  map: {
    flex: 1,
  },
  addressDisplay: {
    position: 'absolute',
    top: 180,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  addressSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: '#F57C1F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
