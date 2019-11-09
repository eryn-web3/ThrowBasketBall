import React, {
  Component,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  PropTypes,
} from 'prop-types';

// constant
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
const LW = Layout.window.width;
const LH = Layout.window.height;
const RateWH = LH/LW;
import config from '../../constants/config';

class Score extends Component {
  render() {
    var player1Score = 0;
    var player2Score = 0;    
    var score = this.props.score;
    var scores = score.split(':');
    if( scores.length == 2 ){
      player1Score = scores[0];
      player2Score = scores[1];
    }
    return (
      <View style={[styles.scoreContainer, {
        bottom: this.props.y,
      }]}
      >
        <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRightColor: '#37d351', borderRightWidth: 3}}>
          <Text style={[{
            fontSize: 32,
            fontWeight: 'bold',
            color: '#37d351',
          }]}
          >
            {player1Score}
          </Text>  
        </View>
        <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[{
            fontSize: 32,
            fontWeight: 'bold',
            color: '#37d351',
          }]}
          >
            {player2Score}
          </Text>  
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scoreContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: LW*0.175,
    left: LW/2-40,
    width: 84,
    height: 40,
    borderColor: '#37d351',
    borderWidth: 3,
    alignItems: 'center',
    borderRadius: 10
  },
});

Score.defaultProps = {
  y: 0,
  scored: null,
  score: 0,
};

Score.propTypes = {
  y: PropTypes.number,
  scored: PropTypes.bool,
  score: PropTypes.number,
};

export default Score;
