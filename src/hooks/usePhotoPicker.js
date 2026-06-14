import { Alert, ActionSheetIOS, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

/**
 * Хук для выбора фото из галереи или камеры.
 * Возвращает функцию pickPhoto(), которая показывает выбор источника
 * и резолвит URI выбранного изображения (или null если отменено).
 */
const usePhotoPicker = () => {
    const requestAndPick = async (source) => {
        const options = {
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: true,
            aspect: [3, 4],
            base64: true,
        }
        if (source === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert('Нет доступа', 'Разрешите доступ к камере в настройках')
                return null
            }
            const result = await ImagePicker.launchCameraAsync(options)
            if (result.canceled) return null
            return { uri: result.assets[0].uri, base64: result.assets[0].base64 }
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert('Нет доступа', 'Разрешите доступ к фото в настройках')
                return null
            }
            const result = await ImagePicker.launchImageLibraryAsync(options)
            if (result.canceled) return null
            return { uri: result.assets[0].uri, base64: result.assets[0].base64 }
        }
    }

    const pickPhoto = () =>
        new Promise((resolve) => {
            if (Platform.OS === 'ios') {
                ActionSheetIOS.showActionSheetWithOptions(
                    {
                        options: ['Отмена', 'Сделать новое фото', 'Использовать фото из галереи'],
                        cancelButtonIndex: 0,
                    },
                    async (idx) => {
                        if (idx === 0) return resolve(null)
                        const result = await requestAndPick(idx === 1 ? 'camera' : 'gallery')
                        resolve(result)
                    }
                )
            } else {
                Alert.alert('Добавить фото', '', [
                    { text: 'Отмена', style: 'cancel', onPress: () => resolve(null) },
                    { text: 'Сделать новое фото', onPress: async () => resolve(await requestAndPick('camera')) },
                    { text: 'Использовать фото из галереи', onPress: async () => resolve(await requestAndPick('gallery')) },

                ])
            }
        })

    return { pickPhoto }
}

export default usePhotoPicker
