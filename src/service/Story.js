import axios from "axios";
let qs = require('qs');
import AsyncStorage from "@react-native-community/async-storage";

async function getId() {
  try {
    return await AsyncStorage.getItem("xxTwo").then(toko => JSON.parse(toko).id_toko)
  } catch (error) {
    console.log(error, " => error get id toko")
  }

}

export async function getStory() {
  let result = await getId()
  return await axios.get(`https://jsonx.jaja.id/core/seller/feed?id_toko=${result}`)
    .then((res) => res.data);
}

export async function addStoryProduct(data) {
  return await axios.post('https://jsonx.jaja.id/core/seller/feed/story', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)
}
