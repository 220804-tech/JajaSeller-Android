import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import style from '../../../styles/style'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native';

export default function index({ data }) {
    const [state, setstate] = useState([])
    const [shimmer, setshimmer] = useState(false)
    const [text, setText] = useState("")


    useEffect(() => {
        if (data && data.length) {
            setstate(data)
            setTimeout(() => setshimmer(false), 500);
        } else {
            setshimmer(true)

            setTimeout(() => {
                setText("Kamu belum melakukan transaksi apapun!")
            }, 500);
            setTimeout(() => setshimmer(false), 500);
        }
    }, [])

    return (

        <SafeAreaView style={style.container}>
            {/* {shimmer ?
                <View style={[style.column, { paddingHorizontal: '2%' }]}>
                    <View style={[style.row, { paddingVertical: '3%', flex: 1 }]}>
                        <View style={[style.column]}>
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ borderRadius: 2, marginBottom: '1%' }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ borderRadius: 2, }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        </View>

                        <View style={[style.column, { flex: 1 }]}>
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ borderRadius: 2, width: '100%' }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ borderRadius: 2, }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        </View>
                    </View>
                    <View style={[style.row, { paddingVertical: '3%', flex: 0 }]}>
                        <View style={[style.column]}>
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ borderRadius: 2, marginBottom: '1%' }}
                                width={83}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ borderRadius: 2, }}
                                width={83}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        </View>
                        <View style={[style.column, { flex: 3 }]}>
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ borderRadius: 2, marginBottom: '1%', width: '100%' }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ borderRadius: 2, }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        </View>
                    </View>
                    <View style={[style.row, { paddingVertical: '3%', flex: 0 }]}>
                        <View style={[style.column]}>
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ borderRadius: 2, marginBottom: '1%' }}
                                width={83}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ borderRadius: 2, }}
                                width={83}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        </View>
                        <View style={[style.column, { flex: 3 }]}>
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ borderRadius: 2, marginBottom: '1%', width: '100%' }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ borderRadius: 2, }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        </View>
                    </View>
                </View>
                : */}
            <ScrollView>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Rekening</DataTable.Title>
                        <DataTable.Title numeric>Nominal</DataTable.Title>
                        <DataTable.Title numeric>Status</DataTable.Title>
                    </DataTable.Header>
                    {state && state.length ?
                        state.map((item, index) => {
                            return (
                                <DataTable.Row key={index}>
                                    <DataTable.Cell>{item.beneficiary_bank}</DataTable.Cell>
                                    <DataTable.Cell numeric>{item.amount_currency_format}</DataTable.Cell>
                                    <DataTable.Cell numeric><Text style={styles.textStatus}>{item.status == "queued" ? "Menunggu" : item.status == "processed" ? "Diproses" : item.status == "completed" ? "Selesai" : "Gagal"}</Text></DataTable.Cell>
                                </DataTable.Row>
                            )
                        })
                        :
                        <View style={[style.container, { paddingVertical: "15%", justifyContent: 'center', alignItems: 'center', }]}>
                            <Text style={{ color: 'grey', fontSize: 14, fontFamily: 'Poppins-Italic' }}>{text}</Text>
                        </View>
                    }
                </DataTable>
            </ScrollView>

        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    textStatus: {
        fontSize: 12,
    }
})