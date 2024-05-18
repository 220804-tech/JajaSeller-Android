import React, {
  useState,
  useEffect,
  Fragment,
  createRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Button,
  Switch,
  TextInput as TextPaper,
  IconButton,
} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetStok from 'react-native-actions-sheet';
import ActionSheetHarga from 'react-native-actions-sheet';
import ActionSheetDeskripsi from 'react-native-actions-sheet';
import ActionSheetGambar from 'react-native-actions-sheet';
import ActionSheetDiskon from 'react-native-actions-sheet';
import ActionSheetVariasi from 'react-native-actions-sheet';
import SelectMultiple from 'react-native-select-multiple';
import ActionSheetListVariasi from 'react-native-actions-sheet';
import ActionSheetLayout from 'react-native-actions-sheet';
import ActionSheetSettingVariasi from 'react-native-actions-sheet';
import Variasi from '../variasi';

import AwesomeAlert from 'react-native-awesome-alerts';

import * as Service from '../../../service/Produk';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Warna from '../../../config/Warna';
import style from '../../../styles/style';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector } from 'react-redux';

const actionSheetRef = createRef();
const actionSheetStok = createRef();
const actionSheetHarga = createRef();
const actionSheetDeskripsi = createRef();
const actionSheetGambar = createRef();
const actionSheetDiskon = createRef();
const actionSheetVariasi = createRef();
const actionSheetListVariasi = createRef();
const actionSheetLayout = createRef();
const actionSheetSettingVariasi = createRef();

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function index(props, { route }) {
  const navigation = useNavigation();
  const [showDetail, setShowDetail] = useState(false);
  const [idProduct, setidProduct] = useState(0);
  const [productsApi, setProductApi] = useState([]);
  const [products, setProduct] = useState([]);
  const [itemPressed, setitemPressed] = useState('-1');
  const [variasipress, setvariasipress] = useState(null);
  const [statusVariasi, setstatusVariasi] = useState('Add');

  const [variasiPressed, setvariasiPressed] = useState([]);
  const [namaprodukVariasi, setnamaprodukVariasi] = useState('');

  const [spinner, setspinner] = useState(false);

  const [idVariasi, setidVariasi] = useState('');
  const [variasi, setvariasi] = useState([]);
  const [listvariasi, setlistvariasi] = useState([]);
  const [paramVariasi, setparamVariasi] = useState('Add');

  const [lenghtvariasiAS, setlenghtvariasiAS] = useState('80%');

  const [showvariasi, setshowvariasi] = useState(false);

  const [vrColor, setvrColor] = useState('#9A9A9A');
  const [vrValue, setvrValue] = useState('Pilih Variasi');

  const [kategori, setKategori] = useState([]);
  const [showAlert, setshowAlert] = useState(false);
  const [titleAlert, setTitleAlert] = useState('');
  const [alertHapus, setAlertHapus] = useState(false);
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertHapusDiskon, setalertHapusDiskon] = useState(false);

  const [productOnpress, setproductOnpress] = useState({});

  const [stok, setStok] = useState(0);
  const [harga, setHarga] = useState(0);
  const [id_toko, setid_toko] = useState(0);

  const [valVariasi, setvalVariasi] = useState(null);
  const [valVariasiAdd, setvalVariasiAdd] = useState(null);

  const [aturDiskon, setaturDiskon] = useState(0);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [gambarUtama, setGambarUtama] = useState(null);
  const [gambarBelakang, setGambarBelakang] = useState(null);
  const [gambarAtas, setGambarAtas] = useState(null);
  const [gambarBawah, setGambarBawah] = useState(null);
  const [gambarLainnaya, setGambarLainnya] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [selectectedItems, setselectectedItems] = useState([]);
  const [isShownPicker, setisShownPicker] = useState(false);

  const [selectedDate, setselectedDate] = useState('start');
  const [visible, setVisible] = useState(false);

  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setloading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const menuRef = createRef();

  const reduxUser = useSelector(state => state.user)

  const onSelectionsChange = (selected) => {
    setselectectedItems(selected);
  };
  const renderLabel = (label, style) => {
    return (
      <TouchableOpacity
        onPress={() => alert('ahah')}
        style={styles.touchKategori}>
        <Text style={styles.textKategori}>{label}</Text>
      </TouchableOpacity>
    );
  };
  const renderListvariasi = ({ item }) => {
    let variasiName = '';
    if (item.warna !== null) {
      variasiName = item.warna;
    } else if (item.ukuran !== null) {
      variasiName = item.ukuran;
    } else if (item.model !== null) {
      variasiName = item.model;
    } else {
      variasiName = 'Default';
    }

    return (
      <View style={styles.listvariasi}>
        <Text style={[styles.textListVariasi, { flex: 2 }]} numberOfLines={2}>
          {variasiName}
        </Text>
        <View style={{ flex: 3, flexDirection: 'column' }}>
          {item.nominal_diskon === '0' || item.nominal_diskon == null ? (
            <Text style={styles.textHarga}>Rp. {item?.harga_normal}</Text>
          ) : (
            <>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.textHargaBeforeVariasi}>
                  Rp. {item?.harga_normal}
                </Text>
                <Text style={styles.textDiskon}>{item.presentase_diskon}%</Text>
              </View>
              <Text style={styles.textHargaAfterVariasi}>
                Rp. {item.harga_variasi}
              </Text>
            </>
          )}
        </View>
        <Text style={[styles.textListVariasi, { flex: 1 }]} numberOfLines={2}>
          {item.stok}
        </Text>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <IconButton
            style={{ margin: 0 }}
            icon={require('../../../icon/settings.png')}
            color={Warna.biruJaja}
            size={22}
            onPress={() => {
              handleSettingVariasi(item);
              setTimeout(
                () => actionSheetLayout.current?.setModalVisible(true),
                100,
              );
            }}
          />
        </View>
      </View>
    );
  };
  const toggleSwitch = (e) => {
    typeSelected(idProduct);
    setIsEnabled((previousState) => !previousState);
    setAlertStatus(true);
  };
  const handleStokPlus = () => {
    setStok(stok + 1);
  };
  const handleStokMinus = () => {
    setStok(stok - 1);
  };
  const handleActionSheet = (e) => {
    setTitleAlert(e + productOnpress.nama_produk);
    actionSheetRef.current?.setModalVisible(false);
    if (e === 'stok ') {
      setTimeout(() => {
        actionSheetStok.current?.setModalVisible(true);
      }, 600);
    } else if (e === 'harga ') {
      setTimeout(() => {
        actionSheetHarga.current?.setModalVisible(true);
      }, 600);
    } else if (e === 'deskripsi ') {
      setTimeout(() => {
        actionSheetDeskripsi.current?.setModalVisible(true);
      }, 600);
    } else if (e === 'gambar ') {
      setTimeout(() => {
        actionSheetGambar.current?.setModalVisible(true);
      }, 600);
    } else if (e === 'listvariasi') {
      setTimeout(() => {
        actionSheetListVariasi.current?.setModalVisible(true);
        console.log('handleActionSheet -> variasi.length', variasi.length);
        console.log('handleActionSheet -> variasi', variasi);
      }, 600);
    } else if (e === 'diskon') {
      setTimeout(() => {
        console.log('handleActionSheet -> variasi.length', variasi.length);
        console.log('handleActionSheet -> variasi', variasi);
        actionSheetDiskon.current?.setModalVisible(true);
      }, 600);
    }
  };
  const handleAlert = (e) => {
    if (e === 'hapus') {
      actionSheetRef.current?.setModalVisible(false);
      setTimeout(() => {
        setAlertHapus(!alertHapus);
      }, 1000);
    } else if (e === 'deskripsi') {
      actionSheetDeskripsi.current?.setModalVisible(false);
      setTimeout(() => {
        setshowAlert(!showAlert);
      }, 700);
      setTimeout(() => {
        setshowAlert(false);
      }, 2800);
    } else {
      actionSheetStok.current?.setModalVisible(false);
      actionSheetHarga.current?.setModalVisible(false);
      setTimeout(() => {
        setshowAlert(!showAlert);
      }, 700);
      setTimeout(() => {
        setshowAlert(false);
      }, 2800);
    }
  };
  const handleHapusProduk = () => {
    // disini nanti ada service untuk delete produk
    setAlertHapus(false);
  };
  const handleStatusProduk = async () => {
    setAlertStatus(false);
    setspinner(true);
    actionSheetRef.current?.setModalVisible(false);
    setTimeout(async () => {
      Service.updateStatusProduct(idProduct, 2)
        .then((res) => {
          console.log('handleStatusProduk -> res', res);
          console.log('handleStatusProduk -> res', res.status);
          if (res.status === 200) {
            console.log('handleStatusProduk -> res', res.status);
            getProductApi();
            setTimeout(() => {
              setspinner(false);
            }, 1000);
          } else {
            console.log('handleStatusProduk -> res else', res.status);
          }
        })
        .catch((error) => console.log('handleStatusProduk -> error', error));
      setIsEnabled(true);
    }, 1000);
  };

  const handleFilter = (text) => {
    const beforeFilter = products;
    console.log('handleFilterPlus -> searchValue', text);
    const afterFilter = beforeFilter.filter(
      (product) =>
        product.nama_produk.toLowerCase().indexOf(text.toLowerCase()) > -1,
    );
    setProductApi(afterFilter);
  };

  const getProductApi = () => {
    console.log('getProductApi -> getProductApi');
    AsyncStorage.getItem('xxTwo').then((res) => {
      Service.getApiProduk(JSON.parse(res).id_toko)
        .then((res) => {
          if (res.status === 200) {
            setProduct(res.product);
            setProductApi(res.product);
          } else {
            console.log('getProductApi -> res status', res.status);
            setProduct([]);
            setTimeout(() => setProduct(productsApi), 200);
          }
        })
        .catch((e) => {
          console.log('getProductApi -> eror', e);
        });
    });
  };

  const handleOptions = async (item) => {
    // console.log("handleOptions", item.harga)
    setaturDiskon('');
    setStartDate('');
    setEndDate('');
    setshowAlert(false);
    actionSheetRef.current?.setModalVisible();
    let obj = await item.variasi[0];
    console.log('obj', obj);
    let arr = await item.variasi;
    setvalVariasiAdd(obj);
    setHarga(item.harga);
    setproductOnpress(item);
    setidProduct(item.id_produk);
    setidVariasi(obj.id_variasi);
    setnamaprodukVariasi(item.nama_produk);
    // console.log("item.variasi.lenght", item.variasi.lenght)
    setlistvariasi(item.variasi);
    console.log('arr', arr.length);
    console.log('arr', arr);
    let data = [];
    if (arr.lenght > 1) {
      await arr.map((ar) => {
        if (ar.warna === null) {
          data.push({ label: ar.ukuran, value: ar.id_variasi });
        } else {
          data.push({ label: ar.warna, value: ar.id_variasi });
        }
      });
      setvariasi(data);
    } else {
      setvariasi(arr);
    }
  };

  const getProductLocal = () => {
    try {
      console.log('getProductLocal -> getProductLocal');
      AsyncStorage.getItem('products').then((res) => {
        setProduct(JSON.parse(res));
        setProductApi(JSON.parse(res));
      });
    } catch (error) {
      console.log('getProductLocal -> error', error);
      getProductApi();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (reduxUser && Object.keys(reduxUser).length && reduxFetchProducts) {
        getProductLocal()
      }
    }, []),
  );

  useEffect(() => {
    try {
      if (reduxUser && Object.keys(reduxUser).length) {

        if (route.params.item) {
          getProductLocal();
        }
        setAlertHapus(false);
        setshowAlert(false);
        setalertHapusDiskon(false);
        setTitleAlert('');
        if (props.search) {
          handleFilter(props.search);
        }
        else {
          getProductLocal();
        }
        // try {
      }
    } catch (error) {
      console.log("index -> error", error)

    }
    // if (route.params.reload) {

    // let params = route.params.reload;
    // console.log("index -> route.params.reload", params)
    // getProductLocal();
    // }
    // } catch (error) {
    // console.log("index ->route.params.reload error", error)

    // }
    // console.log('property changed', props.search);
  }, [props.search, props.handleFilter]);

  const renderItem = ({ item }) => {
    // console.log("renderItem -> item", item.foto)
    return (
      <TouchableOpacity
        onLongPress={() => {
          // setshowAlert(false);
          actionSheetRef.current?.setModalVisible();
          setproductOnpress(item);
        }}>
        <Card
          key={item.id}
          style={[
            styles.card,
            {
              backgroundColor:
                itemPressed === item.id_produk ? '#9A9A9A' : 'white',
            },
          ]}>
          {/* <Card.Title title={product.title} subtitle={`stok : ${product.stok}`} left={LeftContent} /> */}
          <View style={styles.cardItem}>
            <Card.Cover
              style={styles.cardImage}
              source={{ uri: item.foto && item.foto[0] && item.foto[0].url_foto }}
            />
            <View style={styles.cardText}>
              <View style={styles.cardParentTitle}>
                <Text style={styles.cardTitle}>{item.nama_produk}</Text>
                <Text style={styles.cardKondisi}>{item.kondisi}</Text>
              </View>
              <Text style={styles.cardHarga}>Rp. {item.harga}</Text>
              <Text style={styles.cardStok}>Stok: {item.jumlah_stok_in}</Text>
            </View>
            <Card.Actions style={styles.cardOption}>
              <IconButton
                style={{ margin: 0 }}
                icon={require('../../../icon/options.png')}
                color={Warna.black}
                size={27}
                onPress={() => handleOptions(item)}
              />
            </Card.Actions>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };
  const handleEditProduk = () => {
    productOnpress;
    navigation.navigate('ProdukEdit', {
      item: productOnpress,
    });
    console.log(productOnpress, 'lemparrrrr');
  };
  const showDatePicker = (text) => {
    if (text === 'end') {
      setselectedDate('end');
    } else {
      setselectedDate('start');
    }
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    let str = JSON.stringify(date);
    let res = str.slice(1, 11);
    if (selectedDate === 'start') {
      setStartDate(res);
    } else {
      setEndDate(res);
    }
    hideDatePicker();
  };

  const handleDelete = () => {
    console.log('handleDelete -> id_produk', idProduct);
    if (idProduct !== 0) {
      Alert.alert(
        'Hapus!',
        'Anda ingin menghapus produk ini?',
        [
          {
            text: 'BATAL',
            onPress: () => setitemPressed(''),
            style: 'cancel',
          },
          {
            text: 'YA',
            onPress: () => {
              console.log('masuk yax');
              Service.deleteProduct(idProduct)
                .then((res) => {
                  console.log('handleDelete -> res', res);
                  console.log('handleDelete -> res.status ', res.status);
                  if (res.status == 200) {
                    getProductApi();
                    setspinner(true);
                    setTimeout(() => {
                      setspinner(false);
                    }, 1000);
                  }
                })
                .catch((err) => console.log('handleDelete -> err', err));
              actionSheetRef.current?.setModalVisible(false);
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  const typeSelected = (value) => {
    setitemPressed(value);
  };
  const handlePressDiskon = async () => {
    setspinner(true);

    let credentials = {
      presentase_diskon: aturDiskon,
      tgl_mulai_diskon: startDate,
      tgl_berakhir_diskon: endDate,
    };

    console.log('handlePressDiskon -> credentials : ', credentials);
    console.log(
      '===============================================================================',
    );
    console.log(
      'handlePressDiskon -> selectectedItems : ',
      selectectedItems.lenght,
    );
    console.log(
      '===============================================================================',
    );
    console.log('handlePressDiskon -> variasi length', variasi.length);
    console.log(
      '===============================================================================',
    );

    if (selectectedItems.length > 1) {
      console.log('handlePressDiskon masuk IF');
      for (let index = 0; index < variasi.length; index++) {
        try {
          let response = await Service.aturDiskon(credentials, idVariasi);
          console.log('handlePressDiskon -> response', response.data);
          console.log('handlePressDiskon -> response', response.data.statu);
          if (response.status === 200) {
            setTimeout(() => setspinner(false), 1000);
          }
        } catch (error) {
          console.log('handlePressDiskon -> error', error);
        }
      }
    } else {
      console.log('handlePressDiskon ->  idVariasi', idVariasi);

      console.log('handlePressDiskon -> else');
      try {
        let response = await Service.aturDiskon(credentials, idVariasi);
        getProductById();
        actionSheetDiskon.current?.setModalVisible(false);
        console.log('handlePressDiskon -> response', response.data);
        console.log('handlePressDiskon -> response', response.data.status);

        setTimeout(() => setspinner(false), 1000);
      } catch (error) {
        console.log('handlePressDiskon -> error', error);
      }
    }
  };
  const handleDeleteDiskon = async () => {
    setspinner(true);
    setalertHapusDiskon(false);
    try {
      let resDeleteDiskon = await Service.deleteDiskon(idVariasi);
      console.log('handleDeleteDiskon => res : ', resDeleteDiskon.data);
      if (resDeleteDiskon.data.status == 200) {
        setaturDiskon('');
        setStartDate('');
        setEndDate('');
        actionSheetLayout.current?.setModalVisible(false);
        getProductById();
        setTimeout(() => setspinner(false), 500);
      }
      console.log('resDeleteDiskon.data.status', resDeleteDiskon.data.status);
    } catch (error) {
      console.log('handleDeleteDiskon => error : ', error);
    }
  };
  const getProductById = async () => {
    try {
      let listVariasi = await Service.getProductById(idProduct);
      setnamaprodukVariasi(listVariasi.product.nama_produk);
      setlistvariasi(await listVariasi.product.variasi);
      // let obj = await listVariasi.product.variasi[0]
      // setidVariasi(obj.id_variasi)
      let data = [];
      let arr = await listVariasi.product.variasi;
      // console.log("index -> listVariasi.product.variasi", listVariasi.product.variasi.id_variasi)
      if (arr.length > 1) {
        arr.map((ar) => {
          if (ar.warna === null) {
            data.push({ label: ar.ukuran, value: ar.id_variasi });
          } else {
            data.push({ label: ar.warna, value: ar.id_variasi });
          }
        });
        setvariasi(data);
      } else {
        setvariasi(arr);
      }
    } catch (error) {
      console.log('index -> error', error);
    }
    console.log('listvariasi', listvariasi);
  };
  const handleSettingVariasi = (item) => {
    console.log('handleSettingVariasi -> item', item);
    setparamVariasi('Edit');
    setvalVariasi(item);
    setidVariasi(item.id_variasi);
    // console.log("handleEditDiskon -> variasipress", item.id_variasi)
    // console.log("handleSettingVariasi -> item", item.presentase_diskon)
    if (listvariasi.length > 1) setshowvariasi(true);
    if (listvariasi.length <= 1) setshowvariasi(false);
    console.log('handleSettingVariasi -> listvariasi', listvariasi.length);
  };
  const handleEditVariasi = () => {
    console.log('handleEditVariasi -> valVariasiAdd', valVariasiAdd);
    console.log('handleEditVariasi -> valVariasi', valVariasi);
    actionSheetLayout.current?.setModalVisible();
    setTimeout(() => actionSheetSettingVariasi.current?.setModalVisible(), 250);
    setstatusVariasi('Edit');
  };
  const handleSaveVariasi = (params) => {
    if (params == true) setspinner(true);
    else if (params == false) setTimeout(() => setspinner(false), 200);
    else if (params == '201') {
      actionSheetSettingVariasi.current?.setModalVisible();
      getProductById();
      setTimeout(() => setspinner(false), 500);
    }
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getProductApi();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <Fragment>
      <Spinner
        visible={spinner}
        color={Warna.white}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      {productsApi.length === 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ alignSelf: 'center', marginTop: hp('2%') }}>
          <Text>Tidak ada produk</Text>
        </ScrollView>
      ) : (
        <FlatList
          data={productsApi}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_produk}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <ActionSheet containerStyle={styles.actionSheet} ref={actionSheetRef}>
        <View style={styles.headerModal}>
          <Text style={styles.informasiProduk}>Informasi Produk</Text>
          <IconButton
            style={{ margin: 0 }}
            icon={require('../../../icon/close.png')}
            color={Warna.blackLight}
            size={18}
            onPress={() => actionSheetRef.current?.setModalVisible(false)}
          />
          {/* <TouchableOpacity
              onPress={() => actionSheetRef.current?.setModalVisible(false)}>
              <Image
                style={styles.iconClose}
                source={require('../../../icon/close.png')}
              />
            </TouchableOpacity> */}
        </View>
        <View style={styles.modalLine}>
          <Image
            style={styles.iconModal}
            source={require('../../../icon/power-button.png')}
          />
          {/* <Text style={styles.textLine}>Status produk</Text> */}
          <Text style={styles.textLine}>Status produk</Text>

          <View style={styles.abc}>
            <Text style={styles.textLine}>
              {isEnabled ? 'Aktif' : 'Tidak Aktif'}
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        {/* <TouchableOpacity style={styles.modalLine} onPress={() => handleActionSheet('diskon')}>
                <Image style={styles.iconModal} source={require('../../../icon/percentage.png')}/>
                <Text style={styles.textLine}>Atur Diskon</Text>
              </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.modalLine}
          onPress={() => handleActionSheet('listvariasi')}>
          <Image
            style={styles.iconModal}
            source={require('../../../icon/notepad.png')}
          />
          <Text style={styles.textLine}>Detail Produk</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
            style={styles.modalLine}
            onPress={() => alert("Pending")}>
            <Image
              style={styles.iconModal}
              source={require('../../../icon/stock.png')}
            />
            <Text style={styles.textLine}>Stok tersisa</Text>
  
          </TouchableOpacity> */}
        {/* <TouchableOpacity
            style={styles.modalLine}
            onPress={() => handleActionSheet('harga ')}>
            <Image
              style={styles.iconModal}
              source={require('../../../icon/rupiah.png')}
            />
            <Text style={styles.textLine}>Rp</Text>
  
            <Text style={styles.textLine}>Harga</Text>
  
          </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.modalLine}
          onPress={() => handleEditProduk()}>
          <Image
            style={styles.iconModal}
            source={require('../../../icon/settings.png')}
          />
          <Text style={styles.textLine}>Edit </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalLine}
          onPress={() => handleDelete() & typeSelected(idProduct)}>
          {/* onPress={() => alert("pending")}> */}
          <Image
            style={styles.iconModal}
            source={require('../../../icon/delete.png')}
          />
          {/* <Text style={styles.textLine}>Rp</Text> */}
          {/* <Text style={[styles.textLine, { color: '#c0c0c0' }]}>Hapus <Text style={{ fontFamily: 'Poppins-Italic' }}>(Coming Soon)</Text></Text> */}
          <Text style={styles.textLine}>Hapus</Text>
        </TouchableOpacity>
      </ActionSheet>

      <ActionSheetDeskripsi
        footerHeight={11}
        containerStyle={styles.actionSheet}
        ref={actionSheetDeskripsi}>
        <View style={styles.headerModal}>
          <Text style={styles.titleDeskripsi}>Ubah Deskripsi Produk</Text>
          <TouchableOpacity
            onPress={() =>
              actionSheetDeskripsi.current?.setModalVisible(false)
            }>
            <Image
              style={styles.iconClose}
              source={require('../../../icon/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.modalColumn}>
          <Text style={styles.noteDeskripsi}>
            Note : masukkan deskripsi sesuai dengan produk anda, gunakan kata
            yang sopan dan jelas agar dapat menarik perhatian pengunjung
          </Text>
          <TextInput
            numberOfLines={17}
            style={styles.textArea}
            keyboardType="default"
            multiline={true}
            mode="outlined"
            onChangeText={(text) => console.log(text, 'text area')}
          />
        </View>
        <Button
          style={styles.buttonModal}
          mode="contained"
          onPress={() => handleAlert('deskripsi')}>
          Simpan
        </Button>
      </ActionSheetDeskripsi>
      <ActionSheetDiskon
        footerHeight={11}
        containerStyle={style.actionSheet}
        ref={actionSheetDiskon}>
        <View style={styles.headerModal}>
          <Text style={styles.informasiProduk}>Atur Diskon</Text>
          <TouchableOpacity
            onPress={() => actionSheetDiskon.current?.setModalVisible()}>
            <Image
              style={styles.iconClose}
              source={require('../../../icon/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={[style.column]}>
          <Text style={styles.textLabel}>
            Persentase Diskon % <Text style={styles.red}>*</Text>
          </Text>
          <View style={styles.flex0}>
            <TextPaper
              // disabled={true}asasa
              // label="Nominal persentasi diskon"
              maxLength={2}
              keyboardType="numeric"
              value={aturDiskon}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                borderBottomWidth: 0,
                borderBottomColor: 'white',
              }}
              onChangeText={(text) => setaturDiskon(text)}
              theme={{
                colors: {
                  primary: Warna.biruJaja,
                },
              }}
            />
            <Image
              style={styles.iconCalendar}
              source={require('../../../icon/percentage.png')}
            />
          </View>

          <Text style={styles.textLabel}>
            Tanggal Mulai Diskon <Text style={styles.red}>*</Text>
          </Text>
          <View style={styles.flex0border}>
            <TouchableOpacity onPress={() => showDatePicker('start')}>
              <TextPaper
                onPress={() => showDatePicker('start')}
                disabled={true}
                onFocus={() => showDatePicker('start')}
                // label="Tanggal Mulai Diskon"
                style={{ flex: 1, backgroundColor: 'transparent' }}
                value={startDate}
                onChangeText={() => showDatePicker('start')}
              />
            </TouchableOpacity>
            <TouchableNativeFeedback onPress={() => showDatePicker('start')}>
              <Image
                style={styles.iconCalendar}
                source={require('../../../icon/calendar.png')}
              />
            </TouchableNativeFeedback>
          </View>

          <Text style={styles.textLabel}>
            Tanggal Berakhir Diskon <Text style={styles.red}>*</Text>
          </Text>
          <View style={styles.flex0border}>
            <TouchableOpacity onPress={() => showDatePicker('end')}>
              <TextPaper
                disabled={true}
                onFocus={() => showDatePicker('end')}
                // label="Tanggal Berakhir Diskon"
                style={{ flex: 1, backgroundColor: 'transparent' }}
                value={endDate}
                onChangeText={() => showDatePicker('end')}
              />
            </TouchableOpacity>

            <TouchableNativeFeedback onPress={() => showDatePicker('end')}>
              <Image
                style={styles.iconCalendar}
                source={require('../../../icon/calendar.png')}
              />
            </TouchableNativeFeedback>
          </View>
        </View>
        <Button
          style={styles.buttonModal}
          mode="contained"
          onPress={() => handlePressDiskon()}>
          Simpan
        </Button>
      </ActionSheetDiskon>
      <ActionSheetVariasi
        scrollEnabled={true}
        extraScroll={100}
        containerStyle={styles.actionSheet}
        footerHeight={0}
        ref={actionSheetVariasi}>
        <View style={styles.headerModal}>
          <Text style={styles.headerTitle}>Pilih Variasi</Text>
          <TouchableOpacity
            onPress={() => actionSheetVariasi.current?.setModalVisible(false)}>
            <Image
              style={styles.iconClose}
              source={require('../../../icon/close.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 200, paddingHorizontal: wp('2%') }}>
          <SelectMultiple
            items={variasi}
            renderLabel={renderLabel}
            selectedItems={selectectedItems}
            onSelectionsChange={onSelectionsChange}
          />
        </View>
      </ActionSheetVariasi>
      <ActionSheetListVariasi
        containerStyle={[styles.actionSheet, { height: hp('100%') }]}
        footerHeight={20}
        ref={actionSheetListVariasi}>
        <View style={styles.headerModal}>
          <Text style={styles.headerTitle}>Variasi Produk</Text>

          {/* <IconButton
              style={{ margin: 0 }}
              icon={require('../../../icon/plus.png')}
              color={Warna.biruJaja}
              size={19}
              onPress={() => console.log("Tambah Variasi")}
            /> */}
          <IconButton
            style={{ margin: 0, marginLeft: 10 }}
            icon={require('../../../icon/close.png')}
            color={Warna.blackLight}
            size={18}
            onPress={() =>
              actionSheetListVariasi.current?.setModalVisible(false)
            }
          />
        </View>

        <View
          style={{ flex: 9, paddingHorizontal: wp('2%'), marginBottom: '2%' }}>
          <View style={{ height: '100%' }}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 0 }}
              nestedScrollEnabled={false}
              scrollEnabled={true}>
              <View style={styles.listvariasi}>
                <Text style={[styles.textListVariasi, { flex: 2 }]}>Variasi</Text>
                <Text style={[styles.textListVariasi, { flex: 3 }]}>Harga</Text>
                <Text style={[styles.textListVariasi, { flex: 1 }]}>Stok</Text>

                {/* <Text style={styles.textListVariasi}>Diskon</Text> */}
                <Text style={[styles.textListVariasi, { flex: 1 }]}>Opsi</Text>
              </View>

              <FlatList
                contentContainerStyle={{ height: 100 }}
                // nestedScrollEnable={true}
                data={listvariasi}
                renderItem={renderListvariasi}
                keyExtractor={(item) => item.id_variasi}
              />
            </ScrollView>
          </View>
        </View>
        <View
          style={{
            height: hp('5%'),
            paddingHorizontal: wp('2%'),
            marginBottom: '2%',
          }}>
          <Button
            contentStyle={{ height: hp('5%') }}
            color={Warna.biruJaja}
            labelStyle={{ color: Warna.white }}
            mode="contained"
            onPress={() => {
              setvalVariasi(valVariasiAdd);
              setstatusVariasi('Add');
              setTimeout(
                () => actionSheetSettingVariasi.current?.setModalVisible(),
                250,
              );
            }}>
            Tambah Variasi
          </Button>
        </View>
      </ActionSheetListVariasi>
      {/* actionSheetSettingVariasi */}
      <ActionSheetLayout
        footerHeight={11}
        containerStyle={style.actionSheet}
        ref={actionSheetLayout}>
        <View style={style.actionSheetHeader}>
          <Text style={style.actionSheetTitle}>Variasi Produk</Text>
          <TouchableOpacity
            onPress={() => actionSheetLayout.current?.setModalVisible(false)}>
            <Image
              style={style.actionSheetClose}
              source={require('../../../icon/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={style.column_center_start}>
          <TouchableOpacity
            onPress={() => handleEditVariasi()}
            style={style.appBarRow}>
            <Text>Ubah Variasi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              actionSheetLayout.current?.setModalVisible(false) &
              setTimeout(
                () => actionSheetDiskon.current?.setModalVisible(true),
                100,
              )
            }
            style={style.appBarRow}>
            <Text>Atur Diskon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setalertHapusDiskon(true)}
            style={style.appBarRow}>
            <Text>Hapus Diskon</Text>
          </TouchableOpacity>
        </View>
      </ActionSheetLayout>
      <ActionSheetSettingVariasi
        footerHeight={11}
        containerStyle={styles.actionSheet}
        ref={actionSheetSettingVariasi}>
        <View style={styles.headerModal}>
          <Text style={styles.informasiProduk}>Variasi</Text>
          <TouchableOpacity
            onPress={() =>
              actionSheetSettingVariasi.current?.setModalVisible()
            }>
            <Image
              style={styles.iconClose}
              source={require('../../../icon/close.png')}
            />
          </TouchableOpacity>
        </View>

        <Variasi
          status={paramVariasi}
          handleSaveVariasi={(params) => handleSaveVariasi(params)}
          valVariasi={statusVariasi == 'Edit' ? valVariasi : valVariasiAdd}
          status={statusVariasi}
          idProduct={idProduct}
        />
      </ActionSheetSettingVariasi>
      {/* actionSheetSettingVariasi */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        onConfirm={(text) => handleConfirm(text)}
        onCancel={() => hideDatePicker()}
      />
      <AwesomeAlert
        show={showAlert}
        message={`Perubahan pada ${titleAlert} anda berhasil disimpan!`}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
      />

      <AwesomeAlert
        alertContainerStyle={styles.alertContainerStyle}
        overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
        show={alertHapus}
        showProgress={false}
        title="PERINGATAN!"
        message="Anda yakin ingin menghapus produk ini?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => setAlertHapus(false)}
        onConfirmPressed={() => handleHapusProduk()}
      />
      <AwesomeAlert
        alertContainerStyle={styles.alertContainerStyle}
        overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
        show={alertStatus}
        showProgress={false}
        title="Hallo seller"
        message="Anda ingin menonaktifkan produk?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Tidak"
        confirmText="Nonaktifkan"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setAlertStatus(false);
          setIsEnabled(true);
          setitemPressed('-1');
        }}
        onConfirmPressed={() => handleStatusProduk()}
      />
      <AwesomeAlert
        alertContainerStyle={styles.alertContainerStyle}
        overlayStyle={{ backgroundColor: 'white', opacity: 0 }}
        show={alertHapusDiskon}
        showProgress={false}
        title="PERINGATAN!"
        message="Diskon akan dihapus dan kembali ke harga normal!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Batal"
        confirmText="Hapus"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => setalertHapusDiskon(false)}
        onConfirmPressed={() => handleDeleteDiskon()}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: Warna.white,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
  },
  card: {
    marginBottom: '2%',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    position: 'relative',
  },
  cardItem: {
    flex: 1,
    flexDirection: 'row',
    padding: '4%',
  },
  cardImage: {
    height: hp('7.5%'),
    width: wp('16%'),
    borderRadius: 10,
  },
  cardText: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: '3%',
  },
  cardParentTitle: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: '0%',
  },
  cardKondisi: {
    fontSize: 8,
    marginLeft: '1%',
    fontFamily: 'Poppins-Italic',
  },
  cardHarga: {
    fontSize: 10,
    fontWeight: '100',
  },
  cardStok: {
    color: 'grey',
    fontSize: 10,
    fontWeight: '100',
    alignSelf: 'baseline',
  },
  cardOption: {
    paddingHorizontal: wp('2%'),
    // width: wp('22%'),
    // height: hp('22%')
  },
  cardIcon: {
    // color: 'white'
    width: wp('3.5%'),
    height: hp('3.5%'),
  },
  actionSheet: {
    paddingHorizontal: wp('4%'),
    flex: 1,
  },

  headerModal: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center',
  },
  informasiProduk: {
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
    color: Warna.biruJaja,
    marginVertical: hp('3%'),
  },
  x: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  modalLine: {
    borderBottomWidth: 0.2,
    borderBottomColor: Warna.biruJaja,
    flex: 1,
    flexDirection: 'row',
    paddingVertical: hp('1.5%'),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  flex0: {
    flex: 0,
    marginBottom: hp('2%'),
    // paddingVertical: hp('1.5%'),
  },
  flex0border: {
    borderBottomColor: '#9A9A9A',
    borderBottomWidth: 0.2,
    flex: 0,
    marginBottom: hp('2%'),
    // paddingVertical: hp('1.5%'),
  },

  iconCalendar: {
    position: 'absolute',
    tintColor: Warna.biruJaja,
    width: 25,
    height: 25,
    right: 10,
    bottom: 15,
  },
  modalColumn: {
    // // flex : 1,
    // flexDirection: "column",
    // paddingVertical: hp('1.5%'),
    // alignItems: "center",
    // justifyContent: "flex-start",
    // borderBottomColor: Warna.biruJaja, borderBottomWidth: 0.7, flex: 2
    flexDirection: 'column',
    borderBottomColor: Warna.biruJaja,
    flex: 2,
  },
  iconModal: {
    width: 23,
    height: 23,
    tintColor: Warna.biruJaja,
    marginRight: wp('5%'),
  },
  iconAturDiskon: {
    width: 21,
    height: 21,
    tintColor: Warna.biruJaja,
    marginLeft: wp('5%'),
  },
  iconClose: {
    width: 14,
    height: 14,
    tintColor: 'grey',
  },

  textLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#454545',
  },
  red: { color: 'red' },
  textLine: {
    color: 'grey',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    textAlignVertical: 'center',
  },
  textInputLine: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: wp('1%'),
  },

  lineHarga: {
    flex: 1,
    flexDirection: 'row',
  },
  textInputLineHarga: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Warna.biruJaja,
    borderBottomWidth: 0.7,
    flex: 2,
  },
  textInputDeskripsi: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Warna.biruJaja,
    borderBottomWidth: 0.7,
    flex: 2,
  },
  textInputStok: {
    borderBottomColor: Warna.biruJaja,
    overflow: 'hidden',
    borderBottomWidth: 0.7,
    width: wp('15%'),
    paddingVertical: '0.3%',
    marginHorizontal: wp('2%'),
    textAlign: 'center',
  },
  rupiah: {
    color: 'grey',
    width: wp('7%'),
  },
  textInputHarga: {
    paddingVertical: '0.3%',
    textAlign: 'left',
    width: wp('47%'),
  },
  rupiah00: {
    color: 'grey',
    justifyContent: 'flex-end',
    width: wp('7%'),
  },
  persentage: {
    position: 'absolute',
    right: 0,
    color: '#454545',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    justifyContent: 'flex-end',
    width: wp('8%'),
  },
  iconPlusMinus: {
    width: 15,
    height: 15,
    tintColor: Warna.biruJaja,
  },
  buttonModal: {
    backgroundColor: Warna.biruJaja,
    marginTop: hp('3%'),
    marginBottom: hp('1%'),

    // width: wp('100%')
  },
  titleDeskripsi: {
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
    color: Warna.biruJaja,
    marginTop: hp('3%'),
    marginBottom: hp('0.5%'),
  },
  noteDeskripsi: {
    fontSize: 11,
    fontWeight: '500',
    color: 'grey',
    marginBottom: hp('1%'),
  },
  textArea: {
    maxHeight: 200,
    marginBottom: 10,
    borderColor: 'grey',
    borderWidth: 0.5,
    width: wp('92%'),
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
    width: wp('92%'),
    paddingVertical: hp('2%'),
    // justifyContent: "flex-start",
    alignContent: 'space-between',
    justifyContent: 'space-between',
  },

  gambarProduk: {
    width: wp('15%'),
    height: hp('7%'),
    // marginHorizontal: wp('2%'),
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
    // width: wp('90%'),
    // alignSelf: "center",
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonPicture: {
    width: wp('44%'),
    backgroundColor: Warna.white,
    alignSelf: 'center',
    marginBottom: hp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 0.2,
    // borderColor: 'grey',
    padding: '3%',
    elevation: 3,
  },
  buttonItem: {
    color: Warna.biruJaja,
  },
  abc: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewText: {
    // flex:,
    // width: wp('85%'),
    height: hp('7%'),
    borderBottomWidth: 0.2,
    borderBottomColor: '#9A9A9A',
    flexDirection: 'row',
    // alignSelf: 'center',
    alignItems: 'center',
    // backgroundColor:"#c0c0c0",
    justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'left',
    alignItems: 'flex-end',
  },
  iconText: { tintColor: '#9a9a9a', width: 15, height: 15, alignSelf: 'center' },

  actionSheet: { paddingHorizontal: wp('2%') },
  headerModal: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
    color: Warna.biruJaja, marginVertical: hp('3%'),
  },
  iconClose: { width: 14, height: 14, tintColor: 'grey' },
  touchKategori: {
    paddingVertical: hp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('2%'),
  },
  textKategori: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#454545' },
  headerlistvariasi: {
    flex: 1,
    paddingHorizontal: hp('2%'),
    paddingVertical: hp('1.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('0%'),
    borderBottomColor: '#9A9A9A',
    borderBottomWidth: 0.2,
    alignItems: 'center',
    backgroundColor: '#454545',
  },

  listvariasi: {
    flex: 1,
    paddingVertical: hp('1%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('0%'),
    borderBottomColor: '#9A9A9A',
    borderBottomWidth: 0.2,
    alignItems: 'center',
  },
  textListVariasi: {
    flex: 1,
    fontSize: 13,
    color: '#000000',
    fontWeight: '900',
    justifyContent: 'flex-end',
  },
  textHargaBeforeVariasi: {
    flex: 0,
    fontSize: 11,
    color: '#000000',
    fontWeight: '900',
    justifyContent: 'flex-end',
    paddingHorizontal: wp('2%'),
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  textHargaAfterVariasi: {
    flex: 0,
    fontSize: 14,
    color: '#000000',
    fontWeight: '900',
    justifyContent: 'flex-end',
    paddingHorizontal: wp('2%'),
  },
  textDiskon: {
    fontSize: 10,
    marginLeft: 10,
    color: '#FFF',
    backgroundColor: Warna.biruJaja,
    borderRadius: 13,
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3W%'),
    justifyContent: 'flex-end',
  },
  textHarga: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '900',
    justifyContent: 'flex-end',
    paddingHorizontal: wp('2%'),
  },
});
