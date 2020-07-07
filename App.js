import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/Login.js'
import Register from './src/Register.js'
import Main from './src/Main.js';
import Account from './src/Account.js';
import * as firebase from 'firebase';
import SearchBody from './src/SearchBody';
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }
const Stack = createStackNavigator();

function MyStack() {
  return (

    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="Main"
        component={Main}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="My Account"
        component={Account}
        options={{ headerTintColor: 'white',
        headerStyle: { backgroundColor: 'teal' },}}
      />
      <Stack.Screen
        name="Pokemon"
        component={SearchBody}
        options={{ headerTintColor: 'white',
        headerStyle: { backgroundColor: 'teal' },}}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
