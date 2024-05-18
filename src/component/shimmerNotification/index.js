import React, { useState } from 'react'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { Style, Wp } from '../../export';

export default function index() {
    const [data] = useState(["1", "2", "3", "4", "5", "6", "7"])

    return (
        data.map(idx => {
            return (
                <View key={String(idx)} style={[Style.column_0_center, Style.py_3, Style.mb_2, { width: Wp('100%'), backgroundColor: 'white' }]} >
                    <View style={[Style.row_between_center, Style.mb_5, Style.px_3, { width: '100%' }]}>
                        <ShimmerPlaceHolder
                            LinearGradient={LinearGradient}
                            width={120}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                        <ShimmerPlaceHolder
                            LinearGradient={LinearGradient}
                            width={120}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                    </View>

                    <View style={[Style.px_3, Style.mb_3, { width: '100%' }]}>
                        <ShimmerPlaceHolder
                            LinearGradient={LinearGradient}
                            style={{ marginBottom: '1%', width: '80%' }}
                            // shimmerWidthPercent={100}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                        <ShimmerPlaceHolder
                            LinearGradient={LinearGradient}
                            style={{ width: '30%' }}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                    </View>
                    <View style={[Style.px_3, { width: '100%' }]}>
                        <ShimmerPlaceHolder
                            LinearGradient={LinearGradient}
                            style={[{ width: '80%' }]}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                    </View>
                </View >
            )
        })
    )
}
