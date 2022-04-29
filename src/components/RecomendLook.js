import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { TEXT_COLOR } from '../theme';
import Imageui from './UI/ImageUI';

export const RecomendLook = () => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.imgBlock}>
                <Imageui uri={'https://images.unsplash.com/photo-1600574691453-499962cc0611?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'}/>
            </View>
            
            <View style={styles.imgWrap}>
                <View style={styles.itemBlock}>
                    <Imageui uri={'https://img.pikbest.com/png-images/20190903/black-t-shirt-template_2998598.png!bw700'}/>
                </View>
                <View style={styles.itemBlock}>
                    <Imageui uri={'https://img.pikbest.com/png-images/20190903/black-t-shirt-template_2998598.png!bw700'}/>
                </View>
                <View style={styles.itemBlock}>
                    <Imageui uri={'https://img.pikbest.com/png-images/20190903/black-t-shirt-template_2998598.png!bw700'}/>
                </View>
                <View style={styles.itemBlock}>
                    <Imageui uri={'https://img.pikbest.com/png-images/20190903/black-t-shirt-template_2998598.png!bw700'}/>
                    <View style={styles.darkness}>
                        <Text style={styles.number}>+2</Text>
                    </View>
                </View>
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
