import { StyleSheet, ScrollView, useWindowDimensions, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { TEXT_COLOR, GRAY_COLOR, GREEN_COLOR } from '../theme';
import { connect } from 'react-redux';
import { getCurrentArticle } from '../redux/looks-reducer';
import RenderHtml from 'react-native-render-html';

const ArticlePage = ({
        route,
        currentArticle,
        getCurrentArticle
    }) => {
  const { articleSlug } = route.params;

  const { width } = useWindowDimensions();

  useEffect(() => {
    getCurrentArticle(articleSlug)
  }, [route])

  const tagsStyles = {
    body: {
      color: TEXT_COLOR
    },
    a: {
      color: GREEN_COLOR
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
       <RenderHtml
            contentWidth={width - 32}
            source={{html: currentArticle.Text}}
            tagsStyles={tagsStyles}
        />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        position: 'relative',
    },
   
})

const mapStateToProps = (state) => ({
    currentArticle: state.feed.currentArticle,
    isFetching: state.feed.isFetching
})

export default connect(mapStateToProps, {getCurrentArticle})(ArticlePage)