import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import { TEXT_COLOR } from '../../theme';
import FeedCard from './FeedCard';
import { connect } from 'react-redux';
import { requestLooks } from '../../redux/looks-reducer';


const ForYou = ({navigation, isFetching, looks, requestLooks}) => {
  const [page, setPage] = useState(0)

  useEffect(() => {
    requestLooks(page)
  }, [])
  
  return (
    <ScrollView>
      <View style={{paddingBottom: 100, paddingHorizontal: 16, height: '100%'}}>
        <Text style={styles.title}>Образ на сегодня</Text>
        <Image style={styles.image} source={{uri: 'https://images.unsplash.com/photo-1600574691453-499962cc0611?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'}}/>
       {isFetching ?
         <ActivityIndicator/> :
        <View style={styles.row}>
          {looks && looks.map((item,index) => (
            <FeedCard item={item} key={index} navigation={navigation}/>
          ))}
        </View>}
      </View>
    </ScrollView>
  )
}



const styles = StyleSheet.create({
    row: {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    },
    container: {
        paddingHorizontal: 16
    },
    title: {
        color: TEXT_COLOR,
        fontFamily: 'GilroyBold',
        fontSize: 24,
        marginTop: 20,
        marginBottom: 12
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 8,
    }
})

const mapStateToProps = (state) => ({
  looks: state.feed.looks, 
  isFetching: state.feed.isFetching
})

export default connect(mapStateToProps, {requestLooks})(ForYou)