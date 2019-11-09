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

var playerImgArr = [
  require('../../assets/images/player-1.png'),
  require('../../assets/images/player-2.png'),
  require('../../assets/images/player-3.png'),
  require('../../assets/images/player-4.png'),
  require('../../assets/images/player-5.png'),
  require('../../assets/images/player-6.png'),
  require('../../assets/images/player-7.png'),
  require('../../assets/images/player-8.png'),
  require('../../assets/images/player-9.png'),
  require('../../assets/images/player-10.png'),
];
var playerSelImgArr = [
  require('../../assets/images/player-1-s.png'),
  require('../../assets/images/player-2-s.png'),
  require('../../assets/images/player-3-s.png'),
  require('../../assets/images/player-4-s.png'),
  require('../../assets/images/player-5-s.png'),
  require('../../assets/images/player-6-s.png'),
  require('../../assets/images/player-7-s.png'),
  require('../../assets/images/player-8-s.png'),
  require('../../assets/images/player-9-s.png'),
  require('../../assets/images/player-10-s.png'),
]





class PlayerPage extends React.Component {
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
      activeId: 1,
      player1: null,
      player2: null 
    };

  }


  componentDidMount() {
    
  }


  activePlayer( activeId ) {
    this.setState({
      activeId : activeId
    })
  }

  selectPlayer(id) {
    var { activeId } = this.state;
    if( activeId == 1 ){
      this.setState({player1: id})
    } else if( activeId == 2 ){
      this.setState({player2: id})
    }    
  }


  enterGame() {
    var {player1, player2} = this.state;

    if( player1 != null && player2 != null ){
      this.props.navigation.navigate('GamePage', {player1: player1, player2: player2})
    }
  }


  render() {
    var {player1, player2, activeId} = this.state;

    var loading = <Text> </Text>;
    if( this.state.loading ){
      loading = <Loading type="full"/>;
    }

    var playerArr = [];
    var playerCount = config.player_count;
    playerArr.push(
      <View key={'player-s-em1'} style={[styles.playerSelectWrap, {height: 40}]}>
        
      </View>
    )
    for( var i=0; i<playerCount; i++ ){
      playerArr.push(
        <TouchableOpacity key={'player-s-'+i} style={styles.playerSelectWrap} onPress={this.selectPlayer.bind(this, i)}>
          <Image source={playerSelImgArr[i]} style={{width: 80, height: 80}}/>
        </TouchableOpacity>
      )
    }
    playerArr.push(
      <View key={'player-s-em2'} style={[styles.playerSelectWrap, {height: 40}]}>
        
      </View>
    )

    var player1Elem = <View><Text> </Text></View>
    if( player1 != null ) player1Elem = <Image source={playerImgArr[player1]} style={{width: 168, height: 168}}/>
    var player2Elem = <View><Text> </Text></View>
    if( player2 != null ) player2Elem = <Image source={playerImgArr[player2]} style={{width: 168, height: 168}}/>

    return (
      <View style={{width: LW, height:LH, flex: 1, backgroundColor: '#22e5ff', justifyContent: 'center', alignItems: 'center'}}>
        <StatusBar backgroundColor="transparent" barStyle="light-content"/>
        <View style={{flexDirection: 'row', width: 310}}>
          <View style={{marginRight: 20}}>
            <View style={{marginTop: RateWH>2 ? 0 : 30, marginBottom: RateWH>2 ? 70 : 20}}>
              {
                activeId == 1 ? 
                <Text style={{fontSize: 36, color: '#0194a7', fontFamily: "Berlin Sans FB", marginBottom: 10}}>Player 1</Text> :
                <Text style={{fontSize: 36, color: '#fff', fontFamily: "Berlin Sans FB", marginBottom: 10}}>Player 1</Text>
              }
              <TouchableOpacity style={[styles.playerBtn, {
                borderColor: activeId == 1 ? '#01b4cc' : '#fff',
                backgroundColor: player1 == null ? 'rgba(255,255,255,0.5)' : Colors.playerColor[player1]
                }]} onPress={this.activePlayer.bind(this, 1)}>
                {player1Elem}
              </TouchableOpacity>
            </View>
            <View style={{marginBottom: 0}}>
              {
                activeId == 2 ?
                <Text style={{fontSize: 36, color: '#0194a7', fontFamily: "Berlin Sans FB", marginBottom: 10}}>Player 2</Text> :
                <Text style={{fontSize: 36, color: '#fff', fontFamily: "Berlin Sans FB", marginBottom: 10}}>Player 2</Text>
              }              
              <TouchableOpacity style={[styles.playerBtn, {
                borderColor: activeId == 2 ? '#01b4cc' : '#fff',
                backgroundColor: player2 == null ? 'rgba(255,255,255,0.5)' : Colors.playerColor[player2]
                }]} onPress={this.activePlayer.bind(this, 2)}>
                {player2Elem}
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <ScrollView bounces={false} style={{height: 520, width: 100}}>
              <View style={{}}>
                {playerArr}
              </View>
            </ScrollView>            
            <Image source={require("../../assets/images/playerSelectScrollGrad.png")} style={{width: 90, height: 70, position: 'absolute', left: 0, top: -2}}/>
            <Image source={require("../../assets/images/playerSelectScrollGrad-v.png")} style={{width: 90, height: 70, position: 'absolute', left: 0, bottom: -2}}/>
          </View>
          
        </View>

        <TouchableOpacity style={styles.enterGameBtn} onPress={this.enterGame.bind(this)}>
          <Text style={{fontSize: 36, color: '#fff', fontFamily: "Berlin Sans FB"}}>Enter Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={()=>{this.props.navigation.goBack()}}>
          <Text style={{fontSize: 16, color: '#fff', fontFamily: "Berlin Sans FB"}}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  playerBtn: {
    width: 184, 
    height: 184,
    borderWidth: 8, 
    borderColor: '#fff', 
    backgroundColor: 'rgba(255,255,255,0.5)', 
    borderRadius: 20
  },
  playerSelectWrap: {
    width: 80, 
    height: 80, 
    paddingHorizontal: 5,
    marginVertical: 5
  },
  textContainer: {
    paddingVertical: 50,
    bottom: 0,
  },
  enterGameBtn: {
    width: 300, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff9000', borderRadius: 10, marginTop: 20
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
    flexDirection: 'column'
  },
  menuBtn: {
    width: LW*2/3,
    height: LW*2/3*211/889,
    borderBottomWidth: 1,
    borderBottomColor: '#c11200'
  }, 
  menuImg: {
    width: LW*2/3,
    height: LW*2/3*211/889
  },
  backBtn: {
    position: "absolute", left: 20, top: RateWH>2 ? 50 : 30, paddingHorizontal: 5, paddingVertical: 5, borderRadius: 5, backgroundColor: '#1c1c3b'
  },
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
export default connect(mapStateToProps, mapDispatchToProps)(PlayerPage);