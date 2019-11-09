/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';
import { Provider, connect } from 'react-redux';
import { reduxifyNavigator } from 'react-navigation-redux-helpers';
import store from './app/store';
import JPushModule from 'jpush-react-native'

const App = reduxifyNavigator(AppNavigator, "root");
const mapStateToProps = (state) => ({
  state: state.nav,
});
const AppWithNavigationState = connect(mapStateToProps)(App);



export default class Root extends Component<{}> {

  componentDidMount () {
    if (Platform.OS === 'android') {
      JPushModule.initPush()
      JPushModule.getInfo(map => {
        console.log('-- JPush getInfo map : ', map);
      })
      JPushModule.notifyJSDidLoad(resultCode => {
        if (resultCode === 0) {
          console.log('-- JPush notifyJSDidLoad resultCode : ', resultCode);
        }
      })
    } else {
      console.log('-- JPush setupPush : start');
      JPushModule.setupPush()
    }

    this.receiveCustomMsgListener = map => {
      this.setState({
        pushMsg: map.content
      })
      console.log('-- JPush receiveCustomMsgListener extras: ' + map.extras)
    }
    JPushModule.addReceiveCustomMsgListener(this.receiveCustomMsgListener)

    this.receiveNotificationListener = map => {
      console.log('-- JPush receiveNotificationListener alertContent: ' + map.alertContent)
      console.log('-- JPush receiveNotificationListener extras: ' + map.extras)
    }
    JPushModule.addReceiveNotificationListener(this.receiveNotificationListener)

    this.openNotificationListener = map => {
      console.log('-- JPush openNotificationListener Opening notification!')
      console.log('-- JPush openNotificationListener map.extra: ' + map.extras)
      this.jumpSecondActivity()
    }
    JPushModule.addReceiveOpenNotificationListener(this.openNotificationListener)

    this.getRegistrationIdListener = registrationId => {
      console.log('-- JPush getRegistrationIdListener : Device register succeed, registrationId ' + registrationId)
    }
    JPushModule.addGetRegistrationIdListener(this.getRegistrationIdListener)
  }

  componentWillUnmount () {
    JPushModule.removeReceiveCustomMsgListener(this.receiveCustomMsgListener)
    JPushModule.removeReceiveNotificationListener(this.receiveNotificationListener)
    JPushModule.removeReceiveOpenNotificationListener(this.openNotificationListener)
    JPushModule.removeGetRegistrationIdListener(this.getRegistrationIdListener)
    console.log('-- App componentWillUnmount : Will clear all notifications')
    JPushModule.clearAllNotifications()
  }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
