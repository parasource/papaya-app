import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { GREEN_COLOR, TEXT_COLOR } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';

const LookPage = ({navigation}) => {
  return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Image style={styles.image} source={{uri: 'https://images.unsplash.com/photo-1608748010899-18f300247112?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80'}} />
            </View>
        </View>
        <View style={styles.bar}>
            <Icon name="share-outline" style={styles.iconSM}/>
            <Icon name="heart-outline" style={styles.icon}/>
            <Icon name="heart-dislike-outline" style={styles.icon}/>
            <Icon name="bookmark-outline" style={styles.iconSM}/>
        </View>
      </View> 
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        position: 'relative'
    },
    wrapper: {
        width: '100%',
        height: 590,
        overflow: 'hidden',
        borderRadius: 8,
        backgroundColor: GREEN_COLOR
    },
    image: {
        height: '100%',
        resizeMode: 'cover'
    },
    bar: {
        paddingTop: 16,
        paddingBottom: 40,
        width: '100%',
        backgroundColor: "#1f1f1f",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 42,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    icon: {
        color: TEXT_COLOR,
        fontSize: 44
    },
    iconSM: {
        color: TEXT_COLOR,
        fontSize: 28
    }
})

export default LookPage