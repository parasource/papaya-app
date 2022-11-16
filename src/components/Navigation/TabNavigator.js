import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomePage } from '../../pages/HomePage';
import { FavoritesPage } from '../../pages/FavoritesPage';
import ProfilePage from '../../pages/ProfilePage';
import { TEXT_COLOR } from '../../theme';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import SearchPage from '../../pages/SearchPage';
import homeIcon from '../../../assets/img/icons/outline/home.png';
import searchIcon from '../../../assets/img/icons/outline/search.png';
import favoriteIcon from '../../../assets/img/icons/outline/bookmark.png';
import userIcon from '../../../assets/img/icons/outline/user.png';
import { BlurView } from 'expo-blur';

const Tab = createBottomTabNavigator()

export const TabBottomNavigator = ({handelSnapPress}) => {
  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let title;
          if (route.name === "Home") {
            iconName = homeIcon;
            title = "Главная"
          } else if (route.name === "Search") {
            iconName = searchIcon;
            title = "Поиск"
          } else if (route.name === "Favorites") {
            iconName = favoriteIcon;
            title = "Закладки"
          } else if (route.name === "Profile") {
            iconName = userIcon;
            title = "Профиль"
          }
          return (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={{uri: Image.resolveAssetSource(iconName).uri}} style={{width: 28, height: 28, opacity: focused ? 1.0 : 0.5}}/>
              <Text style={{fontSize: 13, fontFamily: 'SFmedium', color: color}}>{title}</Text>
            </View>
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
            {({navigation}) => <HomePage handelSnapPress={handelSnapPress} navigation={navigation}/>}
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
    // backgroundColor: '#1F1F1F',
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