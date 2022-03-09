import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import { login } from '../redux/auth-reducer';
import { connect } from 'react-redux';
import { Formik } from 'formik';

const Login = (props) => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [error, setError] = useState('');

  const onLogin = async (values) => {
    await props.login(values)
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Login</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={values => onLogin(values)}
        style={styles.form}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#fefefe"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#fefefe"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            <Button onPress={handleSubmit} title="Login" style={styles.button}/>
            <Button title=""  onPress={() => onLogin()} />
          </View>
        )}
      </Formik>
      <Button title="create accaunt" style={styles.link} onPress={() => props.navigation.navigate('Register')} />
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  logo: {
    fontSize: 60,
    color: '#fff',
    margin: '20%',
  },
  form: {
    width: '80%',
    margin: '10%',
  },
  input: {
    fontSize: 20,
    color: '#fff',
    paddingBottom: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  error: {
    fontSize: 20,
    color: '#FF2B2B'
  },
  button: {},
});

const mapStateToProps = (state) => ({
  loginError: state.auth.loginError
})

export default connect(mapStateToProps, {login})(Login)