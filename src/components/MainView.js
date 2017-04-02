import * as React from 'react';
import {NameForm} from './NameForm';
import {GameView} from './components';
import {ScoreView} from './ScoreView';
import {HighScores} from './HighScores';

export class MainView extends React.Component {
  render() {
    let s = {
      width: 250, 
      height: 500,
    };
    switch(this.props.passedState.status) {
      case 'splash':
        return <div className="border" style={s}>
          <h1 style={{margin:'64px'}}>TETRIS</h1>
          <div style={{margin:'62px'}}>Press Enter to play</div>
        </div>;
      case 'playing':
        return <div className="border" style={s}>
          <GameView game={this.props.passedState.game} />
          <ScoreView score={this.props.passedState.game.score} lines={this.props.passedState.game.lines} />
        </div>; 
      case 'paused':
        return <div className="border" style={s}>
          <h1 style={{margin:'64px'}} >PAUSED</h1>
          <ScoreView score={this.props.passedState.game.score} lines={this.props.passedState.game.lines} />
        </div>; 
      case 'gameover':
        return <div className="border" style={s}>
          <h1 style={{margin:'22px'}}>GAME OVER</h1>
          <HighScores />
          <NameForm score={this.props.passedState.game.score} />
          <div style={{margin:'42px'}}>Press Enter to play again</div>
          <ScoreView score={this.props.passedState.game.score} lines={this.props.passedState.game.lines} />
        </div>; 
      default: return <div className="border" style={s}/>
    }
  }
}