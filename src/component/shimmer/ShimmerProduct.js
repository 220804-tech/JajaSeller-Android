import React from 'react'
import { View, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { styles } from '../../styles/product';
import { Wp, Hp, Ws } from '../../export';

export default function ShimmerProduct() {
    return (
        <View style={[styles.card]}>
            <View style={styles.cardItem}>
                <ShimmerPlaceHolder
                    LinearGradient={LinearGradient}
                    style={[styles.cardImage]}
                    shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                />
                <View style={[styles.cardText, { paddingVertical: '2%' }]}>
                    <ShimmerPlaceHolder
                        LinearGradient={LinearGradient}
                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        width={Ws * 0.65}
                    />
                    <ShimmerPlaceHolder
                        LinearGradient={LinearGradient}
                        style={{ marginVertical: '1%' }}
                        width={Ws * 0.35}
                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                    />
                    <ShimmerPlaceHolder
                        LinearGradient={LinearGradient}
                        width={Ws * 0.25}
                        shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}

                    />
                </View>
            </View>
            <View style={{ width: '100%' }}>
                <ShimmerPlaceHolder
                    LinearGradient={LinearGradient}
                    style={{ borderRadius: 3 }}
                    width={Ws * 0.85}
                    height={Hp('3.2%')}
                    shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                />
            </View>
        </View>
    );
}
