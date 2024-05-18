import React, { Component } from 'react';
import { Text, View, SafeAreaView, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Platform, Alert, StatusBar, ToastAndroid, Linking } from 'react-native';
import Warna from '../../config/Warna';
import { TextInput, Button } from 'react-native-paper';
import Loading from '../../component/loading'
import * as FetchData from '../../service/Data'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import FormData from 'form-data';
import AsyncStorage from '@react-native-community/async-storage';
import style from '../../styles/style';
import { GoogleSignin, GoogleSigninButton, statusCodes, } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
import { Colors, Hp, Style, Utils } from '../../export';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      users: [],
      spinner: false,
      login: '',
      navigate: "Register",
      showPassword: false,
      userInfo: "",
      loading: false,
      out: false
    };
  }

  abortController = new AbortController();



  login = () => {
    const { navigation } = this.props;
    const credentials = {
      email: this.state.username,
      password: this.state.password,
    };
    if (!this.state.username && !this.state.password) {
      this.setState({ login: 'Email atau password tidak boleh kosong!' });
    } else {
      this.setState({ loading: true })

      var data = new FormData();
      data.append('email', credentials.email);
      data.append('password', credentials.password);

      var config = {
        method: 'post',
        url: 'https://jsonx.jaja.id/core/seller/auth/login',
        data: data,
      };
      axios(config)
        .then(response => {
          let token = this.generateCode();
          if (response.data.status === 200) {
            AsyncStorage.setItem('xOne', JSON.stringify(response.data.customer));
            EncryptedStorage.setItem('user', JSON.stringify(response.data.customer))
            EncryptedStorage.setItem('token', JSON.stringify(token))
            if (response.data.seller && response.data.seller.length === 0) {
              navigation.navigate('RegistrasiToko');
            } else {
              console.log('ini masuk sini')
              AsyncStorage.setItem('xxTwo', JSON.stringify(response.data.seller))
              EncryptedStorage.setItem('seller', JSON.stringify(response.data.seller))
              FetchData.getProduct(JSON.stringify(response.data.seller.id_toko));
              FetchData.getDashboard(JSON.stringify(response.data.seller.id_toko))
              setTimeout(() => this.setState({ loading: false }), 5000);
              setTimeout(() => navigation.replace('SplashScreen'), 3500);
              AsyncStorage.setItem('jwt', JSON.stringify(token))
              EncryptedStorage.setItem('jwt', JSON.stringify(token))
            }
          } else if (response.data.status === 404) {
            this.setState({ login: 'Email atau password anda salah!  ' });
          } else if (response.data.status === 401) {
            if (response.data.message === "Email belum diaktivasi") {
              this.setState({ login: 'Password anda salah!  ' });
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");
              var raw = JSON.stringify({ "email": credentials.email });

              var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
              };

              fetch("https://jsonx.jaja.id/core/seller/auth/forgot_password", requestOptions)
                .then(response => response.json())
                .then(result => {
                  if (result.status.code === 200) {
                    Utils.alertPopUp('Periksa email anda untuk verifikasi akun!')

                  } else {
                    Utils.handleErrorResponse(JSON.stringify(error), 'Error with status code : 11013')
                  }
                })
                .catch(error => {
                  Utils.handleError(JSON.stringify(error), 'Error with status code : 11012')
                });
              AsyncStorage.setItem('xOne', JSON.stringify(response.data.customer))
              EncryptedStorage.setItem('user', JSON.stringify(response.data.customer))

              setTimeout(() => {
                navigation.navigate("VertifikasiEmail", { data: response.data.customer })
              }, 1000);

            } else {
              this.setState({ login: 'Email atau password anda salah!  ' });
            }
          } else {
            this.setState({ login: response.data.message ? response.data.message : 'Sepertinya ada masalah!' });
          }
          this.setState({ loading: false })

          this.setState({ spinner: false })
        })
        .catch((error) => {
          let responseError = error.message;
          console.log('index -> login -> responseError', responseError);
          if (
            responseError === 'Request failed with status code 401' ||
            responseError === 'Request failed with status code 404'
          ) {
            this.setState({ login: 'Email atau password anda salah!  ' });
          } else {
            this.setState({ login: String(error) });
          }
          this.setState({
            spinner: false,
          });
          this.setState({ loading: false })

        });
    }
  };

  onChangeName = (name) => {
    this.setState({ login: '' });
    console.log(name, 'onchange');
    console.log(name);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(name) === false && name.length > 4) {
      console.log('Email is Not Correcttttt');
      this.setState({ login: 'Email tidak valid!' });

      this.setState({ email: name });
      return false;
    } else {
      this.setState({ login: '', username: name });
    }
  };

  onChangePass = (pass) => {
    this.setState({ login: '' });
    console.log(pass, 'onchange');
    this.setState({
      password: pass,
    });
  };

  componentDidMount() {
    this.signOut()
    this.setState({
      username: '',
      password: '',
      users: [],
      spinner: false,
      login: '',
    });
    // this.signOut()
    GoogleSignin.configure({
      webClientId: "284366139562-tnj3641sdb4ia9om7bcp25vh3qn5vvo8.apps.googleusercontent.com",
      offlineAccess: true
    });

    if (GoogleSignin.isSignedIn()) {
      this.signOut()
    }

    this.getStorage()
  }
  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 211 ~ Login ~ signOut= ~ error", error)
    }
  };

  getStorage = () => {
    try {
      const { navigation } = this.props;
      AsyncStorage.getItem('jwt')
        .then((val) => {
          if (val && val.length === 18) {
            navigation.navigate('Home');
          } else {
            console.log('keluar');
          }
        })
        .catch((err) => {
          console.log('jancoook');
        });

      let count = 0;
      AsyncStorage.getItem('xOne').then((res) => {
        console.log("getItem -> customer", res)
        if (res === null) count += 1;
      });
      AsyncStorage.getItem('xxTwo').then((res) => {
        if (res === null) count += 1;
      });
      setTimeout(() => {
        if (count === 2) {
          this.setState({ navigate: 'Register' })
        } else if (count === 1) {
          console.log("index -> 111 -> count", count)
          this.setState({ navigate: 'RegistrasiToko' })
        } else {
          console.log("index -> componentDidMount -> count === 1)", count === 1)
        }
      }, 300);
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 249 ~ Login ~ error", error)
    }
  }


  componentWillUnmount() {
    try {
      this.abortController.abort()
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 258 ~ Login ~ componentWillUnmount ~ error", error)
    }
  }

  backAction = () => {
    this.props.navigation.navigate('Welcome')
    return true;
  };

  generateCode = () => {
    let length = 16;
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  checkSignal = (error) => {
    Utils.checkSignal().then(res => {
      if (res && !res.connect) {
        ToastAndroid.show('Tidak dapat terhubung, periksa kembali koneksi internet anda!', ToastAndroid.LONG, ToastAndroid.TOP)
      } else if (error && Object.keys(error).length && error.code) {
        ToastAndroid.show(`Error with status code : ${err.code}`, ToastAndroid.LONG, ToastAndroid.TOP)
      }
    })
  }
  onGoogleButtonPress = async () => {
    try {
      this.checkSignal(null)
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn();
      this.setState({ loading: true })
      this.handleCheckUser(userInfo)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Sign In Cancelled : " + error.code);
      } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        console.log("Sign In Required : " + error.code);
      } else if (error.code === statusCodes.IN_PROGRESS || String(error.code == '12502')) {
        // console.log("Sign In Progress : " + error.code);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Utils.alertPopUp('Sepertinya anda belum menginstall google play service!')
      } else {
        this.checkSignal(error)
        Alert.alert(
          "Jaja.id",
          String(error) + String(error.code), [
          {
            text: "Ok",
            onPress: () => console.log("Pressed"),
            style: "cancel"
          },
        ],
          { cancelable: false }
        );
      }
    }
  }

  handleCheckUser = (data) => {
    try {

      const { navigation } = this.props;

      var myHeaders = new Headers();
      myHeaders.append("Cookie", "ci_session=djrt9mgeghbe3ji7vsk1no94gjv83qc3");

      var formdata = new FormData();
      formdata.append("email", data.user.email);
      formdata.append("nama_lengkap", data.user.name);
      formdata.append("foto_customer", data.user.photo);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch("https://jsonx.jaja.id/core/seller/auth/google", requestOptions)
        .then(response => response.json())
        .then(result => {
          let arr = result.seller
          let usr = result.customer

          if (arr && arr.length === 0) {
            let token = this.generateCode();
            EncryptedStorage.setItem('token', JSON.stringify(token))
            this.setState({ loading: false })
            setTimeout(() => {
              Alert.alert(
                "Jaja.id",
                "Anda belum memiliki toko", [
                {
                  text: "Batal",
                  onPress: () => {
                    console.log("Cancel Pressed")
                    this.signOut()
                  },
                  style: "cancel"
                },
                {
                  text: "Buka Toko", onPress: () => {
                    this.setState({ loading: true })
                    if (result.customer.verifikasi === 'T') {

                    } else {
                    }
                    AsyncStorage.setItem('xOne', JSON.stringify(result.customer)).then(res => {
                      const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
                      auth().signInWithCredential(googleCredential)
                      setTimeout(() => {
                        this.setState({ loading: false })
                        navigation.replace("RegistrasiToko", { data: data.user })
                      }, 1000);
                    })
                    EncryptedStorage.setItem('user', JSON.stringify(result.customer))
                  }
                }
              ],
                { cancelable: false }
              );
            }, 50);
          } else {
            let token = this.generateCode();
            EncryptedStorage.setItem('token', JSON.stringify(token))
            AsyncStorage.setItem('token', JSON.stringify(token))

            FetchData.getProduct(arr.id_toko);
            FetchData.getDashboard(JSON.stringify(arr.id_toko))
            this.props.dispatch({ 'type': "SET_USER", payload: usr })
            EncryptedStorage.setItem('user', JSON.stringify(usr))
            EncryptedStorage.setItem('seller', JSON.stringify(arr))
            EncryptedStorage.setItem('jwt', JSON.stringify(this.generateCode()))

            AsyncStorage.setItem('xxTwo', JSON.stringify(arr))
            AsyncStorage.setItem('xOne', JSON.stringify(usr))
            AsyncStorage.setItem('jwt', JSON.stringify(this.generateCode()))

            setTimeout(() => this.setState({ loading: false }), 5000);

            setTimeout(() => navigation.replace('SplashScreen'), 3500);
          }
        }).catch(error => {
          console.log("error login line 290 => ", error);
          this.setState({ loading: false })
          setTimeout(() => {
            Alert.alert(
              "Jaja.id",
              "Mohon maaf periksa koneksi anda atau coba lagi nanti => 2" + error, [
              {
                text: "Ok",
                onPress: () => {
                  console.log("Cancel Pressed")
                  this.signOut()
                },
                style: "cancel"
              }
            ],
              { cancelable: false }
            );
          }, 50);
        });
    } catch (error) {
      console.log("🚀 ~ file: index.js ~ line 426 ~ Login ~ error", error)
    }


    // var myHeaders = new Headers();
    // myHeaders.append("Cookie", "ci_session=3q8tr47ksanua1bitr3iccqjo1mul5j4");
    // var formdata = new FormData();
    // formdata.append("email", data.email);
    // 
    // var requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: formdata,
    //   redirect: 'follow'
    // };
    //     
    // 
    // 
    //     fetch("https://jsonx.jaja.id/core/seller/auth/email", requestOptions)
    //       .then(response => response.json())
    //       .then(result => {
    //         console.log("🚀 ~ file: index.js ~ line 240 ~ index ~ result", result)
    //         if (result.data === true) {
    //           this.setState({ loading: false })
    //           auth().signInWithCredential(googleCredential)
    //           // this.props.navigation.navigate("RegistrasiEmail", { data })
    //         } else {
    //           this.setState({ loading: false })
    //           setTimeout(() => {
    //             Alert.alert(
    //               "Jaja.id",
    //               "Anda belum memiliki toko", [
    //               {
    //                 text: "Batal",
    //                 onPress: () => console.log("Cancel Pressed"),
    //                 style: "cancel"
    //               },
    //               {
    //                 text: "Buka Toko", onPress: () => {
    //                   const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
    //                   auth().signInWithCredential(googleCredential)
    //                   this.props.navigation.navigate("RegistrasiToko", { data: data })
    //                 }
    //               }
    //             ],
    //               { cancelable: false }
    //             );
    //           }, 50);
    //         }
    //       })
    // 
    //       .catch(error => console.log('error', error));
  }

  render() {
    return (
      <>
        <StatusBar translucent={true} backgroundColor='transparent' barStyle="dark-content" />
        {/* 
        <FetchUserData
          userId={this.props.userId}
          onUpdate={this._handleUpdate}
        /> */}

        <SafeAreaView style={style.container}>
          {this.state.loading ? <Loading /> : null}
          <ScrollView contentContainerStyle={{
            flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
            backgroundColor: Platform.OS === 'ios' ? Colors.whiteGrey : null
          }}>
            {this.state.spinner ? <Loading /> : null}
            <View style={styles.logo}>
              <Image
                source={require('../../logo/jaja-logo.png')}
                style={styles.logoJaja}
              />
              <Text style={[styles.sellerCenter, Style.font_14, Style.italic]}>SELLER CENTER</Text>
            </View>
            <View style={styles.formInput}>
              <View>
                <Text style={styles.validLogin}>{this.state.login}</Text>
              </View>
              <TextInput
                ref={(ref) => { this.Email = ref; }}
                selectionColor={Warna.kuningJaja}
                style={[styles.inputBox, Style.font_14]}
                label="Alamat Email"
                keyboardType="email-address"
                onChangeText={(text) => this.onChangeName(text)}
                onSubmitEditing={() => this.Password.focus()}
                mode="outlined"
                theme={{
                  colors: {
                    primary: Warna.kuningJaja,
                  },
                }}

              />
              <View style={{ width: wp('85%'), justifyContent: 'flex-end' }}>
                <TextInput
                  ref={(ref) => { this.Password = ref; }}
                  onSubmitEditing={() => this.login()}
                  returnKeyType="go"
                  style={[styles.inputBox, Style.font_14]}
                  mode="outlined"
                  selectionColor={Warna.kuningJaja}
                  label="Kata Sandi"
                  value={this.state.password}
                  onChangeText={this.onChangePass}
                  secureTextEntry={!this.state.showPassword ? true : false}
                  theme={{
                    colors: {
                      primary: Warna.kuningJaja,
                    },
                  }}
                />
                <TouchableOpacity onPress={() => {
                  !this.state.showPassword ? this.setState({ showPassword: true }) : this.setState({ showPassword: false })
                  console.log("🚀 ~ file: index.js ~ line 238 ~ index ~ render ~ this.state.showPassword", this.state.showPassword)
                }} style={{ position: "absolute", width: 24, height: 24, right: 10, bottom: 16, zIndex: 1 }}>
                  <TextInput.Icon
                    onPress={() => {
                      !this.state.showPassword ? this.setState({ showPassword: true }) : this.setState({ showPassword: false })
                      console.log("🚀 ~ file: index.js ~ line 238 ~ index ~ render ~ this.state.showPassword", this.state.showPassword)
                    }}
                    icon={!this.state.showPassword ? require('../../icon/eye-aktive.png') : require('../../icon/eye.png')}

                    style={{ left: 0 }}
                  />
                </TouchableOpacity>
              </View>
              <Button onPress={() => this.login()} style={{ marginVertical: hp('2%') }} contentStyle={{ width: wp('85%') }} labelStyle={[Style.font_13, Style.semi_bold, { color: Warna.white, textAlignVertical: 'center' }]} color={Warna.kuningJaja} mode="contained">
                Masuk
              </Button>
              <View style={{ width: wp('87%'), justifyContent: 'flex-end', marginBottom: '3%' }}>
                {Platform.OS == 'android' ?
                  <GoogleSigninButton
                    style={{ width: "100%", height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.onGoogleButtonPress} /> : null
                }
              </View>
              <View style={[styles.bottomContainer]}>

                <View style={styles.bottom}>
                  <View style={styles.daftar}>
                    <Text style={[Style.font_12, Style.mr_2]}>Belum punya akun?</Text>
                    <Text style={[Style.font_12, { color: '#6495ED' }]} onPress={() => this.props.navigation.navigate("Register")}>Daftar</Text>
                  </View>
                  <Text onPress={() => this.props.navigation.navigate("LupaPassword")} style={[Style.font_12, { color: '#6495ED' }]}>Lupa password?</Text>
                </View>

              </View>
              <Text onPress={() => Linking.openURL('https://jsonx.jaja.id/kebijakan-privasi')} style={[Style.font_12, { color: '#6495ED', marginTop: Hp('-5%') }]}>Kebijakan Privasi</Text>
            </View>

          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}
export default connect(state => ({ state: state.user }))(Login)

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
  logo: {
    flex: 0.65,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  logoJaja: {
    width: wp('70%'),
    height: hp('20%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  formInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    width: wp('85%')
  },
  validLogin: {
    width: wp('85%'),
    color: 'red',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: Warna.biruJaja,
    width: wp('85%'),
    height: hp('5.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 0.7,
    height: '80%',
    width: wp('84%'),
    flexDirection: 'column',
  },
  bottom: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'space-between',
  },
  daftar: {
    flex: 1,
    flexDirection: 'row',
  },

  sellerCenter: {
    justifyContent: 'flex-end',
    paddingHorizontal: wp('20%'),
    alignSelf: 'flex-end',
    marginTop: hp('-3%'),
  },
  touchLupaKataSandi: {
    flex: 1,
  },
  lupaKataSandi: {
    color: 'grey',
    fontSize: 11,
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  input: {
    flex: 1,
    flexDirection: 'column',
  },
});
