import React, { useEffect } from 'react'
import { StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { checkToken, googleLogin, appleLogin } from '../redux/auth-reducer';
import { FirstScreen } from '../pages/FirstScreen';
import ItemScreen from './ItemScreen';
import LookPage from '../pages/LookPage';
import { ProfileSettings } from '../pages/ProfileSettings';
import { TabBottomNavigator } from './Navigation/TabNavigator';
import { BG_COLOR } from '../theme';
import Wardrobe from './Wardrobe/Wardrobe';
import WardrobeDetail from './Wardrobe/WardrobeDetail';
import { TopicPage } from '../pages/TopicPage';
import * as Linking from 'expo-linking';
import MyWardrobe from './Wardrobe/MyWardrobe';

const prefix = Linking.createURL('/');

const Stack = createNativeStackNavigator()
const Share = createNativeStackNavigator()

const AppContainer = (props) => {
  useEffect(() => {
    props.checkToken() 
  }, [])

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        LookPage: 'look'
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
            headerTransparent: true,
            headerBlurEffect: 'dark',
            headerBackTitleVisible: false,
            headerTintColor: '#fff',
         }}>
              <Stack.Screen name="Wardrobe" 
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
    <SafeAreaProvider>
      <StatusBar barStyle="light-content"/>
      <NavigationContainer theme={MyTheme} linking={linking}>
        <Share.Navigator screenOptions={{  
          headerShown: true, 
          headerBackTitleVisible: false  }}>
            <Share.Screen
              name="MainNavigator"
              component={TabBottomNavigator}
              options={{ 
                headerShown: false
              }}
            />
            <Share.Group screenOptions={{ 
                headerBlurEffect: 'dark',
                headerBackTitleVisible: false,
                headerTintColor: '#fff',
             }}>
              <Share.Screen
                name="LookPage"
                component={LookPage}
                options={({ route }) => ({ title: route.params.lookName,})}
              />
              <Share.Screen
                name="TopicPage"
                component={TopicPage}
                options={({ route }) => ({ 
                  title: route.params.topicName,
                  headerBackTitleVisible: false,
                  cardStyleInterpolator: ({ current: { progress } }) => {
                    return {
                      cardStyle: {
                        opacity: progress,
                      },
                    };
                  }})}
              />
              <Share.Screen name="Wardrobe" component={Wardrobe} 
              options={{ 
                title: "Гардероб",
              }}/>
              <Share.Screen name="MyWardrobe" component={MyWardrobe} 
              options={{ 
                title: "Мой гародероб",
              }}/>
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
    </SafeAreaProvider>
  );
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  isFirstTime: state.auth.isFirstTime,
  auth: state.auth
})

export default connect(mapStateToProps, {checkToken, googleLogin, appleLogin})(AppContainer)