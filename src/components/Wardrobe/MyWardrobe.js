import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { requestSelectedWardrobeThings, requestCategories, requestSelectedWardrobe, setInterests, addThingWardrobe, removeThingWardrobe, requestWardrobe } from '../../redux/wardrobe-reducer';
import { connect } from 'react-redux';
import { BG_COLOR, GRAY_COLOR, GREEN_COLOR, INPUTS_BG, TEXT_COLOR } from '../../theme';
import { WardrobeThingCard } from './WardrobeThingCard';
import { LinearGradient } from 'expo-linear-gradient';

const MyWardrobe = ({
    isFetching,
    selectedWardrobeId,
    selectedWardrobe,
    selectedWardrobeCategories,
    addThingWardrobe,
    requestWardrobe,
    removeThingWardrobe,
    requestSelectedWardrobeThings,
    setInterests,
    categories, 
    requestCategories, 
    navigation
  }) => {
  const wardrobeRef = useRef(null)

  const [categoryId, setCategoryId] = useState(1);
  const [scrollIndex, setIndex] = useState(0);

  useEffect(() => {
    setCategoryId(selectedWardrobeCategories[0])
    requestWardrobe(categoryId)
    requestCategories()
  }, [])

  useEffect(() => {
    requestSelectedWardrobeThings(categoryId)
    wardrobeRef?.current?.scrollToIndex({
      index: scrollIndex, 
      animated: true, 
      viewOffset: 16
    })
  }, [categoryId, scrollIndex])

  const categoriesList = () => {
    if(categories.length){
        return (<FlatList
        ref={wardrobeRef}
        data={categories.filter(category => selectedWardrobeCategories.includes(category.id))}
        horizontal 
        initialScrollIndex={scrollIndex}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={'category-wardrobe-'+item.id}
            accessibilityRole="button"
            onPress={() => {
              setIndex(index)
              setCategoryId(item.id)
            }}
            style={{...styles.btnWrapper, backgroundColor: categoryId == item.id ? TEXT_COLOR : INPUTS_BG }}
          >
            <Text style={{...styles.btnAnimated, color: categoryId == item.id ? BG_COLOR : GRAY_COLOR}}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            wardrobeRef.current?.scrollToIndex({ index: info.index, animated: true });
          });
        }}
        showsHorizontalScrollIndicator={false} 
        style={styles.tabWrapper}
      />)
    }else{
      return null
    }}

  return (
    <View style={styles.row}>
        <FlatList
            data={selectedWardrobe}
            numColumns={2}
            keyExtractor={(item) => item.id + "wardrobe-thing"}
            renderItem={({item}) => (
            <WardrobeThingCard
              isFetching={isFetching}
              item={item} 
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
  categories: state.wardrobe.categories,
  selectedWardrobeCategories: state.wardrobe.selectedWardrobeCategories
})

export default connect(mapStateToProps, {requestSelectedWardrobeThings, requestCategories, setInterests, removeThingWardrobe, addThingWardrobe, requestWardrobe})(MyWardrobe)