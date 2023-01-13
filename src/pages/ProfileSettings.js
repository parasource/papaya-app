import React, { useState } from 'react';
import { View, Text,  StyleSheet,  ActionSheetIOS, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { GRAY_COLOR, GREEN_COLOR, INPUTS_BG, MUTE_TEXT, TEXT_COLOR } from '../theme';
import Chevron from '../../assets/img/icons/chevron.left.svg'
import { updateUser } from '../redux/auth-reducer';
import { requestSelectedWardrobe, requestCategories } from '../redux/wardrobe-reducer';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileSettingsContainer = ({ name, sex, updateUser, requestCategories, requestSelectedWardrobe, firstTime, navigation}) => {
    const [stateSex, setSex] = useState(sex)
    const [stateName, setName] = useState(name)

    const BUTTONS = [
      "Mужской", 
      "Женский", 
      "Отмена"
    ]

      const showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: 2,
          title: 'Выберите свой пол'
        },
        (buttonIndex) => {
          if(buttonIndex !== 2){
            setSex(buttonIndex === 0 ? "male" : "female");
            updateUser({"sex": (buttonIndex === 0 ? "male" : "female"), "name": stateName})
            if(sex !== (buttonIndex === 0 ? "male" : "female")){
              requestCategories()
              requestSelectedWardrobe()
              console.log('reload');
            }
          }
        });
      }

      const handleChange = () => {
        let str = stateName.trim()
        if(str.length > 0){
          updateUser({"sex": stateSex, "name": str})
        }else{
          setName(name)
        }
      }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            {firstTime && <>
            <Text style={{fontFamily: 'SFsemibold', fontSize: 28, color: TEXT_COLOR, marginTop: 32}}>Настройка аккаунта</Text>
            <Text style={{fontFamily: 'SFregular', fontSize: 16, color: TEXT_COLOR, marginTop: 8, marginBottom: 24}}>Настройте ваш аккаунт, чтобы мы подбирали подходящие для вас образы</Text>
            </>}
            {firstTime || <><Text style={styles.label}>Имя пользователя</Text>
            <TextInput
                style={styles.listItem}
                placeholder="Имя"
                placeholderTextColor={GRAY_COLOR}
                onBlur={handleChange}
                onChangeText={text => setName(text)}
                value={stateName}
              />
            <Text style={styles.label}>Учетные данные</Text>
            </>}
            <TouchableOpacity style={styles.listItem} onPress={showActionSheet}>
              <Text style={styles.listItemLabel}>Ваш пол</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.mute}>{sex === "male" ? "Муж." : "Жен."}</Text>
                <Chevron style={styles.chevron}/>
              </View>
            </TouchableOpacity>
            {firstTime && <LinearGradient colors={['rgba(17, 17, 17, 0)', '#111']} style={styles.gradient}>
                  <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('Wardrobe')}>
                    <Text style={{fontFamily: 'SFsemibold', fontSize: 16, lineHeight: 20}}>
                        Продолжить
                    </Text>
                  </TouchableOpacity>
            </LinearGradient>}
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
  sex: state.auth.sex
})

export const ProfileSettings = connect(mapStateToProps, {updateUser, requestCategories, requestSelectedWardrobe})(ProfileSettingsContainer)