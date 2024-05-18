import React, { createRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { IconButton, RadioButton, Button } from 'react-native-paper';
import ActionSheet from 'react-native-actions-sheet';
import {
  Style,
  Utils,
  useFocusEffect,
  useNavigation,
  Hp,
  Wp,
  ServiceAccount,
  Colors,
  Appbar,
} from '../../export';
import { useSelector } from 'react-redux';

export default function index() {
  const reduxSeller = useSelector((state) => state.user.seller.id_toko);
  const actionSheetChange = createRef();
  const navigation = useNavigation();
  const [bk, setbk] = useState([]);
  const [selectedBk, setselectedBk] = useState({});
  const [bkName, setBkName] = useState('');
  const [name, setname] = useState('');
  const [payNml, setpayNml] = useState('');
  const [salad, setsalad] = useState('');
  const [validationSalad, setvalidationSalad] = useState('');
  const [textAlert, settextAlert] = useState('*Biaya penarikan 5.000');
  const [textAlertNote, settextAlertNote] = useState('');

  const [catatan, setcatatan] = useState('');
  const [id, setid] = useState('');
  const [idBk, setidBk] = useState('');
  const [verified, setverified] = useState();

  useEffect(() => {
    getItem();
    getDataBank();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getDataBank();
      // getItem()
    }, []),
  );
  const getDataBank = async () => {
    try {
      let idToko = reduxSeller;
      let response = await ServiceAccount.getBk(idToko);
      if (response.status.code === 200) {
        setbk(response.data);
        console.log(
          "🚀 ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''",
          response.data,
        );
        setBkName(response.data[0].bank_name);
        setname(response.data[0].name);
        setidBk(response.data[0]?.id_data);
        setverified(response.data[0].verified);
        setvalidationSalad(response.saldo);
      } else {
        setbk([]);
        console.log(
          '🚀 ~ file: index.js ~ line 34 ~ AsyncStorage.getItem ~ esponse.status.code',
          response,
        );
      }
    } catch (error) { }
  };
  const getItem = async () => {
    console.log('masuk payouts');
    try {
      let idToko = reduxSeller;
      if (idToko) {
        setid(idToko);
        let sld = await ServiceAccount.getsalad(idToko);
        if (sld.status.code == 200) {
          setsalad(sld.data.saldo_seller.done_currency_format);
        } else {
        }
      } else {
        console.log(
          '🚀 ~ file: index.js ~ line 124 ~ AsyncStorage.getItem ~ null | undefined',
        );
        setbk([]);
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: index.js ~ line 43 ~ AsyncStorage.getItem ~ error',
        error,
      );
      setbk([]);
    }
  };

  const handleChangeBK = (item) => {
    setselectedBk(item);
    setBkName(item.bank_name);
    setname(item.name);
    actionSheetChange.current?.setModalVisible();
  };

  const renderBK = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleChangeBK(item)}
        style={[
          Style.py_2,
          { borderBottomColor: Colors.blackgrayScale, borderBottomWidth: 0.5 },
        ]}>
        <Text style={[Style.font_14, Style.medium]}>{item.bank_name}</Text>
      </TouchableOpacity>
    );
  };

  const handleChange = async (status, text) => {
    if (status === 'saldo') {
      let res = await Utils.regex('number', text);
      setpayNml(await res);
      let ult = await Utils.money(res);
      setpayNml(await ult);
      console.log(
        '🚀 ~ file: index.js ~ line 136 ~ index ~ owned',
        validationSalad,
      );
      let request = String(ult.replace('.', ''));
      console.log('🚀 ~ file: index.js ~ line 137 ~ index ~ request', request);

      if (Number(validationSalad) < Number(request)) {
        settextAlert('Saldo anda tidak mencukupi!');
        Alert.alert(
          '',
          'Saldo anda tidak mencukupi!',
          [
            {
              text: 'Tutup',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      } else {
        settextAlert('');
      }
    } else {
      settextAlertNote('');
      setcatatan(text);
    }
  };

  const handlePress = () => {
    let credentials = {
      id_toko: id,
      id_toko_bank: idBk,
      nominal: payNml,
      catatan: catatan,
    };
    console.log(
      '🚀 ~ file: index.js ~ line 187 ~ handlePress ~ credentials',
      credentials,
    );
    if (
      payNml.length == 0 ||
      payNml === '' ||
      payNml === 0 ||
      payNml === null ||
      payNml === undefined
    ) {
      settextAlert('Nominal tidak boleh kosong!');
      console.log('kaka');
    } else {
      ServiceAccount.withdrawal(credentials)
        .then((res) => {
          if (res.status.code == 201) {
            navigation.goBack();
          } else if (res.status.code == 400) {
            if (res.status.message == 'insufficient balance') {
              settextAlert('Saldo tidak cukup!');
            } else if (
              res.status.message == 'amount cannot less than minimum'
            ) {
              settextAlert('Minimum penarikan saldo Rp.55.000');
            } else if (
              JSON.stringify(res.status.message).slice(2, 22) ===
              "Notes can't be blank"
            ) {
              settextAlertNote('Catatan tidak boleh kosong');
            } else if (res.status.message == 'pending saldo more than limit') {
              settextAlert('Saldo anda tidak cukup!');
            } else {
              settextAlert('Minimum penarikan saldo Rp. 55s.000!');
            }
          } else if (
            (res.status.code == 404 &&
              res.status.message ===
              'bank is not verified, plse verification') ||
            res.status.message === 'bank is not verified, please verification'
          ) {
            settextAlert('Nomer rekening anda belum diverifikasi!');
          } else {
            settextAlert('Periksa kembali koneksi internet anda!');
          }
        })
        .catch((err) => console.log(err, 'error withdrawal'));
    }
  };

  const handleVerified = () => {
    Alert.alert(
      'Jaja.id',
      'Rekening anda belum di verifikasi!',
      [
        {
          text: 'Verifikasi',
          onPress: () => navigation.navigate('ListBank'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };
  return (
    <SafeAreaView style={[Style.container, { flexDirection: 'column' }]}>
      <Appbar back={true} title="Penarikan Saldo" />
      <ScrollView nestedScrollEnabled={true}>
        <View
          style={[Style.column, { marginBottom: 20, backgroundColor: 'white' }]}>
          <View
            style={[
              Style.row_space,
              { padding: '4%', alignItems: 'flex-start' },
            ]}>
            <Text style={[Style.font_14, Style.semi_bold]}>Saldo</Text>
            <Text style={Style.font_14}>{salad}</Text>
          </View>
          <View
            style={[Style.column, { padding: '4%', alignItems: 'flex-start' }]}>
            <View style={Style.row_between_center}>
              <Text style={[Style.font_14, { flex: 1 }]}>Nominal Penarikan</Text>
              <Text style={[Style.font_10]}></Text>
            </View>
            <View
              style={[
                Style.row_center,
                {
                  paddingHorizontal: '0.5%',
                  borderBottomWidth: 0.2,
                  borderBottomColor: Colors.biruJaja,
                },
              ]}>
              <Text>Rp.</Text>
              <TextInput
                style={{ flex: 1 }}
                placeholder="55.000"
                keyboardType="numeric"
                value={payNml}
                maxLength={String(salad).length}
                onChangeText={(text) => handleChange('saldo', String(text))}
              />
            </View>
            <Text style={[Style.font_12, { color: textAlert === '*Biaya penarikan 5.000' ? Colors.silver : Colors.redNotif }]}>
              {textAlert}
            </Text>
            {console.log(textAlert, '1234')}
            <Text></Text>
            <Text style={Style.font_14}>Catatan</Text>
            <View
              style={[
                Style.column_center,
                {
                  paddingHorizontal: '0.5%',
                  borderBottomWidth: 0.2,
                  borderBottomColor: Colors.biruJaja,
                  width: '100%',
                  alignItems: 'flex-start',
                },
              ]}>
              <TextInput
                style={{ flex: 1, width: '100%' }}
                label="Nominal Penarikan"
                keyboardType="defaukt"
                value={catatan}
                maxLength={200}
                onChangeText={(text) => handleChange('note', String(text))}
              />
            </View>
            <Text style={[Style.font_12, { color: Colors.redNotif }]}>
              {textAlertNote}
            </Text>
          </View>
        </View>
        <View
          style={[Style.column, { marginBottom: 20, backgroundColor: 'white' }]}>
          <View
            style={[
              Style.row_space,
              { padding: '4%', alignItems: 'flex-start' },
            ]}>
            <Text style={[Style.font_14, Style.semi_bold]}>
              Pilih Rekening Tujuan
            </Text>
            {bk.length > 1 ? (
              <Text
                style={styles.textGanti}
                onPress={() => actionSheetChange.current?.setModalVisible()}>
                Ganti
              </Text>
            ) : null}
          </View>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              padding: '2%',
            }}>
            <RadioButton
              value="first"
              status={'checked'}
              color={Colors.biruJaja}
            />
            <View style={{ flex: 0, flexDirection: 'column' }}>
              <Text style={Style.font_13}>{bkName}</Text>
              <Text style={[Style.font_12, Style.light]}>{name}</Text>
              {verified === false ? (
                <TouchableOpacity onPress={handleVerified}>
                  <Text style={styles.textVerified}>Belum di verifikasi</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <View style={{ padding: '4%', alignItems: 'flex-end' }}>
            <Button
              style={{ flex: 1, justifyContent: 'center' }}
              labelStyle={[
                Style.font_11,
                Style.semi_bold,
                { color: Colors.white },
              ]}
              color={Colors.biruJaja}
              mode="contained"
              onPress={() => handlePress()}>
              Tarik
            </Button>
          </View>
        </View>
      </ScrollView>
      <ActionSheet
        extraScroll={19}
        closeOnTouchBackdrop={false}
        containerStyle={Style.actionSheet}
        ref={actionSheetChange}>
        <View style={Style.actionSheetHeader}>
          <Text style={Style.actionSheetTitle}>Pilih Bank</Text>
          <IconButton
            style={{ margin: 0 }}
            icon={require('../../icon/close.png')}
            color={Colors.biruJaja}
            size={18}
            onPress={() => actionSheetChange.current?.setModalVisible()}
          />
        </View>
        <View style={{ height: 200, paddingHorizontal: Wp('2%') }}>
          <ScrollView style={{ flex: 1 }}>
            <FlatList
              data={bk}
              renderItem={renderBK}
              keyExtractor={(item) => item?.id_data}
            />
          </ScrollView>
        </View>
      </ActionSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nominalPenarikan: {
    fontSize: 12,
    fontWeight: '900',
    color: '#454545',
  },
  textGanti: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.biruJaja,
    fontFamily: 'Poppins-Regular',
  },
  textBkName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#454545',
    fontFamily: 'Poppins-Regular',
  },
  textName: {
    fontSize: 12,
    fontWeight: '900',
    color: '#9A9A9A',
    fontFamily: 'Poppins-Regular',
  },
  textVerified: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.redPower,
    fontFamily: 'Poppins-Regular',
  },
  touchKategori: {
    borderBottomColor: '#454545',
    borderBottomWidth: 0.5,
    paddingVertical: Hp('2%'),
  },
});
