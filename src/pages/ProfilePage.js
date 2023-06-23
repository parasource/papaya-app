import {  View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Linking } from 'react-native'
import React, { useState } from 'react'
import { INPUTS_BG, MUTE_TEXT, TEXT_COLOR } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux';
import { logout, remove, updateUser } from '../redux/auth-reducer';
import { Switch } from 'react-native-elements';
import Chevron from '../../assets/img/icons/chevron.left.svg'
import { i18n } from '../../i18n/i18n';

const ProfilePage = ({navigation, logout, remove, name, toggleNotification, sex, updateUser}) => {
  const [isActive, setIsActive] = useState(toggleNotification)

  const pushHandler = async () => {
    if(isActive){
      setIsActive(false)
      updateUser({"sex": sex, "name": name, "receive_push_notifications": false})
    }else{
      setIsActive(true)
      updateUser({"sex": sex, "name": name, "receive_push_notifications": true})
    }
  }

  const logoutAlert = () => {  
      Alert.alert(  
					i18n.t('profile.alertLogoutTitle'),  
          i18n.t('profile.alertLogoutSubtitle'),  
          [  
              {  
									text:	i18n.t('profile.alertCancel'),    
                  style: 'cancel'
              },  
              {
                text:	i18n.t('profile.alertLogout'),    
                onPress: () => logout(),
              },  
          ],
          {cancelable: true}
      );  
  }  

  const removeAlert = () => {  
      Alert.alert(  
					i18n.t('profile.alertRemoveTitle'),  
					i18n.t('profile.alertRemoveSubtitle'),  
          [  
              {  
                  text:	i18n.t('profile.alertCancel'),    
                  style: 'cancel'
              },  
              {
								text:	i18n.t('profile.alertRemove'),    
                onPress: () => remove(),
              },  
          ],
          {cancelable: true}
      );  
  }  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.wrapper}>
          <Text style={styles.title}>{i18n.t('profile.title')}</Text>
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('ProfileSettings')}>
            <View>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.muteText}>{i18n.t('profile.settingsSubtitle')}</Text>
            </View>
            <Chevron style={styles.chevron}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('MyWardrobe')}>
            <Text style={styles.listItemLabel}>{i18n.t('profile.myWardrobeTitle')}</Text>
            <Chevron style={styles.chevron}/>
          </TouchableOpacity>
          <Text style={{...styles.muteText, marginLeft: 16}}>{i18n.t('profile.myWardrobeSubtitle')}</Text>
          <TouchableOpacity style={styles.listItemWithSwitch}>
            <Text style={styles.listItemLabel}>{i18n.t('profile.pushTitle')}</Text>
            <Switch value={isActive} onValueChange={pushHandler} color={'#34C759'}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => Linking.openURL('mailto:support@papaya.pw') }>
            <Text style={styles.listItemLabel}>{i18n.t('profile.support')}</Text>
          </TouchableOpacity>
          <Text style={styles.logout} onPress={logoutAlert}>{i18n.t('profile.logout')}</Text>
          <Text style={styles.remove} onPress={removeAlert}>{i18n.t('profile.remove')}</Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16, 
        flex: 1,
    },
    chevron: {
      width: 8,
      height: 12,
      marginTop: 4
    },
    logout: {
      color: MUTE_TEXT,
      fontSize: 16,
      fontFamily: 'SFregular',
      marginTop: 24,
      textAlign: 'center',
    }, 
    remove: {
      color: '#f44',
      fontSize: 16,
      fontFamily: 'SFregular',
      marginTop: 16,
      textAlign: 'center',
    }, 
    wrapper: {
      marginTop: 50,
    },
    title: {
      color: TEXT_COLOR,
      fontSize: 34,
      fontFamily: 'SFbold', 
      marginBottom: 6
    },
    listItem: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: INPUTS_BG,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16
    },
    listItemWithSwitch: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: INPUTS_BG,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16
    },
    profileName: {
      color: TEXT_COLOR,
      fontSize: 24,
      fontFamily: 'SFregular', 
    },
    muteText: {
      color: MUTE_TEXT,
      fontSize: 13,
      marginTop: 8,
      fontFamily: 'SFregular', 
      maxWidth: 192
    },
    listItemLabel: {
      color: TEXT_COLOR,
      fontSize: 16,
      fontFamily: 'SFregular', 
    }
})

const mapStateToProps = (state) => ({
  name: state.auth.name, 
  id: state.auth.id, 
  email: state.auth.email,
  toggleNotification: state.auth.toggleNotification,
  sex: state.auth.sex
})

export default connect(mapStateToProps, {logout, remove, updateUser})(ProfilePage)