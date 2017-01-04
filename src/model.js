import * as _ from 'underscore';

export class Point {
  constructor(row,col,color) {
    this.row = row;
    this.col = col;
    this.color = color;
  }
  add(otherPoint) {
    return new Point(this.row -1 + otherPoint.row, this.col - 1 + otherPoint.col);
  }
  addRow(rowNum) {
    return new Point(this.row -1 + rowNum, this.col);
  }
  addColor(color) {
    return new Point(this.row, this.col, color);
  }
  sameAs(p2) {
    return this.row === p2.row && this.col === p2.col;
  }
}

export class Tetromino {
  constructor(name, rotator, color) {
    this.name = name; 
    this.rotator = rotator;
    this.color = color;
  }
  pointsRotated(rotation) {
    return this.rotator(rotation);
  }
}

// an instance of a tetromino on the board
export class Piece {
  constructor(shape, rows, cols, offset = new Point(1,4), rotation = 'N') {
    this.shape = shape;
    this.rows = rows;
    this.cols = cols;
    this.offset = offset;
    this.rotation = rotation;
  }  

  points() {
    return this.shape.pointsRotated(this.rotation).map(point => point.add(this.offset)).map(point => point.addColor(this.shape.color));
  }
  pointsNoOffset() {
    return this.shape.pointsRotated(this.rotation);
  }
  maxRow() {
    return Math.max.apply(null, this.points().map(point => point.row));
  }
  maxCol() {
    return Math.max.apply(null, this.points().map(point => point.col));
  }
  minCol() {
    return Math.min.apply(null, this.points().map(point => point.col));
  }
  rotate() {
    this.rotation = Piece.rotations()[(Piece.rotations().indexOf(this.rotation)+1) % 4];
  }
  unRotate() {
    this.rotation = Piece.rotations()[(Piece.rotations().indexOf(this.rotation)-1) % 4];
  }
  hasPoint(point) {
    return this.points().some(item => item.sameAs(point));
  }
  fallOne() {
    this.offset = new Point(this.offset.row+1, this.offset.col);
  }
  liftOne() {
    this.offset = new Point(this.offset.row-1, this.offset.col);
  }
  left() {
    this.offset = new Point(this.offset.row, this.offset.col-1);
  }
  right() {
    this.offset = new Point(this.offset.row, this.offset.col+1);
  }
  static rotations() {
    return ['N','E','S','W'];
  }
}

export class Game {
  constructor() {
    this.time = 0;
    this.rows = 20;
    this.cols = 10;
    this.startNextGame();
    this.isGameOver = true;
  }

  startNextGame() {
    this.score = 0;
    this.lines = 0;
    this.rubble = [];
    this.nextPieces = [];
    this.nextPieces = this.nextPieces.concat(this.newPiece());
    this.nextPieces = this.nextPieces.concat(this.newPiece());
    this.nextPieces = this.nextPieces.concat(this.newPiece());
    this.startAPiece();
    this.heldPiece = new Piece(new Tetromino('empty', x => [], 'white'), this.rows, this.cols);
    this.isGameOver = false;
    return this;
  }
  startAPiece() {
    this.usedHold = false;
    this.fallingPiece = this.nextPieces.shift();
    this.nextPieces = this.nextPieces.concat(this.newPiece());
    this.calculatePhantom();
  }
  newPiece() {
    return new Piece(shapes.selectRandom(), this.rows, this.cols);
  }

  calculatePhantom() {
    this.phantomPiece = new Piece(this.fallingPiece.shape, this.rows, this.cols, this.fallingPiece.offset, this.fallingPiece.rotation);
    while(!this.PieceOverlapsRubble(this.phantomPiece) && !this.PieceIsOutOfBounds(this.phantomPiece)) {
      this.phantomPiece.fallOne();
    }
    this.phantomPiece.liftOne();

  }
  hold() {
    if(this.usedHold !== true) {
      const prev = this.heldPiece;
      this.heldPiece = this.fallingPiece;
      if(prev.shape.name === "empty") {
        this.startAPiece();
      }
      else {
        this.fallingPiece = new Piece(prev.shape, this.rows, this.cols);
        this.calculatePhantom();
      }
      this.usedHold = true;
    }
    return this;
  }
  tick() {
    if (this.fallingPiece.maxRow() == this.rows) {
      this.convertToRubble();
    }
    var nextPos = this.fallingPiece.points().map(p => new Point(p.row+1,p.col));
    if (nextPos.some(p => this.rubble.some(r => r.sameAs(p)))) {
      this.convertToRubble();
    };

    this.transactionDo(()=>this.fallingPiece.fallOne(), ()=> this.fallingPiece.liftOne());
    return this;
  }

  collapseRow(row) {
    this.rubble = this.rubble.filter(point => point.row !== row);
    this.rubble.filter(point => point.row < row).forEach(point => point.row +=1);
  }

  completedRows() {
    let completedRows = _.range(1, this.rows+1).filter(row =>
      _.range(1, this.cols+1).every(col => 
        this.rubble.some(point => point.row === row && point.col === col))
    );
    return completedRows;
  }

  calculateAward(numRows) {
    const map = {
      0: 0,
      1: 40,
      2: 100,
      3: 300,
      4: 1200
    };
    return map[numRows];
  }

  isGameLost() {
    return this.rubble.some(point => point.row === 1);
  }

