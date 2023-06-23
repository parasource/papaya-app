import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { StatusBar, View, Text, StyleSheet, TouchableOpacity, Share as rnShare } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { checkToken, googleLogin, appleLogin } from '../redux/auth-reducer';
import { FirstScreen } from '../pages/FirstScreen';
import { ProfileSettings } from '../pages/ProfileSettings';
import { TabBottomNavigator } from './Navigation/TabNavigator';
import { BG_COLOR, INPUTS_BG, TEXT_COLOR, GRAY_COLOR } from '../theme';
import { TopicPage } from '../pages/TopicPage';
import { FullButton } from './UI/FullButton';
import { LinearGradient } from 'expo-linear-gradient';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import ItemScreen from './ItemScreen';
import LookPage from '../pages/LookPage';
import Wardrobe from './Wardrobe/Wardrobe';
import WardrobeDetail from './Wardrobe/WardrobeDetail';
import * as Linking from 'expo-linking';
import MyWardrobe from './Wardrobe/MyWardrobe';
import InternetConnectionAlert from 'react-native-internet-connection-alert';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import * as Analytics from "expo-firebase-analytics";
import ArticlePage from '../pages/ArticlePage';
import Icon from 'react-native-vector-icons/Ionicons';
import GenderSelectionPage from '../pages/GenderSelectionPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { i18n } from '../../i18n/i18n';

const prefix = Linking.createURL('/');

const Stack = createNativeStackNavigator()
const Share = createSharedElementStackNavigator()

