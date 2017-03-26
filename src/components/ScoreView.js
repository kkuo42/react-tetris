import * as React from 'react';

export class ScoreView extends React.Component{
  render() {
    return <div className='score-display'>
      <div>Score: {this.props.score}</div>
      <div>Lines: {this.props.lines}</div>
    </div>;
  }
}