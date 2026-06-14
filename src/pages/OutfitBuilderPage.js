import React, { useEffect, useState, useCallback } from 'react'
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    Image, StyleSheet, ActivityIndicator, Alert, useWindowDimensions
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'
import { wardrobeAPI } from '../api/api'
import * as ImagePicker from 'expo-image-picker'
import Icon from 'react-native-vector-icons/Ionicons'
import { BG_COLOR, TEXT_COLOR, GRAY_COLOR, INPUTS_BG, GREEN_COLOR } from '../theme'
import { storage } from '../const'
import { saveOutfit, generateId } from '../storage/outfitStorage'
import { aiAPI } from '../api/aiAPI'
import usePhotoPicker from '../hooks/usePhotoPicker'

// ─── Слоты образа ────────────────────────────────────────────────
// parent_category и name матчатся в нижнем регистре
const OUTFIT_SLOTS = [
    {
        key: 'outerwear',
        label: 'Верхняя одежда',
        limit: 1,
        keywords: ['верхн', 'куртк', 'пальт', 'плащ', 'дождев', 'пуховик', 'бомбер', 'ветровк', 'тренч'],
    },
    {
        key: 'headwear',
        label: 'Головной убор',
        limit: 1,
        keywords: ['шапк', 'кепк', 'берет', 'шляп', 'бейсболк', 'голов'],
    },
    {
        key: 'tops',
        label: 'Верх',
        limit: 2,
        keywords: ['футболк', 'рубашк', 'свитер', 'водолазк', 'майк', 'блузк', 'толстовк', 'худи', 'джемпер', 'лонгслив', 'топ'],
    },
    {
        key: 'bottoms',
        label: 'Низ',
        limit: 1,
        keywords: ['брюк', 'джинс', 'шорт', 'юбк', 'леггинс', 'чинос'],
    },
]

const getSlot = (categoryName, parentCategoryName) => {
    const haystack = `${(categoryName || '')} ${(parentCategoryName || '')}`.toLowerCase()
    return OUTFIT_SLOTS.find(s => s.keywords.some(kw => haystack.includes(kw))) ?? null
}

