import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { requestAllWardrobe, requestSelectedWardrobe, setInterests, addThingWardrobe, removeThingWardrobe } from '../../redux/wardrobe-reducer';
import { connect } from 'react-redux';
import { TEXT_COLOR } from '../../theme';
import { WardrobeThingCard } from './WardrobeThingCard';

const WardrobeDetail = ({
    route,
    wardrobeThings,
    requestAllWardrobe,
    isFetching,
    selectedWardrobeId,
    addThingWardrobe,
    removeThingWardrobe,
    setInterests
  }) => {
  const { categoryId } = route.params;

  useEffect(() => {
    requestAllWardrobe(categoryId)
  }, [])

  return (
    <View style={styles.row}>
      {isFetching ? <ActivityIndicator /> :
          <>
          <View style={{height: 70}}></View>
            <FlatList
                data={wardrobeThings[0]}
                numColumns={2}
                renderItem={({item}) => (
                <WardrobeThingCard
                  item={item} 
                  key={item.id}
                  selected={selectedWardrobeId.includes(item.id)}
                  onPress={() => {
                    if(selectedWardrobeId.includes(item.id)){
                      removeThingWardrobe(item.id)
                      setInterests(selectedWardrobeId)
                    }else{
                      addThingWardrobe(item.id)
                      setInterests(selectedWardrobeId)
                    }
                  }}
                  />
                )}
            />
          </>
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
    paddingHorizontal: 16,
    paddingBottom: 100
  }
})


const mapStateToProps = (state) => ({
  wardrobeThings: state.wardrobe.wardrobeThings,
  isFetching: state.wardrobe.isFetching,
  selectedWardrobeId: state.wardrobe.selectedWardrobeId,
})

export default connect(mapStateToProps, {requestAllWardrobe, requestSelectedWardrobe, setInterests, removeThingWardrobe, addThingWardrobe})(WardrobeDetail)