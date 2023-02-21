import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomePage } from '../../pages/HomePage';
import { FavoritesPage } from '../../pages/FavoritesPage';
import ProfilePage from '../../pages/ProfilePage';
import { TEXT_COLOR } from '../../theme';
import { Image, Platform, Pressable, StyleSheet, Text } from 'react-native';
import SearchPage from '../../pages/SearchPage';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { storage } from '../../const';

const Tab = createBottomTabNavigator()

export const TabBottomNavigator = (props) => {
  const [onTop, setOnTop] = useState(null)
  const {handelSnapPress} = props.route.params

  return(
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let title;
          if (route.name === "Home") {
            iconName = 'home.png';
            title = "Главная"
          } else if (route.name === "Search") {
            iconName = 'search.png';
            title = "Поиск"
          } else if (route.name === "Favorites") {
            iconName = 'bookmark.png';
            title = "Сохраненные"
          } else if (route.name === "Profile") {
            iconName = 'user.png';
            title = "Профиль"
          }
          return (
            <Pressable style={{justifyContent: 'center', alignItems: 'center'}} 
            onPress={() => {
              let history = navigation.getState().history
              if(title === "Главная" && history.length === 1){
                if(onTop === 1) setOnTop(2)
                else setOnTop(1)
              }else if(title === "Поиск"){
                navigation.navigate(route.name, {isFocused: false})
              }
              navigation.navigate(route.name)
            }}
            >
              <Image source={{uri: storage + "/ui/" + iconName}} style={{width: 28, height: 28, opacity: focused ? 1.0 : 0.5}}/>
              <Text style={{fontSize: 13, fontFamily: 'SFmedium', color: color}}>{title}</Text>
            </Pressable>
          )
        },
        tabBarActiveTintColor: TEXT_COLOR,
        tabBarInactiveTintColor: "rgba(255, 255,255, .5)",
        backgroundColor: 'transparent',
        tabBarStyle: styles.tab,
        tabBarLabel: () => {return null},
        headerShown: false,
        tabBarBackground: () => (
          <BlurView tint="dark" intensity={Platform.OS === 'ios' ? 100 : 150} style={StyleSheet.absoluteFill} />
        ),
      })}
    >
        <Tab.Screen name="Home">
            {({navigation, route}) => <HomePage handelSnapPress={handelSnapPress} navigation={navigation} onTop={onTop} route={route} onTopEnd={() => setOnTop(null)}/>}
        </Tab.Screen>
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
    paddingVertical: 8,
    minHeight: 60,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopColor: '#666666',
    backgroundColor: 'transparent'
  }
})