import React, { useEffect } from 'react'
import { connect } from "react-redux"
import { requestCategories } from '../../redux/interests-reducer';
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
import WardrobeCard from "./WardrobeCard";
import { TEXT_COLOR } from '../../theme';

const Wardrobe = ({navigation, categories, requestCategories}) => {
    useEffect(() => {
        requestCategories()
    }, [])

    return(
      <View>
        <Text style={styles.title}>Гардероб</Text>
        {!categories.length ? <ActivityIndicator /> :
            <FlatList
                data={categories}
                numColumns={2}
                columnWrapperStyle={styles.row}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => <WardrobeCard item={item} key={index} navigation={navigation}/>}
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
            justifyContent: "space-around",
            marginHorizontal: -4
        }
    })


    const mapStateToProps = (state) => ({
        categories: state.interests.categories
    })

    export default connect(mapStateToProps, {requestCategories})(Wardrobe)