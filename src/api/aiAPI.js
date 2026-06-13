import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

// Base URL будет заполнен позже
const AI_BASE_URL = ''

const aiInstance = axios.create({
    baseURL: AI_BASE_URL,
    timeout: 60000, // AI может отвечать долго
})

aiInstance.interceptors.request.use(async config => {
    const token = await SecureStore.getItemAsync('token')
    if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Хелпер: превращает локальный URI в FormData
const buildImageForm = (imageUri, extra = {}) => {
    const form = new FormData()
    form.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
    })
    Object.entries(extra).forEach(([k, v]) => form.append(k, v))
    return form
}

export const aiAPI = {
    /**
     * POST /recommends
     * Возвращает образы и айтемы, подходящие под фото пользователя
     * @returns { comment, looks_ids: [{id, comment}], items_ids: [{id, comment}] }
     */
    getRecommends(imageUri) {
        return aiInstance.post('/recommends', buildImageForm(imageUri), {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },

    /**
     * POST /photo/scan
     * Сканирует фото и возвращает найденные вещи для добавления в гардероб
     * @returns { id, category_id, category_name, name, image_base64, sex, tags }
     */
    scanPhoto(imageUri) {
        return aiInstance.post('/photo/scan', buildImageForm(imageUri), {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },

    /**
     * POST /photo/edit
     * Одевает человека с фото в указанные вещи, возвращает изменённое фото
     * @returns string (base64 изображение)
     */
    editPhoto(imageUri, itemsIds) {
        const form = buildImageForm(imageUri)
        itemsIds.forEach(id => form.append('items_ids', id))
        return aiInstance.post('/photo/edit', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
}
