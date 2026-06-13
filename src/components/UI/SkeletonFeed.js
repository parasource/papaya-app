import React from 'react'
import { View, useWindowDimensions } from 'react-native'
import ContentLoader, { Rect } from 'react-content-loader/native'

const BG = '#1f1f1f'
const FG = '#2a2a2a'

// Имитируем реальный masonry — разные высоты карточек
const COL_HEIGHTS = [
  [200, 155, 215],
  [155, 225, 170],
]

const CardSkeleton = ({ width, height }) => (
  <ContentLoader
    speed={1.5}
    width={width}
    height={height}
    backgroundColor={BG}
    foregroundColor={FG}
  >
    <Rect x="0" y="0" rx="8" ry="8" width={width} height={height - 34} />
    <Rect x="0" y={height - 30} rx="4" ry="4" width={width * 0.85} height="10" />
    <Rect x="0" y={height - 16} rx="4" ry="4" width={width * 0.55} height="10" />
  </ContentLoader>
)

const SkeletonFeed = () => {
  const { width } = useWindowDimensions()
  // 16px padding с каждой стороны + 8px margin у каждой карточки
  const cardWidth = Math.floor((width - 48) / 2)

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: -8 }}>
      {COL_HEIGHTS.map((heights, col) => (
        <View key={col} style={{ flex: 1 }}>
          {heights.map((h, i) => (
            <View key={i} style={{ marginTop: 16, marginHorizontal: 8 }}>
              <CardSkeleton width={cardWidth} height={h + 36} />
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

export default SkeletonFeed
