import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export const InterestCard = ({product}) => {
    return (
        <View style={{marginLeft: 20}}>
            <Text>{product.name}</Text>
        </View>
    );
}


