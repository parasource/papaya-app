import * as Font from "expo-font";
 
export default useFonts = async () =>
  await Font.loadAsync({
    'GilroyMedium': require('../../assets/fonts/gilroy-medium.ttf'),
    'GilroyRegular': require('../../assets/fonts/Gilroy-Regular.ttf'),
    'GilroyBold': require('../../assets/fonts/gilroy-bold.ttf'),
    'GilroyExtraBold': require('../../assets/fonts/Gilroy-ExtraBold.otf'),
    'GilroyBoldItalic': require('../../assets/fonts/Gilroy-BoldItalic.ttf'),
  });