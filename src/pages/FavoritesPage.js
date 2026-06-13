import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { TEXT_COLOR, GRAY_COLOR, INPUTS_BG, BG_COLOR } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BookmarkedContainer } from '../components/Bookmarked/Bookmarked'
import MyOutfits from '../components/Favorites/MyOutfits'
import Icon from 'react-native-vector-icons/Ionicons'

export const FavoritesPage = ({ navigation }) => {
    const [tab, setTab] = useState('saved') // 'saved' | 'outfits'

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Избранное</Text>
                {tab === 'outfits' && (
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => navigation.navigate('OutfitBuilder')}
                    >
                        <Icon name="add" size={22} color={TEXT_COLOR} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Переключатель */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, tab === 'saved' && styles.tabActive]}
                    onPress={() => setTab('saved')}
                >
                    <Text style={[styles.tabText, tab === 'saved' && styles.tabTextActive]}>
                        Сохранённые
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === 'outfits' && styles.tabActive]}
                    onPress={() => setTab('outfits')}
                >
                    <Text style={[styles.tabText, tab === 'outfits' && styles.tabTextActive]}>
                        Мои образы
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                {tab === 'saved'
                    ? <BookmarkedContainer navigation={navigation} />
                    : <MyOutfits navigation={navigation} />
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 12,
    },
    title: {
        color: TEXT_COLOR,
        fontSize: 34,
        fontFamily: 'SFbold',
    },
    addBtn: {
        width: 36, height: 36,
        backgroundColor: INPUTS_BG,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: INPUTS_BG,
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabActive: {
        backgroundColor: TEXT_COLOR,
    },
    tabText: {
        color: GRAY_COLOR,
        fontFamily: 'SFmedium',
        fontSize: 14,
    },
    tabTextActive: {
        color: BG_COLOR,
    },
})
