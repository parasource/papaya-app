import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { TEXT_COLOR, GRAY_COLOR, GREEN_COLOR } from '../../theme'
import { getOutfits, deleteOutfit } from '../../storage/outfitStorage'
import OutfitCard from './OutfitCard'
import { useFocusEffect } from '@react-navigation/native'

const MyOutfits = ({ navigation }) => {
    const [outfits, setOutfits] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    const load = async () => {
        const list = await getOutfits()
        setOutfits(list)
    }

    // Перезагружаем при каждом фокусе (после создания/редактирования)
    useFocusEffect(useCallback(() => { load() }, []))

    const onRefresh = async () => {
        setRefreshing(true)
        await load()
        setRefreshing(false)
    }

    const handleDelete = async (id) => {
        const next = await deleteOutfit(id)
        setOutfits(next)
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl tintColor={TEXT_COLOR} refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 120 }}
        >
            {outfits.length === 0 ? (
                <View style={styles.empty}>
                    <Icon name="shirt-outline" size={48} color={GRAY_COLOR} />
                    <Text style={styles.emptyTitle}>Нет образов</Text>
                    <Text style={styles.emptyText}>Собери свой первый образ из вещей гардероба</Text>
                    <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('OutfitBuilder')}>
                        <Text style={styles.createBtnText}>Создать образ</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ paddingTop: 8 }}>
                    {outfits.map(outfit => (
                        <OutfitCard
                            key={outfit.id}
                            outfit={outfit}
                            onPress={() => navigation.navigate('OutfitBuilder', { outfit })}
                            onDelete={handleDelete}
                        />
                    ))}
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    empty: {
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 32,
        gap: 12,
    },
    emptyTitle: {
        color: TEXT_COLOR,
        fontFamily: 'SFsemibold',
        fontSize: 18,
    },
    emptyText: {
        color: GRAY_COLOR,
        fontFamily: 'SFregular',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    createBtn: {
        marginTop: 8,
        backgroundColor: GREEN_COLOR,
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    createBtnText: {
        fontFamily: 'SFsemibold',
        fontSize: 15,
    },
})

export default MyOutfits
