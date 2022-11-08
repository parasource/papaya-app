import React, { useEffect } from 'react'
import { connect } from "react-redux"
import { checkToken } from '../../redux/auth-reducer';
import { requestCategories, requestSelectedWardrobe } from '../../redux/wardrobe-reducer';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Text, ScrollView } from 'react-native';
import WardrobeCard from "./WardrobeCard";
import { GREEN_COLOR, INPUTS_BG, TEXT_COLOR } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const Wardrobe = ({navigation, parentCategories, categories, requestCategories, checkToken, selectedWardrobeId, isFetching, requestSelectedWardrobe, firstTime}) => {
    useEffect(() => {
        requestCategories()
    }, [])

    useEffect(() => {
        requestSelectedWardrobe()
    }, [])

    return(
      <View style={{paddingHorizontal: 16, flex: 1}}>
        {isFetching ? <ActivityIndicator /> :
        <ScrollView showsVerticalScrollIndicator={false}>
            {firstTime && 
            <TouchableOpacity style={styles.wrapper}>
                <Text style={styles.text}>Вы выбрали {selectedWardrobeId.length} вещей из 5</Text>
            </TouchableOpacity>}
            {parentCategories.map((parent, index) => (
                <View key={'wardrobe-parent-category' + index}>
                    <Text style={styles.parentTitle}>{parent}</Text>
                        {[...categories].filter(item => item.parent_category == parent).map((item, index) => <WardrobeCard 
                        item={item}
                        key={index + 'wardrobe-card'} 
                        navigation={navigation} />)}
                </View>
            ))}
            </ScrollView>
        }
        {(selectedWardrobeId.length >= 5 && firstTime) && <LinearGradient colors={['rgba(17, 17, 17, 0)', '#111']} style={styles.gradient}>
              <TouchableOpacity style={styles.addBtn} onPress={checkToken}>
                <Text style={{fontFamily: 'SFsemibold', fontSize: 16, lineHeight: 20}}>
                    Продолжить
                </Text>
              </TouchableOpacity>
        </LinearGradient>}
      </View>
    )
  }


const styles = StyleSheet.create({
    title: {
        marginTop: 20,
        color: TEXT_COLOR,
        fontSize: 24,
        fontFamily: 'SFsemibold'
    },
    parentTitle: {
        marginTop: 20,
        color: TEXT_COLOR,
        fontSize: 24,
        fontFamily: 'SFsemibold'
    },
    text: {
        marginTop: 20,
        textAlign: 'center',
        color: TEXT_COLOR,
        fontSize: 14
    },
    row: {
        flex: 1,
        marginHorizontal: -4
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
    },
    text: {
        fontSize: 16,
        fontFamily: 'SFregular',
        marginLeft: 8,
        color: TEXT_COLOR
    },
    wrapper: {
        width: '100%',
        marginTop: 8,
        marginBottom: 12,
        borderRadius: 12,
        flexDirection: 'row',
        backgroundColor: INPUTS_BG,
        paddingHorizontal: 12,
        paddingVertical: 16
    },
})


const mapStateToProps = (state) => ({
    parentCategories: state.wardrobe.parentCategories,
    categories: state.wardrobe.categories,
    isFetching: state.wardrobe.isFetching,
    selectedWardrobe: state.wardrobe.selectedWardrobe,
    selectedWardrobeId: state.wardrobe.selectedWardrobeId
})

export default connect(mapStateToProps, {requestCategories, requestSelectedWardrobe, checkToken})(Wardrobe)