import { Dimensions } from 'react-native'
import { widthPercentageToDP as Wp, heightPercentageToDP as Hp } from 'react-native-responsive-screen';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Colors from '../config/Warna'
import Style from '../styles/style'
import Appbar from '../component/header/Appbar'
import Loading from '../component/loading'
import ShimmerProduct from '../component/shimmer/ShimmerProduct'
import ModalAlert from '../component/modal/ModalComponents'

import * as Firebase from '../service/Firebase'

import * as Storage from '../service/Storage'
import * as ServiceAccount from '../service/Account'
import * as ServiceOrders from '../service/Orders'
import * as ServiceOrdersNew from '../service/OrdersNew'


import * as ServiceProduct from '../service/Product'
import ActionSheetProduct from '../component/product/ActionSheet'
import ActionSheetPromotion from '../component/product/ActionSheetPromotion'

import FastImage from 'react-native-fast-image'
import * as Utils from '../utils'
import NotFound from '../component/empty/NotFound';
let Ws = Dimensions.get('screen').width
let Hs = Dimensions.get('screen').height

export {
    Colors, useNavigation, useFocusEffect, Wp, Hp, Ws, Hs, Style, ServiceAccount, Utils, Storage, Appbar, Loading, ServiceProduct, ServiceOrders, ServiceOrdersNew, ShimmerProduct, Firebase, NotFound, ActionSheetProduct, ActionSheetPromotion, ModalAlert, FastImage
}           
