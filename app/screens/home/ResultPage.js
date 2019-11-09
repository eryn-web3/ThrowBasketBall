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




class ResultPage extends React.Component {
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
    
  }



  render() {

    var loading = <Text> </Text>;
    if( this.state.loading ){
      loading = <Loading type="full"/>;
    }

    return (
      <View style={{width: LW, height:LH, flex: 1, backgroundColor: 'fb3833'}}>
        <StatusBar backgroundColor="transparent" barStyle="light-content"/>
        <Text>Result Page</Text>        
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
export default connect(mapStateToProps, mapDispatchToProps)(ResultPage);