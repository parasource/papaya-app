import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomePage } from '../../pages/HomePage';
import { WardrobePage } from '../../pages/WardrobePage';
import { FavoritesPage } from '../../pages/FavoritesPage';
import ProfilePage from '../../pages/ProfilePage';
import { GREEN_COLOR } from '../../theme';
import { StyleSheet, Text, View } from 'react-native';
import SearchPage from '../../pages/SearchPage';

const Tab = createBottomTabNavigator()

export const TabBottomNavigator = () => {
  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let title;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
            title = "Главная"
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
            title = "Поиск"
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
          name="Search"
          component={SearchPage}
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