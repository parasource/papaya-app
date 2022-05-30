import React from 'react';
import {StyleSheet} from 'react-native';
import SkeletonContent from 'react-native-skeleton-content';

export const SkeletonFeed = ({secondFetch, isFetching, children}) => {
    return (
        <SkeletonContent
            containerStyle = {
                {
                    flex: 1,
                    width: '100%',
                    marginTop: 16,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    flexWrap: 'wrap'
                }
            }
            boneColor="#333333"
            highlightColor="#121212"
            animationType="pulse"
            duration={2000}
            isLoading={!secondFetch && isFetching}
            layout={[
                { key: 'title', width: 200, height: 26, marginBottom: 12, borderRadius: 12 },
                { key: 'rec', width: '100%', height: 240, borderRadius: 12 },
                { key: 'btn1', width: '60%', height: 32, marginTop: 24, marginBottom: 12,  borderRadius: 32 },
                { key: 'card', width: '48%', height: 220, marginTop: 4, borderRadius: 12 },
                { key: 'card2', width: '48%', height: 220, marginTop: 4, borderRadius: 12 },
            ]}
       >
           {children}
        </SkeletonContent>
    );
}
