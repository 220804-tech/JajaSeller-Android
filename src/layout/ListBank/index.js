import React, { useState, useEffect, createRef, useCallback } from 'react'
import { View, Text, ScrollView, FlatList, ToastAndroid, TouchableOpacity, TextInput, SafeAreaView, Image, Alert, TouchableNativeFeedback, RefreshControl, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { DataTable, Button, Appbar, TouchableRipple } from 'react-native-paper';
import Warna from '../../config/Warna';
import ActionSheet from "react-native-actions-sheet";
import AwesomeAlert from 'react-native-awesome-alerts';
import SnackBar from 'react-native-snackbar-component'
import { Style, Colors, Storage, useNavigation, Loading, Wp, Hp, ServiceAccount, Utils } from '../../export';
import { useSelector } from 'react-redux';



export default function ListBank() {
  const navigation = useNavigation();
  const seller = useSelector(state => state.user.seller)
  const reduxAuth = useSelector(state => state.user.token)

  const actionSheetAdd = createRef();
  const actionSheetList = createRef();

  const [refreshControl, setRefreshControl] = useState(false);
  const [listBk, setlistBk] = useState([]);
  const [shimmerRK, setshimmerRK] = useState(false);
  const [alertHapus, setAlertHapus] = useState(false);
  const [firstBank, setFirstBank] = useState([]);
  const [listBankApi, setListBankApi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bkName, setbkName] = useState("");
  const [acc, setacc] = useState("");
  const [bkKode, setbkKode] = useState("");
  const [idDelete, setIdDelete] = useState("");
  const [city, setcity] = useState("");
  const [branch_office, setbranch_office] = useState("");
  const [alertRekening, setAlertRekening] = useState("");
  const [notif, setnotif] = useState(false);
  const [addAccount, setaddAccount] = useState(false);
  const [pertamax, setpertamax] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState(false);
  const [count, setCount] = useState(0);

  function getListBank() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append(
      "Authorization",
      "Basic SVJJUy01ZjNjZjQ1MC0xZmQwLTQ1ZWQtODk3Zi0xMDVmNGMyMjQwY2I6"
    );
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    fetch("https://app.sandbox.midtrans.com/iris/api/v1/beneficiary_banks", requestOptions)
      .then(response => response.json())
      .then(result => {
        var count = Object.keys(result.beneficiary_banks).length;
        let list = [];
        let pertamax = [];
        let keduax = [];
        setTimeout(() => setshimmerRK(false), 1000);
        for (var i = 0; i < count; i++) {
          let name = result.beneficiary_banks[i].name;
          if (name === "PT. BANK CENTRAL ASIA TBK." || name === "PT. BANK OCBC NISP TBK." || name === "PT. BANK MANDIRI (PERSERO) TBK." || name === "PT. BANK MAYBANK INDONESIA TBK." || name === "PT. BANK BUKOPIN TBK." || name === "PT. BANK NEGARA INDONESIA (PERSERO)" || name === "PT. BANK DANAMON INDONESIA TBK." || name === "PT. BANK CIMB NIAGA TBK.") {
            pertamax.push({ code: result.beneficiary_banks[i].code, value: result.beneficiary_banks[i].name })
          } else {
            keduax.push({ code: result.beneficiary_banks[i].code, value: result.beneficiary_banks[i].name })
          }
        }

        setListBankApi(pertamax.concat(keduax));
        setFirstBank(pertamax.concat(keduax));
      })
      .catch(error => {
        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
        setshimmerRK(false)
      });
  }

  const handleVerified = (value) => {
    if (value.verified === true) {
      Utils.alertPopUp('Akun ini sudah diverifikasi!')
      return null
    } else if (value.verified === false) {
      Alert.alert(
        "Jaja.id",
        "Anda yakin ingin mengirim mengulang verifikasi bank?", [
        {
          text: "Batal",
          onPress: () => console.log("pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            handleResendVerification(value?.id_data)
          }
        }
      ],
        { cancelable: false }
      );
    }
  }

  const handleResendVerification = (value) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "ci_session=pf8cqr6eefjail0khooef61h0og4nrcl");

    var raw = JSON.stringify({ "id_toko_bank": value, "id_toko": seller.id_toko });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://jsonx.jaja.id/core/seller/mailing/bank", requestOptions)
      .then(response => response.text())
      .then(res => {
        try {
          let result = JSON.parse(res);
          if (result.status.code === 200) {
            Utils.alertPopUp('Email berhasil dikirim!')
          } else {
            Utils.handleErrorResponse(result, 'Error with status code : 12082')
          }
        } catch (error) {
          Utils.alertPopUp(JSON.stringify(res) + '\n' + JSON.stringify(error))
        }
      })
      .catch(error => Utils.handleError(JSON.stringify(error), 'Error with status code : 12081'));
  }

  const handleUtama = (val) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "id_toko": seller.id_toko,
      "rekening_id": val
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://jsonx.jaja.id/core/seller/dompetku/change_primary_rekening", requestOptions)
      .then(response => response.text())
      .then(result => {
        try {
          let res = JSON.parse(result);
          if (res.status.code === 200) {
            getItem()
          } else {
            Utils.handleErrorResponse(res, 'Error with status code : 12099')
          }
        } catch (error) {
          Utils.alertPopUp(JSON.stringify(result))
        }
      })
      .catch(error => Utils.handleError(error, 'Error with status code : 12098'));
  }

  const renderRow = ({ item }) => {
    return (
      <DataTable style={{ marginBottom: '2%', backgroundColor: 'white', width: '100%' }}>

        <DataTable.Header style={{ paddingVertical: Platform.OS === 'ios' ? '3%' : 0, alignItems: 'center' }}>
          <DataTable.Title>Nama Bank</DataTable.Title>
          <DataTable.Cell style={{ flexDirection: 'row', alignItems: 'center' }}>{item.bank_name}</DataTable.Cell>
        </DataTable.Header>
        <DataTable.Header style={{ paddingVertical: Platform.OS === 'ios' ? '3%' : 0, alignItems: 'center' }}>
          <DataTable.Title>Nama Pemilik</DataTable.Title>
          <DataTable.Cell>{item.name}</DataTable.Cell>
        </DataTable.Header>
        <DataTable.Header style={{ paddingVertical: Platform.OS === 'ios' ? '3%' : 0, alignItems: 'center' }}>
          <DataTable.Title>Rekening</DataTable.Title>
          <DataTable.Cell>{String(item.account).slice(0, 6)}XXXX</DataTable.Cell>
        </DataTable.Header>
        <DataTable.Header style={{ paddingVertical: Platform.OS === 'ios' ? '3%' : 0, alignItems: 'center' }}>
          <DataTable.Title>Verifikasi</DataTable.Title>
          <View style={{ flex: 1, }}>
            <TouchableOpacity style={{ backgroundColor: item.verified === true ? 'transparent' : Colors.redNotif, alignSelf: 'flex-start', borderRadius: 3, paddingHorizontal: item.verified === true ? '0%' : '4%', paddingVertical: '1%' }} onPress={() => item.verified === true ? null : handleVerified(item)}>
              <Text style={[Style.font_12, Style.semi_bold, { color: item.verified === true ? Warna.biruJaja : Warna.white, }]}>{item.verified === true ? "Aktif" : "Belum verifikasi"}</Text>

              {/* <Text style={{ flex: 1, color: item.verified === true ? Warna.biruJaja : Warna.redPower, alignItems: 'center' }}>{item.verified === true ? "Aktif" : "Belum verifikasi"}</Text> */}
            </TouchableOpacity>
          </View>
        </DataTable.Header>
        <DataTable.Header style={{ paddingVertical: Platform.OS === 'ios' ? '3%' : 0, alignItems: 'center' }}>
          <DataTable.Title>Status</DataTable.Title>
          <DataTable.Cell>
            {/* <Button onPress={() => item.is_primary ? null : handleUtama(item?.id_data)} color={Colors.biruJaja} mode='text' style={{ width: Wp('45%'), borderColor: Colors.biruJaja }} contentStyle={{ width: Wp('45%'), borderColor: Colors.biruJaja }} labelStyle={[Style.font_11, Style.bold, { color: Colors.biruJaja, alignSelf: 'flex-start' }]}>{item.is_primary ? 'UTAMA' : 'JADIKAN UTAMA'}
            </Button> */}
            {item.is_primary ?
              <Text style={[Style.font_12, Style.semi_bold, { color: Colors.biruJaja }]}>{item.is_primary ? 'UTAMA' : 'JADIKAN UTAMA'}</Text>
              :
              <TouchableRipple style={[{ backgroundColor: Colors.biruJaja, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }]} onPress={() => handleUtama(item?.id_data)}>
                <Text style={[Style.font_12, Style.semi_bold, { color: Colors.white }]}>JADIKAN UTAMA</Text>
              </TouchableRipple>
            }
          </DataTable.Cell>
        </DataTable.Header>
        <DataTable.Header style={[Style.row_between_center]}>
          <Button onPress={() => setDeleteSelected(item?.id_data) & setAlertHapus(true)} color={Colors.redNotif} mode="outlined" style={{ width: Wp('90%'), borderColor: Colors.redNotif, borderWidth: 0.5 }} contentStyle={{ width: Wp('92%'), borderColor: Colors.redNotif }} labelStyle={[Style.font_12, Style.bold, { color: Colors.redNotif }]}>HAPUS</Button>
        </DataTable.Header>
      </DataTable >
    );
  };

  const getItem = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`https://jsonx.jaja.id/core/seller/dompetku/rekening?id_toko=${seller.id_toko}`, requestOptions)
      .then(response => response.text())
      .then(resp => {
        try {
          let response = JSON.parse(resp)
          if (response.status.code === 200) {
            setlistBk(response.data)
            setCount(count + 1)
          } else if (response.status.message !== 'data empty') {
            // setlistBk([])
            Utils.alertPopUp(String(response.status.message))
          } else {
            setlistBk([])
          }
        } catch (error) {
          // setlistBk([])
        }
        setTimeout(() => setshimmerRK(false), 500)
      })
      .catch(error => Utils.alertPopUp(String(error)))

  }
  const handleSubmit = async () => {
    setLoading(true)
    let credentials = {
      "bank_code": bkKode,
      "bank_name": bkName,
      "account": acc,
      "branch_office": branch_office,
      "city": city,
      "id_toko": seller.id_toko,
    }
    try {
      let response = await ServiceAccount.addBk(credentials)
      if (response?.status?.code === 404) {
        setLoading(false)
        setTimeout(() => Utils.alertPopUp(String(response?.status?.message)), 1000);
        setAlertRekening(String(response?.status?.message))
      } else if (response?.status?.code === 200) {
        getItem()
        // setbkKode("")
        // setbkName("")
        // setacc("")
        // setcity("")
        // setbranch_office("")
        setTimeout(() => setLoading(false), 1000);
        setTimeout(() => setaddAccount(false), 1500);
        setTimeout(() => setnotif(true), 2000);
      } else if (response?.status?.code === 409) {
        setLoading(false)
        Utils.alertPopUp("Nomor rekening sudah pernah digunakan!")
        setAlertRekening("Nomor rekening sudah pernah digunakan!")
      } else if (response?.status?.code === 400 && response?.status?.message === 'you have to verified before') {
        Utils.alertPopUp('Harap verifikasi terlebih dahulu rekening anda yang sudah terdaftar!')
        setLoading(false)
        setaddAccount(false)
      } else {
        setLoading(false)
        Utils.alertPopUp(String(response?.status?.message + " =>" + response?.status?.code))
      }
    } catch (error) {
      setLoading(false)
      Utils.alertPopUp(String(error))
    }
  }
  const handleDelete = () => {
    setAlertHapus(false)

    ServiceAccount.deleteBk(deleteSelected, seller.id_toko).then(res => {
      if (res && Object.keys(res).length) {
        if (res?.status?.code === 200) {
          getItem()
          Utils.alertPopUp('Akun anda berasil dihapus!')
        } else {
          Utils.handleErrorResponse(res)
        }
      } else {
        Utils.handleErrorResponse(res, 'Error with status code : 12088')
      }
    }).catch(err => Utils.handleError(JSON.stringify(err), 'Error with status code: 12087'))
    // var myHeaders = new Headers();
    // myHeaders.append("Cookie", "ci_session=sqm3ldo309bkgvhoourpsl3fegakfl2b");

    // var formdata = new FormData();

    // var requestOptions = {
    //   method: 'DELETE',
    //   headers: myHeaders,
    //   body: formdata,
    //   redirect: 'follow'
    // };

    // fetch(`https://jsonx.jaja.id/core/seller/dompetku/rekening/${deleteSelected}?id_toko=${seller.id_toko}`, requestOptions)
    //   .then(response => response.text())
    //   .then(result => {
    //     console.log("🚀 ~ file: index.js ~ line 273 ~ handleDelete ~ result", result)
    //     try {
    //       let res = JSON.parse(result);
    //       if (res.status.code === 200) {
    //         getItem()
    //       } else {
    //         Utils.handleErrorResponse(res, 'Error with status code : 12099')
    //       }
    //     } catch (error) {
    //       console.log("🚀 ~ file: index.js ~ line 283 ~ handleDelete ~ error", error)
    //       Utils.alertPopUp(JSON.stringify(result))
    //     }
    //   })
    //   .catch(error => {
    //     Utils.handleError(error, 'Error with status code : 12098')
    //   });

  }
  useEffect(() => {
    getItem();
    getListBank();
    return () => {
      setshimmerRK(true)
      setLoading(false)
      setAlertHapus(false)
    }
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshControl(false)
    setshimmerRK(true)
    getItem();
  }, []);

  function onChangeText(text, code, data) {
    var codeBank = data.filter(value => value.value.toLowerCase().indexOf(text.toLowerCase()) > -1);
    setbkKode(codeBank[0].code)
    setbkName(text)
  }

  const handleSearch = (text) => {
    const beforeFilter = listBankApi;
    const afterFilter = beforeFilter.filter(bank => bank.value.toLowerCase().indexOf(text.toLowerCase()) > -1);
    setFirstBank(afterFilter);
  };

  const handlePressed = (item) => {
    setbkKode(item.code)
    setbkName(item.value)
    actionSheetList.current?.setModalVisible(false)
  }
  const renderBank = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handlePressed(item)} style={Style.FL_TouchAble}>
        <Text style={Style.FL_TouchAbleItem}>{item.value}</Text>
      </TouchableOpacity >
    )
  }

  return (
    <SafeAreaView style={Style.container}>
      <SnackBar autoHidingTime={10000} messageStyle={{ fontFamily: 'Poppins-SemiBold' }} messageColor={Colors.blackgrayScale} backgroundColor="#f0e68c" visible={notif} bottom={0} position="bottom" textMessage="Rekening berhasil ditambahkan, mohon cek email anda untuk verifikasi rekening anda!" actionHandler={() => { console.log("snackbar button clicked!") }} />
      {loading ? <Loading /> : null}

      <View style={Style.appBar}>
        <View style={Style.row_start_center}>
          <TouchableOpacity onPress={() => addAccount ? setaddAccount(false) & getItem() : navigation.goBack()}>
            <Image style={Style.appBarIcon} source={require('../../icon/arrow.png')} />
          </TouchableOpacity>
          <Text style={Style.appBarText}>{addAccount ? "Tambah Rekening" : "Rekening Bank"}</Text>
        </View>
        {addAccount ? null :
          <TouchableOpacity style={{ paddingHorizontal: '4%', justifyContent: 'center', alignItems: 'center', paddingVertical: '1%' }} onPress={() => setaddAccount(true)}>
            <Image style={Style.appBarIcon} source={require('../../icon/more.png')} />
          </TouchableOpacity>
        }
      </View>
      <ScrollView contentContainerStyle={[Style.container, { backgroundColor: Colors.white }]} refreshControl={
        <RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />
      }>


        {
          shimmerRK === true ?
            <View style={Style.column}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={{ borderRadius: 2, width: '100%', height: '30%', alignSelf: 'center', marginBottom: '2%' }}
                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={{ borderRadius: 2, width: '100%', height: '30%', alignSelf: 'center', marginBottom: '3%' }}
                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={{ borderRadius: 2, width: '100%', height: '30%', alignSelf: 'center', marginBottom: '3%' }}
                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']} />
            </View>
            :
            addAccount ?
              <View style={{ flex: 0, flexDirection: 'column', padding: '4%' }}>
                <View style={{ flex: 0, flexDirection: 'column', marginBottom: '3%' }}>
                  <Text style={{ fontSize: 13 }}>Nama Bank</Text>
                  <TouchableOpacity style={[Style.row_0, { borderBottomWidth: 1, borderBottomColor: '#C0C0C0', }]} onPress={() => actionSheetList.current?.setModalVisible(true)} >
                    <Text numberOfLines={1} style={[Style.font_13, Style.py_3, { color: bkName ? Colors.blackgrayScale : Colors.blackGrey, width: '90%' }]}>{bkName ? bkName : "Pilih Bank"}</Text>
                    <TouchableNativeFeedback onPress={() => {
                      console.log("🚀 ~ file: index.js ~ line 493 ~ index ~ firstBank", firstBank)

                      actionSheetList.current?.setModalVisible(true)
                    }}>
                      <Image
                        style={[Style.TI_RightIcon, { tintColor: Warna.biruJaja }]}
                        source={require('../../icon/down-arrow.png')}
                      />
                    </TouchableNativeFeedback>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 0, flexDirection: 'column', marginBottom: '3%', borderBottomWidth: 1, borderBottomColor: '#C0C0C0', }}>
                  <Text style={Style.font_14}>Nomor Rekening</Text>
                  <TextInput style={[Style.font_13, { paddingVertical: Platform.OS ? '3%' : 0 }]} value={acc} onChangeText={(text) => {
                    setacc(text)
                    setAlertRekening("")
                  }} placeholder="ex. 12920009209" keyboardType="numeric" />
                </View>
                <Text style={{ fontSize: 12, color: 'red' }}>{alertRekening}</Text>
                <View style={{ borderBottomWidth: 1, flex: 0, flexDirection: 'column', borderBottomColor: '#C0C0C0', marginTop: '2%' }}>
                  <Text style={Style.font_14}>Kantor Cabang</Text>
                  <TextInput style={[Style.font_13, { paddingVertical: Platform.OS ? '3%' : 0 }]} placeholder="Kantor Cabang" value={branch_office} onChangeText={(text) => setbranch_office(text)} />
                </View>
                <View style={{ borderBottomWidth: 1, flex: 0, flexDirection: 'column', borderBottomColor: '#C0C0C0', marginTop: '3%' }}>
                  <Text style={Style.font_14}>Kota</Text>
                  <TextInput style={[Style.font_13, { paddingVertical: Platform.OS ? '3%' : 0 }]} placeholder="Kota" value={city} onChangeText={(text) => setcity(text)} keyboardType="default" />
                </View>
                {/* <Button onPress={() => handleSubmit()} mode="contained" color={Warna.biruJaja} labelStyle={[Style.font_14, Style.semi_bold, { color: Warna.white }]} style={{ marginTop: '11%' }}>
                  Simpan
                </Button> */}
                <TouchableRipple rippleColor={Colors.white} onPress={() => handleSubmit()} style={[Style.py_2, Style.mt_3, { backgroundColor: Colors.biruJaja, elevation: 1, borderRadius: 3 }]}>
                  <Text style={[Style.font_13, Style.semi_bold, { color: Colors.white, alignSelf: 'center' }]}>Simpan</Text>
                </TouchableRipple>
              </View>
              :
              listBk.length !== 0 ?
                <FlatList
                  data={listBk}
                  renderItem={renderRow}
                  keyExtractor={(item, index) => String(index) + "CJ"} />
                : <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'grey' }}>Belum ada rekening bank</Text></View>
        }

        <AwesomeAlert alertContainerStyle={[Style.font_14, { color: Colors.redNotif }]} overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
          show={alertHapus}
          showProgress={false}
          title="PERINGATAN!"
          message="Anda ingin menghapus rekening dari jaja?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Batal"
          confirmText="Hapus"
          confirmButtonColor="#DD6B55" onCancelPressed={() => setAlertHapus(false) & setDeleteSelected(null)} onConfirmPressed={() => handleDelete()}
        />

        <ActionSheet delayActionSheetDraw={true} delayActionSheetDrawTime={100} footerHeight={80} containerStyle={{
          paddingVertical: Platform.OS === 'ios' ? '1%' : '5%',
          paddingHorizontal: '4%',
          width: Wp("100%"),
          height: Platform.OS === 'ios' ? Hp("75%") : Hp("80%"),
          flex: 0, flexDirection: 'column'
        }}
          ref={actionSheetList}>

          <View style={[Style.actionSheetHeader, { flex: 0, }]}>
            <Text style={Style.actionSheetTitle}>Pilih Bank</Text>
            <TouchableOpacity onPress={() => actionSheetList.current?.setModalVisible(false)}  >
              <Image
                style={Style.actionSheetClose}
                source={require('../../icon/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0, flexDirection: 'column', height: '100%' }}>
            <View style={[{ flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: Colors.whiteGrey, borderRadius: 5, }]}>
              <Image
                source={require('../../assets/icons/loupe.png')}
                style={{
                  height: 22,
                  width: 22,
                  flex: 1,
                  resizeMode: 'contain',
                }}
              />
              <TextInput
                placeholder="Cari bank"
                style={[Style.font_13, Style.pl_2, { paddingLeft: 0, width: '90%', marginBottom: Platform.OS === 'ios' ? 0 : '-1%' }]}
                onChangeText={(text) => handleSearch(text)}
              />
            </View>
            <View style={{ flex: 0, height: '89%', paddingHorizontal: Wp('2%') }}>
              <ScrollView style={{ flex: 1 }}>
                <FlatList
                  data={firstBank}
                  renderItem={renderBank}
                  keyExtractor={(item, index) => String(index) + "LH"} />
              </ScrollView>
            </View>
          </View>
        </ActionSheet>
      </ScrollView>
    </SafeAreaView >
  )
}
