import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert, Modal} from 'react-native';
import {Form, Item, Label, Input, Button, Header, Left, Body, Title, Right, Fab} from 'native-base';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/AntDesign';
import * as firebase from 'firebase';
import axios from 'axios';
import * as Font from 'expo-font';
import { AppLoading} from 'expo';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import 'firebase/firestore';
import { YellowBox } from 'react-native';
import _ from 'lodash';
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
class Main extends React.Component{
    async getLocationAsync() {
        // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
        const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
          Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        } else {
          Alert.alert('Permission not granted, default Location will be San Francisco');
          this.setState({location:{ 
            latitude: 37.78825,
	        longitude: -122.4324,
	        latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }});
        }
        this.setState({loading: true});
        let location = await Location.getCurrentPositionAsync({});
        this.setState({location: {
            latitude: location.coords.latitude,
	        longitude: location.coords.longitude,
	        latitudeDelta: 0.0922,
		    longitudeDelta: 0.0421,
        }});
        this.setState({loading: false});
      }
    UNSAFE_componentWillMount(){
        this.getLocationAsync();
    }
    componentDidMount() {

        firebase.auth().onAuthStateChanged((user) => {
          })
      }
      async componentDidMount() {
        await Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        })
      }
    state = {
		location: {
        },
        loading: true,
        pokemon: [],
        user : '',
        visibleModal: null,
    }
    modal = () => {
        this.props.navigation.navigate('My Account');
    };
    addPokemon = () => {
        var range = 0.035;
		var range1 = Math.random() > 0.5 ? range : -range;
        var range2 = Math.random() > 0.5 ? range : -range;
        var lat = this.state.location.latitude;
        lat = lat + Math.random() * (range1);
        var long = this.state.location.longitude;
        long = long + Math.random() * (range2);
        var random = Math.ceil(Math.random() * (809 - 1) + 1);
        /*
        axios.get("http://pokeapi.co/api/v2/pokemon/" + random)
		.then(function(response){
            console.log(response.data.sprites.front_default);
            var res = (
                <MapView.Marker
                    coordinate = {{latitude: lat, longitude: long}}
                >
                <Image source = {{uri: response.data.sprites.front_default}} style = {{height: 50, width: 50}}/>
                </MapView.Marker>
            )
            return res;
		})
		.catch(function(error){
			console.log(error);
        });
        */
       var user = firebase.auth().currentUser;
       if(user.uid){
        firebase.firestore().collection('users').doc(user.uid).get().then((snapshot) => {
          if(snapshot.data().pokemon){
           var array = snapshot.data().pokemon;
           axios.get("http://pokeapi.co/api/v2/pokemon/" + random)
           .then(function(response){
             array.push({
               pokemon: random,
               longitude: long,
               latitude: lat,
               sprite: response.data.sprites.front_default
             });
             firebase.firestore().collection('users').doc(user.uid).set({
               pokemon: array,
             })
           })
           this.setState({pokemon: snapshot.data().pokemon});
          }
          else {
           axios.get("http://pokeapi.co/api/v2/pokemon/" + random)
           .then(function(response){
             firebase.firestore().collection('users').doc(user.uid).set({
               pokemon: [{
                 pokemon: random,
                 longitude: long,
                 latitude: lat,
                 sprite: response.data.sprites.front_default,
               }],
             })
           })
          }
        })
       }
       this.pokemon();
    }
    removePokemon = () => {
        var user = firebase.auth().currentUser;
        if(user.uid){
          firebase.firestore().collection('users').doc(user.uid).get().then((snapshot) => {
            if(snapshot.data().pokemon != undefined){
              var array = snapshot.data().pokemon;
              var random = Math.ceil(Math.random() * ((array.length - 1)));
              array.splice(random, 1);
              this.setState({pokemon: array});
              firebase.firestore().collection('users').doc(user.uid).set({
                pokemon: array,
              })
            }
            else{
              return;
            }
          })
        }
        this.pokemon();
    }
    pokemon = () => {
      var user = firebase.auth().currentUser;
      if(user.uid){
        
      firebase.firestore().collection('users').doc(user.uid).get().then((snapshot) => {
        this.setState({pokemon: snapshot.data().pokemon})
      })
      }
      var i = 1;
      if(this.state.pokemon){
        return this.state.pokemon.map(p=>{
          return(
            <MapView.Marker
              coordinate = {{latitude: p.latitude, longitude: p.longitude}}
              key = {p.pokemon}
              onPress = {() => {
                firebase.firestore().collection('pokemon').doc(user.uid).set({
                  pokemon: p.pokemon,
                }).then(() => {
                  this.props.navigation.navigate('Pokemon')
                })
              }}
            >
            <Image source = {{uri: p.sprite}} style = {{height: 50, width: 50}}/>
            </MapView.Marker>
          )
        })
      }
    }
    render(){
        if (this.state.loading) {
            return (
              <View style = {{flex: 1,alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
              <Image
                source = {{uri: "https://media.tenor.com/images/39d6060576a516f1dd437eafccafbdb1/tenor.gif"}}
                style = {{height: Platform.OS === "android" ? 560 :560,
                width: Platform.OS === "android" ? 400 : 400,
                justifyContent: 'center',
                alignItems: 'center',  }}
              />
            </View>
            );
          }
		return(
			<View style = {{flex: 1}}>
                <Header>
                  <Left>
                                <Icon style = {{fontSize: 20}} onPress = {() => this.modal()} color = {Platform.OS == 'android'? 'white' : 'black'} name = "user"/>
                  </Left>
                  <Body style = {{alignItems: 'center', justifyContent: 'center'}}>
                    <Title>PokeMap</Title>
                  </Body>
                  <Right>	
                    <Button transparent>
                    </Button>
                  </Right>
                </Header>
                <MapView 
                	style={{flex: 1}}
                  initialRegion={this.state.location}
                  provider = {MapView.PROVIDER_GOOGLE}
                >
                  {this.pokemon()}
                </MapView>
                <Fab direction = 'left' position = 'bottomRight' style = {{backgroundColor: 'green',}} onPress = {() => this.addPokemon()}>
                	<Icon name = 'plus'/>
                </Fab>
                <Fab direction = 'right' position = 'bottomLeft' style = {{backgroundColor: 'red',}} onPress = {() => this.removePokemon()}>
                	<Icon name = 'minus' />
                </Fab>
			</View>
		);	
	}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
export default Main;
