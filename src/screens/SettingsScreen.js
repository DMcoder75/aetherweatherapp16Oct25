import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const isPremium = false; // Temporarily disable premium features
  const loading = false;
  const handlePurchase = () => Alert.alert('Feature Disabled', 'Subscription feature is temporarily disabled.');
  const handleRestore = () => Alert.alert('Feature Disabled', 'Restore Purchase feature is temporarily disabled.');


  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        
        <View style={styles.subscriptionCard}>
          <Text style={styles.subscriptionTitle}>Remove Ads</Text>
          <Text style={styles.subscriptionPrice}>$10.00</Text>
          <Text style={styles.subscriptionDescription}>
            Enjoy an ad-free experience with premium features and support the development of Aether Weather.
          </Text>
          
          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={handlePurchase}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.purchaseButtonText}>Subscribe Now (Disabled)</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={loading}
        >
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>Aether Weather v1.0.0</Text>
        <Text style={styles.aboutText}>
          Advanced weather forecasting with AI-powered insights
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  section: {
    padding: scale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: verticalScale(16),
  },
  premiumCard: {
    backgroundColor: '#1e293b',
    padding: scale(20),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  premiumTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: verticalScale(8),
  },
  premiumText: {
    fontSize: moderateScale(14),
    color: '#cbd5e1',
    lineHeight: moderateScale(20),
  },
  subscriptionCard: {
    backgroundColor: '#1e293b',
    padding: scale(20),
    borderRadius: moderateScale(12),
  },
  subscriptionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: verticalScale(4),
  },
  subscriptionPrice: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: verticalScale(8),
  },
  subscriptionDescription: {
    fontSize: moderateScale(14),
    color: '#94a3b8',
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  purchaseButton: {
    backgroundColor: '#3b82f6',
    padding: scale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  purchaseButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#fff',
  },
  restoreButton: {
    marginTop: verticalScale(16),
    padding: scale(12),
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: moderateScale(14),
    color: '#3b82f6',
  },
  aboutText: {
    fontSize: moderateScale(14),
    color: '#94a3b8',
    marginBottom: verticalScale(8),
  },
});

export default SettingsScreen;

