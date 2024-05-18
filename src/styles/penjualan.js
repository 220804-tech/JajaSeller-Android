import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Warna from '../config/Warna';

export default styles = StyleSheet.create({
    cardAll: {
        flex: 0,
        backgroundColor: 'white',
        marginBottom: '2%',
        flexDirection: 'column',
        height: hp('22%'),
        // paddingVertical: '2%',
        paddingBottom: '2%'
        // paddingHorizontal: wp('4%')
    },
    card: {
        flex: 0,
        backgroundColor: 'white',
        marginBottom: '1%',
        flexDirection: 'column',
        // height: hp('17%'),
        paddingVertical: '2%',
        // paddingHorizontal: wp('4%')
    },
    bodyCard: {
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: '3%',

    },
    textTitle: {
        color: '#454545',
        fontSize: 13,
        alignSelf: 'flex-start',
        fontFamily: 'Poppins-Regular',
        // marginBottom: '0.5%',
        paddingHorizontal: '2%',

    },
    textPriceBefore: {
        color: Warna.blackgrayScale,
        fontSize: 10,
        alignSelf: 'flex-start',
        fontFamily: 'Poppins-MediumItalic',
        paddingHorizontal: '2%',
        textDecorationLine: 'line-through',
    },
    textPrice: {
        color: Warna.biruJaja,
        fontSize: 12,
        alignSelf: 'flex-start',
        fontFamily: 'Poppins-SemiBold',
        paddingHorizontal: '2%',
    },
    textDetail: {
        color: Warna.biruJaja,
        fontSize: 12,
        alignSelf: 'flex-start',
        fontFamily: 'Poppins-Regular',
        marginBottom: '1%',
        paddingHorizontal: '2%',
    },
    textDate: {
        color: Warna.blackgrayScale,
        fontSize: 10,
        textAlign: 'left',
        fontFamily: 'Poppins-Italic',
        marginBottom: '3%',
        paddingHorizontal: '3%',
        paddingVertical: '0.5%'
    },

    textName: {
        fontSize: 12,
        textAlign: 'left',
        fontFamily: 'Poppins-Regular',
        marginBottom: '3%',
        paddingHorizontal: '3%',
        paddingVertical: '0.5%'
    },
    footerCard: {
        flex: 0,
        flexDirection: "row",
        justifyContent: 'flex-end',
        alignItems: 'center',
        // backgroundColor: 'grey',
        paddingHorizontal: '2%'
    },
    formDetail: {
        flex: 0,
        flexDirection: 'column',
        marginBottom: '3%'
    },
    formDPlaceholder: {
        fontSize: 14, color: Warna.blackLight, fontFamily: 'Poppins-Regular',
    },
    // '#C7C7CD'
    formDItem: {
        flex: 0, flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderBottomColor: '#C0C0C0', borderBottomWidth: 0.5, paddingBottom: '2%', paddingTop: '1%'
    },
    formDTitle: {
        fontSize: 14, color: 'grey', fontFamily: 'Poppins-Regular',
    },
    formText: { width: '100%', fontSize: 14, fontFamily: 'Poppins-Regular', color: Warna.blackLight, textAlign: 'left' },
    formTextRight: { fontSize: 14, fontFamily: 'Poppins-Regular', color: Warna.blackLight, textAlign: 'right', alignSelf: 'flex-end' },

    formDValue: { fontSize: 14, fontFamily: 'Poppins-Regular', color: Warna.blackGrey, marginBottom: '1.5%' },

    formDspaceRow: { flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1%', paddingVertical: '1%' },
    formDLabel: { fontSize: 14, fontFamily: 'Poppins-Regular', color: Warna.blackgrayScale, marginBottom: '2%' },
    formDButtonText: { fontSize: 14, color: Warna.biruJaja, fontFamily: 'Poppins-Regular', },
    image: { flex: 0, width: wp('18%'), height: wp('17%'), marginRight: '1%', borderRadius: 5, backgroundColor: Warna.silver },
    imageItem: { height: undefined, width: undefined, flex: 1, resizeMode: 'cover', borderRadius: 5, },
    textAlasanTolak: { fontSize: 14, color: Warna.blackgrayScale, fontFamily: 'Poppins-Regular', },

})