import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Aether Weather needs access to your location to provide accurate weather forecasts.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          setPermissionGranted(true);
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
          setPermissionGranted(false);
          setLoading(false);
          setError('Location permission denied');
          Alert.alert(
            'Permission Required',
            'Location access is required to show weather data for your area. Please enable it in settings.',
            [{ text: 'OK' }]
          );
        }
      } else if (Platform.OS === 'ios') {
        const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        const result = await check(permission);

        if (result === RESULTS.GRANTED) {
          setPermissionGranted(true);
          getCurrentLocation();
        } else if (result === RESULTS.DENIED) {
          const requestResult = await request(permission);
          if (requestResult === RESULTS.GRANTED) {
            setPermissionGranted(true);
            getCurrentLocation();
          } else {
            setPermissionGranted(false);
            setLoading(false);
            setError('Location permission denied');
            Alert.alert(
              'Permission Required',
              'Location access is required to show weather data for your area.',
              [{ text: 'OK' }]
            );
          }
        } else {
          setPermissionGranted(false);
          setLoading(false);
          setError('Location permission blocked');
        }
      }
    } catch (err) {
      console.error('Error requesting location permission:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Current location:', latitude, longitude);
        
        setLocation({
          latitude,
          longitude,
          name: 'Current Location',
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error getting location:', err);
        setError(err.message);
        setLoading(false);
        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please check your GPS settings.',
          [{ text: 'OK' }]
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const refreshLocation = () => {
    setLoading(true);
    setError(null);
    getCurrentLocation();
  };

  return {
    location,
    loading,
    error,
    permissionGranted,
    refreshLocation,
    requestLocationPermission,
  };
};

export default useLocation;