const AppContainer = (props) => {
  const sheetRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(null);
  const snapPoints = [314]
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();
  
  const checkForFirstTimeLoaded = async () => {
    const result = await AsyncStorage.getItem('isFirstTime')
    if(result == null) setIsFirstTime(null);
    else setIsFirstTime(true)
  }

  const changeIsFirstTime = async () => {
    await AsyncStorage.setItem('isFirstTime', 'false')
    setIsFirstTime(true)
  }

  const handelSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index)
    setIsOpen(true)
  }, [])

  useMemo(() => {
    props.checkToken()
  }, [])

  useEffect(() => {
    checkForFirstTimeLoaded()
  }, [])

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={-1}
        enableTouchThrough={true}
      />
    ),
    []
  );

  const linking = {
    prefixes: [prefix, 'https://papaya.pw/'],
    config: {
      screens: {
        LookPage: {
          path: 'looks/:lookSlug',
          parse: (lookSlug) => `${lookSlug}`
        },
        TopicPage: {
          path: 'topics/:topicSlug',
          parse: (topicSlug) => `${topicSlug}`
        }
      }
    }
  };

  const shareHandler = async (slug, name) => {
    Analytics.logEvent('share', {contentType: 'Share look' + name});

    const options={
        message: `Посмотри этот образ:\n${name}\n\nБольше образов ты найдешь в приложении Papaya\n\nhttps://papaya.pw/looks/${slug}`,
    }
    try{
        await rnShare.share(options)
    }catch(err){
        console.log(err);
    }
  }

  useEffect(() => {
    if(props.isAuth && isFirstTime){
      console.log('for');
      try {
        StoreReview.requestReview();
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  const MyTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: BG_COLOR,
      text: '#fff'
    },
  };

  if(!props.isAuth || !isFirstTime){
    return(<SafeAreaProvider>
        <StatusBar barStyle="light-content"/>
        <NavigationContainer theme={MyTheme} linking={linking}>
            {!props.isAuth ? <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen name="FirstScreen">
                  {() => <FirstScreen googleLogin={props.googleLogin} appleLogin={props.appleLogin}/>}
              </Stack.Screen> 
            </Stack.Navigator>
            :
            <Stack.Navigator screenOptions={{ headerShown: false}}>
              <Stack.Screen name="GenderSelectPage">
                {() => <GenderSelectionPage onSelect={changeIsFirstTime}/>}
              </Stack.Screen>
            </Stack.Navigator>}
        </NavigationContainer>
      </SafeAreaProvider>
    )
  }

  return (
    <InternetConnectionAlert useInternetReachability={false}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content"/>
        <NavigationContainer theme={MyTheme} linking={linking}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            routeNameRef.current = currentRouteName;
            await Analytics.logEvent("screen_view",{
              "prev_screen_name": previousRouteName,
              "screen_name": currentRouteName,});
          }
        }}>
          <Share.Navigator screenOptions={{  
            headerShown: true, 
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <Icon name="chevron-back-outline" size={28} style={{color: TEXT_COLOR}}/>
            ),
            headerTintColor: '#fff',
            headerLeftContainerStyle: {paddingLeft: 8},
            headerTitleContainerStyle:{
              width:'60%',
              alignItems:'center'
            },
            headerTitleAlign: 'center',
            tabBarHideOnKeyboard: true,
            }}>
              <Share.Screen
                name="MainNavigator"
                options={{ 
                  headerShown: false,
                }}
                initialParams={{handelSnapPress}}
                component={TabBottomNavigator}
              />
              <Share.Screen
                name="LookPage"
                component={LookPage}
                options={({ route }) => ({
                  headerBackButtonMenuEnabled: true,
                  headerTransparent: true,
                  headerTitle: route.params.lookName,
                  headerBlurEffect: '',
                  headerRight: () => (
                    <TouchableOpacity style={{marginRight: 8}} activeOpacity={.6} onPress={() => shareHandler(route.params.lookSlug, route.params.lookName)}>
                      <Icon name="share-outline" style={styles.icon}/>
                    </TouchableOpacity>
                  ),
                  headerBackground: () => {
                    return (
                      <LinearGradient colors={['rgba(17, 17, 17, 0)', 'rgba(17, 17, 17, 0)']} style={styles.gradient}/>
                  )},
                })}
              />
              <Share.Screen
                name="ArticlePage"
                component={ArticlePage}
                options={({ route }) => ({
                  title: route.params.articleName,
                  headerBackButtonMenuEnabled: true
                })}
              />
              <Share.Screen
                name="TopicPage"
                component={TopicPage}
                options={({ route }) => ({ 
                  title: '',
                  headerBackTitleVisible: false,
                  headerTransparent: true,
                  headerBlurEffect: '',
                })}
              />
              <Share.Screen name="Wardrobe" component={Wardrobe} options={{title: i18n.t('headerTitles.wardrobe')}}/>
              <Share.Screen name="MyWardrobe" component={MyWardrobe} options={{ title: i18n.t('headerTitles.myWardrobe')}}/>
              <Share.Screen name="WardrobeDetail" component={WardrobeDetail} options={({ route }) => ({ title: route.params.categoryName })}/>
              <Share.Screen
                  name="ProfileSettings"
                  component={ProfileSettings}
                  options={{ title: i18n.t('headerTitles.profile')}}
                />
              
              <Share.Group screenOptions={{ presentation: 'modal' }}>
                  <Share.Screen name="ItemModal" component={ItemScreen} 
                  options={({ route }) => ({ 
                    title: route.params.itemName,
                  })}/>
              </Share.Group>
          </Share.Navigator>
        </NavigationContainer>
        <BottomSheet 
        ref={sheetRef} 
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{backgroundColor: INPUTS_BG}}
        onClose={() => setIsOpen(false)}
        backdropComponent={renderBackdrop}>
          <View style={styles.bottomSheet}>
              <Text style={styles.sheetTitle}>{i18n.t('lookBottomSheet.title')}</Text>
              <Text style={styles.sheetText}>{i18n.t('lookBottomSheet.subtitle')}</Text>
              <FullButton label={i18n.t('lookBottomSheet.button')} style={{marginTop: 40}} pressHandler={() => sheetRef.current?.close()}/>
          </View>
        </BottomSheet>
      </SafeAreaProvider>
    </InternetConnectionAlert>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    paddingBottom: 36,
    alignItems: 'center'
  },
  sheetTitle: {
    fontFamily: 'SFbold',
    fontSize: 22,
    color: TEXT_COLOR,
    textAlign: 'center',
    marginTop: 15,
    maxWidth: 291
  },
  sheetText: {
    fontFamily: 'SFsemibold',
    fontSize: 14,
    color: GRAY_COLOR,
    marginTop: 12,
    textAlign: 'center', 
    maxWidth: 288
  },
  icon: {
      color: TEXT_COLOR,
      fontSize: 24
  },
  gradient: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0,
    paddingHorizontal: 20
},
})

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  isFirstTime: state.auth.isFirstTime,
  auth: state.auth,
  currentLook: state.feed.current
})

export default connect(mapStateToProps, {checkToken, googleLogin, appleLogin})(AppContainer)