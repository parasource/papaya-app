import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { requestSelectedWardrobeThings, requestCategories, requestSelectedWardrobe, setInterests, addThingWardrobe, removeThingWardrobe } from '../../redux/wardrobe-reducer';
import { connect } from 'react-redux';
import { BG_COLOR, GRAY_COLOR, GREEN_COLOR, INPUTS_BG, TEXT_COLOR } from '../../theme';
import { WardrobeThingCard } from './WardrobeThingCard';
import { LinearGradient } from 'react-native-skeleton-content/node_modules/expo-linear-gradient';

const MyWardrobe = ({
    isFetching,
    selectedWardrobeId,
    selectedWardrobe,
    addThingWardrobe,
    removeThingWardrobe,
    requestSelectedWardrobeThings,
    setInterests,
    categories, 
    requestCategories, 
    requestSelectedWardrobe,
    navigation
  }) => {

  const [categoryId, setCategoryId] = useState(1);

  useEffect(() => {
    requestCategories()
    requestSelectedWardrobe()
  }, [])

  useEffect(() => {
    requestSelectedWardrobeThings(categoryId)
  }, [categoryId])

  const categoriesList = () => (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabWrapper}>
        {categories && categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            accessibilityRole="button"
            onPress={() => setCategoryId(category.id)}
            style={{...styles.btnWrapper, backgroundColor: categoryId == category.id ? TEXT_COLOR : INPUTS_BG }}
          >
            <Text style={{...styles.btnAnimated, color: categoryId == category.id ? BG_COLOR : GRAY_COLOR}}>
              {category.name}
            </Text>
          </TouchableOpacity>
        )) }
      </ScrollView>
  )

  return (
    <View style={styles.row}>
      <View style={{height: 70}}></View>
        <FlatList
            data={selectedWardrobe}
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
            // ListEmptyComponent={()=>{
            //     return  isFetching ? 
            //     <ActivityIndicator animating size="large"/> : <Text>data is empty</Text>
            //   }}
            //   refreshControl={<RefreshControl
            //                      colors={["#9Bd35A", "#689F38"]}
            //                      refreshing={isFetching}
            //                    />}
            ListHeaderComponent={categoriesList}
            ListFooterComponent={() => <View style={{height: 128}}></View>}
        />
        <LinearGradient colors={['rgba(17, 17, 17, 0)', '#111']} style={styles.gradient}>
              <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('Wardrobe')}>
                <Image source={require("../../../assets/img/icons/outline/plusBlack.png")} style={{
                  width: 16,
                  height: 16,
                  transform: [{rotate: '45deg'}],
                  marginRight: 4
                }}/>
                <Text style={{fontFamily: 'SFsemibold', fontSize: 12, lineHeight: 20}}>
                    Добавить одежду
                </Text>
              </TouchableOpacity>
        </LinearGradient>
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
  },
  tabWrapper:{
    marginTop: 20,
    marginLeft: -16,
    paddingLeft: 8,
    maxHeight: 34
  },
  btnWrapper: { 
    minWidth: 120,
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginLeft: 8,
    height: 34
  },
  btnAnimated: {
    textAlign: 'center',
    fontFamily: 'SFmedium',
    fontSize: 16,
    height: 34
  },
  gradient: {
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0
  },
  addBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GREEN_COLOR,
    borderRadius: 12,
  }
})


const mapStateToProps = (state) => ({
  isFetching: state.wardrobe.isFetching,
  selectedWardrobeId: state.wardrobe.selectedWardrobeId,
  selectedWardrobe: state.wardrobe.selectedWardrobe,
  categories: state.wardrobe.categories
})

export default connect(mapStateToProps, {requestSelectedWardrobeThings, requestCategories, setInterests, removeThingWardrobe, addThingWardrobe, requestSelectedWardrobe})(MyWardrobe)