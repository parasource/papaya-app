import React from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';

const ImageUi = ({uri}) => {
    return (
        <View>
            <Image source={{uri: uri}} resizeMode = "cover" 
            style = {styles.Image} PlaceholderContent={<ActivityIndicator />}/>
        </View>
    )
}

const styles = StyleSheet.create({
    Image: {
        height: '100%',
        borderRadius: 12
    },
})

export default ImageUi;
