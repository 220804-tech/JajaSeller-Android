/* eslint-disable prettier/prettier */
import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import Warna from "../../config/Warna";
import { Style } from "../../export";

const CardButton = props => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Warna.white,
        elevation: 2,
        padding: "3%",
        borderRadius: 8,
        height: "100%",
        width: "48%",
        marginHorizontal: "1%"
      }}
    >
      <Text>{props.title}</Text>
      <Text style={Style.font_18}>{props.jumlah}</Text>
    </TouchableOpacity>
  );
};

export default CardButton;
