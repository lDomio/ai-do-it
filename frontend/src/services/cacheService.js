import AsyncStorage from '@react-native-async-storage/async-storage';

const APPOINTMENTS_KEY = 'cache_appointments';
const PROFILE_KEY = 'cache_profile';
const SEARCH_KEY = 'cache_search';

export const cacheService = {
  async saveAppointments(appointments) {
    try {
      await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    } catch (err) {
      console.error('Error caching appointments:', err);
    }
  },

  async getAppointments() {
    try {
      const data = await AsyncStorage.getItem(APPOINTMENTS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Error reading appointments cache:', err);
      return null;
    }
  },

  async saveProfile(profile) {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.error('Error caching profile:', err);
    }
  },

  async getProfile() {
    try {
      const data = await AsyncStorage.getItem(PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Error reading profile cache:', err);
      return null;
    }
  },

  async saveSearchResults(key, results) {
    try {
      await AsyncStorage.setItem(`${SEARCH_KEY}_${key}`, JSON.stringify(results));
    } catch (err) {
      console.error('Error caching search results:', err);
    }
  },

  async getSearchResults(key) {
    try {
      const data = await AsyncStorage.getItem(`${SEARCH_KEY}_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Error reading search cache:', err);
      return null;
    }
  },

  async clearAll() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(
        (k) =>
          k.startsWith(APPOINTMENTS_KEY) || k.startsWith(PROFILE_KEY) || k.startsWith(SEARCH_KEY)
      );
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (err) {
      console.error('Error clearing cache:', err);
    }
  },
};
