import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import style from '../../styles/style';
import styless from '../../styles/penjualan';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function index() {
    const [data, setdata] = useState(["1", "2", "3", "4", "5"])

    return (
        data.map(index => {
            return (
                <TouchableOpacity key={index} style={styless.card}>
                    <View style={[style.row_space, { flex: 0, marginBottom: '3.7%', marginLeft: '3%' }]}>
                        <ShimmerPlaceHolder
                            LinearGradient={LinearGradient}
                            style={{ width: '50%', height: 16 }}
                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                    </View>
                    <View style={styless.bodyCard}>
                        <View style={styless.image}>
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={styless.imageItem}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        </View>
                        <View style={[style.column_start, { height: '100%', justifyContent: 'space-between', alignItems: 'flex-start', flex: 3, paddingVertical: '0.5%' }]}>
                            <View>
                                <ShimmerPlaceHolder
                                    LinearGradient={LinearGradient}
                                    style={{ width: '19%', height: 16, marginBottom: '0.5%' }}

                                    shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                />
                                <ShimmerPlaceHolder
                                    LinearGradient={LinearGradient}
                                    style={{ width: '19%', height: 14 }}

                                    shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                                />
                            </View>
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ width: '20%', height: 17 }}

                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        </View>
                    </View>
                    <View style={styless.footerCard}>
                        <ShimmerPlaceHolder
                            LinearGradient={LinearGradient}
                            style={{ width: '40%', height: 18 }}

                            shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                        />
                    </View>

                </TouchableOpacity >)
        })
    )
}

const styles = StyleSheet.create({
    cardItem: {
        flex: 1,
        flexDirection: 'row',
        padding: '4%',
    },
    cardImage: {
        height: hp('10%'),
        width: wp('16%'),
        borderRadius: 10,
    },
    cardText: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: '3%',
    },
})