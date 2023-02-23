import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { storage } from '../../const';

const FakeSearchBar = ({navigation}) => {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 12}}>
            <Image source={require('../../../assets/logo-transparent.png')} style={{height: 40, width: 35, marginRight: 12}}/>
            <TouchableOpacity activeOpacity={0.8} style={styles.searchWrapper} 
                onPress={() => navigation.navigate('Search', {isFocused: true})}>
                <Icon name="search" style={{fontSize: 20, color: '#888'}}/>
                <Text style={styles.searchPlaceholder}>Искать</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    searchPlaceholder: {
        color: '#888',
        fontSize: 18,
        marginLeft: 8,
        minHeight: 40,
        paddingVertical: 12
      },
      searchWrapper: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        backgroundColor: '#1F1F1F',
        flexDirection: 'row',
        alignItems: 'center',
       
      }
})

export default FakeSearchBar;
