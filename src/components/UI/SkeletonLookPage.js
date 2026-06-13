import React from 'react'
import { useWindowDimensions } from 'react-native'
import ContentLoader, { Rect } from 'react-content-loader/native'

const BG = '#1f1f1f'
const FG = '#2a2a2a'

const SkeletonLookPage = () => {
  const { width, height } = useWindowDimensions()
  const imageHeight = Math.round(width * 14 / 9 * 0.7)

  return (
    <ContentLoader
      speed={1.5}
      width={width}
      height={height}
      backgroundColor={BG}
      foregroundColor={FG}
    >
      {/* Главное изображение */}
      <Rect x="0" y="0" rx="0" ry="0" width={width} height={imageHeight} />

      {/* Кнопки действий */}
      <Rect x="16" y={imageHeight - 60} rx="12" ry="12" width="148" height="44" />
      <Rect x="172" y={imageHeight - 60} rx="12" ry="12" width="44" height="44" />
      <Rect x={width - 60} y={imageHeight - 60} rx="12" ry="12" width="44" height="44" />

      {/* Тег категории */}
      <Rect x="16" y={imageHeight + 16} rx="8" ry="8" width="80" height="28" />

      {/* Заголовок "Элементы образа" */}
      <Rect x="16" y={imageHeight + 60} rx="4" ry="4" width="150" height="14" />

      {/* Карточки вещей */}
      <Rect x="16"  y={imageHeight + 88} rx="8" ry="8" width="113" height="145" />
      <Rect x="137" y={imageHeight + 88} rx="8" ry="8" width="113" height="145" />
      <Rect x="258" y={imageHeight + 88} rx="8" ry="8" width="113" height="145" />
    </ContentLoader>
  )
}

export default SkeletonLookPage
