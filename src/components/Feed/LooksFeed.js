import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { GRAY_COLOR } from '../../theme';
import MasonryColumns from '../UI/MasonryColumns';
import MasonryCard from './MasonryCard';
import { i18n } from '../../../i18n/i18n';

export const LooksFeed = ({looks, isListEnd, navigation, modalHandler}) => {
    return (
        <View>
            <View style={styles.row}>
              {looks && <MasonryColumns
                    style={{ marginHorizontal: -8 }}
                    numColumns={2}
                    data={looks}
                    renderItem={({item, index}) => {
                        return item ? <MasonryCard key={'looks-item' + item.slug + index} item={item} navigation={navigation} modalHandler={modalHandler}/> : <></>
                    }}
                />}
            </View>
            <View style={styles.footer}>
              {isListEnd ? 
              <Text style={styles.footerText}>{i18n.t('looksFeed.noMore')}</Text> 
              : <ActivityIndicator/>}
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
    },
    footer: {
        textAlign: 'center',
        color: GRAY_COLOR, 
        paddingTop: 16
    },
    footerText: {
        color: GRAY_COLOR,
        textAlign: 'center',
        fontFamily: 'SFregular'
    },
})

