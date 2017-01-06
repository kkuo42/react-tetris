import * as React from 'react';
import * as ReactDOM  from 'react-dom';
import {GameView} from './components';
import {Game} from './model';
import {createStore} from 'redux';
import * as Mousetrap from 'mousetrap';

function reducer(state = new Game(), action) {
  switch (action.type) {
      case 'TICK':
        const revState = state.tick();
        if (!revState.isGameOver) {
          timer = setTimeout(() => store.dispatch({ type: 'TICK' }),500);
        }
        return revState;
      case 'ROTATE':
        return state.rotate();
      case 'LEFT':
        return state.left();
      case 'RIGHT':
        return state.right();
      case 'DOWN':
        return state.tick();
      case 'FALL':
        return state.fall();
      case 'HOLD':
        return state.hold();
      case 'START':
        if(state.isGameOver) {
          clearTimeout(timer)
          timer = setTimeout(() => store.dispatch({ type: 'TICK' }),500);
          return state.startNextGame();
        };
      default: return state;
  }
}

Mousetrap.bind('shift', function() { store.dispatch({type:'HOLD'}); });
Mousetrap.bind('enter', function() { store.dispatch({type:'START'}); });
Mousetrap.bind('space', function() { store.dispatch({type:'FALL'}); });
Mousetrap.bind('up', function() { store.dispatch({type:'ROTATE'}); });
Mousetrap.bind('left', function() { store.dispatch({type:'LEFT'}); });
Mousetrap.bind('right', function() { store.dispatch({type:'RIGHT'}); });
Mousetrap.bind('down', function() { store.dispatch({type:'DOWN'}); });

let store = createStore(reducer);
store.subscribe(() => { 
  ReactDOM.render(<GameView game={store.getState()} />, document.getElementById('container'));
});

let timer = setTimeout(() => store.dispatch({ type: 'TICK' }), 0);
