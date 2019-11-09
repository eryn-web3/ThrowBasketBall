import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import SystemSetting from 'react-native-system-setting';
import SplashScreen from 'react-native-splash-screen';
import TBB_UTILS from '../../utils/ThrowBasketBallUtils'

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ApiSettingsActions from '../../actions/apisettings';

// constant
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
const LW = Layout.window.width;
const LH = Layout.window.height;
const RateWH = LH/LW;
import config from '../../constants/config';
const CURRENCYARR = config.currencyArr;

class LoadingPage extends React.Component {
  static navigationOptions = {
    header: null,
  };

  timer: null;

  /**
   * @method constructor
   * @description This is constructor function
   */
  constructor(props) {
    super(props);

    this.state = {
      loadingText: 'Loading App...'
    }

    this.connection = this.connection.bind(this);
  }

  timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  }


  async connection(){

    var apiSettings = await this.timeout(5000, fetch(config.api_url+'/admin/settings/getSetting', {
      method: 'GET',
      timeout: 5000
    })).then(data => { 
      var ret = JSON.parse(data._bodyText);
      return ret;
    })
    .catch(e => {
      TBB_UTILS.log(5, "-- LoadingPage initialize connectivity1 e : ", e);
      this.setState({
        loadingText: 'Internet connection is not valid. \nPlase wait for a while.'
      })
      return null;
    });

    TBB_UTILS.log(3, '-- LoadingPage componentWillMount apiSettings : ', apiSettings);
    if( !apiSettings ) return;

    var setApiSettings = this.props.actions.ApiSettingsActions.setApiSettings;
    setApiSettings(apiSettings);
      
    var url = 'https://developer.apple.com';
    TBB_UTILS.log(3, '-- LoadingPage componentWillMount url : ', url);

    var connectivity = await this.timeout(5000, fetch(url, {
      method: 'GET',
      timeout: 5000
    })).then(data => { return data })
    .catch(e => {
      TBB_UTILS.log(5, "-- LoadingPage initialize connectivity2 e : ", e);
      this.setState({
        loadingText: 'Internet connection is not valid. \nPlase wait for a while.'
      })
      return null;
    });
    TBB_UTILS.log(5, "-- LoadingPage componentWillMount connectivity : ", connectivity);

    if( !connectivity || connectivity.status !== 200 ){
      TBB_UTILS.log(5, "-- LoadingPage componentWillMount connectivity : fail");
      this.setState({
        loadingText: 'Internet connection is not valid. \nPlase wait for a while.'
      })
    } else {    
      TBB_UTILS.log(5, "-- LoadingPage componentWillMount connectivity : success");
      if( apiSettings.apiStatus == 1 ){
        this.props.navigation.navigate('ApiPage'); 
      } else {
        this.props.navigation.navigate('HomePage'); 
      }
      clearInterval(this.timer);
    }
  }


  /**
   * @method componentWillMount
   * @description This function is called component is loaded.
   */
  componentWillMount() {
    this.connection();

    var that = this;
    this.timer = setInterval( async function(){      
      that.connection();
    }, 2000);
  }


  render() {
    var { loadingText } = this.state;
    return (
      <View style={{width: LW, height:LH, flex: 1}}>
        <StatusBar backgroundColor="transparent" barStyle="light-content"/>
        <View style={styles.mainContent}>
          <Image
            source={require('../../assets/images/icon/Splash3x.png')} 
            style={{width: LW, height: LW/1125*2436, position: 'absolute', left: 0, top: 0}}
          />
          <View style={styles.content}>
            {/* <ActivityIndicator size="large" color={Colors.buttonColorCyan}/> */}
            <Text style={{display: 'none', color: '#2ee6f8', fontSize: 18, textAlign: "center", position: 'absolute', top: 60}}>{loadingText}</Text>
          </View>
          <View style={styles.contact}>
            {/* <ActivityIndicator size="large" color={Colors.buttonColorCyan}/> */}
            <Text style={{color: '#2ee6f8', fontSize: 16, textAlign: "center"}}>
              Contact Us: pan74266693@qq.com
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute', 
    left: 0, 
    top: 0, 
    width: LW,
    height: LH,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',   
  },
  backgroundGrad: {
    alignItems: 'center', flex: 1, width: LW
  },  
  apiContent: {
    flexDirection: 'column',
    width: LW,
    height: LH,
  },
  mainContent: {
    flexDirection: 'column',
    width: LW,
    height: LH,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: LH*3/5
  },
  contact: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    bottom: 150,
    width: LW
  },
});


function mapStateToProps(state) {
  return {
    apiSettings: state.apiSettings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ApiSettingsActions: bindActionCreators(ApiSettingsActions, dispatch),
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LoadingPage);