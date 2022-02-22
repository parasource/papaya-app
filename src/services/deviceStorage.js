import { AsyncStorage } from 'react-native';

export const deviceStorage = {
  
    async saveItem(key, value) {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.log('AsyncStorage Error: ' + error.message);
      }
    },
    
    async loadJWT() {
        try {
          const value = await AsyncStorage.getItem('id_token');
          if (value !== null) {
            return value
          } else{
            return null
          }
        } catch (error) {
          console.log('AsyncStorage Error: ' + error.message);
        }
      },

      async deleteJWT() {
        try{
          await AsyncStorage.removeItem('id_token')
          .then(() => console.log('logout')
          );
        } catch (error) {
          console.log('AsyncStorage Error: ' + error.message);
        }
      }
};