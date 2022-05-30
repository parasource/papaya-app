import * as Font from "expo-font";
 
const useFonts = async () =>
  await Font.loadAsync({
    'GilroyMedium': require('../../assets/fonts/gilroy-medium.ttf'),
    'GilroyRegular': require('../../assets/fonts/Gilroy-Regular.ttf'),
    'GilroyBold': require('../../assets/fonts/gilroy-bold.ttf'),
    'GilroyExtraBold': require('../../assets/fonts/Gilroy-ExtraBold.otf'),
    'GilroyBoldItalic': require('../../assets/fonts/Gilroy-BoldItalic.ttf'),
    'SFultralight': require('../../assets/fonts/SF-Compact-Display-Ultralight.otf'),
    'SFlight': require('../../assets/fonts/SF-Compact-Display-Light.otf'),
    'SFthin': require('../../assets/fonts/SF-Compact-Display-Thin.otf'),
    'SFregular': require('../../assets/fonts/SF-Compact-Display-Regular.otf'),
    'SFmedium': require('../../assets/fonts/SF-Compact-Display-Medium.otf'),
    'SFsemibold': require('../../assets/fonts/SF-Compact-Display-Semibold.otf'),
    'SFbold': require('../../assets/fonts/SF-Compact-Display-Bold.otf'),
    'SFheavy': require('../../assets/fonts/SF-Compact-Display-Heavy.otf'),
    'SFblack': require('../../assets/fonts/SF-Compact-Display-Black.otf'),
  });

  export default useFonts