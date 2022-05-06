import React, { useEffect } from 'react'
import { StyleSheet, StatusBar, View, Text} from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BG_COLOR, GREEN_COLOR, TEXT_COLOR } from '../theme';

import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { checkToken } from '../redux/auth-reducer';
import { FirstScreen } from '../pages/FirstScreen';
import { FavoritesPage } from '../pages/FavoritesPage';
import ProfilePage from '../pages/ProfilePage';
import LookPage from '../pages/LookPage';
import { WardrobePage } from '../pages/WardrobePage';
import HomePage from '../pages/HomePage';
import { TopicDetail } from '../pages/TopicDetail';
import { ItemScreen } from './ItemScreen';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabNaigator = () => {
  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let title;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
            title = "Главная"
          } else if (route.name === "Wardrobe") {
            iconName = focused ? "shirt" : "shirt-outline";
            title = "Гардероб"
          } else if (route.name === "Favorites") {
            iconName = focused ? "bookmark" : "bookmark-outline";
            title = "Закладки"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
            title = "Профиль"
          }
          return (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Ionicons name={iconName} size={size} color={color} />
              <Text style={{fontSize: 13, fontFamily: 'SFmedium', color: color}}>{title}</Text>
            </View>
          )
        },
        tabBarActiveTintColor: GREEN_COLOR,
        tabBarInactiveTintColor: "#fff",
        tabBarStyle: styles.tab,
        tabBarLabel: () => {return null},
        headerShown: false,
      })}
    >
        <Tab.Screen
          name="Home"
          component={HomePage}
        />
        <Tab.Screen
          name="Wardrobe"
          component={WardrobePage}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesPage}
        />
        <Tab.Screen
          name="Profile"
          component={ProfilePage}
        />
    </Tab.Navigator>
  )
}

const AppContainer = (props) => {
  useEffect(() => {
    props.checkToken()
  }, [])

  const screenOptions = {
    headerShown: false
  }

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
    <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
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
        <Stack.Navigator screenOptions={{  
          headerShown: true, 
          headerBackTitleVisible: false  }}>
            <Stack.Screen
              name="MainNavigator"
              component={TabNaigator}
              options={{ 
                headerShown: false
              }}
            />
            <Stack.Screen
              name="LookPage"
              component={LookPage}
              options={({ route }) => ({ title: route.params.lookName })}
            />
            <Stack.Screen
              name="TopicPage"
              component={TopicDetail}
              options={({ route }) => ({ title: route.params.topicName })}
            />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="ItemModal" component={ItemScreen} />
            </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tab: {
    backgroundColor: '#1F1F1F',
    paddingVertical: 8,
    minHeight: 60,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
})

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  auth: state.auth
})

export default connect(mapStateToProps, {checkToken})(AppContainer)