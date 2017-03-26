import * as React from 'react';
import { render } from 'react-dom';
import { MainView } from './components/MainView';
import { Game } from './model';
import { createStore } from 'redux';
import * as Mousetrap from 'mousetrap';

const initialState = {
  status: 'splash'
}

function reducer(state = initialState, action) {
  if(state.status === 'splash') {
    switch(action.type) {
      case 'START':
        timer = setTimeout(() => store.dispatch({ type: 'TICK' }),500);
        state.game = new Game();
        return Object.assign( {}, state, {
          status: 'playing',
          game: state.game.startNextGame()
        });
      default: return state; 
    }
  }

  else if(state.status === 'paused') {
    switch(action.type) {
      case 'START':
        clearTimeout(timer)
        timer = setTimeout(() => store.dispatch({ type: 'TICK' }),500);
        return Object.assign( {}, state, {
          status: 'playing',
        });
      default: return state; 
    }
  }

  else if(state.status === 'gameover') {
    switch(action.type) {
      case 'START':
        clearTimeout(timer)
        timer = setTimeout(() => store.dispatch({ type: 'TICK' }),500);
        state.game = new Game();
        return Object.assign( {}, state, {
          status: 'playing',
          game: state.game.startNextGame()
        });
      default: return state; 
    }
  }

  else {
    switch (action.type) {
      case 'TICK':
        const rev = state.game.tick();
        if (!rev.isGameOver) {
          timer = setTimeout(() => store.dispatch({ type: 'TICK' }),500);
          return Object.assign( {}, state, {
            game: rev
          });
        }
        else {
          return Object.assign( {}, state, {
            status: 'gameover',
            game: rev
          });
        }
      case 'ROTATE':
        return Object.assign( {}, state, {
          game: state.game.rotate()
        });
      case 'LEFT':
        return Object.assign( {}, state, {
          game: state.game.left()
        });
      case 'RIGHT':
        return Object.assign( {}, state, {
          game: state.game.right()
        });
      case 'DOWN':
        return Object.assign( {}, state, {
          game: state.game.tick()
        });
      case 'FALL':
        return Object.assign( {}, state, {
          game: state.game.fall()
        });
      case 'HOLD':
        return Object.assign( {}, state, {
          game: state.game.hold()
        });
      case 'START':
        if(!state.game.isGameOver) {
          return Object.assign( {}, state, {
            status: 'paused'
          });
        }
        clearTimeout(timer)
        timer = setTimeout(() => store.dispatch({ type: 'TICK' }),500);
        state.game = new Game();
        return Object.assign( {}, state, {
          status: 'playing',
          game: state.game.startNextGame()
        });
      default: return state; 
    }
  }
}

Mousetrap.bind('shift', function() { store.dispatch({type:'HOLD'}); });
Mousetrap.bind('enter', function() { store.dispatch({type:'START'}); });
Mousetrap.bind('space', function() { store.dispatch({type:'FALL'}); });
Mousetrap.bind('up', function() { store.dispatch({type:'ROTATE'}); });
Mousetrap.bind('left', function() { store.dispatch({type:'LEFT'}); });
Mousetrap.bind('right', function() { store.dispatch({type:'RIGHT'}); });
Mousetrap.bind('down', function() { store.dispatch({type:'DOWN'}); });

render(<MainView passedState={initialState} />, document.getElementById('container'));

let store = createStore(reducer);
store.subscribe(() => { 
  render(<MainView passedState={store.getState()} />, document.getElementById('container'));
});

let timer = {};
