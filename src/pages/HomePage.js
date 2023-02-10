import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feed from '../components/Feed/Feed';

export const HomePage = (props) => {
    return (
        <SafeAreaView style={styles.container}>
            <Feed 
                navigation={props.navigation} 
                handelSnapPress={props.handelSnapPress} 
                onTop={props.onTop} 
                route={props.route}
                onTopEnd={props.onTopEnd}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})