import React from 'react'
import { View, Text, Linking, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import { GRAY_COLOR, TEXT_COLOR } from '../theme'

export const LookItem = ({lookSlug, item, navigation}) => {
 const urlsArr = item.urls.slice(0,2)

  return (
    <TouchableOpacity onPress={() => navigation.navigate('ItemModal', { lookSlug: lookSlug, itemId: item.id, itemName: item.name})}>
        <View style={styles.wrapper}>
        <Image source={{uri: `https://storage.lightswitch.digital/storage/${item.image}`}} 
                resizeMode = "cover"
                style = {{height: 95, width: 70, flex: 1, borderRadius: 12}}
                PlaceholderContent={<ActivityIndicator />}/>
            <View style={styles.content}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.mute}>Бренды</Text>
                <View style={styles.linksWrapper}>
                    {urlsArr.map(url => (
                        <TouchableOpacity key={url.id} onPress={() => Linking.openURL(url.url)} style={styles.linkWrapper}>
                            <Text style={styles.link}>{url.brand.name}</Text>
                        </TouchableOpacity>
                    ))}
                    {(item.urls.length >= 2) && 
                        <TouchableOpacity onPress={() => navigation.navigate('ItemModal', { lookSlug: lookSlug, itemId: item.id, itemName: item.name})}>
                            <Text style={styles.moreBtn}>Ещё</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </View>
    </TouchableOpacity>
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