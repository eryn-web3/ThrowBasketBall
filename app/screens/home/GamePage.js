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
import Icon from 'react-native-vector-icons/FontAwesome'

// custom component
import Loading from '../../components/common/Loading';

import Ball from '../../components/basketball/Ball';
import Hoop from '../../components/basketball/Hoop';
import Net from '../../components/basketball/Net';
import Floor from '../../components/basketball/Floor';
import Emoji from '../../components/basketball/Emoji';
import Score from '../../components/basketball/Score';

import Vector from '../../utils/Vector';

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

// physical variables
const gravity = 0.6; // gravity
const radius = 48; // ball radius
const rotationFactor = 10; // ball rotation factor

// components sizes and positions
const FLOOR_HEIGHT = 48;
const FLOOR_Y = 11;
const HOOP_Y = Dimensions.get('window').height - 227;
const NET_HEIGHT = 6;
const NET_WIDTH = 83;
const NET_Y = Dimensions.get('window').height - (LW*0.575);
const NET_X = (Dimensions.get('window').width / 2) - (NET_WIDTH / 2);
const NET_LEFT_BORDER_X = NET_X + NET_HEIGHT / 2;
const NET_LEFT_BORDER_Y = NET_Y;
const NET_RIGHT_BORDER_X = NET_X + NET_WIDTH - NET_HEIGHT / 2;
const NET_RIGHT_BORDER_Y = NET_LEFT_BORDER_Y;

// ball lifecycle
const LC_WAITING = 0;
const LC_STARTING = 1;
const LC_FALLING = 2;
const LC_BOUNCING = 3;
const LC_RESTARTING = 4;
const LC_RESTARTING_FALLING = 5;

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




class GamePage extends React.Component {
  static navigationOptions = {
    header: null,
  };

  timer: null

  /**
   * @method constructor
   * @description This is constructor function
   */
  constructor(props) {
    super(props);

    this.interval = null;    

    // initialize ball states
    this.state = {
      hash: '',
      loading: false,
      x: Dimensions.get('window').width / 2 - radius,
      y: FLOOR_Y,
      vx: 0,
      vy: 0,
      rotate: 0,
      scale: 1,
      lifecycle: LC_WAITING,
      scored: null,
      score: '0:0',
      index: 0,
      player1Score: [null, null, null, null, null, null, null, null, null, null],
      player2Score: [null, null, null, null, null, null, null, null, null, null],
      player1: this.props.navigation.state.params.player1,
      player2: this.props.navigation.state.params.player2,
      visibleResultModal: false,
      isCongrate: false
    };

  }


  /**
   * @method componentWillMount
   * @description This function is called component is loaded.
   */
  async componentWillMount() {
        
    Linking.getInitialURL().then(url => {
      TBB_UTILS.log(1, 'GamePage initialize url : ', url);
      this.navigate(url);
    });

    if (this.interval) {
      clearInterval(this.interval);
    }
  }


  componentDidMount() { // B
    
    
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    } else {
      TBB_UTILS.log(1, 'GamePage componentDidMount ios');
      Linking.addEventListener('url', this.handleOpenURL);
    }

