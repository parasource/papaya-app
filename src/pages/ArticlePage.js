import { StyleSheet, ScrollView, useWindowDimensions } from 'react-native'
import React, { useEffect } from 'react'
import { TEXT_COLOR, GRAY_COLOR } from '../theme';
import { connect } from 'react-redux';
// import { getCurrentArticle } from '../redux/looks-reducer';
import RenderHtml from 'react-native-render-html';

const ArticlePage = ({
        route,
        articles
        // currentArticle,
        // getCurrentArticle,
    }) => {
  const { articleSlug } = route.params;

  const { width } = useWindowDimensions();

  useEffect(() => {
    // getCurrentArticle(articleSlug)
  }, [route])

  const tagsStyles = {
    body: {
      color: TEXT_COLOR
    },
    a: {
      color: GRAY_COLOR
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <RenderHtml
            contentWidth={width - 32}
            source={{html: articles[0].Text}}
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
    // currentArticle: state.feed.currentArticle,
    articles: state.feed.articles,
})

export default connect(mapStateToProps, {
  // getCurrentArticle
})(ArticlePage)