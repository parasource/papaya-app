import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { InterestsGroup } from "../components/InterestsGroup";
import { requestInterests } from '../redux/interests-reducer';

const SetInterests = (props) => {
  useEffect(() => {
    props.requestInterests()
  }, [])

  if(!props.categories.length){
      return  <Text>категорий нет</Text> 
  }

  return (
    <View>
        {props.categories.map((category, index) => (
            <InterestsGroup
              category={category}
              key={index}
              products={props.interests.filter(
                (interest) => interest.category == category
              )}
            />
          ))}
    </View>
  );
};

const mapStateToProps = (state) => ({
  categories: state.interests.categories,
  interests: state.interests.interests
})

export default connect(mapStateToProps, {requestInterests})(SetInterests)