    this.interval = setInterval(this.update.bind(this), 1000 / 60);
  }


  /**
   * @method componentWillUnmount
   * @description This function is called component is unmount.
   */
  componentWillUnmount() { // C
    Linking.removeEventListener('url', this.handleOpenURL);
  }


  handleOpenURL = (event) => { // D

    console.log('----- handleOpenURL event : ', event);
    this.navigate(event.url);
  }


  navigate = (url) => { // E
    const { navigate } = this.props.navigation;
    const route = url.replace(/.*?:\/\//g, '');
  
    TBB_UTILS.log(13, '------- GamePage navigate route : ', route);
    if( route.indexOf('home/restore/') > -1 ){      
      var hash = route.replace('home/restore/', '');
      TBB_UTILS.log(13, '------- GamePage navigate hash : ', hash);
      clearTimeout(this.timer);
      this.setState({
        hash: hash,
        isHash: true
      });
      return;
    }
  }


  onStart(angle) {
    if (this.state.lifecycle === LC_WAITING) {
      this.setState({
        vx: angle * 0.2,
        vy: -16,
        lifecycle: LC_STARTING,
      });
    }
  }


  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  circlesColliding(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.radius + circle2.radius) {
      return true;
    }
    return false;
  }

  // Inspired by http://www.adambrookesprojects.co.uk/project/canvas-collision-elastic-collision-tutorial/
  updateCollisionVelocity(nextState, ball, netBorder) {
    const xDistance = (netBorder.x - ball.x);
    const yDistance = (netBorder.y - ball.y);
    let normalVector = new Vector(xDistance, yDistance);
    normalVector = normalVector.normalise();

    const tangentVector = new Vector((normalVector.getY() * -1), normalVector.getX());

    // create ball scalar normal direction.
    const ballScalarNormal = normalVector.dot(ball.velocity);
    const netScalarNormal = normalVector.dot(netBorder.velocity);

    // create scalar velocity in the tagential direction.
    const ballScalarTangential = tangentVector.dot(ball.velocity);

    const ballScalarNormalAfter = (ballScalarNormal * (ball.mass - netBorder.mass) +
     2 * netBorder.mass * netScalarNormal) / (ball.mass + netBorder.mass);

    const ballScalarNormalAfterVector = normalVector.multiply(ballScalarNormalAfter);
    const ballScalarNormalVector = (tangentVector.multiply(ballScalarTangential));

    const nextVelocity = ballScalarNormalVector.add(ballScalarNormalAfterVector);

    if (ball.y < NET_Y + NET_HEIGHT / 2) {
      nextState.vx = nextVelocity.x;
    } else {
      nextState.vx = -nextVelocity.x;
    }

    nextState.vy = nextVelocity.y;
    nextState.x = this.state.x + nextState.vx;
    nextState.y = this.state.y - nextState.vy;
  }

  handleCollision(nextState) {
    if (nextState.lifecycle !== LC_FALLING && nextState.lifecycle !== LC_BOUNCING) return;

    const _self = this;

    const ball = {
      x: nextState.x + radius,
      y: nextState.y + radius,
      radius: radius * nextState.scale,
      velocity: {
        getX() {
          return _self.state.vx;
        },
        getY() {
          return _self.state.vy;
        },
      },
      mass: 2,
    };
    const netLeftBorder = {
      x: NET_LEFT_BORDER_X,
      y: NET_LEFT_BORDER_Y,
      radius: NET_HEIGHT / 2,
      velocity: {
        getX() {
          return 0;
        },
        getY() {
          return 0;
        },
      },
      mass: 10,
    };
    const netRightBorder = {
      x: NET_RIGHT_BORDER_X,
      y: NET_RIGHT_BORDER_Y,
      radius: NET_HEIGHT / 2,
      velocity: {
        getX() {
          return 0;
        },
        getY() {
          return 0;
        },
      },
      mass: 10,
    };

    const isLeftCollision = this.circlesColliding(ball, netLeftBorder);
    if (isLeftCollision) {
      nextState.lifecycle = LC_BOUNCING;
      this.updateCollisionVelocity(nextState, ball, netLeftBorder);
    } else {
      const isRightCollision = this.circlesColliding(ball, netRightBorder);
      if (isRightCollision) {
        nextState.lifecycle = LC_BOUNCING;
        this.updateCollisionVelocity(nextState, ball, netRightBorder);
      }
    }
  }

  updateVelocity(nextState) {
    nextState.vx = this.state.vx;
    if (nextState.lifecycle === LC_STARTING && nextState.y < NET_Y - 200) {
      nextState.vy = this.state.vy;
    } else {
      nextState.vy = this.state.vy + gravity;
    }
  }

  updatePosition(nextState) {
    nextState.x = this.state.x + nextState.vx;
    nextState.y = this.state.y - nextState.vy;

    if (nextState.lifecycle === LC_STARTING && nextState.y < this.state.y) {
      nextState.lifecycle = LC_FALLING;
    }
    if (nextState.lifecycle === LC_RESTARTING && nextState.y < this.state.y) {
      nextState.lifecycle = LC_RESTARTING_FALLING;
    }

    var {index} = nextState;
    var id = Math.floor(index/2);
    if (this.state.scored === null) {
      if (this.state.y + radius > NET_Y + NET_HEIGHT / 2 && nextState.y + radius < NET_Y + NET_HEIGHT / 2) {
        if (nextState.x + radius > NET_LEFT_BORDER_X && nextState.x + radius < NET_RIGHT_BORDER_X) {
          nextState.scored = true;
          
          if( index%2 == 0 ) nextState.player1Score[id] = true;
          else nextState.player2Score[id] = true;
        } else {
          nextState.scored = false;
          if( index%2 == 0 ) nextState.player1Score[id] = false;
          else nextState.player2Score[id] = false;
        }
        var player1Score=0, player2Score=0;
        for( var i=0; i<10; i++ ){
          if( nextState.player1Score[i] === true ) player1Score++;
          if( nextState.player2Score[i] === true ) player2Score++;
        }
        nextState.score = player1Score + ':' + player2Score;
        // alert(JSON.stringify(nextState.player1Score));
        // alert(JSON.stringify(nextState.player2Score));
      }
    }
  }

  updateScale(nextState) {
    if (nextState.lifecycle === LC_BOUNCING || nextState.lifecycle === LC_RESTARTING || nextState.lifecycle === LC_RESTARTING_FALLING) return;

    let scale = this.state.scale;
    if (scale > 0.4 && this.state.y > FLOOR_HEIGHT) {
      scale -= 0.01;
    }

    nextState.scale = scale;
  }

  updateRotate(nextState) {
    nextState.rotate = this.state.rotate + (nextState.vx * rotationFactor);
  }

  handleRestart(nextState) {
    var { index } = this.state;

    if (nextState.lifecycle === LC_RESTARTING_FALLING && nextState.y <= FLOOR_Y) {
      // in front of the Floor
      // will restart to 'Waiting' lifecycle step
      nextState.y = FLOOR_Y;
      nextState.vx = 0;
      nextState.vy = 0;
      nextState.rotate = 0;
      nextState.scale = 1;
      nextState.lifecycle = LC_WAITING;

      nextState.scored = null;
    }

    const outOfScreen = (nextState.x > Dimensions.get('window').width + 100 || nextState.x < 0 - (radius * 2) - 100);

    if (
      (outOfScreen === true)
      || ((nextState.lifecycle === LC_FALLING || nextState.lifecycle === LC_BOUNCING) && (nextState.y + (radius * nextState.scale * 2) < FLOOR_Y + radius * -2))
    ) {
      if (outOfScreen && nextState.scored === null) {
        nextState.scored = false;
        var id = Math.floor(index/2);
        if( index%2 == 0 ) nextState.player1Score[id] = false;
        else nextState.player2Score[id] = false;
      }

      // behind the Floor
      // will be thrown to the front of the floor
      nextState.y = FLOOR_Y;

      if (nextState.scored === true) {
        nextState.x = this.randomIntFromInterval(4, Dimensions.get('window').width - (radius * 2) - 4);
      } else {
        // nextState.x = Dimensions.get('window').width / 2 - radius;
        nextState.x = this.randomIntFromInterval(4, Dimensions.get('window').width - (radius * 2) - 4);
      }

      // nextState.x = Dimensions.get('window').width / 2 - radius;
      nextState.vy = -8;
      nextState.vx = 0;
      nextState.scale = 1;
      nextState.rotate = 0;
      nextState.index++;
      nextState.lifecycle = LC_RESTARTING;

      if( index == 19 ){
        setTimeout(function(){
          this.setState({
            visibleResultModal: true,
            isCongrate: true
          })
          setTimeout(function(){
            this.setState({
              isCongrate: false
            })
          }.bind(this), 2000)
        }.bind(this), 1000)
      }
      
    }
  }

  update() {
    if (this.state.lifecycle === LC_WAITING) return;

    let nextState = null;
    nextState = Object.assign({}, this.state);
    this.updateVelocity(nextState);
    this.updatePosition(nextState);
    this.updateScale(nextState);
    this.updateRotate(nextState);

    this.handleCollision(nextState);
    this.handleRestart(nextState);

    this.setState(nextState);
  }

  renderNet(render) {
    if (render === true) {
      return (
        <Net y={NET_Y} x={NET_X} height={NET_HEIGHT} width={NET_WIDTH} />
      );
    }
    return null;
  }

  renderFloor(render) {
    if (this.state.lifecycle === LC_RESTARTING || this.state.lifecycle === LC_RESTARTING_FALLING) {
      render = !render;
    }

    if (render === true) {
      return (
        <Floor height={FLOOR_HEIGHT} />
      );
    }
    return null;
  }

  renderPlayer1(){
    var {index, player1, player2} = this.state;
    var isPlayer = false;
    if( index%2 == 0 ) isPlayer = true;
    return (
      <View style={{position: 'absolute', left: 20, top: RateWH > 2 ? 350 : 280, width: LW/4+10, height: LW/4+10, backgroundColor: Colors.playerTransColor[player1], borderRadius: 20, borderColor: isPlayer ? Colors.orangeColor : Colors.playerColor[player1], borderWidth: 5}}>
        <Image source={playerImgArr[player1]} style={{width: LW/4, height: LW/4}}/>
      </View>
      
    )
  }

  renderPlayer1Balls(){
    var {index, player1, player2} = this.state;
    var ballArr = [];
    for( var i=0; i<5; i++ ){
      for( var j=0; j<2; j++ ){
        var player1Index = i*2+j;    
        var ballImg = <Image source={require('../../assets/images/ball-small.png')} style={{width: 25, height: 25, opacity: 0.3}}/>
        if( this.state.player1Score[player1Index] == true ){
          var ballImg = <Image source={require('../../assets/images/ball-small.png')} style={{width: 25, height: 25, opacity: 1}}/>
        } else if( this.state.player1Score[player1Index] == false ){
          var ballImg = <Image source={require('../../assets/images/ball-small-dead.png')} style={{width: 25, height: 25, opacity: 1}}/>
        }
        ballArr.push(
          <View style={{position: 'absolute', left: j*30, top: i*30, width: 30, height: 30, justifyContent: 'center', alignItems: 'center'}}>
            {ballImg}
          </View>
        )
      }
    }
    return (
      <View style={{position: 'absolute', left: 20, top: RateWH > 2 ? 350+LW/4+20 : 280+LW/4+20, width: 30*2+4, height: 30*10/2+4, backgroundColor: Colors.whiteOpacity05, borderRadius: 10, borderColor: Colors.playerColor[player1], borderWidth: 2 }}>
        {ballArr}
      </View>
    )
  }

  renderPlayer2(){
    var {index, player1, player2} = this.state;
    var isPlayer = false;
    if( index%2 == 1 ) isPlayer = true;
    return (
      <View style={{position: 'absolute', right: 20, top: RateWH > 2 ? 350 : 280, width: LW/4+10, height: LW/4+10, backgroundColor: Colors.playerTransColor[player2], borderRadius: 20, borderColor: isPlayer ? Colors.orangeColor : Colors.playerColor[player2], borderWidth: 5}}>
        <Image source={playerImgArr[player2]} style={{width: LW/4, height: LW/4}}/>
      </View>
      
    )
  }

  renderPlayer2Balls(){
    var {index, player1, player2} = this.state;
    var ballArr = [];
    for( var i=0; i<5; i++ ){
      for( var j=0; j<2; j++ ){
        var player2Index = i*2+j;    
        var ballImg = <Image source={require('../../assets/images/ball-small.png')} style={{width: 25, height: 25, opacity: 0.3}}/>
        if( this.state.player2Score[player2Index] == true ){
          var ballImg = <Image source={require('../../assets/images/ball-small.png')} style={{width: 25, height: 25, opacity: 1}}/>
        } else if( this.state.player2Score[player2Index] == false ){
          var ballImg = <Image source={require('../../assets/images/ball-small-dead.png')} style={{width: 25, height: 25, opacity: 1}}/>
        }
        ballArr.push(
          <View style={{position: 'absolute', left: j*30, top: i*30, width: 30, height: 30, justifyContent: 'center', alignItems: 'center'}}>
            {ballImg}
          </View>
        )
      }
    }
    return (
      <View style={{position: 'absolute', right: 20, top: RateWH > 2 ? 350+LW/4+20 : 280+LW/4+20, width: 30*2+4, height: 30*10/2+4, backgroundColor: Colors.whiteOpacity05, borderRadius: 10, borderColor: Colors.playerColor[player2], borderWidth: 2 }}>
        {ballArr}
      </View>
    )
  }

  retry(){
    this.setState({
      x: Dimensions.get('window').width / 2 - radius,
      y: FLOOR_Y,
      vx: 0,
      vy: 0,
      rotate: 0,
      scale: 1,
      lifecycle: LC_WAITING,
      scored: null,
      score: '0:0',
      index: 0,
      player1Score: [null, null, null, null, null, null, null, null, null, null],
      player2Score: [null, null, null, null, null, null, null, null, null, null],
      player1: this.props.navigation.state.params.player1,
      player2: this.props.navigation.state.params.player2,
      visibleResultModal: false,
      isCongrate: false
    })
  }  

  render() {
    var { visibleResultModal, player1Score, player2Score, player1, player2, isCongrate } = this.state;

    var loading = <Text> </Text>;
    if( this.state.loading ){
      loading = <Loading type="full"/>;
    }

    if( visibleResultModal ){
      var p1S=0, p2S=0;
      for( var i=0; i<10; i++ ){
        if( player1Score[i] === true ) p1S++;
        if( player2Score[i] === true ) p2S++;
      }
      var winId = p1S > p2S ? player1 : p1S < p2S ? player2 : null

      var winPlayer = <View></View>
      if( winId != null ){
        winPlayer = <View style={{alignItems: 'center'}}>
                      <Text style={{fontSize: 28, color: '#fff', fontFamily: "Berlin Sans FB"}}>Round is finished</Text>                      
                      <Text style={{fontSize: 50, color: '#ffd200', fontFamily: "Berlin Sans FB", fontWeight: 'bold', marginTop: 20}}>Win Player {winId == player1 ? '1' : '2'} !</Text>
                      <Image source={playerImgArr[winId]} style={{width: LW*3/4, height: LW*3/4, marginVertical: 20}}/>
                      <TouchableOpacity style={{backgroundColor: '#32abff', width: 300, alignItems: 'center', paddingVertical: 10, borderRadius: 10}} onPress={this.retry.bind(this)}>
                        <Text style={{fontSize: 30, color: '#fff', fontFamily: "Berlin Sans FB"}}>Retry</Text>
                      </TouchableOpacity>
                    </View>
      } else {
        winPlayer = <TouchableOpacity style={{backgroundColor: '#32abff', width: 300, alignItems: 'center', paddingVertical: 10, borderRadius: 10}} onPress={this.retry.bind(this)}>
                      <Text style={{fontSize: 24, color: '#fff', fontFamily: "Berlin Sans FB"}}>Retry</Text>
                    </TouchableOpacity>
      }
      
    }

    return (
      <View style={{width: LW, height:LH, flex: 1}}>
        <StatusBar backgroundColor="transparent" barStyle="light-content"/>      
        <Image source={require('../../assets/images/gameBk.png')} style={{width:LW, height:LW/1242*2688, position: "absolute", left: 0, top: 0}} />
        <Score y={FLOOR_HEIGHT * 3} score={this.state.score} scored={this.state.scored} />
        <Hoop y={HOOP_Y} />
        {this.renderPlayer1()}
        {this.renderPlayer1Balls()}
        {this.renderPlayer2()}
        {this.renderPlayer2Balls()}
        {this.renderNet(this.state.lifecycle === LC_STARTING)}
        {this.renderFloor(this.state.vy <= 0)}
        <Ball
          onStart={this.onStart.bind(this)}
          x={this.state.x}
          y={this.state.y}
          radius={radius}
          rotate={this.state.rotate}
          scale={this.state.scale}
        />
        {this.renderNet(this.state.lifecycle !== LC_STARTING)}
        {this.renderFloor(this.state.vy > 0)}
        <Emoji y={NET_Y} scored={this.state.scored} />

        <TouchableOpacity style={styles.backBtn} onPress={()=>{this.props.navigation.goBack()}}>
          <Text style={{fontSize: 16, color: '#fff', fontFamily: "Berlin Sans FB"}}>Back</Text>
        </TouchableOpacity>
        
        <Modal
          transparent
          animationType={'slide'}
          visible={this.state.visibleResultModal}
          onRequestClose={()=>{this.setState({visibleResultModal: false})}}
        >
          <View style={{width: "100%", flex: 1}}>            
            <View style={styles.modalWrapStyle}>              
              <View style={styles.modalStyle}>
                <Image source={require('../../assets/images/giphy.gif')} style={{width: LW, height: LW*480/270, position: 'absolute', left: 0, right: 0, display: winId != null && isCongrate ? 'flex' : 'none'}}/>
                <TouchableOpacity style={styles.modalClose} onPress={()=>{this.setState({visibleResultModal: false})}}>
                  <Icon name="times" size={20} color="white" />
                </TouchableOpacity>
                
                <View style={[styles.pannelStyle, {alignItems: 'center', justifyContent: 'center', height: RateWH>2 ? LH-300 : LH-200}]}>  
                  {winPlayer}
                </View>
              </View>
            </View>          
          </View>
        </Modal>
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
  backBtn: {
    position: "absolute", left: 20, top: RateWH>2 ? 50 : 30, paddingHorizontal: 5, paddingVertical: 5, borderRadius: 5, backgroundColor: '#1c1c3b'
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
  modalWrapStyle: {
    flex: 1,
    width: LW,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  modalStyle: {
    marginTop: RateWH > 2 ? 150 : 120,
    width: LW,
    height: LH-(RateWH > 2 ? 150 : 120),
    backgroundColor: 'rgba(231,45,26,0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalClose: {
    marginTop: -15,
    marginLeft: 30,
    width: 30,
    height: 30,
    backgroundColor: '#32abff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    paddingTop: 5,
    paddingLeft: 7,
  },
  pannelStyle: {
    paddingTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
  },
  pannelHeader: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20
  },
  pannelDescription: {
    color: Colors.textColorBlueOpacity,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10
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
export default connect(mapStateToProps, mapDispatchToProps)(GamePage);