import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { requestAllWardrobe, requestSelectedWardrobe, setInterests } from '../../redux/wardrobe-reducer';
import { connect } from 'react-redux';
import { TEXT_COLOR } from '../../theme';
import WardrobeThingCard from './WardrobeThingCard';
import { FullButton } from '../UI/FullButton';

const WardrobeDetail = ({
    route,
    wardrobeThings,
    requestAllWardrobe,
    requestSelectedWardrobe,
    setInterests,
    isFetching
  }) => {
  const { categoryId } = route.params;
  const [things, setThings] = useState([])

  useEffect(() => {
    requestAllWardrobe(categoryId)
    requestSelectedWardrobe()
  }, [])

  return (
    <View style={styles.row}>
      {isFetching ? <ActivityIndicator /> :
          <>
            <FlatList
                data={wardrobeThings[0]}
                numColumns={3}
                renderItem={({item}) => (
                <WardrobeThingCard 
                  item={item} 
                  key={item.ID}
                  selected={things.find(el => el.slug == item.slug)}
                  onPress={() => {
                    if(![...things].find(el => el == item)){
                      setThings(prevArray => [...prevArray, item])
                    }else{
                      setThings(things.filter(el => el.slug !== item.slug))
                    }
                  }}
                  />
                )}
            />
            <FullButton label="Сохранить" style={{width: 200, marginTop: 20}} pressHandler={() => {setInterests(things)}}/>
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
  }
})


const mapStateToProps = (state) => ({
  wardrobeThings: state.wardrobe.wardrobeThings,
  isFetching: state.wardrobe.isFetching
})

export default connect(mapStateToProps, {requestAllWardrobe, requestSelectedWardrobe, setInterests})(WardrobeDetail)