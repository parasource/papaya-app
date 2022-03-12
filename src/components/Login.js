import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import React from 'react';
import { login } from '../redux/auth-reducer';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { FullButton } from './UI/FullButton';
import { BG_COLOR, GRAY_COLOR } from '../theme';
import * as Yup from 'yup';

const Login = (props) => {
  
  const onLogin = async (values) => {
      await props.login(values)
  };

  const SignupSchema = Yup.object().shape({
       password: Yup.string()
         .required('Введите пароль'),
       email: Yup.string().required('Введите email'),
     });

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.wrapper}>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={values => onLogin(values)}
            validationSchema={SignupSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>
                <Text style={styles.title}>Снова привет!</Text>
                <Text style={styles.subtitle}>Мы рады, что ты вернулся к нам</Text>
                {props.loginError ? (<Text style={styles.error}>{'\u25CF'}{props.loginError}</Text>) : null}
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
                {errors.email && touched.email ? (<Text style={styles.error}>{'\u25CF'}{errors.email}</Text>) : null}
                <TextInput
                  style={styles.input}
                  placeholder="Пароль"
                  placeholderTextColor="#fff"
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                {errors.password && touched.password ? (<Text style={styles.error}>{'\u25CF'}{errors.password}</Text>) : null}
                <FullButton label="Войти в аккаунт" pressHandler={() => handleSubmit()} style={styles.button}/> 
                <Text style={styles.forget} onPress={() => props.navigation.navigate('Register')}>Забыли пароль?</Text> 
              </View>
            )}
          </Formik>
          <View>
            <Text style={styles.forget}>У тебя нет аккаунта?</Text>
            <Text style={styles.link} onPress={() => props.navigation.navigate('Register')}>Зарегистрироваться</Text>
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
  },
  error: {
    color: '#F25757',
    marginTop: 8,
    fontFamily: 'GilroyRegular',
    fontSize: 14
  },
});

const mapStateToProps = (state) => ({
  loginError: state.auth.loginError
})

export default connect(mapStateToProps, {login})(Login)