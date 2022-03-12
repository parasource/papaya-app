import React, { useEffect } from 'react'
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { connect } from 'react-redux';
import { checkToken } from '../redux/auth-reducer';
import { FirstScreen } from '../pages/FirstScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BG_COLOR, GREEN_COLOR } from '../theme';
import { StyleSheet } from 'react-native';
import { HomePage } from '../pages/HomePage';
import { NotificationPage } from '../pages/NotificationPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import ProfilePage from '../pages/ProfilePage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

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
    return(
    <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name="FirstScreen" component={FirstScreen} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
        </Stack.Navigator>
    </NavigationContainer>
    )
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Notification") {
                iconName = focused ? "notifications" : "notifications-outline";
              } else if (route.name === "Favorites") {
                iconName = focused ? "heart" : "heart-outline";
              } else if (route.name === "Profile") {
                iconName = focused ? "person" : "person-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: GREEN_COLOR,
            tabBarInactiveTintColor: "#fff",
            tabBarStyle: styles.tab,
            headerShown: false
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomePage}
            options={{ title: "Главная" }}
          />
          <Tab.Screen
            name="Notification"
            component={NotificationPage}
            options={{
              title: "Уведомления",
              tabBarBadge: 9,
              tabBarBadgeStyle: { backgroundColor: GREEN_COLOR },
            }}
          />
          <Tab.Screen
            name="Favorites"
            component={FavoritesPage}
            options={{ title: "Избранное" }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfilePage}
            options={{ title: "Профиль" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tab: {
    backgroundColor: '#1F1F1F',
    paddingTop: 8,
    height: 93,
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