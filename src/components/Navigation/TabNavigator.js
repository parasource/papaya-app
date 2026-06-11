import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomePage } from '../../pages/HomePage';
import { FavoritesPage } from '../../pages/FavoritesPage';
import ProfilePage from '../../pages/ProfilePage';
import { TEXT_COLOR } from '../../theme';
import { Platform, StyleSheet, Text } from 'react-native';
import SearchPage from '../../pages/SearchPage';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import { i18n } from '../../../i18n/i18n';


const Tab = createBottomTabNavigator()

export const TabBottomNavigator = (props) => {
  const [onTop, setOnTop] = useState(null)
  const {handelSnapPress} = props.route.params

  return(
    <Tab.Navigator
      screenOptions={({ route }) => {
        const icons = { Home: 'home', Search: 'search', Favorites: 'bookmark', Profile: 'person' }
        const titles = { Home: 'tabbar.home', Search: 'tabbar.search', Favorites: 'tabbar.bookmarked', Profile: 'tabbar.profile' }
        return {
        tabBarIcon: ({ focused }) => (
          <Icon name={icons[route.name]} size={24} style={{color: TEXT_COLOR, opacity: focused ? 1.0 : 0.5}}/>
        ),
        tabBarLabel: ({ color }) => (
          <Text numberOfLines={1} style={{fontSize: 13, fontFamily: 'SFmedium', color: color}}>{i18n.t(titles[route.name])}</Text>
        ),
        tabBarActiveTintColor: TEXT_COLOR,
        tabBarInactiveTintColor: "rgba(255, 255,255, .5)",
        tabBarStyle: styles.tab,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => (
          <BlurView tint="dark" intensity={Platform.OS === 'ios' ? 100 : 150} style={StyleSheet.absoluteFill} />
        ),
      }}}
    >
        <Tab.Screen name="Home"
          listeners={({ navigation }) => ({
            tabPress: () => {
              if (navigation.isFocused()) {
                setOnTop(prev => prev === 1 ? 2 : 1)
              }
            }
          })}>
            {({navigation, route}) => <HomePage handelSnapPress={handelSnapPress} navigation={navigation} onTop={onTop} route={route} onTopEnd={() => setOnTop(null)}/>}
        </Tab.Screen>
        <Tab.Screen
          name="Search"
          component={SearchPage}
          listeners={({ navigation }) => ({
            tabPress: () => {
              navigation.navigate('Search', { isFocused: false })
            }
          })}
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
    paddingVertical: 8,
    minHeight: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopColor: '#666666',
    backgroundColor: 'transparent'
  }
})