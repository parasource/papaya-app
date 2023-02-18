import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { checkToken, googleLogin, appleLogin } from '../redux/auth-reducer';
import { FirstScreen } from '../pages/FirstScreen';
import ItemScreen from './ItemScreen';
import LookPage from '../pages/LookPage';
import { ProfileSettings } from '../pages/ProfileSettings';
import { TabBottomNavigator } from './Navigation/TabNavigator';
import { BG_COLOR, INPUTS_BG, TEXT_COLOR, GRAY_COLOR } from '../theme';
import Wardrobe from './Wardrobe/Wardrobe';
import WardrobeDetail from './Wardrobe/WardrobeDetail';
import { TopicPage } from '../pages/TopicPage';
import * as Linking from 'expo-linking';
import MyWardrobe from './Wardrobe/MyWardrobe';
import InternetConnectionAlert from 'react-native-internet-connection-alert';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { FullButton } from './UI/FullButton';
import * as Analytics from "expo-firebase-analytics";
import ArticlePage from '../pages/ArticlePage';
import { LinearGradient } from 'expo-linear-gradient';

const prefix = Linking.createURL('/');

const Stack = createNativeStackNavigator()
const Share = createNativeStackNavigator()

const AppContainer = (props) => {
  useMemo(() => {
    props.checkToken()
  }, [])

  const sheetRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = [314]
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();

  const handelSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index)
    setIsOpen(true)
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
    prefixes: [prefix, 'https://papaya.pw'],
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

  const MyTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: BG_COLOR,
      text: '#fff'
    },
  };

  if(!props.isAuth || props.isFirstTime){
    return(<>
      <StatusBar barStyle="light-content"/>
      <NavigationContainer theme={MyTheme} linking={linking}>
          {!props.isAuth ? <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="FirstScreen">
                {() => <FirstScreen googleLogin={props.googleLogin} appleLogin={props.appleLogin}/>}
            </Stack.Screen> 
          </Stack.Navigator>
          :
          <Stack.Navigator screenOptions={{ 
            headerBlurEffect: 'dark',
            headerBackTitleVisible: false,
            headerTintColor: '#fff',
         }}>
              <Stack.Screen
                name="ProfileSettings"
                options={{headerShown: false}}>
                {({navigation}) => <ProfileSettings firstTime={true} navigation={navigation}/>}
              </Stack.Screen>
              <Stack.Screen 
                name="Wardrobe" 
                options={{ 
                  title: "Гардероб",
                }}>
                {({navigation}) => <Wardrobe firstTime={true} navigation={navigation}/>}
              </Stack.Screen>
              <Stack.Screen name="WardrobeDetail" component={WardrobeDetail} options={({ route }) => ({ title: route.params.categoryName })}/>
          </Stack.Navigator>}
      </NavigationContainer>
    </>
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
          headerBackTitleVisible: false  }}>
            <Share.Screen
              name="MainNavigator"
              options={{ 
                headerShown: false,
              }}
              >
                {() => <TabBottomNavigator handelSnapPress={handelSnapPress}/>}
              </Share.Screen>
            <Share.Group screenOptions={{ 
                headerBlurEffect: 'dark',
                headerBackTitleVisible: false,
                headerTintColor: '#fff',
             }}>
              <Share.Screen
                name="LookPage"
                component={LookPage}
                options={({ route }) => ({
                  headerBackButtonMenuEnabled: true,
                  headerTransparent: true,
                  headerTitle: '',
                  headerBlurEffect: '',
                  headerBackground: () => {
                    return (
                      <LinearGradient
                      colors={['#111', 'rgba(17, 17, 17, 0)']} style={styles.gradient}
                      />
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
                  title: route.params.topicName,
                  headerBackTitleVisible: false,
                  headerTransparent: true,
                  headerBlurEffect: '',
                  headerBackground: () => {
                    return (
                      <LinearGradient
                      colors={['#111', 'rgba(17, 17, 17, 0)']} style={styles.gradient}
                      />
                  )},
                })}
              />
              <Share.Screen name="Wardrobe" component={Wardrobe} options={{title: "Гардероб"}}/>
              <Share.Screen name="MyWardrobe" component={MyWardrobe} options={{ title: "Мой гардероб"}}/>
              <Share.Screen name="WardrobeDetail" component={WardrobeDetail} options={({ route }) => ({ title: route.params.categoryName })}/>
              <Share.Screen
                  name="ProfileSettings"
                  component={ProfileSettings}
                  options={{ title: 'Аккаунт'}}
                />
            </Share.Group>
            
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
            <Text style={styles.sheetTitle}>Образ подобран на основе вашего гардероба</Text>
            <Text style={styles.sheetText}>Этой иконкой обозначены образы, которые были рекомендованы на основе вашего гардероба. В них есть как минимум одна вещь, которая есть у вас.</Text>
            <FullButton label="Отлично!" style={{marginTop: 40}} pressHandler={() => sheetRef.current?.close()}/>
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
  gradient: {
    height: 200,
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