// ─── Быстрый выбор даты ──────────────────────────────────────────
const getDateOptions = () => {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() + i)
        const label = i === 0 ? 'Сегодня' : i === 1 ? 'Завтра'
            : `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
        const value = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
        return { label, value }
    })
}

// ─── Компонент ───────────────────────────────────────────────────
const OutfitBuilderPage = ({ navigation, route }) => {
    const editingOutfit = route.params?.outfit ?? null
    const { width } = useWindowDimensions()

    const [name, setName] = useState(editingOutfit?.name ?? '')
    const [selectedDate, setSelectedDate] = useState(editingOutfit?.date ?? null)
    const [selectedItems, setSelectedItems] = useState(editingOutfit?.items ?? [])
    const [previewPhoto, setPreviewPhoto] = useState(editingOutfit?.previewPhoto ?? null) // base64 или null
    const [photoLoading, setPhotoLoading] = useState(false)

    const [wardrobeItems, setWardrobeItems] = useState([])
    const [categoryMap, setCategoryMap] = useState({}) // id → {name, parent_category}
    const [categories, setCategories] = useState([])
    const [activeCategory, setActiveCategory] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const { pickPhoto } = usePhotoPicker()
    const dateOptions = getDateOptions()

    useEffect(() => { loadWardrobe() }, [])

    const loadWardrobe = async () => {
        setLoading(true)
        try {
            const [wRes, cRes] = await Promise.all([
                wardrobeAPI.getSelectedWardrobe(),
                wardrobeAPI.getCategories(),
            ])
            if (cRes.status === 200) {
                const map = {}
                cRes.data.forEach(c => { map[c.ID] = { name: c.name, parent: c.parent_category } })
                setCategoryMap(map)

                if (wRes.status === 200) {
                    setWardrobeItems(wRes.data)
                    const usedIds = new Set(wRes.data.map(i => i.category_id))
                    const cats = cRes.data
                        .filter(c => usedIds.has(c.ID))
                        .map(c => ({ id: c.ID, name: c.name }))
                    setCategories(cats)
                    if (cats.length) setActiveCategory(cats[0].id)
                }
            }
        } catch (e) {
            console.log('OutfitBuilder load error', e)
        } finally {
            setLoading(false)
        }
    }

    // Проверка лимита слота перед добавлением
    const checkSlotLimit = (item) => {
        const cat = categoryMap[item.category_id]
        if (!cat) return null
        const slot = getSlot(cat.name, cat.parent)
        if (!slot) return null

        const countInSlot = selectedItems.filter(i => {
            const c = categoryMap[i.category_id]
            return c && getSlot(c.name, c.parent)?.key === slot.key
        }).length

        if (countInSlot >= slot.limit) return slot
        return null
    }

    const toggleItem = (item) => {
        const alreadySelected = selectedItems.some(i => i.id === item.id)
        if (alreadySelected) {
            setSelectedItems(prev => prev.filter(i => i.id !== item.id))
            return
        }
        const limitedSlot = checkSlotLimit(item)
        if (limitedSlot) {
            Alert.alert(
                `Лимит: ${limitedSlot.label}`,
                `В образе может быть не более ${limitedSlot.limit} ${limitedSlot.limit === 1 ? 'вещи' : 'вещей'} в категории "${limitedSlot.label}". Сначала убери текущую.`
            )
            return
        }
        setSelectedItems(prev => [...prev, item])
    }

    // Выбор фото превью (камера/галерея, с base64)
    const handlePickPhoto = async () => {
        Alert.alert('Фото образа', '', [
            { text: 'Отмена', style: 'cancel' },
            {
                text: 'Сделать новое фото', onPress: async () => {
                    const { status } = await ImagePicker.requestCameraPermissionsAsync()
                    if (status !== 'granted') return Alert.alert('Нет доступа к камере')
                    const res = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7, allowsEditing: true, aspect: [3, 4] })
                    if (!res.canceled) setPreviewPhoto(res.assets[0].base64)
                }
            },
            {
                text: 'Из галереи', onPress: async () => {
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
                    if (status !== 'granted') return Alert.alert('Нет доступа к фото')
                    const res = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7, allowsEditing: true, aspect: [3, 4] })
                    if (!res.canceled) setPreviewPhoto(res.assets[0].base64)
                }
            },
            // Место под AI-примерку — активируется когда будет готов бэкенд
            selectedItems.length > 0 ? {
                text: '✨ Создать AI-фото', onPress: handleAiPhoto
            } : null,
        ].filter(Boolean))
    }

    const handleAiPhoto = async () => {
        const photo = await pickPhoto()
        if (!photo) return
        setPhotoLoading(true)
        try {
            const itemImageUrls = selectedItems.map(i => i.image)
            const res = await aiAPI.editPhoto(photo.uri, itemImageUrls)
            setPreviewPhoto(res.data) // base64 от бэкенда
        } catch {
            Alert.alert('Не удалось создать AI-фото', 'Попробуй позже')
        } finally {
            setPhotoLoading(false)
        }
    }

    const handleSave = async () => {
        if (!name.trim()) return Alert.alert('Дай название образу')
        setSaving(true)
        const outfit = {
            id: editingOutfit?.id ?? generateId(),
            name: name.trim(),
            date: selectedDate,
            items: selectedItems,
            previewPhoto,
            createdAt: editingOutfit?.createdAt ?? new Date().toISOString(),
        }
        await saveOutfit(outfit)
        setSaving(false)
        navigation.goBack()
    }

    const filteredItems = activeCategory
        ? wardrobeItems.filter(i => i.category_id === activeCategory)
        : wardrobeItems

    const photoWidth = width - 32

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* ── Фото превью ── */}
                <View style={styles.section}>
                    <Text style={styles.label}>Фото образа</Text>
                    <TouchableOpacity
                        style={[styles.photoPlaceholder, { width: photoWidth, height: photoWidth * 4 / 3 }]}
                        onPress={handlePickPhoto}
                        activeOpacity={0.8}
                    >
                        {photoLoading ? (
                            <View style={styles.photoInner}>
                                <ActivityIndicator size="large" color={TEXT_COLOR} />
                                <Text style={styles.photoHint}>AI создаёт фото…</Text>
                            </View>
                        ) : previewPhoto ? (
                            <>
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${previewPhoto}` }}
                                    style={StyleSheet.absoluteFill}
                                    resizeMode="cover"
                                />
                                <View style={styles.photoEditBadge}>
                                    <Icon name="camera-outline" size={16} color="#fff" />
                                    <Text style={styles.photoEditText}>Изменить</Text>
                                </View>
                            </>
                        ) : (
                            <View style={styles.photoInner}>
                                <Icon name="camera-outline" size={36} color={GRAY_COLOR} />
                                <Text style={styles.photoHint}>Добавить фото</Text>
                                <Text style={styles.photoSubHint}>Обычное или AI-примерка</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* ── Название ── */}
                <View style={styles.section}>
                    <Text style={styles.label}>Название образа</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Например: Офис в понедельник"
                        placeholderTextColor={GRAY_COLOR}
                        value={name}
                        onChangeText={setName}
                        maxLength={50}
                    />
                </View>

                {/* ── Дата ── */}
                <View style={styles.section}>
                    <Text style={styles.label}>Дата (необязательно)</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
                        {dateOptions.map(opt => (
                            <TouchableOpacity
                                key={opt.value}
                                style={[styles.chip, selectedDate === opt.value && styles.chipActive]}
                                onPress={() => setSelectedDate(prev => prev === opt.value ? null : opt.value)}
                            >
                                <Text style={[styles.chipText, selectedDate === opt.value && styles.chipTextActive]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* ── Слоты (подсказка) ── */}
                <View style={[styles.section, { flexDirection: 'row', flexWrap: 'wrap', gap: 6 }]}>
                    {OUTFIT_SLOTS.map(slot => {
                        const count = selectedItems.filter(i => {
                            const c = categoryMap[i.category_id]
                            return c && getSlot(c.name, c.parent)?.key === slot.key
                        }).length
                        const full = count >= slot.limit
                        return (
                            <View key={slot.key} style={[styles.slotBadge, full && styles.slotBadgeFull]}>
                                <Text style={[styles.slotText, full && styles.slotTextFull]}>
                                    {slot.label} {count}/{slot.limit}
                                </Text>
                            </View>
                        )
                    })}
                </View>

                {/* ── Вещи из гардероба ── */}
                <View style={styles.section}>
                    <Text style={styles.label}>Вещи из гардероба</Text>
                    {loading ? (
                        <ActivityIndicator style={{ marginTop: 20 }} color={TEXT_COLOR} />
                    ) : wardrobeItems.length === 0 ? (
                        <Text style={styles.empty}>Гардероб пуст. Добавь вещи сначала.</Text>
                    ) : (
                        <>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, marginBottom: 12 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
                                {categories.map(cat => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[styles.chip, activeCategory === cat.id && styles.chipActive]}
                                        onPress={() => setActiveCategory(cat.id)}
                                    >
                                        <Text style={[styles.chipText, activeCategory === cat.id && styles.chipTextActive]}>
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View style={styles.itemsGrid}>
                                {filteredItems.map(item => {
                                    const isSelected = selectedItems.some(i => i.id === item.id)
                                    const cat = categoryMap[item.category_id]
                                    const slot = cat ? getSlot(cat.name, cat.parent) : null
                                    const atLimit = !isSelected && slot && selectedItems.filter(i => {
                                        const c = categoryMap[i.category_id]
                                        return c && getSlot(c.name, c.parent)?.key === slot.key
                                    }).length >= slot.limit

                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={[
                                                styles.itemCard,
                                                isSelected && styles.itemCardSelected,
                                                atLimit && styles.itemCardDisabled,
                                            ]}
                                            onPress={() => toggleItem(item)}
                                            activeOpacity={atLimit ? 1 : 0.8}
                                        >
                                            <Image
                                                source={{ uri: `${storage}/${item.image}` }}
                                                style={styles.itemImage}
                                                resizeMode="cover"
                                            />
                                            <Text style={[styles.itemName, atLimit && { color: GRAY_COLOR }]} numberOfLines={2}>
                                                {item.name}
                                            </Text>
                                            {isSelected && (
                                                <View style={styles.checkBadge}>
                                                    <Icon name="checkmark-circle" size={22} color={GREEN_COLOR} />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </>
                    )}
                </View>

                {/* ── Выбранные вещи ── */}
                {selectedItems.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.label}>В образе ({selectedItems.length})</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
                            {selectedItems.map(item => (
                                <TouchableOpacity key={item.id} onPress={() => toggleItem(item)} style={styles.selectedItem}>
                                    <Image source={{ uri: `${storage}/${item.image}` }} style={styles.selectedItemImage} resizeMode="cover" />
                                    <View style={styles.removeBtn}>
                                        <Icon name="close-circle" size={18} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* ── Кнопка сохранить ── */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                    {saving
                        ? <ActivityIndicator color="#000" />
                        : <Text style={styles.saveBtnText}>Сохранить образ</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_COLOR },
    section: { paddingHorizontal: 16, marginTop: 20 },
    label: { color: TEXT_COLOR, fontFamily: 'SFsemibold', fontSize: 15, marginBottom: 10 },
    input: {
        backgroundColor: INPUTS_BG, borderRadius: 12,
        paddingHorizontal: 14, paddingVertical: 12,
        color: TEXT_COLOR, fontFamily: 'SFregular', fontSize: 15,
    },

    // Фото превью
    photoPlaceholder: {
        backgroundColor: INPUTS_BG, borderRadius: 16,
        overflow: 'hidden', alignSelf: 'center',
    },
    photoInner: {
        flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    photoHint: { color: TEXT_COLOR, fontFamily: 'SFmedium', fontSize: 14 },
    photoSubHint: { color: GRAY_COLOR, fontFamily: 'SFregular', fontSize: 12 },
    photoEditBadge: {
        position: 'absolute', bottom: 12, right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20,
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 10, paddingVertical: 6,
    },
    photoEditText: { color: '#fff', fontFamily: 'SFmedium', fontSize: 12 },

    // Чипы (дата, категории)
    chip: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: INPUTS_BG, borderRadius: 20 },
    chipActive: { backgroundColor: TEXT_COLOR },
    chipText: { color: GRAY_COLOR, fontFamily: 'SFmedium', fontSize: 13 },
    chipTextActive: { color: '#000' },

    // Слоты
    slotBadge: {
        paddingHorizontal: 10, paddingVertical: 5,
        backgroundColor: INPUTS_BG, borderRadius: 8,
    },
    slotBadgeFull: { backgroundColor: GREEN_COLOR },
    slotText: { color: GRAY_COLOR, fontFamily: 'SFregular', fontSize: 12 },
    slotTextFull: { color: '#000', fontFamily: 'SFmedium' },

    // Сетка вещей
    itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    itemCard: { width: '47%', backgroundColor: INPUTS_BG, borderRadius: 12, overflow: 'hidden' },
    itemCardSelected: { borderWidth: 2, borderColor: GREEN_COLOR },
    itemCardDisabled: { opacity: 0.35 },
    itemImage: { width: '100%', aspectRatio: 3 / 4 },
    itemName: { color: TEXT_COLOR, fontFamily: 'SFregular', fontSize: 12, padding: 8 },
    checkBadge: { position: 'absolute', top: 8, right: 8 },

    // Выбранные
    selectedItem: { position: 'relative' },
    selectedItemImage: { width: 72, height: 90, borderRadius: 10 },
    removeBtn: {
        position: 'absolute', top: -6, right: -6,
        backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12,
    },

    empty: { color: GRAY_COLOR, fontFamily: 'SFregular', fontSize: 14, marginTop: 8 },
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 16, paddingBottom: 24, paddingTop: 12,
        backgroundColor: BG_COLOR,
    },
    saveBtn: { backgroundColor: GREEN_COLOR, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    saveBtnText: { fontFamily: 'SFsemibold', fontSize: 16 },
})

export default connect(null, {})(OutfitBuilderPage)
