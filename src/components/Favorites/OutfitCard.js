import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { INPUTS_BG, TEXT_COLOR, GRAY_COLOR } from '../../theme'
import { storage } from '../../const'

const OutfitCard = ({ outfit, onPress, onDelete }) => {
    const previewItems = outfit.items.slice(0, 4)

    const confirmDelete = () => {
        Alert.alert('Удалить образ?', outfit.name, [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Удалить', style: 'destructive', onPress: () => onDelete(outfit.id) },
        ])
    }

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            {/* Превью — фото если есть, иначе 2x2 сетка вещей */}
            {outfit.previewPhoto ? (
                <Image
                    source={{ uri: `data:image/jpeg;base64,${outfit.previewPhoto}` }}
                    style={styles.photo}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.grid}>
                    {previewItems.map((item, i) => (
                        <View key={i} style={styles.gridCell}>
                            <Image
                                source={{ uri: `${storage}/${item.image}` }}
                                style={styles.gridImage}
                                resizeMode="cover"
                            />
                        </View>
                    ))}
                    {previewItems.length === 0 && (
                        <View style={[styles.gridCell, { alignItems: 'center', justifyContent: 'center', width: '100%' }]}>
                            <Icon name="shirt-outline" size={32} color={GRAY_COLOR} />
                        </View>
                    )}
                </View>
            )}

            {/* Инфо */}
            <View style={styles.info}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.name} numberOfLines={1}>{outfit.name}</Text>
                    {!!outfit.date && (
                        <Text style={styles.date}>
                            <Icon name="calendar-outline" size={11} /> {outfit.date}
                        </Text>
                    )}
                    <Text style={styles.count}>{outfit.items.length} {itemsWord(outfit.items.length)}</Text>
                </View>
                <TouchableOpacity onPress={confirmDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Icon name="trash-outline" size={18} color={GRAY_COLOR} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const itemsWord = (n) => {
    if (n % 100 >= 11 && n % 100 <= 14) return 'вещей'
    if (n % 10 === 1) return 'вещь'
    if (n % 10 >= 2 && n % 10 <= 4) return 'вещи'
    return 'вещей'
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: INPUTS_BG,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
    },
    photo: {
        width: '100%',
        height: 260,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: 160,
    },
    gridCell: {
        width: '50%',
        height: '50%',
        borderWidth: 0.5,
        borderColor: '#111',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    name: {
        color: TEXT_COLOR,
        fontFamily: 'SFsemibold',
        fontSize: 14,
    },
    date: {
        color: GRAY_COLOR,
        fontFamily: 'SFregular',
        fontSize: 12,
        marginTop: 2,
    },
    count: {
        color: GRAY_COLOR,
        fontFamily: 'SFregular',
        fontSize: 12,
        marginTop: 2,
    },
})

export default OutfitCard
