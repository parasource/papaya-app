import React from 'react'
import { View, Text, Button, Linking, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import { GRAY_COLOR, TEXT_COLOR } from '../theme'

export const LookItem = () => {
  return (
    <View style={styles.wrapper}>
       <Image source={{uri: `https://img.pikbest.com/png-images/20190903/black-t-shirt-template_2998598.png!bw700`}} 
            resizeMode = "cover"
            style = {{height: 95, width: 70, flex: 1, borderRadius: 12}}
            PlaceholderContent={<ActivityIndicator />}/>
        <View style={styles.content}>
            <Text style={styles.title}>Черная майка</Text>
            <Text style={styles.mute}>Бренды</Text>
            <View style={styles.linksWrapper}>
                <TouchableOpacity onPress={() => Linking.openURL('https://google.com')} style={styles.linkWrapper}>
                    <Text style={styles.link}>Zara</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://google.com')} style={styles.linkWrapper}>
                    <Text style={styles.link}>Pull&Bear</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('Ещё')}>
                    <Text style={styles.moreBtn}>Ещё</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        borderRadius: 12,
        backgroundColor: '#1F1F1F',
        padding: 6,
        flexDirection: 'row',
        marginTop: 12
    },
    content: {
        marginLeft: 20,
        paddingVertical: 6
    },
    title: {
        fontFamily: 'SFmedium',
        fontSize: 17,
        color: TEXT_COLOR,
        marginBottom: 7
    },
    mute: {
        fontFamily: 'SFregular',
        fontSize: 13,
        color: GRAY_COLOR
    },
    linksWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    link: {
        fontFamily: 'SFregular',
        fontSize: 13,
        color: TEXT_COLOR,
    },
    linkWrapper: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#282828',
        marginRight: 8
    },
    moreBtn: {
        paddingHorizontal: 8,
        fontFamily: 'SFregular',
        fontSize: 13,
        color: TEXT_COLOR,
    }
})