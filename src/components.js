import * as React from 'react';
import * as ReactDOM from 'react-dom';

var count = 0;

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Name: ' + this.state.value + " Score: " + this.props.score);
    event.preventDefault();
  }

  render() {
    return <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input type="text" value={this.state.value} onChange={this.handleChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>;
  }
}

export class GameView extends React.Component {
  render() {
    let s = {
      width: this.props.game.cols*25-1, 
      height: this.props.game.rows*25-1,
    };
    return <div className="border" style={s}>
      { this.props.game.isGameOver ? 
          this.props.game.isGameLost() ?  
          <span>
            <h1 style={{margin:'22px'}}>GAME OVER</h1>
            <NameForm score={this.props.game.score} />
            <div style={{margin:'42px'}}>Press Enter to play again</div>
          </span> : 
          <span>
            <h1 style={{margin:'64px'}}>TETRIS</h1>
            <div style={{margin:'62px'}}>Press Enter to play</div>
          </span> :
        <span>
          <PhantomView piece={this.props.game.phantomPiece} />
          <PieceView piece={this.props.game.fallingPiece} />
          <RubbleView rubble={this.props.game.rubble} />
          <NextView nextPieces={this.props.game.nextPieces} />
          <HoldView piece={this.props.game.heldPiece} />
        </span>
      }
      <ScoreView score={this.props.game.score} lines={this.props.game.lines} />
    </div>;
  }
}

class PhantomView extends React.Component {
  render() {
    return <div>
      {this.props.piece.points().map(sq => 
        <Square 
          key={count++} 
          row={sq.row} 
          col={sq.col} 
          color={"white"} 
        />
      )}
    </div>;
  }
}

class HoldView extends React.Component {
  render() {
    return <div className="hold">
      <div>HOLD</div>
      <HoldPieceView piece={this.props.piece} />
    </div>;
  }
}

class HoldPieceView extends React.Component {
  render() {
    return <div className="holdPiece">
      {this.props.piece.shape.pointsRotated('N').map(sq => 
        <Square 
          key={"row"+sq.row+"col"+sq.col}
          row={sq.row} 
          col={sq.col} 
          color={this.props.piece.shape.color} 
        />
      )}
    </div>
  }
}

class PieceView extends React.Component {
  render() {
    return <div>
      {this.props.piece.points().map(sq => 
        <Square 
          key={count++} 
          row={sq.row} 
          col={sq.col} 
          color={sq.color} 
        />
      )}
    </div>;
  }
}

class RubbleView extends React.Component{
  render() {
    return <span>
      {this.props.rubble.map(sq => 
        <Square 
          key={"row"+sq.row+"col"+sq.col} 
          row={sq.row} 
          col={sq.col} 
          color={sq.color} 
        />
      )}
    </span>;
  }
}

class ScoreView extends React.Component{
  render() {
    return <div className='score-display'>
      <div>Score: {this.props.score}</div>
      <div>Lines: {this.props.lines}</div>
    </div>;
  }
}

class NextView extends React.Component{
  render() {
    return <div className="next">
      <div>NEXT</div>
      { this.props.nextPieces.map((piece, index) => 
        <NextPieceView 
          key={index} 
          num={index} 
          shape={piece.shape} 
        /> 
      )}
    </div>;
  }
}

class NextPieceView extends React.Component {
  render() { 
    let s = {
      position: 'relative',
      top: this.props.num*75 + 'px',
    }
    return <div style={s}>
      { this.props.shape.pointsRotated('N').map(sq => 
        <Square
          key={"row"+sq.row+"col"+sq.col} 
          row={sq.row} 
          col={sq.col} 
          color={this.props.shape.color} 
        />
      )}
    </div>;
  }
}

class Square extends React.Component {
  render() {
    let s = {
      left: (this.props.col-1) * 25 + 'px',
      top: ((this.props.row-1) * 25) + 'px',
      backgroundColor: this.props.color,
    };
    return <div className="square" style={s}></div>;
  }
}


