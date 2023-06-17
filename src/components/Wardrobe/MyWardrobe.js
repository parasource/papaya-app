import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, Platform, ScrollView, VirtualizedList, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { requestSelectedWardrobeThings, requestSelectedWardrobe, requestCategories, addThingWardrobe, removeThingWardrobe, requestWardrobe } from '../../redux/wardrobe-reducer';
import { connect } from 'react-redux';
import { BG_COLOR, GRAY_COLOR, GREEN_COLOR, INPUTS_BG, TEXT_COLOR } from '../../theme';
import { WardrobeThingCard } from './WardrobeThingCard';
import { LinearGradient } from 'expo-linear-gradient';
import MasonryList from '@react-native-seoul/masonry-list';
import Icon from 'react-native-vector-icons/Ionicons';
import { i18n } from '../../../i18n/i18n';

const MyWardrobe = ({
    isFetching,
    selectedWardrobeId,
    selectedWardrobe,
    selectedWardrobeCategories,
    addThingWardrobe,
    requestWardrobe,
    removeThingWardrobe,
    requestSelectedWardrobeThings,
    requestSelectedWardrobe,
    categories, 
    requestCategories, 
    navigation,
    sex
  }) => {
  const wardrobeRef = useRef(null)

  const [categoryId, setCategoryId] = useState();
  const [scrollIndex, setIndex] = useState(0);
  const [localCategories, setLocalCategories] = useState([])

  useEffect(() => {
    setCategoryId(null)
    requestCategories()
    requestSelectedWardrobe()
  }, [sex])

  useEffect(() => {
    categories != localCategories ? setLocalCategories(categories) : null

    if(categoryId){
      if(localCategories.length){
        wardrobeRef?.current?.scrollToIndex({
          index: scrollIndex, 
          animated: true, 
          viewOffset: 16
        })
      }
      requestSelectedWardrobeThings(categoryId)
    }else{
      setCategoryId(selectedWardrobeCategories?.sort((a, b) => a - b)[0])
    }
  }, [scrollIndex, categoryId])

  const MapWardrobe = () => {
    if(!categoryId) setCategoryId(selectedWardrobeCategories.sort((a, b) => a - b)[0])

    return <MasonryList
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
                removeThingWardrobe(item.id, selectedWardrobeId) 
              }else{
                addThingWardrobe(item.id, selectedWardrobeId) 
              }
            }}
            />
          )}
          nestedScrollEnabled
          ListFooterComponent={() => <View style={{height: 128}}></View>}
      />
  }

  return (
    <View style={styles.row}>
      {selectedWardrobeId.length <= 0 ? <Text style={{
        fontSize: 16,
        fontFamily: 'SFregular',
        color: GRAY_COLOR,
        textAlign: 'center',
        marginTop: 20
      }}>{i18n.t('wardrobe.empty')}</Text> :
      <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            ref={wardrobeRef}
            data={localCategories.sort(el => el.id).filter(category => selectedWardrobeCategories.includes(category.id))}
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
                style={{...styles.btnWrapper, backgroundColor: categoryId == item.id ? TEXT_COLOR : INPUTS_BG, paddingVertical: Platform.OS === 'ios' ? 8 : 4}}
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
          />
          <View>
            {isFetching ? <ActivityIndicator style={{marginTop: 40}}/> : <MapWardrobe/>}
          </View>
          <View style={{height: 120}}></View>
      </ScrollView>}
      <LinearGradient colors={['rgba(17, 17, 17, 0)', '#111']} style={styles.gradient}>
            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('Wardrobe')}>
              <Icon name="add-outline" style={{fontSize: 24}}/>
              <Text style={{fontFamily: 'SFsemibold', fontSize: 12, lineHeight: 20}}>
                {i18n.t('wardrobe.addItem')}
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
    bottom: 0,
    paddingHorizontal: 20
  },
  addBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GREEN_COLOR,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center'
  }
})


const mapStateToProps = (state) => ({
  isFetching: state.wardrobe.isFetching,
  selectedWardrobeId: state.wardrobe.selectedWardrobeId,
  selectedWardrobe: state.wardrobe.selectedWardrobe,
  categories: state.wardrobe.categories,
  selectedWardrobeCategories: state.wardrobe.selectedWardrobeCategories,
  sex: state.auth.sex,
})

export default connect(mapStateToProps, {requestSelectedWardrobeThings, requestSelectedWardrobe, requestCategories, removeThingWardrobe, addThingWardrobe, requestWardrobe})(MyWardrobe)