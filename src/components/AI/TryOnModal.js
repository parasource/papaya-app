import React from 'react'
import {
    View, Text, Modal, Image, TouchableOpacity,
    StyleSheet, ActivityIndicator, ScrollView, useWindowDimensions
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { BG_COLOR, TEXT_COLOR, GRAY_COLOR } from '../../theme'

/**
 * Модалка результата примерки.
 * Props:
 *   visible: bool
 *   onClose: fn
 *   isLoading: bool
 *   error: string | null
 *   resultBase64: string | null  (base64 изображение от /photo/edit)
 */
const TryOnModal = ({ visible, onClose, isLoading, error, resultBase64 }) => {
    const { width } = useWindowDimensions()
    const insets = useSafeAreaInsets()

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
                <View style={styles.header}>
                    <Text style={styles.title}>Примерка</Text>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                        <Icon name="close" size={24} color={TEXT_COLOR} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                    {isLoading && (
                        <View style={styles.center}>
                            <ActivityIndicator size="large" color={TEXT_COLOR} />
                            <Text style={styles.hint}>AI примеряет образ…{'\n'}Это может занять несколько секунд</Text>
                        </View>
                    )}
                    {!isLoading && error && (
                        <View style={styles.center}>
                            <Icon name="alert-circle-outline" size={48} color={GRAY_COLOR} />
                            <Text style={styles.hint}>{error}</Text>
                        </View>
                    )}
                    {!isLoading && !error && resultBase64 && (
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${resultBase64}` }}
                            style={{ width, height: width * 4 / 3 }}
                            resizeMode="contain"
                        />
                    )}
                </ScrollView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_COLOR,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: {
        color: TEXT_COLOR,
        fontFamily: 'SFsemibold',
        fontSize: 18,
    },
    body: {
        flexGrow: 1,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingTop: 80,
        gap: 16,
    },
    hint: {
        color: GRAY_COLOR,
        fontFamily: 'SFregular',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
    },
})

export default TryOnModal
