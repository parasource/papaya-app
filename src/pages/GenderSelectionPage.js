import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import GenderButton from '../components/UI/GenderButton';
import {checkToken, updateUser} from '../redux/auth-reducer'
import { BG_COLOR, GRAY_COLOR } from '../theme';

const GenderSelectionPage = ({updateUser, name, checkToken}) => {
    
    const selectGender = (gender) => {
        updateUser({"sex": gender, "name": name, "receive_push_notifications": true}) 
        checkToken()
    }

    return (
        <View style={{flex: 1, backgroundColor: BG_COLOR}}>
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <View style={styles.dashedCircle}>
                    <Icon name="male-female" style={{fontSize: 60, color: '#F4CA41'}}/>
                </View>
                <Text style={styles.title}>Укажите свой пол</Text>
                <Text style={styles.text}>Мы будем показывать для вас персональные образы. Пол можно будет поменять позже в настройках</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 80}}>
                <GenderButton iconName={'male-outline'} label={'Парень'} onPress={() => selectGender('male')}/>
                <Text style={styles.orText}>Или</Text>
                <GenderButton iconName={'female-outline'} label={'Девушка'} onPress={() => selectGender('female')}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    dashedCircle: {
        width: 120, 
        height: 120, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 120, 
        borderWidth: 3, 
        borderColor: 'rgba(255, 255, 255, .2)', 
        borderStyle: 'dashed'
    },
    title: {
        marginTop: 40,
        fontSize: 28,
        color: '#fff',
        fontFamily: 'SFbold',
        textAlign: 'center'
    },
    text: {
        fontSize: 16,
        marginTop: 8,
        fontFamily: 'SFregular',
        textAlign: 'center',
        color: GRAY_COLOR,
    },
    orText: {
        fontSize: 16,
        fontFamily: 'SFregular',
        textAlign: 'center',
        color: '#B4B7C0',
        marginBottom: 24
    },
})

const mapStateToProps = (state) => ({
    name: state.auth.name,
})

export default connect(mapStateToProps, {updateUser, checkToken})(GenderSelectionPage);
