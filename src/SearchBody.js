import React from 'react';
import {View,Image,Text, ScrollView,Dimensions, ImageBackground} from 'react-native';
import {ListItem,List} from 'native-base';
import 'firebase/firestore';
import * as firebase from 'firebase';
import axios from 'axios';
var {height, width} = Dimensions.get('window');

class SearchBody extends React.Component{
    state = {
        loading: false,
        pokemon: {},
    };
	render(){
        var user = firebase.auth().currentUser;
        var self = this;
        firebase.firestore().collection('pokemon').doc(user.uid).get().then((snapshot) => {
            var pokemon = snapshot.data().pokemon;
            if(!pokemon){
                self.setState({loading: true});
                return (
                    <View style = {{flex: 1,alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                    <Image
                      source = {{uri: "https://media.tenor.com/images/39d6060576a516f1dd437eafccafbdb1/tenor.gif"}}
                      style = {{height: Platform.OS === "android" ? 560 :560,
                      width: Platform.OS === "android" ? 400 : 400,
                      justifyContent: 'center',
                      alignItems: 'center',  }}
                    />
                    <Text style = {{alignItems: 'center', justifyContent: 'center'}}>No Data Found</Text>
                  </View>)
            }
            else{
                axios.get("http://pokeapi.co/api/v2/pokemon/" + pokemon)
                .then(function(response){
                    self.setState({loading: true, pokemon: response.data})
                })
                .catch(function(error){
                    console.log(error);
                });
            }
        });
		if(!this.state.loading){
			return (
                <View style = {{flex: 1,alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                <Image
                  source = {{uri: "https://media.tenor.com/images/39d6060576a516f1dd437eafccafbdb1/tenor.gif"}}
                  style = {{height: Platform.OS === "android" ? 560 :560,
                  width: Platform.OS === "android" ? 400 : 400,
                  justifyContent: 'center',
                  alignItems: 'center',  }}
                />
                <Text style = {{alignItems: 'center', justifyContent: 'center'}}>Please Wait</Text>
              </View>)
        }
        return(
			<ImageBackground style={styles.backgroundImage} source={{uri: "http://pokemongolive.com/img/posts/raids_loading.png"}}>
			<ScrollView style={{flex: 1}}>
				<Text style={styles.header}>#{this.state.pokemon.id} - {this.state.pokemon.name.toUpperCase()}</Text>
				<View style={styles.viewStyle}>
					<Image source={{uri: this.state.pokemon.sprites.front_default}} style={styles.img}/>
				</View>
				<View style={styles.info}>
					<ListItem itemDivider>
	                    <Text style={{fontWeight: 'bold'}}>Size </Text>
	                </ListItem>
					<ListItem>
						<Text>Weight - {this.state.pokemon.weight} kg</Text>
					</ListItem>
					<ListItem>
						<Text>Height - {this.state.pokemon.height} m</Text>
					</ListItem>
					<ListItem itemDivider>
	                    <Text style={{fontWeight: 'bold'}}>Abilities </Text>
	                </ListItem>
					<List dataArray={this.state.pokemon.abilities}
	                    renderRow={(item) =>
	                        <ListItem key = {item}>
	                            <Text>{item.ability.name.toUpperCase()}</Text>
	                        </ListItem>
	                    }>
	                </List>
                </View>
			</ScrollView>
			</ImageBackground>
		)
	}
}

const styles = {
	img: {
		height: 300,
		width: 300,
		justifyContent: 'center',
		alignItems: 'center'
	},
	viewStyle: {
		justifyContent: 'center',
	    alignItems: 'center',
	    flex: 1
	},
	header: {
		fontSize: 30,
		color: 'red',
		textAlign: 'center'
	},
	backgroundImage: {
		flex: 1,
	    resizeMode: 'cover',
	    width: width,
	    height: height,
	    opacity: 0.9
	},
	info:{
		flex: 1,
		backgroundColor: 'white',
		opacity: 0.8
	}
}

export default SearchBody;
/*

					<List dataArray={pokemon.abilities}
	                    renderRow={(item) =>
	                        <ListItem>
	                            <Text>{item.ability.name.toUpperCase()}</Text>
	                        </ListItem>
	                    }>
                    </List>
*/