import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import Default from '../layout/update'
const Stack = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer NavigationContainer>
            <Stack.Navigator initialRouteName="default" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="default" component={Default} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}