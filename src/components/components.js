import * as React from 'react'; 

var count = 0;

export class GameView extends React.Component {
  render() {
    return <div>
      <span>
        <PhantomView piece={this.props.game.phantomPiece} />
        <PieceView piece={this.props.game.fallingPiece} />
        <RubbleView rubble={this.props.game.rubble} />
        <NextView nextPieces={this.props.game.nextPieces} />
        <HoldView piece={this.props.game.heldPiece} />
      </span>
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
