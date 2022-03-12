import { Animated, View, TouchableOpacity , Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ForYou from '../components/Feed/ForYou'
import { ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BG_COLOR, GRAY_COLOR, GREEN_COLOR, TEXT_COLOR } from '../theme';

const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, descriptors, navigation, position }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginLeft: 8}}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ 
              width: 120,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: isFocused ? GREEN_COLOR : GRAY_COLOR,
              borderRadius: 8,
              marginLeft: 8,
              backgroundColor: isFocused ? GREEN_COLOR : null 
             }}
          >
            <Animated.Text style={{
              color: isFocused ? BG_COLOR : TEXT_COLOR,
              textAlign: 'center',
              fontFamily: 'GilroyBold',
              fontSize: 16
              }}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
      </ScrollView>
    </View>
  );
}

const TabNaigator = () => {
  return (
      <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
          <Tab.Screen name="ForYou" component={ForYou} options={{ title: "Для тебя" }}/>
          <Tab.Screen name="Settings" component={ForYou} options={{ title: "Подборки" }}/>
          <Tab.Screen name="Page1" component={ForYou} options={{ title: "Коллекция 1" }}/>
          <Tab.Screen name="Page2" component={ForYou} options={{ title: "Коллекция 2" }}/>
          <Tab.Screen name="Page3" component={ForYou} options={{ title: "Коллекция 3" }}/>
          <Tab.Screen name="Page4" component={ForYou} options={{ title: "Коллекция 4" }}/>
      </Tab.Navigator>
  )
}

export const HomePage = () => {
  return (
     <SafeAreaView style={styles.container}>
          <TabNaigator/>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        // paddingHorizontal: 16,
        flex: 1,
    }
})