import React, { Component } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button, Paragraph, TextInput } from 'react-native-paper'
import Loading from '../../component/loading'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import * as Service from '../../service/Account';
import Warna from '../../config/Warna';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  BackHandler, StatusBar, ScrollView, Linking,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Style } from '../../export';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      alertTextUsername: '',
      accUsername: false,
      email: '',
      password: '',
      confirmPassword: '',
      alertTextPssword: '',
      alertTextPssword1: '',
      accPassword: false,
      accPassword1: false,
      telephone: '',
      alertTextTelephone: '',
      alertTextEmail: '',
      accEmail: false,
      spinner: false,
      verified: false,
      loading: false
    };
  }
  backAction = () => {
    this.props.navigation.navigate('Login');
    return true;
  };

  componentDidMount() {
    // this.props.navigation.navigate('VertifikasiEmail')
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleUsername = (e) => {
    console.log(e.nativeEvent.text, ' username');
    this.setState({ username: e.nativeEvent.text });
    const str = e.nativeEvent.text;
    if (str.length < 3) {
      this.setState({
        alertTextUsername: 'terlalu singkat',
        accUsername: false,
      });
    } else {
      this.setState({
        alertTextUsername: '',
        accUsername: true,
      });
    }
  };
  handlePassword = (e) => {
    if (this.state.accPassword === true) {
      if (this.state.confirmPassword !== this.state.password) {
        this.setState({
          alertTextPssword: 'password tidak sama!',
          accPassword: false,
        });
      } else {
        this.setState({
          alertTextPssword: '',
          accPassword: true,
        });
      }
    }
    const str = e.nativeEvent.text;
    if (str.length < 8) {
      this.setState({
        alertTextPssword1: 'password terlalu pendek',
        accPassword1: false,
      });
    } else {
      this.setState({
        alertTextPssword1: '',
        accPassword1: true,
      });
    }
    console.log(e.nativeEvent.text, ' password', this.state.accPassword);
    this.setState({ password: e.nativeEvent.text });
  };

  handleEmail = (e) => {
    console.log(e.nativeEvent.text, ' email');
    this.setState({ email: e.nativeEvent.text });
    let val = e.nativeEvent.text;
    let re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    let rest = re.test(e.nativeEvent.text);
    console.log("index -> handleEmail -> val.length", val.length)

    if (val.length > 4) {
      if (rest === false) {
        this.setState({ alertTextEmail: 'email tidak valid', accEmail: false });
      } else {
        this.setState({ alertTextEmail: '', accEmail: true });
      }
    } else if (val.length === 0) {
      this.setState({ alertTextEmail: '', accEmail: false });

    }
  }
  confirmPassword = (e) => {
    this.setState({ alertTextPssword: 'password tidak sama!' });
    console.log(e.nativeEvent.text, ' confirm password');
    if (e.nativeEvent.text === this.state.password) {
      this.setState({
        alertTextPssword: '',
        accPassword: true,
      });
    }
    this.setState({ confirmPassword: e.nativeEvent.text });
  };

  handleTelephone = (e) => {
    console.log(e.nativeEvent.text, ' telephone');

    this.setState({ telephone: e.nativeEvent.text, alertTextTelephone: "" });
  }

  onRegistrasi = (e) => {
    const credentials = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      telepon: this.state.telephone
    };
    if (this.state.username === '')
      this.setState({ alertTextUsername: 'username tidak boleh kosong!' });
    if (this.state.password === '')
      this.setState({ alertTextPssword1: 'password tidak boleh kosong!' });
    if (this.state.confirmPassword === '')
      this.setState({
        alertTextPssword: 'konfirmasi password tidak boleh kosong!',
      });
    if (this.state.telephone === '')
      this.setState({ alertTextTelephone: 'nomor telephone tidak boleh kosong!' });
    if (this.state.email === '') {
      this.setState({ alertTextEmail: 'email tidak boleh kosong!' });
    } else {
      if (this.state.accPassword === true && this.state.accPassword1 && this.state.accUsername) {
        this.setState({
          loading: true,
        });
        Service.register(credentials)
          .then((res) => {
            if (res.status === 201) {
              AsyncStorage.setItem('xOne', JSON.stringify(res.customer)).then(res => {
                setTimeout(() => this.setState({ loading: false }), 3000);
              })
              this.props.navigation.navigate('VertifikasiEmail', { email: this.state.email })
            } else if (res.status === 409) {
              setTimeout(() => this.setState({ loading: false }), 1000);
              this.setState({ alertTextEmail: 'Email sudah pernah digunakan!' })
            }
          })
          .catch((err) => {
            console.log("index -> onRegistrasi -> err", JSON.stringify(err))
            setTimeout(() => this.setState({ loading: false }), 1000);
            console.log('Failed', 'Username/Password wrong!', 'error');
          });
      } else {
        console.log('gagal');
      }
    }
    console.log("index -> onRegistrasi -> credentials", credentials)
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent={false} backgroundColor={Warna.kuningJaja} barStyle="light-content" />
        {this.state.loading ? <Loading /> : null}
        <ScrollView style={styles.scrollView} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.viewImage}>
            <Image
              source={require('../../logo/jaja-logo.png')}
              style={styles.logoJaja}
            />
            <Text style={styles.sellerCenter}>SELLER CENTER</Text>
          </View>
          <View style={styles.viewInput}>
            <TextInput
              name="username"
              style={styles.inputBox}
              type="text"
              onChange={this.handleUsername}
              selectionColor={Warna.kuningJaja}
              label="Nama Lengkap"
              keyboardType="default"
              mode="outlined"
              theme={{
                colors: {
                  primary: Warna.kuningJaja,
                },
              }}
            />
            <Text style={{ color: 'red' }}>{this.state.alertTextUsername}</Text>
          </View>
          <View style={styles.viewInput}>
            <TextInput
              selectionColor={Warna.kuningJaja}
              label="your@mail.example"
              type="text"
              style={styles.inputBox}
              onChange={this.handleEmail}
              keyboardType="email-address"
              mode="outlined"
              theme={{
                colors: {
                  primary: Warna.kuningJaja,
                },
              }}
            />
            <Text style={{ color: 'red' }}>{this.state.alertTextEmail}</Text>
          </View>
          <View style={styles.viewInput}>
            <TextInput
              selectionColor={Warna.kuningJaja}
              label="Nomor Telephone"
              style={styles.inputBox}
              onChange={this.handleTelephone}
              keyboardType="numeric"
              mode="outlined"
              theme={{
                colors: {
                  primary: Warna.kuningJaja,
                },
              }}
            />
            <Text style={{ color: 'red' }}>{this.state.alertTextTelephone}</Text>
          </View>
          <View style={styles.viewInput}>
            <TextInput
              style={styles.inputBox}
              name="password"
              type="password"
              onChange={this.handlePassword}
              mode="outlined"
              selectionColor={Warna.kuningJaja}
              label="Password"
              secureTextEntry={true}
              theme={{
                colors: {
                  primary: Warna.kuningJaja,
                },
              }}
            />
            <Text style={{ color: 'red' }}>{this.state.alertTextPssword1}</Text>
          </View>
          <View style={styles.viewInput}>
            <TextInput
              style={styles.inputBox}
              name="confirmPassword"
              type="password"
              onChange={this.confirmPassword}
              mode="outlined"
              selectionColor={Warna.kuningJaja}
              label="Konfirmasi Password"
              secureTextEntry
              on
              theme={{
                colors: {
                  primary: Warna.kuningJaja,
                },
              }}
            />
            <Text style={{ color: 'red' }}>{this.state.alertTextPssword}</Text>
          </View>
          <View style={styles.viewInput}>
            <Button
              labelStyle={{ color: 'white' }}
              onPress={this.onRegistrasi}
              mode="contained"
              contentStyle={styles.contentButton}
              color={Warna.kuningJaja}
              style={styles.button}>
              Daftar
            </Button>
          </View>
          <View style={[Style.row_between_center, { width: '99%' }]}>
            <View style={[Style.row_0_start_center, Style.mb_5,]}>
              <View>
                <Text style={{ color: 'black', padding: 5 }}>
                  Sudah punya akun?
                </Text>
              </View>
              <View>
                <Text
                  style={{ color: '#6495ED', padding: 5 }}
                  onPress={(e) => this.props.navigation.navigate('Login')}>
                  Login
                </Text>
              </View>
            </View>
            <View style={[Style.row_0_end_center, Style.mb_5]}>

              <Text onPress={() => Linking.openURL('https://jsonx.jaja.id/kebijakan-privasi')} style={[Style.font_12, Style.mt_5, { color: '#6495ED' }]}>Kebijakan Privasi</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#fff'
  },

  viewImage: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: "20%",
    marginTop: '10%'
  },

  logoJaja: {
    flex: 0,
    width: wp('60%'),
    height: hp('17%'),
    resizeMode: 'contain',
    alignSelf: 'center',
    alignItems: 'flex-start'

  },
  sellerCenter: {
    fontWeight: '900',
    fontFamily: 'Poppins-Italic',
    color: Warna.black,
    alignItems: "flex-start",
    justifyContent: 'flex-end',
    paddingHorizontal: wp('20%'),
    alignSelf: 'flex-end',
    marginTop: hp('-2%'),
  },
  viewInput: {
    flex: 1,
    justifyContent: 'center',
    width: wp('90%'),
    alignSelf: 'center',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  inputBox: {
    height: hp('5.7%'),
  },
  iconMarket: { alignSelf: "center", width: wp('80%'), height: hp('40%') },
  textJajakan: { alignSelf: 'center', textAlign: 'center', width: wp('80%'), fontSize: 18, fontFamily: 'Poppins-SemiBold', color: Warna.black, fontFamily: 'Poppins-Regular', marginVertical: hp('2%') },
  textCenter: { fontSize: 18, fontWeight: '900', color: Warna.black, fontFamily: 'Poppins-Regular' },

  button: {
    marginTop: hp('1%'),
    alignSelf: 'center'
  },
  contentButton: {
    width: wp('90%'),
    height: hp('5.3%')
  },
  scrollView: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: wp('5%'),
    // backgroundColor: 'pink',
  }
});
