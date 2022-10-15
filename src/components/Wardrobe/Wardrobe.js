import React, { useEffect } from 'react'
import { connect } from "react-redux"
import { requestCategories, requestSelectedWardrobe } from '../../redux/wardrobe-reducer';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import WardrobeCard from "./WardrobeCard";
import { TEXT_COLOR } from '../../theme';

const Wardrobe = ({navigation, categories, requestCategories, isFetching, requestSelectedWardrobe, selectedWardrobe}) => {
    useEffect(() => {
        requestCategories()
    }, [])

    useEffect(() => {
        requestSelectedWardrobe()
    }, [])

    return(
      <View style={{paddingHorizontal: 16, flex: 1}}>
        <View style={{height: 70}}></View>
        {isFetching ? <ActivityIndicator /> :
            <FlatList
                data={categories}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => <WardrobeCard 
                item={item}
                key={index} 
                navigation={navigation} />}
            />
        }
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
        text: {
            marginTop: 20,
            textAlign: 'center',
            color: TEXT_COLOR,
            fontSize: 14
        },
        row: {
            flex: 1,
            marginHorizontal: -4
        }
    })


    const mapStateToProps = (state) => ({
        categories: state.wardrobe.categories,
        isFetching: state.wardrobe.isFetching,
        selectedWardrobe: state.wardrobe.selectedWardrobe
    })

    export default connect(mapStateToProps, {requestCategories, requestSelectedWardrobe})(Wardrobe)