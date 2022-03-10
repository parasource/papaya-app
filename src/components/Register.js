import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { FullButton } from './UI/FullButton';
import { BG_COLOR, GRAY_COLOR } from '../theme';
import { register } from '../redux/auth-reducer';
import * as Yup from 'yup';

const Register = (props) => {

  const onRegister = values => {
    props.register(values)
  };

  const SignupSchema = Yup.object().shape({
    password: Yup.string()
      .min('Минимум 8 символов')
      .required('Введите пароль'),
    email: Yup.string().email('Введите email верно').required('Введите email'),
    name: Yup.string().required('Введите имя'),
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.wrapper}>
          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            onSubmit={values => onRegister(values)}
            validationSchema={SignupSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>
                <Text style={styles.title}>Снова привет!</Text>
                <Text style={styles.subtitle}>Мы рады, что ты вернулся к нам</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Имя"
                  placeholderTextColor="#fff"
                  autoCapitalize="none"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Электронная почта"
                  placeholderTextColor="#fff"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Пароль"
                  placeholderTextColor="#fff"
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                <FullButton label="Войти в аккаунт" handlePress={handleSubmit} style={styles.button}/> 
              </View>
            )}
          </Formik>
          <View>
            <Text style={styles.forget}>Уже есть аккаунт?</Text>
            <Text style={styles.link} onPress={() => props.navigation.navigate('Login')}>Войти в аккаунт</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
  );
};
  
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: BG_COLOR,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingTop: '23%',
    paddingBottom: 74
  },
  title: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'GilroyMedium',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'GilroyRegular',
    marginTop: 8,
    marginBottom: 44
  },
  input: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderColor: GRAY_COLOR,
    borderWidth: 1,
    fontFamily: 'GilroyRegular',
    borderRadius: 8,
    marginTop: 16
  },
  error: {
    fontSize: 20,
    color: '#FF2B2B'
  },
  forget: {
    fontSize: 16,
    textAlign: 'center',
    color: GRAY_COLOR,
    fontFamily: 'GilroyRegular',
    marginTop: 12
  },
  button: {
    marginTop: 24
  },
  link: {
    fontSize: 16,
    textAlign: 'center',
    color: '#5096FF',
    fontFamily: 'GilroyRegular',
    marginTop: 4
  }
})

export default connect(null, {register})(Register)