  convertToRubble() {
    this.rubble = this.rubble.concat(this.fallingPiece.points());
    const completedRows = this.completedRows();
    completedRows.forEach(row => this.collapseRow(row));
    this.score += this.calculateAward(completedRows.length);
    this.lines += completedRows.length;

    if (this.isGameLost()) {
      this.isGameOver = true;
    } 
    else {
      this.startAPiece();
    }
  }
  rotate() {
    this.transactionDo(()=>this.fallingPiece.rotate(), ()=> this.fallingPiece.unRotate());
    return this;
  }
  left() {
    this.transactionDo(()=>this.fallingPiece.left(), ()=> this.fallingPiece.right());
    return this;
  }
  right() {
    this.transactionDo(()=>this.fallingPiece.right(), ()=> this.fallingPiece.left());
    return this;
  }
  fall() {
    if(this.isGameOver) {
      return this;
    }

    while(!this.PieceOverlapsRubble(this.fallingPiece) && !this.PieceIsOutOfBounds(this.fallingPiece)) {
      this.fallingPiece.fallOne();
    }

    this.fallingPiece.liftOne();
    this.convertToRubble();

    return this;
  }
  PieceIsOutOfBounds(piece) {
    return piece.minCol() < 1 ||
      piece.maxCol() > this.cols ||
      piece.maxRow() > this.rows;
  }
  PieceOverlapsRubble(piece) {
    return piece.points().some(p => this.rubble.some(r => r.sameAs(p)));
  }
  transactionDo(thing, compensation) {
    thing();
    if (this.PieceIsOutOfBounds(this.fallingPiece) || this.PieceOverlapsRubble(this.fallingPiece)) {
      compensation();
    }
    this.calculatePhantom();
  }
}

// dictionary of shape type to square offsets
export var shapes = {
  'O': new Tetromino('O', rotation => [new Point(1,1),new Point(1,2), new Point(2,1),new Point(2,2)], 'yellow'),
  'I': new Tetromino('I', rotation => {
    switch (rotation) {
      case 'N': return [new Point(2,1), new Point(2,2),new Point(2,3), new Point(2,4)];
      case 'E': return [new Point(1,3), new Point(2,3),new Point(3,3), new Point(4,3)];
      case 'S': return [new Point(3,1), new Point(3,2),new Point(3,3), new Point(3,4)];
      case 'W': return [new Point(1,2), new Point(2,2),new Point(3,2), new Point(4,2)];
    }
  }, 'Cyan'),
  'T': new Tetromino('T', rotation => {
    switch (rotation) {
      case 'N': return [new Point(1,2), new Point(2,1),new Point(2,2), new Point(2,3)];
      case 'E': return [new Point(1,2), new Point(2,2),new Point(3,2), new Point(2,3)];
      case 'S': return [new Point(2,1), new Point(2,2), new Point(3,2), new Point(2,3)];
      case 'W': return [new Point(1,2), new Point(2,2),new Point(3,2), new Point(2,1)];
    }
  }, 'DarkOrchid'),
  'J': new Tetromino('J', rotation => {
    switch (rotation) {
      case 'N': return [new Point(1,1), new Point(2,3), new Point(1,2), new Point(1,3)];
      case 'E': return [new Point(1,2), new Point(2,2), new Point(3,2), new Point(3,1)];
      case 'S': return [new Point(1,1), new Point(2,1), new Point(2,2), new Point(2,3)];
      case 'W': return [new Point(1,1), new Point(2,1), new Point(3,1), new Point(1,2)];
    }
  }, 'blue'),
  'L': new Tetromino('L', rotation => {
    switch (rotation) {
      case 'N': return [new Point(1,1), new Point(2,1), new Point(1,2), new Point(1,3)];
      case 'E': return [new Point(1,1), new Point(1,2), new Point(2,2), new Point(3,2)];
      case 'S': return [new Point(1,3), new Point(2,1), new Point(2,2), new Point(2,3)];
      case 'W': return [new Point(1,1), new Point(2,1), new Point(3,1), new Point(3,2)];
    }
  }, 'orange'),
  'S': new Tetromino('S', rotation => {
    switch (rotation) {
      case 'N': return [new Point(2,1), new Point(2,2), new Point(1,2), new Point(1,3)];
      case 'E': return [new Point(1,1), new Point(2,1),new Point(2,2), new Point(3,2)];
      case 'S': return [new Point(2,1), new Point(2,2), new Point(1,2), new Point(1,3)];
      case 'W': return [new Point(1,1), new Point(2,1),new Point(2,2), new Point(3,2)];
    }
  }, 'Lime'),
  'Z': new Tetromino('Z', rotation => {
    switch (rotation) {
      case 'N': return [new Point(1,1), new Point(1,2), new Point(2,2), new Point(2,3)];
      case 'E': return [new Point(1,2), new Point(2,2),new Point(2,1), new Point(3,1)];
      case 'S': return [new Point(1,1), new Point(1,2), new Point(2,2), new Point(2,3)];
      case 'W': return [new Point(1,2), new Point(2,2),new Point(2,1), new Point(3,1)];
    }
  }, 'red')
};
shapes.selectRandom = function() {
  var index = Math.floor(Math.random()*1000000%7);
  return shapes[Object.keys(shapes)[index]];
}
