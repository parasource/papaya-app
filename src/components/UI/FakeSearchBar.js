import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { storage } from '../../const';

const FakeSearchBar = ({navigation}) => {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 16}}>
            <Image source={require('../../../assets/logo-transparent.png')} style={{height: 40, width: 35, marginRight: 12}}/>
            <TouchableOpacity activeOpacity={0.8} style={styles.searchWrapper} 
                onPress={() => navigation.navigate('Search', {isFocused: true})}>
                <Image source={{uri: storage + "/ui/search.png"}} style={{width: 20, height: 20, opacity: 0.5}}/>
                <Text style={styles.searchPlaceholder}>Search</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    searchPlaceholder: {
        color: '#888',
        fontSize: 18,
        marginLeft: 12
      },
      searchWrapper: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#1F1F1F',
        flexDirection: 'row',
        alignItems: 'center'
      }
})

export default FakeSearchBar;
