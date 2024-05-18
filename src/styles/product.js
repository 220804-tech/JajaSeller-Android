import { StyleSheet } from 'react-native';
import { Hp, Wp, Colors } from '../export';

export const styles = StyleSheet.create({
    status: {
        fontFamily: 'Poppins-Regular', fontSize: 12,
        fontFamily: 'Poppins-Italic',

    },
    spinnerTextStyle: {
        color: Colors.white,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        position: 'absolute',
    },
    card: {
        marginBottom: '2%',
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: '4%',
        paddingVertical: '2%'
    },
    cardBody: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        position: 'relative',
    },
    cardItem: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: '2%',
    },
    cardImage: {
        height: Hp('7.5%'),
        width: Wp('16%'),
        borderRadius: 5,
    },
    cardText: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: '3%',
    },
    cardParentTitle: {
        flex: 1,
        flexDirection: 'row',
        paddingRight: '4%'
        // flexWrap: 'wrap',    
    },
    cardTitle: {
        fontFamily: 'Poppins-SemiBold', fontSize: 13,
        marginBottom: '0%',
    },
    cardKondisi: {
        fontFamily: 'Poppins-Italic', fontSize: 8,
        marginLeft: '0.5%',
        alignItems: 'flex-start'
    },
    cardHarga: {
        fontFamily: 'Poppins-Regular', fontSize: 10,
        color: Colors.blackgrayScale
    },
    cardStok: {
        color: Colors.blackGrey,
        fontFamily: 'Poppins-Regular', fontSize: 10,
        alignSelf: 'baseline',
    },
    cardOption: {
        paddingHorizontal: Wp('2%'),
    },
    cardIcon: {
        width: Wp('3.5%'),
        height: Hp('3.5%'),
    },
    actionSheet: {
        // paddingVertical: '2%',
        paddingHorizontal: '4%',
        flex: 0,
        flexDirection: 'column',
        // height: Hp('40%')
    },
    headerModal: {
        flex: 0,
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '1%'
    },
    informasiProduk: {
        flex: 1,
        fontFamily: 'Poppins-Bold', fontSize: 17,
        color: Colors.biruJaja,
        marginVertical: '3%'
    },
    x: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold', fontSize: 20,
    },
    modalLine: {
        borderBottomWidth: 0.2,
        borderBottomColor: Colors.biruJaja,
        flex: 1,
        flexDirection: 'row',
        paddingVertical: '4%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    flex0: {
        flex: 0,
        marginBottom: Hp('2%'),
    },
    flex0border: {
        borderBottomColor: '#9A9A9A',
        borderBottomWidth: 0.2,
        flex: 0,
        marginBottom: Hp('2%'),
    },

    iconCalendar: {
        position: 'absolute',
        tintColor: Colors.biruJaja,
        width: 25,
        height: 25,
        right: 10,
        bottom: 15,
    },
    modalColumn: {
        flexDirection: 'column',
        borderBottomColor: Colors.biruJaja,
        flex: 2,
    },
    iconModal: {
        width: 23,
        height: 23,
        marginRight: Wp('5%'),
    },
    iconAturDiskon: {
        width: 21,
        height: 21,
        tintColor: Colors.biruJaja,
        marginLeft: Wp('5%'),
    },
    iconClose: {
        width: 14,
        height: 14,
        tintColor: 'grey',
    },

    textLabel: {
        fontFamily: 'Poppins-SemiBold', fontSize: 14,
        color: '#454545',
    },
    red: { color: 'red' },
    textLine: {
        color: Colors.blackLight,
        fontFamily: 'Poppins-SemiBold', fontSize: 14,
        textAlignVertical: 'center',
    },
    textInputLine: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: Wp('1%'),
    },

    lineHarga: {
        flex: 1,
        flexDirection: 'row',
    },
    textInputLineHarga: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: Colors.biruJaja,
        borderBottomWidth: 0.7,
        flex: 2,
    },
    textInputDeskripsi: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: Colors.biruJaja,
        borderBottomWidth: 0.7,
        flex: 2,
    },
    textInputStok: {
        borderBottomColor: Colors.biruJaja,
        overflow: 'hidden',
        borderBottomWidth: 0.7,
        width: Wp('15%'),
        paddingVertical: '0.3%',
        marginHorizontal: Wp('2%'),
        textAlign: 'center',
    },
    rupiah: {
        color: 'grey',
        width: Wp('7%'),
    },
    textInputHarga: {
        paddingVertical: '0.3%',
        textAlign: 'left',
        width: Wp('47%'),
    },
    rupiah00: {
        color: 'grey',
        justifyContent: 'flex-end',
        width: Wp('7%'),
    },
    persentage: {
        position: 'absolute',
        right: 0,
        color: '#454545',
        fontFamily: 'Poppins-SemiBold', fontSize: 16,
        justifyContent: 'flex-end',
        width: Wp('8%'),
    },
    iconPlusMinus: {
        width: 15,
        height: 15,
        tintColor: Colors.biruJaja,
    },
    buttonModal: {
        backgroundColor: Colors.biruJaja,
        marginTop: Hp('3%'),
        marginBottom: Hp('1%'),
        // width: Wp('100%')
    },
    titleDeskripsi: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold', fontSize: 17,
        color: Colors.biruJaja,
        marginTop: Hp('3%'),
        marginBottom: Hp('0.5%'),
    },
    noteDeskripsi: {
        fontFamily: 'Poppins-Regular', fontSize: 11,
        color: Colors.blackGrey,
        marginBottom: Hp('1%'),
    },
    textArea: {
        maxHeight: 200,
        marginBottom: 10,
        borderColor: 'grey',
        borderWidth: 0.5,
        width: Wp('92%'),
    },
    // ALERT
    alertContainerStyle: {
        borderColor: 'grey',
        borderWidth: 2,
    },

    // gambar
    listGambar: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: Wp('92%'),
        paddingVertical: Hp('2%'),
        // justifyContent: "flex-start",
        alignContent: 'space-between',
        justifyContent: 'space-between',
    },

    gambarProduk: {
        width: Wp('15%'),
        height: Hp('7%'),
        // marginHorizontal: Wp('2%'),
        alignSelf: 'flex-start',
    },
    hapusGambar: {
        width: 11,
        height: 11,
        position: 'absolute',
        // marginTop: '-5%'
        right: 0,
        tintColor: 'black',
    },

    bottomModal: {
        // width: Wp('90%'),
        // alignSelf: "center",
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonPicture: {
        width: Wp('44%'),
        backgroundColor: Colors.white,
        alignSelf: 'center',
        marginBottom: Hp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3%',
        elevation: 3,
    },
    buttonItem: {
        color: Colors.biruJaja,
    },
    abc: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    viewText: {
        height: Hp('7%'),
        borderBottomWidth: 0.2,
        borderBottomColor: '#9A9A9A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textInput: {
        fontFamily: 'Poppins-Regular', fontSize: 14,
        alignSelf: 'center',
        textAlign: 'left',
        alignItems: 'flex-end',
    },
    iconText: { tintColor: '#9a9a9a', width: 15, height: 15, alignSelf: 'center' },
    headerTitle: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold', fontSize: 17,
        color: Colors.biruJaja,
        marginVertical: Hp('3%'),
    },
    touchKategori: {
        paddingVertical: Hp('2%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: Hp('2%'),
    },
    textKategori: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#454545' },

    headerlistvariasi: {
        flex: 1,
        paddingHorizontal: Hp('2%'),
        paddingVertical: Hp('1.5%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: Hp('0%'),
        borderBottomColor: '#9A9A9A',
        borderBottomWidth: 0.2,
        alignItems: 'center',
        backgroundColor: '#454545',
    },

    listvariasi: {
        flex: 1,
        paddingVertical: Hp('1%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: Hp('0%'),
        borderBottomColor: '#9A9A9A',
        borderBottomWidth: 0.2,
        alignItems: 'center',
    },

    textListVariasi: {
        flex: 1,
        fontFamily: 'Poppins-Regular', fontSize: 13,
        color: Colors.blackgrayScale,
        justifyContent: 'flex-end',
    },

    textHargaBeforeVariasi: {
        flex: 0,
        fontFamily: 'Poppins-Regular', fontSize: 11,
        color: Colors.blackgrayScale,
        justifyContent: 'flex-end',
        paddingHorizontal: Wp('2%'),
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    textHargaAfterVariasi: {
        flex: 0,
        fontFamily: 'Poppins-Regular', fontSize: 14,
        color: Colors.blackgrayScale,
        justifyContent: 'flex-end',
        paddingHorizontal: Wp('2%'),
    },
    textDiskon: {
        fontFamily: 'Poppins-Regular', fontSize: 10,
        marginLeft: 10,
        color: '#FFF',
        backgroundColor: Colors.biruJaja,
        borderRadius: 13,
        paddingHorizontal: Wp('2%'),
        paddingVertical: Hp('0.3W%'),
        justifyContent: 'flex-end',
    },
    textHarga: {
        fontFamily: 'Poppins-Regular', fontSize: 13,
        color: Colors.blackgrayScale,
        justifyContent: 'flex-end',
        paddingHorizontal: Wp('2%'),
    },
});
