import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, StyleSheet } from "react-native";
import { GRAY_COLOR, INPUTS_BG, TEXT_COLOR } from "../../theme";
import SearchItem from "./SearchItem";
import { useKeyboard } from '../../hooks/useKeyboards';

const SearchFocus = ({feed, onClick, onClear, autofill, onTagPress}) => {
	const keyboardHeight = useKeyboard()

  const setHistory = feed.history.filter((value, index, self) => {
    return self.findIndex(v => v.query === value.query) === index;
  })

  const setPopular = feed.suggestions.filter((value, index, self) => {
    return self.findIndex(v => v.query === value.query) === index;
  })

  return (
    <TouchableOpacity activeOpacity={1}>
      {/* <View> */}
      {autofill?.tags && 
        <View style={{marginBottom: 8, flex: 1, flexDirection: 'row', flexWrap: 'wrap'}} showsHorizontalScrollIndicator={false}>
          {autofill.tags.map((item, index) => 
            <TouchableOpacity onStartShouldSetResponder={() => true} style={styles.tag} key={`tags_${index}`} onPress={() => onTagPress(item)}>
                <Text style={{color: TEXT_COLOR}}>
                    {item.toLowerCase()}
                </Text>
            </TouchableOpacity>)}
        </View>}
      {/* </View> */}
      {feed ? (
        <View>
          {autofill?.suggestions ?  
          <View>
            {autofill.suggestions.map((item, index) => {
              if(item.query ){
                return  <SearchItem key={index} item={item} onClick={(value) => onClick(value)} icon={'search-outline'}/>
              }
            })}
          </View>
          : <View>
          {feed.history.length > 0 && 
          <View style={styles.row}>
            <View style={{
              width: '100%',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center'
              }}>
                  <Text style={styles.title}>Недавние</Text>
                  <TouchableOpacity onPress={() => onClear()}>
                    <Text style={styles.clear}>Очистить</Text>
                  </TouchableOpacity>
              </View>
            
            {setHistory.map((item, index) => {
              if(item.query ){
                return  <SearchItem key={index} item={item} onClick={(value) => onClick(value)} icon={'search-outline'}/>
              }
            })}
          </View>}
          <View style={styles.row}>
            <Text style={styles.title}>Также ищут</Text>
            {setPopular.map((item, index) => {
              if(item.query ){
                return  <SearchItem key={index} item={item} onClick={(value) => onClick(value)} icon={'flash-outline'}/>
              }
            })}
          </View>
          </View>}
        </View>
      ) : (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Больше образов нет</Text>
        </View>
      )}
			{keyboardHeight !== 0 ? <View style={{height: keyboardHeight}}></View> : <></>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 40
  },
  footer: {
      textAlign: 'center',
      color: GRAY_COLOR, 
      paddingTop: 16
  },
  footerText: {
      color: GRAY_COLOR,
      textAlign: 'center',
      fontFamily: 'SFregular'
  },
  container: {
      paddingHorizontal: 16,
      paddingBottom: 150
  },
  title: {
    fontFamily: 'SFsemibold',
    fontSize: 24,
    color: TEXT_COLOR
  },
  clear: {
    fontFamily: 'SFregular',
    fontSize: 17,
    color: TEXT_COLOR
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: INPUTS_BG,
    marginRight: 8,
  }
});

export default SearchFocus;
