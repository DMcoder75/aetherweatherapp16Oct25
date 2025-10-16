import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  initConnection,
  endConnection,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getProducts,
  requestPurchase,
  finishTransaction,
  getAvailablePurchases,
} from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Product IDs for the $10 ad-free subscription
const PRODUCT_IDS = Platform.select({
  ios: ['com.aetherweather.adfree'], // Replace with your actual iOS product ID
  android: ['com.aetherweather.adfree'], // Replace with your actual Android product ID
});

export const useSubscription = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    initializeIAP();
    checkPremiumStatus();

    return () => {
      endConnection();
    };
  }, []);

  const initializeIAP = async () => {
    try {
      await initConnection();
      console.log('IAP connection initialized');
      
      // Get available products
      const availableProducts = await getProducts({ skus: PRODUCT_IDS });
      setProducts(availableProducts);
      console.log('Available products:', availableProducts);

      // Set up purchase listeners
      const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
        console.log('Purchase updated:', purchase);
        const receipt = purchase.transactionReceipt;
        
        if (receipt) {
          try {
            // Acknowledge the purchase
            await finishTransaction({ purchase, isConsumable: false });
            
            // Save premium status
            await AsyncStorage.setItem('isPremium', 'true');
            await AsyncStorage.setItem('purchaseReceipt', receipt);
            setIsPremium(true);
            
            console.log('Purchase successful and acknowledged');
          } catch (error) {
            console.error('Error finishing transaction:', error);
          }
        }
      });

      const purchaseErrorSubscription = purchaseErrorListener((error) => {
        console.error('Purchase error:', error);
        setLoading(false);
      });

      return () => {
        purchaseUpdateSubscription?.remove();
        purchaseErrorSubscription?.remove();
      };
    } catch (error) {
      console.error('Error initializing IAP:', error);
    }
  };

  const checkPremiumStatus = async () => {
    try {
      const premiumStatus = await AsyncStorage.getItem('isPremium');
      setIsPremium(premiumStatus === 'true');
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  const purchaseSubscription = async () => {
    setLoading(true);
    try {
      if (PRODUCT_IDS.length === 0) {
        throw new Error('No product IDs configured');
      }

      await requestPurchase({ sku: PRODUCT_IDS[0] });
      return true;
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      setLoading(false);
      return false;
    }
  };

  const restorePurchases = async () => {
    setLoading(true);
    try {
      const purchases = await getAvailablePurchases();
      console.log('Available purchases:', purchases);

      if (purchases && purchases.length > 0) {
        // Check if user has purchased the ad-free product
        const adFreePurchase = purchases.find(
          (purchase) => purchase.productId === PRODUCT_IDS[0]
        );

        if (adFreePurchase) {
          await AsyncStorage.setItem('isPremium', 'true');
          await AsyncStorage.setItem('purchaseReceipt', adFreePurchase.transactionReceipt);
          setIsPremium(true);
          setLoading(false);
          return true;
        }
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      setLoading(false);
      return false;
    }
  };

  return {
    isPremium,
    loading,
    products,
    purchaseSubscription,
    restorePurchases,
  };
};

export default useSubscription;

