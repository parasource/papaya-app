import { Formik } from 'formik';
import React from 'react';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { View, Text, TextInput, StyleSheet, Button, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { GRAY_COLOR, TEXT_COLOR } from '../theme';
import * as Yup from 'yup';
import { FullButton } from '../components/UI/FullButton';

export const ProfileSettings = ({ navigation, route }) => {
    const {email} = route.params;

    const SignupSchema = Yup.object().shape({
        password: Yup.string()
          .required('Введите пароль'),
        email: Yup.string().required('Введите email'),
      });

    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Электронная почта</Text>
        <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
            <Text style={{fontFamily: 'SFregular', fontSize: 13, color: GRAY_COLOR}}>{email}</Text>
            <Button title="Изменить" titleStyle={{fontSize: 13}}/>
        </View>
        <Text style={styles.title}>Пароль</Text>
        <Formik
            initialValues={{ password: '', duble: '' }}
            validationSchema={SignupSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Новый пароль"
                  placeholderTextColor={GRAY_COLOR}
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                {/* {errors.email && touched.email ? (<Text style={styles.error}>{'\u25CF'}{errors.email}</Text>) : null} */}
                <TextInput
                  style={styles.input}
                  placeholder="Подтверждение пароля"
                  placeholderTextColor={GRAY_COLOR}
                  secureTextEntry
                  onChangeText={handleChange('duble')}
                  onBlur={handleBlur('duble')}
                  value={values.duble}
                />
                {errors.password && touched.password ? (<Text style={styles.error}>{'\u25CF'}{errors.password}</Text>) : null}
                <FullButton label="Сохранить изменения" style={{marginTop: 12}}/> 
              </View>
            )}
          </Formik>
          <Text style={styles.title}>Ваш пол</Text>
          <Text style={styles.mute}>Изменять этот параметр можно два раза в день</Text>
          <SegmentedControl
          values={['Мужской', 'Женский']}
          selectedIndex={0}
          />
      </View>
      </TouchableWithoutFeedback>
    )
  }

  const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16
    },
    title: {
        fontFamily: 'SFmedium', 
        color: TEXT_COLOR,
        fontSize: 17,
        marginTop: 20,
        marginBottom: 12
    },
    mute: {
        fontFamily: 'SFregular', 
        color: GRAY_COLOR,
        fontSize: 13,
        marginBottom: 12
    },
    input: {
        fontSize: 13,
        color: '#fff',
        paddingVertical: 11,
        paddingHorizontal: 14,
        backgroundColor: '#1F1F1F',
        fontFamily: 'GilroyRegular',
        borderRadius: 12,
        marginTop: 8
      },
      error: {
        color: '#F25757',
        marginTop: 8,
        fontFamily: 'GilroyRegular',
        fontSize: 14
      },
  })
  