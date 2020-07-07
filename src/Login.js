import React from 'react';
import { StyleSheet, Text, View, Platform, Image, ImageBackground, Dimensions, Linking} from 'react-native';
import {Button, Form, Item, Label, Input} from 'native-base';
import * as firebase from 'firebase';
import 'firebase/firestore';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var myBackground = require('../assets/landing.jpg');
// Your web app's Firebase configuration
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
var firebaseConfig = {
	apiKey: "AIzaSyAOF_JrE5gGuYuWxt4SBUMUgYNvPSlAlSg",
	authDomain: "pokemap-74379.firebaseapp.com",
	databaseURL: "https://pokemap-74379.firebaseio.com",
	projectId: "pokemap-74379",
	storageBucket: "pokemap-74379.appspot.com",
	messagingSenderId: "936394818438",
	appId: "1:936394818438:web:e89c49bec5c723ab112207"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
class Login extends React.Component{
	componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
          if (user != null) {
			this.setState({email: '', password: '', error: ''});
          }
        })
      }
    firebaseSignIn = (email, password) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(cred => {
			this.setState({error: " "});
			this.props.navigation.navigate('Main');
		}).catch(err => {
			this.setState({error: err.message});
			console.log(this.state.error);
		})
	}
	state = {
		email: "",
		password: "",
		error : " ",
	}
	render(){
		return(
			<View style = {{flex: 1,}}>
				<ImageBackground source = {myBackground} style = {styles.backgroundImg}>
					<View style = {styles.inputStyle}>
						<Form>
							<Item floatingLabel>
								<Label>Email</Label>
								<Input
									autoCorrect = {false}
									onChangeText = {(email) =>this.setState({email})}
									value = {this.state.email}
								/>
							</Item>
							<Item floatingLabel>
								<Label>Password</Label>
								<Input 
									autoCorrect = {false}
									onChangeText = {(password) =>this.setState({password})}
									value = {this.state.password}
									secureTextEntry
								/>
							</Item>
						</Form>
						<View style = {{marginTop: 10}}>
							<Button
								primary
                                block
                                onPress = {() => this.firebaseSignIn(this.state.email,this.state.password)}
							>
								<Text style = {{color: 'white'}}>Sign In</Text>
							</Button>
							<Text style = {{color: 'blue', textDecorationLine: 'underline',}} onPress={() => {
								this.setState({email: '', password: '', error: ''});
								this.props.navigation.navigate('Register')
							}}>Haven't Signed Up Yet? Register Here!</Text>
							<Text style = {{color: 'red'}}>{this.state.error}</Text>
						</View>
					</View>
				</ImageBackground>
			</View>
		)
	}
}
const styles = {
	backgroundImg: {
		resizeMode: 'cover',
		width: width,
		height: height,
	},
	inputStyle: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		margin: 10,
	}
}
export default Login;