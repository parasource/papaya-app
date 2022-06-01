import { Button, View, Text,Image, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { GRAY_COLOR, TEXT_COLOR } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux';
import { logout } from '../redux/auth-reducer';
import { Avatar } from 'react-native-elements';
import { FullButton } from '../components/UI/FullButton';

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
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.wrapper}>
          <Avatar
            title={login}
            rounded
            size="xlarge"
            source={{uri: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=798&q=80'}}
          />
          <Text style={styles.login}>{login}</Text>
          <View style={styles.refWrap}>
            <Text style={{fontSize: 16, fontFamily: 'SFmedium', color: TEXT_COLOR, marginBottom: 16}}>Вы ещё никого не пригласили</Text>
            <FullButton label="Пригласить"/>
          </View>
          <View style={styles.settingsWrap}>
              <TouchableOpacity style={styles.settingsCard} onPress={() => navigation.navigate('Wardrobe')}>
                <Text style={styles.settingsTitle}>Гардероб</Text>
                <Text style={styles.settingsText} numberOfLines={1}>Изменить вещи в гардеробе</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsCard} onPress={() => navigation.navigate('ProfileSettings', {email: email})}>
                <Text style={styles.settingsTitle}>Аккаунт</Text>
                <Text style={styles.settingsText} numberOfLines={1}>Изменить логин, пароль, почту и личные данные</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsCard} onPress={() => navigation.navigate('Notification')}>
                <Text style={styles.settingsTitle}>Уведомления</Text>
                <Text style={styles.settingsText} numberOfLines={1}>Включить или выключить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsCard}>
                <Text style={styles.settingsTitle}>Поддержка</Text>
                <Text style={styles.settingsText} numberOfLines={1}>Что-то там можно</Text>
              </TouchableOpacity>
          </View>
      </View>
        
        <Text style={styles.logout} onPress={logoutAlert}>Выйти из аккаунта</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16, 
        flex: 1,
    },
    settingsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    },
    settingsCard: {
      width: '49%',
      marginBottom: 12,  
      borderRadius: 12,
      padding: 12,
      justifyContent: 'flex-end',
      height: 100,
      backgroundColor: '#1F1F1F'
    },
    settingsTitle: {
      color: TEXT_COLOR,
      fontSize: 16,
      fontFamily: 'SFsemibold'
    },
    settingsText: {
      color: GRAY_COLOR,
      fontSize: 12,
      fontFamily: 'SFregular',
    },
    refWrap: {
      backgroundColor: '#1F1F1F',
      paddingHorizontal: 16, 
      paddingVertical: 20,
      borderRadius: 12,
      justifyContent: 'center', 
      alignItems: 'center',
      marginBottom: 20,
      width: '100%', 
      marginTop: 32
    },
    login: {
      color: TEXT_COLOR,
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'SFmedium', 
      marginTop: 12
    },  
    logout: {
      color: GRAY_COLOR,
      fontSize: 16,
      fontFamily: 'SFregular',
      marginTop: 'auto',
      textAlign: 'center',
      marginTop: 80,
      marginBottom: 70
    }, 
    wrapper: {
      marginTop: 20,
      justifyContent: 'center', 
      alignItems: 'center',
    }
})

const mapStateToProps = (state) => ({
  login: state.auth.login, 
  id: state.auth.id, 
  email: state.auth.email
})

export default connect(mapStateToProps, {logout})(ProfilePage)