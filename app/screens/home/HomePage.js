import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
  Linking,
  Modal,
  StatusBar,
  AsyncStorage,
  WebView,
  Alert,
  Dimensions,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import TBB_UTILS from '../../utils/ThrowBasketBallUtils'

// custom component
import Loading from '../../components/common/Loading';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// constant
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
const LW = Layout.window.width;
const LH = Layout.window.height;
const RateWH = LH/LW;
import config from '../../constants/config';




class HomePage extends React.Component {
  static navigationOptions = {
    header: null,
  };


  /**
   * @method constructor
   * @description This is constructor function
   */
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

  }


  componentDidMount() {
    SplashScreen.hide();
  }



  render() {

    var loading = <Text> </Text>;
    if( this.state.loading ){
      loading = <Loading type="full"/>;
    }

    return (
      <View style={{width: LW, height:LH, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <StatusBar backgroundColor="transparent" barStyle="light-content"/>
        <Image source={require('../../assets/images/homeBk.png')} style={{width:LW, height:LW/1242*2688, position: "absolute", left: 0, top: 0}} />
        <View style={styles.menuWrap}>
          {/* <TouchableOpacity onPress={()=>{this.props.navigation.navigate('PlayerPage')}} style={[styles.menuBtn, {borderRadius: 10}]}>
            <Text style={{fontSize: 36, color: '#fff', fontFamily: "Berlin Sans FB"}}>Start Game</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={()=>{this.props.navigation.navigate('PlayerPage')}} style={[styles.menuBtn, {borderTopLeftRadius: 10, borderTopRightRadius: 10}]}>
            <Text style={{fontSize: 36, color: '#fff', fontFamily: "Berlin Sans FB"}}>Start Game</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{Linking.openURL('https://apps.apple.com/us/app/throw-basketball/id1479330742?ls=1')}} style={styles.menuBtn}>
            <Text style={{fontSize: 36, color: '#fff', fontFamily: "Berlin Sans FB"}}>Review</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{Linking.openURL('http://throwbasketball.thejinhu.com/home/contact_us')}} style={[styles.menuBtn, {borderBottomWidth: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
            <Text style={{fontSize: 36, color: '#fff', fontFamily: "Berlin Sans FB"}}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textContainer: {
    paddingVertical: 50,
    bottom: 0,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: '#fff'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
  },
  bottomOverlay: {
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuWrap: {
    width: LW,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',    
  },
  menuBtn: {
    width: LW*2/3,
    height: LW*2/3*211/889,
    borderBottomWidth: 1,
    borderBottomColor: '#c11200',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(193,18,0,0.8)'
  }, 
  menuImg: {
    width: LW*2/3,
    height: LW*2/3*211/889
  }
});

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);