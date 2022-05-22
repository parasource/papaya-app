import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { TEXT_COLOR } from '../theme';
import Imageui from './UI/ImageUI';

export const RecomendLook = ({look, navigation}) => {
    const items = look?.items?.slice(0,4)

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.imgBlock} onPress={() => navigation.navigate('LookPage', { lookSlug: look.slug, item: look})}>
                <Imageui uri={`https://storage.lightswitch.digital/storage/${look.image}`}/>
            </TouchableOpacity>
            <View style={styles.imgWrap}>
                {items?.map((item, index) => (
                    <TouchableOpacity key={item.id} style={styles.itemBlock} onPress={() => navigation.navigate('LookPage', { lookSlug: look.slug, item: look})}>
                        <Imageui uri={`https://storage.lightswitch.digital/storage/${item.image}`}/>
                        {index == 3 && look.items.length > 4 ? 
                            <View style={styles.darkness}>
                                <Text style={styles.number}>+{look.items.length - 4}</Text>
                            </View> : null
                        }
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    imgWrap: {
        width: '48%', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    imgBlock: {
        height: 240,
        width: '48%',
    },
    itemBlock: {
        height: 115, 
        width: '47%',
        marginBottom: 10,
        position: 'relative'
    },
    darkness: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(31,31,31,0.6)',
        position: 'absolute',
        top: 0,
        left: 0
    },
    number: {
        fontFamily: 'SFsemibold',
        fontSize: 24,
        color: TEXT_COLOR
    }
})
