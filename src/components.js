import * as React from 'react';
import * as ReactDOM from 'react-dom';

var count = 0;

export var GameView = React.createClass({
  render: function () {
    return <div className="border" style={{width: this.props.game.cols*25-1, height: this.props.game.rows*25-1}}>
      { this.props.game.isGameOver ? 
          this.props.game.isGameLost() ? 
          <span>
            <h1 style={{margin:'22px'}}>GAME OVER</h1>
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
});

export var PhantomView = React.createClass({
  render: function () {
    return <div>
      {this.props.piece.points().map(sq => <Square key={count++} row={sq.row} col={sq.col} color={"white"} />)}
    </div>;
  }
});

export var HoldView = React.createClass({
  render: function() {
    return <div className="hold">
      <div>HOLD</div>
      <HoldPieceView piece={this.props.piece} />
    </div>;
  }
})

export var HoldPieceView = React.createClass({
  render: function() {
    return <div className="holdPiece">
      {this.props.piece.shape.pointsRotated('N').map(sq => <Square key={"row"+sq.row+"col"+sq.col}row={sq.row} col={sq.col} color={this.props.piece.shape.color} />)}
    </div>
  }
})

export var PieceView = React.createClass({
  render: function () {
    return <div>
      {this.props.piece.points().map(sq => <Square key={count++} row={sq.row} col={sq.col} color={sq.color} />)}
    </div>;
  }
});

export var RubbleView = React.createClass({
  render: function () {
    return <span>
      {this.props.rubble.map(sq => <Square key={"row"+sq.row+"col"+sq.col} row={sq.row} col={sq.col} color={sq.color} />)}
    </span>;
  }
});

export var ScoreView = React.createClass({
  render: function () {
    return <div className='score-display'>
      <div>Score: {this.props.score}</div>
      <div>Lines: {this.props.lines}</div>
    </div>;
  }
})

export var NextView = React.createClass({
  render: function () {
    return <div className="next">
      <div>NEXT</div>
      {this.props.nextPieces.map((piece, index) => <NextPieceView key={index} num={index} shape={piece.shape} /> )}
    </div>;
  }
})

export var NextPieceView = React.createClass({
  render: function() {
    var s = {
      position: 'relative',
      top: this.props.num*75 + 'px',
    }
    return <div style={s}>
      {this.props.shape.pointsRotated('N').map(sq => <Square key={"row"+sq.row+"col"+sq.col}row={sq.row} col={sq.col} color={this.props.shape.color} />)}
    </div>;
  }
})

export var Square = React.createClass({
    render: function() {
    		var s = {
        	left: (this.props.col-1) * 25 + 'px',
          top: ((this.props.row-1) * 25) + 'px',
          backgroundColor: this.props.color,
        };
        return <div className="square" style={s}></div>;
    }
});
