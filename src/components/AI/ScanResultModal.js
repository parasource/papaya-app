import React from 'react'
import {
    View, Text, Modal, Image, TouchableOpacity,
    StyleSheet, ActivityIndicator, FlatList
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { BG_COLOR, TEXT_COLOR, GRAY_COLOR, INPUTS_BG, GREEN_COLOR } from '../../theme'

/**
 * Модалка результата сканирования гардероба.
 * Props:
 *   visible: bool
 *   onClose: fn
 *   isLoading: bool
 *   error: string | null
 *   items: Array<{ id, category_id, category_name, name, image_base64, sex, tags }>
 *   selectedIds: Set<number>
 *   onToggle: fn(id)
 *   onConfirm: fn()  — добавить выбранные
 */
const ScanResultModal = ({ visible, onClose, isLoading, error, items = [], selectedIds, onToggle, onConfirm }) => {
    const insets = useSafeAreaInsets()

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
                <View style={styles.header}>
                    <Text style={styles.title}>Найденные вещи</Text>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                        <Icon name="close" size={24} color={TEXT_COLOR} />
                    </TouchableOpacity>
                </View>

                {isLoading && (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={TEXT_COLOR} />
                        <Text style={styles.hint}>Сканируем фото…</Text>
                    </View>
                )}

                {!isLoading && error && (
                    <View style={styles.center}>
                        <Icon name="alert-circle-outline" size={48} color={GRAY_COLOR} />
                        <Text style={styles.hint}>{error}</Text>
                    </View>
                )}

                {!isLoading && !error && items.length === 0 && (
                    <View style={styles.center}>
                        <Icon name="shirt-outline" size={48} color={GRAY_COLOR} />
                        <Text style={styles.hint}>Вещи не найдены. Попробуй другое фото.</Text>
                    </View>
                )}

                {!isLoading && !error && items.length > 0 && (
                    <>
                        <Text style={styles.subtitle}>
                            Выбери вещи, которые хочешь добавить в гардероб
                        </Text>
                        <FlatList
                            data={items}
                            keyExtractor={i => String(i.id)}
                            numColumns={2}
                            contentContainerStyle={styles.grid}
                            columnWrapperStyle={{ gap: 12 }}
                            renderItem={({ item }) => {
                                const selected = selectedIds?.has(item.id)
                                return (
                                    <TouchableOpacity
                                        onPress={() => onToggle(item.id)}
                                        style={[styles.card, selected && styles.cardSelected]}
                                    >
                                        {item.image_base64 ? (
                                            <Image
                                                source={{ uri: `data:image/jpeg;base64,${item.image_base64}` }}
                                                style={styles.cardImage}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View style={[styles.cardImage, styles.noImage]}>
                                                <Icon name="shirt-outline" size={32} color={GRAY_COLOR} />
                                            </View>
                                        )}
                                        <Text style={styles.cardCategory}>{item.category_name}</Text>
                                        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
                                        {selected && (
                                            <View style={styles.check}>
                                                <Icon name="checkmark-circle" size={22} color={GREEN_COLOR} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        <TouchableOpacity
                            style={[styles.confirmBtn, !selectedIds?.size && styles.confirmBtnDisabled]}
                            onPress={onConfirm}
                            disabled={!selectedIds?.size}
                        >
                            <Text style={styles.confirmText}>
                                Добавить {selectedIds?.size ? `(${selectedIds.size})` : ''}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_COLOR },
    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
    },
    title: { color: TEXT_COLOR, fontFamily: 'SFsemibold', fontSize: 18 },
    subtitle: {
        color: GRAY_COLOR, fontFamily: 'SFregular', fontSize: 13,
        paddingHorizontal: 16, marginBottom: 12,
    },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
    hint: { color: GRAY_COLOR, fontFamily: 'SFregular', fontSize: 14, textAlign: 'center', lineHeight: 22 },
    grid: { paddingHorizontal: 16, paddingBottom: 100 },
    card: {
        flex: 1, backgroundColor: INPUTS_BG, borderRadius: 12,
        overflow: 'hidden', marginBottom: 12,
    },
    cardSelected: { borderWidth: 2, borderColor: GREEN_COLOR },
    cardImage: { width: '100%', aspectRatio: 3 / 4 },
    noImage: { backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
    cardCategory: {
        color: GRAY_COLOR, fontFamily: 'SFregular', fontSize: 11,
        textTransform: 'uppercase', paddingHorizontal: 8, paddingTop: 8,
    },
    cardName: { color: TEXT_COLOR, fontFamily: 'SFmedium', fontSize: 13, paddingHorizontal: 8, paddingBottom: 10 },
    check: { position: 'absolute', top: 8, right: 8 },
    confirmBtn: {
        position: 'absolute', bottom: 24, left: 16, right: 16,
        backgroundColor: GREEN_COLOR, borderRadius: 12,
        paddingVertical: 14, alignItems: 'center',
    },
    confirmBtnDisabled: { opacity: 0.4 },
    confirmText: { fontFamily: 'SFsemibold', fontSize: 16 },
})

export default ScanResultModal
