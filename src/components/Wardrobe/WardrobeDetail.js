import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { requestWardrobe, requestSelectedWardrobe, addThingWardrobe, setInterests, removeThingWardrobe } from '../../redux/wardrobe-reducer';
import { connect } from 'react-redux';
import { TEXT_COLOR } from '../../theme';
import { WardrobeThingCard } from './WardrobeThingCard';

const WardrobeDetail = ({
    route,
    wardrobeThings,
    requestWardrobe,
    isFetching,
    selectedWardrobeId,
    addThingWardrobe,
    removeThingWardrobe,
    setInterests
  }) => {
  const { categoryId } = route.params;

  useEffect(() => {
    requestWardrobe(categoryId)
  }, [])

  return (
    <View style={styles.row}>
      {isFetching ? <ActivityIndicator /> :
          <>
            <FlatList
                style={{flex: 1}}
                data={wardrobeThings}
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
    flex: 1
  }
})


const mapStateToProps = (state) => ({
  wardrobeThings: state.wardrobe.wardrobeThings,
  isFetching: state.wardrobe.isFetching,
  selectedWardrobeId: state.wardrobe.selectedWardrobeId,
})

export default connect(mapStateToProps, {requestWardrobe, requestSelectedWardrobe, setInterests, removeThingWardrobe, addThingWardrobe})(WardrobeDetail)