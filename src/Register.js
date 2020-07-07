import React from 'react';
import { StyleSheet, Text, View, Platform, Image, ImageBackground, Dimensions} from 'react-native';
import {Button, Form, Item, Label, Input} from 'native-base';
import * as firebase from 'firebase';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var myBackground = require('../assets/landing.jpg');
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
const db = firebase.firestore();
class Register extends React.Component{
	componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
          if (user != null) {
			this.setState({email: '', password: '', error: ''});
          }
        })
      }
    firebaseAuth = (email, password) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {
			this.setState({email: '', password: '', error: ''});
			firebase.firestore().collection('users').doc(cred.user.uid).set({
				user: cred.user.uid,
			}).then(() => {
				this.props.navigation.navigate('Main');
			})
		}).catch(err => {
			this.setState({error: err.message});
			console.log(this.state.error);
		})
	}
	state = {
		email: "",
		password: "",
		error: "",
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
                                onPress = {() => this.firebaseAuth(this.state.email,this.state.password)}
							>
								<Text style = {{color: 'white'}}>Sign Up</Text>
							</Button>
							<Text style = {{color: 'blue', textDecorationLine: 'underline',}} onPress={() => {
								this.setState({email: '', password: '', error: ''});
								this.props.navigation.navigate('Login')
							}}>Already Signed Up? Sign In Here!</Text>
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
		flex: 1,
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
export default Register;