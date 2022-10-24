import React, { useState } from 'react';
import { View, Text,  StyleSheet,  ActionSheetIOS, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { GRAY_COLOR, INPUTS_BG, MUTE_TEXT, TEXT_COLOR } from '../theme';
import Chevron from '../../assets/img/icons/chevron.left.svg'
import { updateUser } from '../redux/auth-reducer';
import { connect } from 'react-redux';

const ProfileSettingsContainer = ({ login, sex, updateUser }) => {
    const [stateSex, setSex] = useState(sex)
    const [name, setName] = useState(login)

    const BUTTONS = ['male', 'female', 'Отмена']

      const showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if(buttonIndex !== 2){
            setSex(BUTTONS[buttonIndex]);
            updateUser({"sex": stateSex})
          }
        });
      }

      const handleChange = (text) => {
        if(text.trim().length > 0){
          setName(text.trim())
          updateUser({"login": name})
        }else{
          setName(name)
        }
      }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={{height: 70}}></View>
            <Text style={styles.label}>Имя пользователя</Text>
            <TextInput
                style={styles.listItem}
                placeholder="Имя"
                placeholderTextColor={GRAY_COLOR}
                onChangeText={text => handleChange(text)}
                value={name}
              />
            <Text style={styles.label}>Учетные данные</Text>
            <TouchableOpacity style={styles.listItem} onPress={showActionSheet}>
              <Text style={styles.listItemLabel}>Ваш пол</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.mute}>{stateSex}</Text>
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
  login: state.auth.login, 
  sex: state.auth.sex
})

export const ProfileSettings = connect(mapStateToProps, {updateUser})(ProfileSettingsContainer)