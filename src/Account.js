import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';
import {ListItem,List} from 'native-base';
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
class Account extends React.Component{
    componentDidMount() {

        firebase.auth().onAuthStateChanged((user) => {
          if (user != null) {
              this.setState({user: user.email});
          }
        })
      }
      state = {
          user : ''
      }
    render(){
        return(
            <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black'}}>
                    <Icon style = {{marginTop: 10,fontSize: 50, color: 'white'}}name = "user-circle"/>
                    <Text style = {{marginTop: 15, fontSize: 20, color: 'white'}}>Welcome, {this.state.user}</Text>
                    <List>
                    <ListItem style = {{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style = {{fontSize: 19, color: 'white'}}>Account Details: {this.state.user}</Text>
                    </ListItem>
                    <ListItem style = {{alignItems: 'center', justifyContent: 'center'}} onPress = {() => {
                            firebase.auth().signOut();
                            this.props.navigation.navigate('Login');
                        }}>
                        <Text style = {{fontSize: 20, color: 'white'}}>Logout</Text>
                        <Icon2 style = {{ color: 'white',fontSize: 50,}} name = "logout" ></Icon2>
                     </ListItem>
                    </List>
            </View>
        )
    }
}
export default Account;