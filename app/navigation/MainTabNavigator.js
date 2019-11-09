import React from 'react';
import { Platform, TouchableHighlight } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import HomePage from '../screens/home/HomePage';
import PlayerPage from '../screens/home/PlayerPage';
import GamePage from '../screens/home/GamePage';
import ResultPage from '../screens/home/ResultPage';
import TabBarIcon from '../components/common/TabBarIcon';
import Icon from 'react-native-vector-icons/FontAwesome';

// constant
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
const LW = Layout.window.width;
const LH = Layout.window.height;
const RateWH = LH/LW;
import config from '../constants/config';
const CURRENCYARR = config.currencyArr;

const HomeStack = createStackNavigator({
  HomePage: HomePage,
  GamePage: GamePage,
  ResultPage: ResultPage,
  PlayerPage: PlayerPage,
}, {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0
    },
    headerTintColor: 'transparent',
    headerTitleStyle:{
      textAlign: 'center',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      flexGrow:1,
      alignSelf:'center',
      marginRight: Platform.select({
        ios: 18,
        android:76
      })
    },
    headerTransparent: true, 
  }
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Recog',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="recog"
      title="Recog"
    />
  ),
};

export default HomeStack;
// export default createBottomTabNavigator({
//   HomeStack,
//   UsageStack,
//   // SettingStack,
// },
// {
//   tabBarOptions: {
//     activeTintColor: Colors.buttonColorCyan,
//     style: {
//       backgroundColor: Colors.tabBk,
//     },
//   }
// });
