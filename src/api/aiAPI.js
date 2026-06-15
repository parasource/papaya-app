import axios from 'axios'

const aiInstance = axios.create({
    baseURL: 'https://papaya-ai.arsuhinars.ru',
    timeout: 100000000,
})

aiInstance.interceptors.request.use(request => {
    const params = request.params ? '?' + Object.entries(request.params)
        .flatMap(([k, v]) => Array.isArray(v) ? v.map(i => `${k}=${i}`) : [`${k}=${v}`])
        .join('&') : ''
    console.log(`[AI] → ${request.method?.toUpperCase()} ${request.url}${params}`)
    if (request.data) {
        if (request.data._parts) {
            console.log('[AI] body (FormData):', request.data._parts.map(([k, v]) =>
                typeof v === 'object' ? `${k}: {uri: ${v.uri}, type: ${v.type}}` : `${k}: ${v}`
            ))
        } else {
            console.log('[AI] body:', request.data)
        }
    }
    return request
})

aiInstance.interceptors.response.use(
    response => {
        console.log(`[AI] ${response.config.method?.toUpperCase()} ${response.config.url} →`, response.status, response.data)
        return response
    },
    error => {
        console.log(`[AI] ERROR ${error.config?.method?.toUpperCase()} ${error.config?.url} →`, error.response?.status, error.response?.data ?? error.message)
        return Promise.reject(error)
    }
)

const paramsSerializer = params =>
    Object.entries(params)
        .flatMap(([k, v]) => Array.isArray(v) ? v.map(i => `${k}=${encodeURIComponent(i)}`) : [`${k}=${encodeURIComponent(v)}`])
        .join('&')

const buildForm = (imageUri) => {
    // Подстраховка: если по ошибке передали объект {uri, base64} вместо строки
    const uri = typeof imageUri === 'string' ? imageUri : imageUri?.uri
    if (!uri) throw new Error('[AI] buildForm: ожидалась строка-URI, получено: ' + JSON.stringify(imageUri))
    const form = new FormData()
    form.append('image', { uri, type: 'image/jpeg', name: 'photo.jpg' })
    return form
}

// Blob → чистый base64 (без префикса data:...;base64,)
const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
        const result = reader.result || ''
        const comma = result.indexOf(',')
        resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
})

export const aiAPI = {
    /**
     * POST /recommends
     * @returns { comment, looks_ids: [{id, comment}], items_ids: [{id, comment}] }
     */
    async getRecommends(imageUri) {
        const uri = typeof imageUri === 'string' ? imageUri : imageUri?.uri
        const blob = await fetch(uri).then(r => r.blob())
        return aiInstance.post('/recommends', blob, {
            headers: { 'Content-Type': 'image/jpeg' },
            // RN Blob → отдаём байты как есть (как в /photo/edit), без JSON.stringify
            transformRequest: (data) => data,
        })
    },

    /**
     * POST /photo/scan
     * @returns { id, category_id, category_name, name, image_base64, sex, tags }
     */
    scanPhoto(imageUri) {
        return aiInstance.post('/photo/scan', buildForm(imageUri), {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },

    /**
     * POST /photo/edit
     * body: фото пользователя (multipart)
     * query images[]: URL вещей из образа
     * @returns string (base64 результата)
     */
    async editPhoto(imageUri, itemImageUrls) {
        const blob = await fetch(imageUri).then(r => r.blob())
        const res = await aiInstance.post('/photo/edit', blob, {
            headers: { 'Content-Type': 'image/jpeg' },
            params: { images: itemImageUrls },
            paramsSerializer,
            // RN Blob не распознаётся axios как Blob → дефолтный transformRequest
            // делает JSON.stringify. Отдаём тело как есть, XHR пошлёт байты.
            transformRequest: (data) => data,
            // Ответ — сырые байты JPEG. Без этого axios парсит их как JSON
            // и data становится пустой строкой → картинка не отображается.
            responseType: 'blob',
        })
        const base64 = await blobToBase64(res.data)
        return { ...res, data: base64 }
    },
}
