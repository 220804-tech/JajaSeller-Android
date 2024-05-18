import React, { useState, useEffect } from 'react';
import {
  Pressable,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button
} from 'react-native';
import Warna from '../../../config/Warna';
import ImagePicker from 'react-native-image-crop-picker';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function ProdukDetail() {
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [aktif, setAktif] = useState(true);
  const [ulasan, setUlasan] = useState('');
  const [imageDepan, setImageDepan] = useState('');

  useEffect(() => {
    const { id } = route.params;
    const { title } = route.params;
    const { ulasan } = route.params;
    const { aktif } = route.params;
    const { imageDepan } = route.params;

    setUlasan(ulasan);
    setAktif(aktif);
    setTitle(title);
    setId(id);
    setImageDepan(imageDepan);
  });

  const goToPicFromCameras = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
      compressImageQuality: 0,
    }).then((image) => {
      console.log(image);
      this.setState({ images: image });
    });
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Image
          source={require('../../../icon/arrow.png')}
          style={styles.headerIconBack}
          onPress={() => alert('sukses')}
        />
        <Text style={styles.headerTitle}>Detail Produk</Text>
      </View>
      {/* body */}
      <View style={styles.body}>
        <View style={styles.saran}>
          <Text style={styles.saranTitle}>
            Update informasi produkmu sekarang!
          </Text>
          <Text style={styles.saranNote}>
            Note: update foto atau ulasanmu dengan benar dan bagus untuk menarik
            perhatian pembeli!!
          </Text>
        </View>
        <View style={styles.detailProduk}>
          <View style={styles.detailProdukRow}>
            <Text style={styles.detailProdukTitle}>Detail Produk</Text>
            <TouchableOpacity onPress={() => alert("clicked")}>
              <Text style={styles.detailProdukButton}>Ubah</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detailProdukRow}>
            <View style={styles.detailProdukColumnNama}>
              <Text style={styles.detailNamaTitle}>Nama Produk</Text>
              <Text style={styles.detailNamaProduk}>{title}</Text>
              <Text style={styles.detailNamaTitle}>Stok</Text>
              <Text style={styles.detailNamaProduk}>200</Text>
            </View>
            <View style={styles.detailProdukColumnHarga}>
              <Text style={styles.detailNamaTitle}>Harga Produk</Text>
              <Text style={styles.detailNamaProduk}>Rp. 10.000</Text>
            </View>
          </View>
        </View>
        <View style={styles.detailProduk}>
          <View style={styles.detailProdukRow}>
            <View style={styles.detailProdukFoto}>
              <Text style={styles.detailProdukTitle}>Foto Produk</Text>
              <View style={styles.listImageProduk}>

              </View>
            </View>
            <TouchableOpacity onPress={() => alert("clicked")}>
              <Text style={styles.detailProdukButton}>Tambah Foto</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 1, backgroundColor: 'grey' }}>
          <Text>Ini Footer</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: hp('9%'),
    paddingHorizontal: wp('2%'),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerIconBack: {
    height: hp('4%'),
    width: wp('6%'),
    tintColor: Warna.biruJaja,
    alignSelf: 'center',
  },
  headerTitle: {
    marginLeft: '3%',
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'center',
    flex: 1,
  },

  body: {
    flex: 1,
    paddingHorizontal: wp('2%'),
    paddingVertical: wp('1%'),
  },

  saran: {
    // flex: 1,
    height: hp('11%'),
    flexDirection: 'column',
  },
  saranTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  saranNote: {
    fontSize: 9,
    fontWeight: '500',
    color: '#A9A9A9',
  },
  detailProduk: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'flex-start',
    // justifyContent: "flex-start",
    marginTop: hp('-3%')
  },
  detailProdukRow: {
    flex: 1,
    flexDirection: "row"
  },
  detailProdukTitle: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    flex: 1
  },
  detailProdukButton: {
    //   backgroundColor: ,
    fontSize: 10,
    color: Warna.biruJaja,
    //   justifyContent: 'flex-start'
  },
  detailProdukColumnNama: {
    flex: 1,
    flexDirection: "column"
  },
  detailProdukColumnHarga: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end"
  },
  detailNamaTitle: {
    fontSize: 10,
    color: '#A9A9A9'
  },
  detailNamaProduk: {
    fontSize: 12,
    fontWeight: '900'
  },

  detailHargaTitle: {

  },

  detailProdukFoto: {
    flex: 1,
    flexDirection: "column"
  },
  listImageProduk: {
    flex: 1,
    flexDirection: "row"
  }
});

