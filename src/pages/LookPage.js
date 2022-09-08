import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, Share } from 'react-native'
import React, { useEffect } from 'react'
import { TEXT_COLOR } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { getCurrentLook, dislikeLook, likeLook, unlikeLook, undislikeLook } from '../redux/looks-reducer';
import { BounceAnimation } from '../components/UI/BounceAnimation';
import { LookItem } from '../components/LookItem';
import SkeletonContent from 'react-native-skeleton-content';
import { SharedElement } from 'react-navigation-shared-element';
import { storage } from '../const';

const LookPage = ({route,isFetching,currentLook,getCurrentLook,isLiked,isDisliked,likeLook,dislikeLook,unlikeLook,undislikeLook, navigation}) => {
  const { lookSlug } = route.params;
  const { item } = route.params;

  useEffect(() => {
      getCurrentLook(lookSlug)
  }, [item])

  const shareHamdler = async () => {
    const options={
        message: `Посмотри этот образ:\n${item.name}\n\nБольше образов ты найдешь в приложении Papaya\n\n${storage}/${item.image}`,
    }

    try{
        const result = await Share.share(options)
    }catch(err){
        console.log(err);
    }

  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.space}></View>
        <View style={styles.wrapper}>
            <SharedElement id={`feedCard${lookSlug}`}>
                <Image style={styles.image} 
                source={{uri: `${storage}/${item.image}`}}/>
            </SharedElement>
        </View>
         <SkeletonContent
            containerStyle={{ flex: 1, width: '100%' }}
            boneColor="#121212"
            highlightColor="#333333"
            animationType="pulse"
            isLoading={isFetching}
            layout={[
            // { key: 'someId', width: '100%', height: 500, borderRadius: 12, },
            { key: 'someOtherId', width: '100%', height: 68, marginTop: 12, borderRadius: 12, },
            { key: 'title', width: 300, height: 22, marginTop: 24, borderRadius: 12, },
            { key: 'item', width: '100%', height: 105, marginTop: 12, borderRadius: 12, },
            ]}
       >
            <View style={styles.bar}>
                <BounceAnimation onPress={shareHamdler} component={<Icon name="share-outline" style={styles.iconSM}/>}/>
                <BounceAnimation onPress={() => {
                        if(isLiked){
                            unlikeLook(lookSlug)
                        }else{
                            if(isDisliked){
                                undislikeLook(lookSlug)
                            }
                            likeLook(lookSlug)
                        }

                    }} component={
                    <Icon name = {!isLiked ? "heart-outline" : "heart"}
                    style = {{...styles.icon, color: isLiked ? 'red' : TEXT_COLOR}}/>
                }/>
                <BounceAnimation onPress={() => {
                        if(isDisliked){
                            undislikeLook(lookSlug)
                        }else{
                            if(isLiked){
                                unlikeLook(lookSlug)
                            }
                            dislikeLook(lookSlug)
                        }
                    }} component={
                    <Icon name = {!isDisliked ? "heart-dislike-outline" : "heart-dislike"}
                    style = {styles.icon}/>
                }/>
                <BounceAnimation component={
                    <Icon name="bookmark-outline" style={styles.iconSM}/>
                }/>
            </View>
            <View style={{paddingBottom: 100}}>
                <Text style={styles.title}>Элементы образа</Text>
                {currentLook?.items?.map(item => (
                    <LookItem lookSlug={lookSlug} item={item} key={item.slug} navigation={navigation}/>
                ))}
            </View>
       </SkeletonContent> 
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        position: 'relative',
    },
    wrapper: {
        width: '100%',
        height: 500,
        overflow: 'hidden',
        borderRadius: 12,
        // marginTop: 100
    },
    space: {
        height: 100,
        
    },
    image: {
        height: '100%',
        resizeMode: 'cover'
    },
    bar: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
        backgroundColor: "#1f1f1f",
        borderRadius: 12,
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    icon: {
        color: TEXT_COLOR,
        fontSize: 44
    },
    iconSM: {
        color: TEXT_COLOR,
        fontSize: 28
    },
    title: {
        color: TEXT_COLOR,
        fontFamily: 'SFsemibold',
        fontSize: 24,
        marginTop: 24
    },
    text: {
        color: TEXT_COLOR,
        fontFamily: 'SFregular',
        fontSize: 16,
        marginTop: 8
    }
})

const mapStateToProps = (state) => ({
    currentLook: state.feed.currentLook,
    isFetching: state.feed.isFetching,
    isLiked: state.feed.isLiked,
    isDisliked: state.feed.isDisliked,
})

LookPage.sharedElements = route => {
    const { lookSlug } = route.params;
    return [
        {
        id: `feedCard${lookSlug}`,
        animation: 'fade',
        resize: 'clip'
        }
    ];
};

export default connect(mapStateToProps, {getCurrentLook, likeLook, dislikeLook, unlikeLook, undislikeLook})(LookPage)