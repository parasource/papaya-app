import { Button, View, Text,Image, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { TEXT_COLOR } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux';
import { logout } from '../redux/auth-reducer';

const ProfilePage = ({navigation, logout, login, id, email}) => {
  const logoutAlert = () => {  
      Alert.alert(  
          'Вы уверены?',  
          'Вы точно хотите выйте',  
          [  
              {  
                  text: 'Отмена',    
                  style: 'cancel'
              },  
              {
                text: 'Выйти', 
                onPress: () => logout(),
              },  
          ],
          {cancelable: true}
      );  
  }  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      <View style={styles.flex}>
        <View style={styles.imgWrap}>
          <Image style={styles.image} source={{uri: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=798&q=80'}}/>
        </View>
        <View style={styles.column}>
          <Text style={styles.login}>{login}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.email}>{id}</Text>
          <Text style={styles.logout} onPress={logoutAlert}>Выйти</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16
    },
    column: {
      flexDirection: 'column',
    },
    login: {
      color: TEXT_COLOR,
      fontSize: 16,
      fontFamily: 'SFmedium'
    },  
    logout: {
      color: 'red',
      fontSize: 16,
      fontFamily: 'SFmedium',
      marginTop: 'auto'
    },  
    email: {
      color: TEXT_COLOR,
      fontSize: 16,
      fontFamily: 'SFregular',
      opacity: 0.4
    },  
    title: {
      marginTop: 20,
      color: TEXT_COLOR,
      fontSize: 24,
      fontFamily: 'SFsemibold'
    },
    imgWrap: {
      width: 109,
      height: 109,
      overflow: 'hidden',
      borderRadius: 8,
      marginRight: 8
    },
    image: {
      height: 109,
      resizeMode: 'cover'
    },
    flex: {
      marginTop: 20,
      flexDirection: 'row',
    }
})

const mapStateToProps = (state) => ({
  login: state.auth.login, 
  id: state.auth.id, 
  email: state.auth.email
})

export default connect(mapStateToProps, {logout})(ProfilePage)