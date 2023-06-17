import React, { useState } from 'react';
import { View, Text,  StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { GRAY_COLOR, GREEN_COLOR, INPUTS_BG, MUTE_TEXT, TEXT_COLOR } from '../theme';
import Chevron from '../../assets/img/icons/chevron.left.svg'
import { updateUser } from '../redux/auth-reducer';
import { requestSelectedWardrobe, requestCategories } from '../redux/wardrobe-reducer';
import { connect } from 'react-redux';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { i18n } from '../../i18n/i18n';

const ProfileSettingsContainer = ({ name, sex, updateUser, requestCategories, requestSelectedWardrobe, navigation, toggleNotification}) => {
    const [stateSex, setSex] = useState(sex)
    const [stateName, setName] = useState(name)
    
    const { showActionSheetWithOptions } = useActionSheet();

    const BUTTONS = [
      i18n.t('settings.male'), 
			i18n.t('settings.female'), 
			i18n.t('settings.cancel'), 
    ]

      const showActionSheet = () => {
        showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: 2,
          title: i18n.t('settings.sheetTitle')
        },
        (buttonIndex) => {
          if(buttonIndex !== 2){
            setSex(buttonIndex === 0 ? "male" : "female");
            updateUser({"sex": (buttonIndex === 0 ? "male" : "female"), "name": stateName, "receive_push_notifications": toggleNotification})
            if(sex !== (buttonIndex === 0 ? "male" : "female")){
              requestCategories()
              requestSelectedWardrobe()
            }
          }
        });
      }

      const handleChange = () => {
        let str = stateName.trim()
        if(str.length > 0){
          updateUser({"sex": stateSex, "name": str, "receive_push_notifications": toggleNotification})
        }else{
          setName(name)
        }
      }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <Text style={styles.label}>{i18n.t('settings.userName')}</Text>
            <TextInput
                style={styles.listItem}
                placeholder={i18n.t('settings.name')}
                placeholderTextColor={GRAY_COLOR}
                onBlur={handleChange}
                onChangeText={text => setName(text)}
                value={stateName}
              />
            <Text style={styles.label}>{i18n.t('settings.settingsData')}</Text>
            <TouchableOpacity style={styles.listItem} onPress={showActionSheet}>
              <Text style={styles.listItemLabel}>{i18n.t('settings.yourSex')}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.mute}>{sex === "male" ? 
								i18n.t('settings.male').substring(0,3) + '.' : 
      					i18n.t('settings.female').substring(0,3) + '.'}</Text>
                <Chevron style={styles.chevron}/>
              </View>
            </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      paddingHorizontal: 16, 
      flex: 1,
    },
    gradient: {
        height: 128,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', 
        left: 0, 
        right: 0, 
        bottom: 0,
        paddingHorizontal: 20
    },
    addBtn: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: GREEN_COLOR,
      borderRadius: 12,
      width: '100%',
      justifyContent: 'center'
    },
    chevron: {
      width: 8,
      height: 12,
      marginTop: 4
    },
    label: {
      color: MUTE_TEXT,
      marginLeft: 16,
      fontSize: 16,
      textTransform: 'uppercase',
      fontFamily: 'SFregular', 
      marginBottom: 8
    },
    listItem: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: INPUTS_BG,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      color: TEXT_COLOR
    },
    listItemBlock: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    listItemLine: {
      flexGrow: 1,
      height: 1,
      marginLeft: 16,
      backgroundColor: MUTE_TEXT,
    },
    listItemWithBlocks: {
      borderRadius: 8,
      backgroundColor: INPUTS_BG,
      width: '100%',
      marginBottom: 16
    },
    profileName: {
      color: TEXT_COLOR,
      fontSize: 24,
      fontFamily: 'SFregular', 
    },
    mute: {
      color: MUTE_TEXT,
      fontSize: 17,
      fontFamily: 'SFregular', 
      marginRight: 8
    },
    listItemLabel: {
      color: TEXT_COLOR,
      fontSize: 16,
      fontFamily: 'SFregular', 
    }
  })

const mapStateToProps = (state) => ({
  name: state.auth.name, 
  sex: state.auth.sex,
  toggleNotification: state.auth.toggleNotification
})

export const ProfileSettings = connect(mapStateToProps, {updateUser, requestCategories, requestSelectedWardrobe})(ProfileSettingsContainer)