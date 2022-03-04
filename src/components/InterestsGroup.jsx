import React from "react";
import { ScrollView, Text, View } from "react-native";
import { InterestCard } from "./InterestCard";

export const InterestsGroup = ({ products, category }) => {
  return (
    <View>
      <Text style={{
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 32,
        marginTop: 48
      }}>{category}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginHorizontal: -20}}>
        {products.map((product, index) => (
          <InterestCard product={product} key={index}/>
        ))}
      </ScrollView>
    </View>
  );
};
