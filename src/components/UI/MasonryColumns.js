import React from 'react';
import { View } from 'react-native';

// Простая masonry-сетка без вложенного ScrollView.
// Замена @react-native-seoul/masonry-list (ломал ширину колонок на RN 0.81/Yoga 3).
const MasonryColumns = ({ data = [], renderItem, numColumns = 2, style }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'flex-start' }, style]}>
    {Array.from(Array(numColumns), (_, col) => (
      <View key={`masonry-col-${col}`} style={{ flex: 1 }}>
        {data.map((item, i) =>
          i % numColumns === col && item ? (
            <View key={`masonry-item-${col}-${i}`}>{renderItem({ item, i, index: i })}</View>
          ) : null
        )}
      </View>
    ))}
  </View>
);

export default MasonryColumns;
