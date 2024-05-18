import { StyleSheet } from 'react-native';
import Warna from '../config/Warna';
import { Colors, Hp, Wp } from '../export';

export const styles = StyleSheet.create({
    inputbox: {
        fontSize: 13,
        width: '100%',
        backgroundColor: 'transparent',
        color: Colors.blackgrayScale,
        fontFamily: 'Poppins-Regular',
        padding: 3
    },
    actionSheetBody: {
        flex: 1, justifyContent: 'center', paddingVertical: '3%'
    },
    form: {
        flex: 0,
        flexDirection: 'column',
        marginBottom: '4%'
    },
    // '#C7C7CD'
    formItem: {
        flex: 0, flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderBottomColor: '#C0C0C0', borderBottomWidth: 0.5, paddingBottom: '2%', paddingTop: '1%'
    },
    formTitle: {
        fontSize: 14, color: Colors.blackgrayScale, fontFamily: 'Poppins-Regular',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 95
    },
    card: { flex: 1, flexDirection: 'column', padding: '4%', marginBottom: '2%', height: Hp('100%'), width: Wp('100%') },
    imageHeader: {
        height: '30%',
        width: '100%',
        opacity: 1,
    },
    header: {
        height: Hp('20%'),
        flex: 0,
        flexDirection: 'column',
        backgroundColor: Warna.biruJaja,
        alignItems: 'center',
        justifyContent: 'flex-start',
        opacity: 0.95,
    },
    ubah: {
        color: Warna.biruJaja,
        fontFamily: 'Poppins-Regular',
        width: '15%',
        textAlign: 'right'
    },

    body: { flex: 1, flexDirection: 'column', },
    bannerKedua: { width: Wp('48%'), height: Wp('24%') },
    formPlaceholder: {
        flex: 0, fontSize: 14, color: Colors.blackgrayScale, fontFamily: 'Poppins-Regular',
    },
    formBannerUtama: {
        flex: 1, width: Wp('80%'), height: Wp('40%'), borderRadius: 7, backgroundColor: 'silver', justifyContent: 'center', alignItems: 'center'
    },
    bannerUtama: { width: Wp('80%'), height: Wp('40%') },
    deleteBannerUtama: { position: 'absolute', right: 1, top: 1, width: 25, height: 25, backgroundColor: '#B22222', borderRadius: 100 },

    formItemPromo: {
        flex: 0, width: Wp('25%'), height: Wp('23%'), borderRadius: 7, marginRight: '5%', marginBottom: "5 %",
    },
    formPromo: {
        flex: 0, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'
    },
    deleteBannerKetiga: { position: 'absolute', right: 1, top: 1, width: 25, height: 25, backgroundColor: '#B22222', borderRadius: 100 },
    deleteBannerKedua: { position: 'absolute', right: 1, top: 1, width: 19, height: 19, backgroundColor: '#B22222', borderRadius: 100 },
    iconDeleteKedua: { alignSelf: "center", width: 8, height: 8, resizeMode: 'contain', flex: 1, borderRadius: 25, tintColor: Warna.white },

    iconDelete: { position: 'absolute', right: 1, top: 1, width: 25, height: 25, backgroundColor: '#B22222', borderRadius: 100 },
    iconDeleteImage: { alignSelf: "center", width: 10, height: 10, resizeMode: 'contain', flex: 1, borderRadius: 25, tintColor: Warna.white },


    image: {
        width: Wp('33%'),
        height: Wp('33%'),
        borderRadius: 5,
    },
    btn: { marginRight: '3%', marginBottom: '3%' },
    iconCalendar: {
        position: 'absolute',
        tintColor: Warna.biruJaja,
        width: 25,
        height: 25,
        right: 10,
        bottom: 15,
    },
    flexRow: {
        flex: 0,
        flexDirection: 'row',
        borderBottomWidth: 0.2
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginTop: '3%',
        color: Warna.blackgrayScale,
    },
})