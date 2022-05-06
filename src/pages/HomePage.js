import {
  Animated,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet
} from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ForYou from '../components/Feed/ForYou'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BG_COLOR, GRAY_COLOR, GREEN_COLOR, TEXT_COLOR } from '../theme';
import { connect } from 'react-redux';
import { requestTopics, getCurrentTopic } from '../redux/looks-reducer';
import Topic from '../components/Feed/Topic';
import AllTopics from '../components/Feed/AllTopics';

const Tab = createMaterialTopTabNavigator();
const descriptors = [];

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabWrapper}>
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
              minWidth: 120,
              paddingVertical: 8,
              paddingHorizontal: 36,
              borderRadius: 32,
              marginLeft: 8,
              backgroundColor: isFocused ? GREEN_COLOR : TEXT_COLOR 
             }}
          >
            <Animated.Text style={{
              color: BG_COLOR,
              textAlign: 'center',
              fontFamily: 'SFsemibold',
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

const TabNavigator = ({watchedTopics, getCurrentTopic}) => {
  return (
      <Tab.Navigator tabBar={props => <MyTabBar {...props}/>} screenOptions={{lazy: true}} >
          <Tab.Screen name="ForYou" component={ForYou} options={{ title: "Рекомендации" }}/>
          <Tab.Screen name="Topics" component={AllTopics} options={{ title: "Темы" }}/>
          {watchedTopics.map(topic => (
            <Tab.Screen 
              key={topic.slug}
              name={topic.slug} 
              component={Topic} 
              options={{ title: topic.name, unmountOnBlur: true }}
              initialParams={{ topicSlug: topic.slug }}
              listeners={{tabPress: e => getCurrentTopic(topic.slug)}}
             />
          ))}
      </Tab.Navigator>
  )
}

const HomePage = (props) => {
  useEffect(() => {
    props.requestTopics()
  }, [])

  return (
      <SafeAreaView style={styles.container}>
        <Image source={require('../../assets/img/papaya.png')} style={styles.logo}/>
        {console.log(props)}
        {/* <MyTabBar navigation={props.navigation} state={props.navigation.getState()} descriptors={descriptors}/> */}
        <TabNavigator topics={props.topics} {...props}/>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logo: {
      width: 135,
      height: 30,
      resizeMode: 'contain',
      alignSelf: 'center',
      marginBottom: 32,
      marginTop: 12
    },
    tabWrapper:{
      marginLeft: 8
    },

})

const mapStateToProps = (state) => ({
  watchedTopics: state.feed.watchedTopics
})

export default connect(mapStateToProps, {requestTopics, getCurrentTopic})(HomePage)