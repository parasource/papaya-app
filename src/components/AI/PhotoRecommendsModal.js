import React from 'react'
import {
    View, Text, Modal, TouchableOpacity,
    StyleSheet, ActivityIndicator, ScrollView
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { BG_COLOR, TEXT_COLOR, GRAY_COLOR } from '../../theme'
import { LooksFeed } from '../Feed/LooksFeed'

/**
 * Модалка результатов поиска образов по фото.
 * Props:
 *   visible: bool
 *   onClose: fn
 *   isLoading: bool
 *   error: string | null
 *   comment: string
 *   looks: Array  — образы для отображения через LooksFeed
 *   navigation: nav object
 */
const PhotoRecommendsModal = ({ visible, onClose, isLoading, error, comment, looks = [], navigation }) => {
    const insets = useSafeAreaInsets()

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
                <View style={styles.header}>
                    <Text style={styles.title}>Образы для тебя</Text>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                        <Icon name="close" size={24} color={TEXT_COLOR} />
                    </TouchableOpacity>
                </View>

                {isLoading && (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={TEXT_COLOR} />
                        <Text style={styles.hint}>AI подбирает образы под твоё фото…{'\n'}Это займёт несколько секунд</Text>
                    </View>
                )}

                {!isLoading && error && (
                    <View style={styles.center}>
                        <Icon name="alert-circle-outline" size={48} color={GRAY_COLOR} />
                        <Text style={styles.hint}>{error}</Text>
                    </View>
                )}

                {!isLoading && !error && (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                        {!!comment && <Text style={styles.comment}>{comment}</Text>}
                        {looks.length === 0 ? (
                            <View style={styles.center}>
                                <Icon name="images-outline" size={48} color={GRAY_COLOR} />
                                <Text style={styles.hint}>Образы не найдены. Попробуй другое фото.</Text>
                            </View>
                        ) : (
                            <View style={{ paddingHorizontal: 16 }}>
                                <LooksFeed
                                    looks={looks}
                                    navigation={navigation}
                                    isListEnd={true}
                                />
                            </View>
                        )}
                    </ScrollView>
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
    comment: {
        color: GRAY_COLOR, fontFamily: 'SFregular', fontSize: 14,
        paddingHorizontal: 16, paddingVertical: 12, lineHeight: 20,
    },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, paddingTop: 80 },
    hint: { color: GRAY_COLOR, fontFamily: 'SFregular', fontSize: 14, textAlign: 'center', lineHeight: 22 },
})

export default PhotoRecommendsModal
