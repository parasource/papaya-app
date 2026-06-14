import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, Platform, ScrollView, VirtualizedList, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { requestSelectedWardrobeThings, requestSelectedWardrobe, requestCategories, addThingWardrobe, removeThingWardrobe, requestWardrobe } from '../../redux/wardrobe-reducer';
import { connect } from 'react-redux';
import { BG_COLOR, GRAY_COLOR, GREEN_COLOR, INPUTS_BG, TEXT_COLOR } from '../../theme';
import { WardrobeThingCard } from './WardrobeThingCard';
import { LinearGradient } from 'expo-linear-gradient';
import MasonryColumns from '../UI/MasonryColumns';
import Icon from 'react-native-vector-icons/Ionicons';
import { i18n } from '../../../i18n/i18n';
import { aiAPI } from '../../api/aiAPI';
import usePhotoPicker from '../../hooks/usePhotoPicker';
import ScanResultModal from '../AI/ScanResultModal';

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

  const { pickPhoto } = usePhotoPicker()
  const [scanVisible, setScanVisible] = useState(false)
  const [scanLoading, setScanLoading] = useState(false)
  const [scanError, setScanError] = useState(null)
  const [scanItems, setScanItems] = useState([])
  const [scanSelected, setScanSelected] = useState(new Set())

  const handleScan = async () => {
    const photo = await pickPhoto()
    if (!photo) return
    setScanItems([])
    setScanError(null)
    setScanSelected(new Set())
    setScanVisible(true)
    setScanLoading(true)
    try {
      const res = await aiAPI.scanPhoto(photo.uri)
      const items = Array.isArray(res.data) ? res.data : [res.data]
      setScanItems(items)
    } catch (e) {
      setScanError('Не удалось распознать вещи. Попробуй другое фото.')
    } finally {
      setScanLoading(false)
    }
  }

  const toggleScanItem = (id) => {
    setScanSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const confirmScanItems = async () => {
    const ids = [...scanSelected]
    const newWardrobe = [...selectedWardrobeId, ...ids]
    await addThingWardrobe(ids[0], selectedWardrobeId) // упрощённо — добавляем по одному
    // TODO: когда бэкенд вернёт реальные id — добавить через setWardrobe весь массив
    setScanVisible(false)
    requestSelectedWardrobeThings(categoryId)
  }

  useEffect(() => {
    setCategoryId(null)
    requestCategories()
    requestSelectedWardrobe()
  }, [sex])

  // если в текущей категории не осталось вещей — переключаемся на первую доступную
  useEffect(() => {
    if(categoryId && selectedWardrobeCategories?.length > 0 && !selectedWardrobeCategories.includes(categoryId)){
      setIndex(0)
      setCategoryId([...selectedWardrobeCategories].sort((a, b) => a - b)[0])
    }
  }, [selectedWardrobeCategories])

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
    return <MasonryColumns
          data={selectedWardrobe}
          numColumns={2}
          renderItem={({item}) => (
          <WardrobeThingCard
            isFetching={isFetching}
            item={item}
            key={item.id + "wardrobe-thing"}
            selected={selectedWardrobeId.includes(item.id)}
            onPress={async () => {
              if(selectedWardrobeId.includes(item.id)){
                await removeThingWardrobe(item.id, selectedWardrobeId)
              }else{
                await addThingWardrobe(item.id, selectedWardrobeId)
              }
              requestSelectedWardrobeThings(categoryId)
            }}
            />
          )}
      />
  }

  return (
    <View style={styles.row}>
      {isFetching && selectedWardrobeId.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 }}>
          <ActivityIndicator size="large" color={TEXT_COLOR} />
          <Text style={{ color: GRAY_COLOR, fontFamily: 'SFregular', fontSize: 14, marginTop: 12, textAlign: 'center' }}>
            Загружаем ваш гардероб…
          </Text>
        </View>
      ) : selectedWardrobeId.length <= 0 ? <Text style={{
        fontSize: 16,
        fontFamily: 'SFregular',
        color: GRAY_COLOR,
        textAlign: 'center',
        marginTop: 20
      }}>{i18n.t('wardrobe.empty')}</Text> :
      <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            ref={wardrobeRef}
            data={[...localCategories].sort((a, b) => a.id - b.id).filter(category => selectedWardrobeCategories.includes(category.id))}
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
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={[styles.addBtn, { flex: 1, marginRight: 8 }]} onPress={() => navigation.navigate('Wardrobe')}>
                <Icon name="add-outline" style={{fontSize: 24}}/>
                <Text style={{fontFamily: 'SFsemibold', fontSize: 12, lineHeight: 20}}>
                  {i18n.t('wardrobe.addItem')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.addBtn, { width: 52, paddingHorizontal: 0 }]} onPress={handleScan}>
                <Icon name="scan-outline" style={{fontSize: 22}}/>
              </TouchableOpacity>
            </View>
      </LinearGradient>
      <ScanResultModal
        visible={scanVisible}
        onClose={() => setScanVisible(false)}
        isLoading={scanLoading}
        error={scanError}
        items={scanItems}
        selectedIds={scanSelected}
        onToggle={toggleScanItem}
        onConfirm={confirmScanItems}
      />
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