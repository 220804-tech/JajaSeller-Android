import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function index() {

    const notifikasi = [
        { id: 1, dibaca: false, tanggal: "12-September-2020", isi: "Qui deserunt duis sunt anim sit magna esse irure eu et. Do qui cupidatat nulla non quis. Enim cupidatat occaecat laboris Lorem aliquip veniam nisi elit excepteur. Et do ea officia elit non incididunt ut enim voluptate.", title: 'Hai seller kamu belum tambah produk ya?' },
        { id: 2, dibaca: false, tanggal: "12-September-2020", isi: "Exercitation qui aliquip culpa sunt aliqua anim cupidatat nulla do Lorem ex nisi commodo sit. Eiusmod anim aliquip dolore et cupidatat ea laborum exercitation. Magna laboris amet aute reprehenderit quis et nostrud fugiat. Elit ipsum veniam pariatur occaecat mollit reprehenderit. Lorem ut qui minim eu cupidatat eu nisi esse sunt Lorem voluptate velit.", title: 'Tips untuk dapatkan transaksi pertama!' },
        { id: 3, dibaca: false, tanggal: "12-September-2020", isi: "Cupidatat reprehenderit ut enim nulla aliquip Lorem qui sit sit esse. Est ea occaecat velit nisi amet veniam sit fugiat consectetur nisi laborum labore esse labore. Ea aliquip proident sint tempor laboris velit sunt excepteur ipsum veniam sit tempor aliquip. Elit dolor nisi quis ullamco commodo enim do. Duis proident in occaecat consectetur anim nisi pariatur anim laboris qui culpa mollit ullamco.", title: 'Jangan menyerah kamu pasti bisa!' },
        { id: 4, dibaca: false, tanggal: "12-September-2020", isi: "Ullamco dolore excepteur cillum veniam reprehenderit deserunt ipsum fugiat voluptate ad ullamco ipsum et. Aliqua ex cupidatat et amet officia laboris aliquip ipsum. Eiusmod amet ullamco anim commodo aliqua ea fugiat ut proident eu ea.", title: 'Selain berusaha dalam berjualan berdoa juga sangat di perlukan loh!' },
        { id: 5, dibaca: false, tanggal: "12-September-2020", isi: "Ullamco eiusmod eu deserunt commodo. Consequat ipsum irure amet eiusmod in veniam aliqua excepteur aliquip velit irure ea. Irure eu in ut est deserunt officia elit adipisicing proident eu exercitation et non enim. Ea ut dolor exercitation incididunt. Qui labore tempor deserunt reprehenderit in exercitation aute officia ad quis consequat consectetur anim. Sit ex amet anim elit mollit veniam cillum voluptate sunt Lorem aute anim.", title: 'Jangan menggunakan foto yang blur pada produkmu!' },
    ]

    return (
        <ScrollView style={styles.container}>
            {notifikasi.map(notif => {
                return (
                    <View key={notif.id} style={styles.card}>
                        <ScrollView style={styles.bodyCard}>
                            <Text style={styles.textDate}>{notif.tanggal}</Text>
                            <Text style={styles.textTitle}>{notif.title}</Text>
                            <Text style={styles.textBody}>{notif.isi}</Text>
                        </ScrollView>
                    </View>

                )
            })}
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F0F0"
    },
    card: {
        flex: 0,
        backgroundColor: 'white',
        marginBottom: '2%',
        flexDirection: 'row',
        height: 150,
        paddingVertical: '2%',
        paddingHorizontal: wp('4%')
    },
    bodyCard: {
        flex: 0,
        flexDirection: "column"
    },
    textTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        fontFamily: 'Poppins-Regular'
    },
    textDate: {
        color: 'grey',
        fontSize: 11,
        textAlign: 'right',
        fontFamily: 'Poppins-SemiBold',
        fontFamily: 'Poppins-Light',
        fontFamily: 'Poppins-Italic',
        marginBottom: hp('1%')
    },
    textBody: {
        color: 'grey',
        fontSize: 12,
        textAlign: 'left',
        fontFamily: 'Poppins-SemiBold',
        fontFamily: 'Poppins-Light',
    }

})