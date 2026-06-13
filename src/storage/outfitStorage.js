import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY = 'my_outfits'

/** Получить все образы */
export const getOutfits = async () => {
    try {
        const raw = await AsyncStorage.getItem(KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

/** Сохранить образ (создать или обновить по id) */
export const saveOutfit = async (outfit) => {
    const list = await getOutfits()
    const idx = list.findIndex(o => o.id === outfit.id)
    if (idx >= 0) {
        list[idx] = outfit
    } else {
        list.unshift(outfit)
    }
    await AsyncStorage.setItem(KEY, JSON.stringify(list))
    return list
}

/** Удалить образ по id */
export const deleteOutfit = async (id) => {
    const list = await getOutfits()
    const next = list.filter(o => o.id !== id)
    await AsyncStorage.setItem(KEY, JSON.stringify(next))
    return next
}

/** Генерация простого уникального id */
export const generateId = () => `outfit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
