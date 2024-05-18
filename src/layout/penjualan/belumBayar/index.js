import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import style from '../../../styles/style'
import styles from '../../../styles/penjualan'
import Warna from '../../../config/Warna'
import Shimmer from '../../../component/shimmerPenjualan'
import { useSelector } from 'react-redux'

export default function index(props) {
    const navigation = useNavigation()
    const [shimmer, setShimmer] = useState(false)
    const orderUnpaid = useSelector(state => state.orders.orderUnpaid)

    const handlePress = (inv) => {
        props.handleShowModal()
        navigation.navigate('DetailsPesanan', { data: inv })
    }

    return (
        <ScrollView style={style.container}>
            {
                shimmer ? <Shimmer /> :
                    orderUnpaid && orderUnpaid.length ?
                        orderUnpaid.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={styles.card} onPress={() => handlePress(item.invoice)}>
                                    <View style={[style.row_space, { flex: 0 }]}>
                                        <Text style={styles.textName}>{String(item.customerName).substr(0, 15)} - <Text style={styles.textDate}>{item.invoice}</Text></Text>
                                        <Text style={styles.textDate}>{item.created_date} {item.time}</Text>
                                    </View>
                                    <View style={styles.bodyCard}>
                                        <View style={styles.image}>
                                            <Image source={{ uri: item.product.image }} style={styles.imageItem} />
                                        </View>
                                        <View style={[style.column_start, { height: '100%', paddingVertical: '1%', justifyContent: 'space-between', alignItems: 'flex-start', flex: 3 }]}>
                                            <View>
                                                <Text style={styles.textTitle}>{item.product.name}</Text>
                                                <Text style={styles.textPrice}>{item.totalOrderCurrencyFormat}</Text>
                                            </View>
                                            <Text style={styles.textDetail}>Rician Pesanan</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => handlePress(item.invoice)} style={styles.footerCard}>
                                        <Text style={{ color: Warna.redPower, fontSize: 12, fontFamily: 'Poppins-Italic' }}>Menunggu Pembayaran</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            )
                        })
                        :
                        <View style={{ width: wp('100%'), height: hp('30%'), marginTop: '10%', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center' }}>
                            <Text>Tidak ada data</Text>
                        </View>
            }
        </ScrollView>
    )
}
