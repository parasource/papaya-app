import React, { useEffect, useRef } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Text, Platform } from 'react-native';
import { GRAY_COLOR, BG_COLOR, TEXT_COLOR, INPUTS_BG } from '../../theme';

export const FeedCategories = ({categories, index, onPress, isActive}) => {
    const categoriesRef = useRef(null)

    useEffect(() => {
        categoriesRef.current?.scrollToIndex({
        index: index, 
        animated: true, 
        viewOffset: 16})
    }, [index])

    return (
        <FlatList
            ref={categoriesRef}
            data={[{ID: null}, ...categories]}
            horizontal 
            keyExtractor={(item) => 'category'+item.ID}
            initialScrollIndex={index}
            showsHorizontalScrollIndicator={false} 
            style={styles.tabWrapper}
            onScrollToIndexFailed={info => {
                const wait = new Promise(resolve => setTimeout(resolve, 500));
                wait.then(() => {
                    categoriesRef.current?.scrollToIndex({ index: info.index, animated: true });
                });
            }}
            renderItem={({item, index}) => {
            if(item.ID === null){
                return (
                <TouchableOpacity
                accessibilityRole="button"
                onPress={() => onPress(null)}
                style={{...styles.btnWrapper, backgroundColor: isActive == null ? TEXT_COLOR : INPUTS_BG, paddingVertical: Platform.OS === 'ios' ? 8 : 4 }}
                >
                    <Text style={{...styles.btnAnimated, color: isActive == null ? BG_COLOR : GRAY_COLOR}}>
                        Для вас
                    </Text>
                </TouchableOpacity>
                )
            }
            return(
                <TouchableOpacity
                    accessibilityRole="button"
                    onPress={() => onPress(item.ID, item.slug, index)}
                    style={{
											...styles.btnWrapper, 
											backgroundColor: isActive == item.ID ? TEXT_COLOR : INPUTS_BG, 
											paddingVertical: Platform.OS === 'ios' ? 8 : 4,
											marginRight: index === categories?.length && 16 }}
                    >
                    <Text style={{...styles.btnAnimated, color: isActive == item.ID ? BG_COLOR : GRAY_COLOR}}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            )}}
        />
    );
}

const styles = StyleSheet.create({
    tabWrapper:{
        marginTop: 8,
        marginLeft: 8,
        maxHeight: 34,
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
})
