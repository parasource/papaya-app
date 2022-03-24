import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { requestInterests } from '../../redux/interests-reducer';
import { connect } from 'react-redux';
import { TEXT_COLOR } from '../../theme';
import WardrobeThingCard from './WardrobeThingCard';

const WardrobeDetail = ({route, interests, requestInterests, isFetching}) => {
  const { categoryId, categoryName } = route.params;

  useEffect(() => {
    requestInterests(categoryId)
  }, [])

  return (
    <View style={styles.row}>
      {isFetching ? <ActivityIndicator /> :
            <FlatList
                data={interests[0]}
                numColumns={3}
                columnWrapperStyle={styles.row}
                renderItem={({item, index}) => <WardrobeThingCard item={item} key={index}/>}
            />
        }
    </View>
  )
}


const styles = StyleSheet.create({
  text: {
      marginTop: 20,
      textAlign: 'center',
      color: TEXT_COLOR,
      fontSize: 14
  },
  row: {
      flex: 1,
      justifyContent: "space-around"
  }
})


const mapStateToProps = (state) => ({
  interests: state.interests.interests,
  isFetching: state.interests.isFetching
})

export default connect(mapStateToProps, {requestInterests})(WardrobeDetail)