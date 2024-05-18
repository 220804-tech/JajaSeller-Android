import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  LacakPaket, AccountToko, EditAlamat, ProdukPreview, JajaCs, Alamat, Account, StoryUpload, Variasi, Story, Login, Register, Payouts, Lainnya, IsiChat, LupaPassword, ProdukDetail,
  Notifikasi, VertifikasiEmail, RegistrasiToko, History, ProdukDeskripsi, SplashScreen, AddVoucher, ProdukBaru, AddProdukFoto, ListBank, DetailsPesanan, Welcome, Pengiriman, EditProduk,
  NewBeranda, DetailNotifikasi, Count, ReviewProduk, Ulasan, RegistrasiEmail, Statistik, Complain, DetailKomplain, Etalase
} from "./pages";
import { createStackNavigator } from '@react-navigation/stack';
import Home from './bottomRoutes'

const Stack = createStackNavigator();
const HomeStack = createBottomTabNavigator();
const UserStack = createStackNavigator();
const PayoutsStack = createStackNavigator();

function User() {
  return (
    <UserStack.Navigator screenOptions={{ headerShown: false }} backBehavior='initialRoute' initialRouteName="SplashScreen">
      <UserStack.Screen name="SplashScreen" component={SplashScreen} />
      <UserStack.Screen name="Welcome" component={Welcome} />
      <UserStack.Screen name="Login" component={Login} />
      <UserStack.Screen name="Register" component={Register} />
      <UserStack.Screen name="RegistrasiToko" component={RegistrasiToko} />
      <UserStack.Screen name="RegistrasiEmail" component={RegistrasiEmail} />
      <UserStack.Screen name="LupaPassword" component={LupaPassword} />
    </UserStack.Navigator>
  );
}

function Payoutss() {
  return (
    <PayoutsStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="initial">
      <PayoutsStack.Screen name="notfound" component={SplashScreen} />
      <PayoutsStack.Screen name="initial" component={Payouts} />
    </PayoutsStack.Navigator>

  )
}

export default function Routes() {
  return (
    <NavigationContainer NavigationContainer>
      <Stack.Navigator initialRouteName="User" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="NewBeranda" component={NewBeranda} />
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="LacakPaket" component={LacakPaket} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="IsiChat" component={IsiChat} />
        <Stack.Screen name="Story" component={Story} />
        <Stack.Screen name="StoryUpload" component={StoryUpload} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="AccountToko" component={AccountToko} />
        <Stack.Screen name="JajaCs" component={JajaCs} />
        <Stack.Screen name="Lainnya" component={Lainnya} />
        <Stack.Screen name="ProdukPreview" component={ProdukPreview} />
        <Stack.Screen name="Count" component={Count} />
        <Stack.Screen name="ReviewProduk" component={ReviewProduk} />
        <Stack.Screen name="Alamat" component={Alamat} />
        <Stack.Screen name="EditAlamat" component={EditAlamat} />
        <Stack.Screen name="ProdukDetail" component={ProdukDetail} />
        <Stack.Screen name="ProdukDeskripsi" component={ProdukDeskripsi} />
        <Stack.Screen name="AddVoucher" component={AddVoucher} />
        <Stack.Screen name="ProdukBaru" component={ProdukBaru} />
        <Stack.Screen name="ProdukEdit" component={EditProduk} />
        <Stack.Screen name="Variasi" component={Variasi} />
        <Stack.Screen name="Payouts" component={Payoutss} />
        <Stack.Screen name="Ulasan" component={Ulasan} />
        <Stack.Screen name="AddProdukFoto" component={AddProdukFoto} />
        <Stack.Screen name="Notifikasi" component={Notifikasi} />
        <Stack.Screen name="VertifikasiEmail" component={VertifikasiEmail} />
        <Stack.Screen name="ListBank" component={ListBank} />
        <Stack.Screen name="DetailsPesanan" component={DetailsPesanan} />
        <Stack.Screen name="Pengiriman" component={Pengiriman} />
        <Stack.Screen name="DetailNotifikasi" component={DetailNotifikasi} />
        <Stack.Screen name="Statistik" component={Statistik} />
        <Stack.Screen name="Complain" component={Complain} />
        <Stack.Screen name="DetailKomplain" component={DetailKomplain} />
        <Stack.Screen name="Etalase" component={Etalase} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}




