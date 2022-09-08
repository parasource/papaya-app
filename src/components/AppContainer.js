import React, { useEffect } from 'react'
import { StatusBar, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { checkToken } from '../redux/auth-reducer';
import { FirstScreen } from '../pages/FirstScreen';
import ItemScreen from './ItemScreen';
import LookPage from '../pages/LookPage';
import { ProfileSettings } from '../pages/ProfileSettings';
import { TabBottomNavigator } from './Navigation/TabNavigator';
import { Notification } from './Notification';
import { BG_COLOR } from '../theme';
import Wardrobe from './Wardrobe/Wardrobe';
import WardrobeDetail from './Wardrobe/WardrobeDetail';
import { TopicPage } from '../pages/TopicPage';
import { BlurView } from 'expo-blur';

const Stack = createNativeStackNavigator()
const Share = createNativeStackNavigator()

const AppContainer = (props) => {
  useEffect(() => {
    props.checkToken()
  }, [])

  const MyTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: BG_COLOR,
      text: '#fff'
    },
  };

  if(!props.isAuth){
    return(<>
      <StatusBar barStyle="light-content"/>
      <NavigationContainer >
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="FirstScreen" component={FirstScreen} />
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Register" component={RegisterPage} />
          </Stack.Navigator>
      </NavigationContainer>
    </>
    )
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content"/>
      <NavigationContainer theme={MyTheme}>
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
            <Share.Screen
              name="LookPage"
              component={LookPage}
              options={({ route }) => ({ 
                headerTransparent: true,
                headerBlurEffect: 'dark',
                title: route.params.lookName,
                headerBackTitleVisible: false,
                cardStyleInterpolator: ({ current: { progress } }) => {
                  return {
                    cardStyle: {
                      opacity: progress,
                    },
                  };
                },
                headerTintColor: '#fff',
               })
              }

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
            
            <Share.Group screenOptions={{ presentation: 'modal' }}>
                <Share.Screen name="ItemModal" component={ItemScreen} 
                options={({ route }) => ({ 
                  title: route.params.itemName,
                })}/>
                <Share.Screen name="Wardrobe" component={Wardrobe} 
                options={{ 
                  title: "Гардероб",
                }}/>
                <Share.Screen
                  name="ProfileSettings"
                  component={ProfileSettings}
                  options={{ title: 'Аккаунт'}}
                />
                <Share.Screen
                  name="Notification"
                  component={Notification}
                  options={{ title: 'Уведомления'}}
                />
                <Share.Screen name="WardrobeDetail" component={WardrobeDetail} options={({ route }) => ({ title: route.params.categoryName })}/>
            </Share.Group>
        </Share.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({})

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  auth: state.auth
})

export default connect(mapStateToProps, {checkToken})(AppContainer)