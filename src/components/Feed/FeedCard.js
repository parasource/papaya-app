import { View, TouchableHighlight, StyleSheet, Image} from 'react-native'
import React, { useMemo } from 'react'
import { TEXT_COLOR } from '../../theme'
import AutoHeightImage from 'react-native-auto-height-image'

const FeedCard = ({navigation, item}) => {
  return (
    <TouchableHighlight onPress={() => navigation.navigate('LookPage')}>
      <View style={styles.cardWrapper} >
        <AutoHeightImage
          source={{uri: item.imgURL}}
          width={200}
          resizeMode="cover"
        />
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    cardWrapper: {
        marginTop: 12, 
        flex: 1,
        overflow: 'hidden',
        borderRadius: 8,
        marginHorizontal: 4
    },
    text: {
        color: TEXT_COLOR
    }
})

export default FeedCard