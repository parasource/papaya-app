import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { connect } from 'react-redux';
import { ArticlesCard } from './ArticlesCard';

const ArticlesCarousel = ({articles, navigation}) => {
  
    const { width } = Dimensions.get('window');


    const baseOptions = {
        vertical: false,
        width: width * 0.85,
        height: width / 2,
    };

    return (
        <View>
            <Carousel
                  {...baseOptions}
                  loop={false}
                  width={width - 24}
                  data={articles}
                  style={styles.sliderWrapper}
                  pagingEnabled={true}
                  snapEnabled={true}
                  overscrollEnabled={true}
                  enabled={true}
                  renderItem={({ item }) => 
										<View style={{flex: 1}} key={'articles-item_' + item.slug}>
											<ArticlesCard item={item} navigation={navigation} height={width / 3.125}/>
										</View>
                  }
              />
        </View>
    );
}

const styles = StyleSheet.create({
    sliderWrapper: {
        marginTop: 16,
        width: "100%",
        marginLeft: 10
    },
})

const mapStateToProps = (state) => ({
    articles: state.feed.articles,
})
  

export default connect(mapStateToProps, null)(ArticlesCarousel)