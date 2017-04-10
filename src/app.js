import * as React from 'react';
import { render } from 'react-dom';
import { MainView } from './components/MainView';
import { Game } from './model';
import { createStore } from 'redux';
import * as Mousetrap from 'mousetrap';

const initialState = {
  status: 'splash',
  scores: [],
  online: false
}

function reducer(state = initialState, action) {
  if(state.status === 'splash') {
    if(action.type === 'START') {
      return startNewGame(state);
    }
    else return state;
  }

  else if(state.status === 'paused') {
    if(action.type === 'START') {
      clearTimeout(timer)
      timer = setTimeout(() => store.dispatch({ type: 'TICK' }),500);
      return updateObj(state, {status: 'playing'});
    }
    else return state; 
  }

  else if(state.status === 'gameover') {
    switch(action.type) {
      case 'REQUEST_SCORES':
        requestScores();
        return state;
      case 'RECEIVED_SCORES':
        return updateObj(state, {scores: action.scores, online: true});
      case 'START':
        return startNewGame(state);
      default: return state; 
    }
  }

  else {
    switch (action.type) {
      case 'TICK':
        const rev = state.game.tick();
        if (rev.isGameLost()) {
          return updateObj(state, {status: 'gameover', game: rev});
        }
        timer = setTimeout(() => store.dispatch({ type: 'TICK' }),500);
        return updateObj(state, {game: rev});
      case 'ROTATE':
        return updateObj(state, {game: state.game.rotate()});
      case 'LEFT':
        return updateObj(state, {game: state.game.left()});
      case 'RIGHT':
        return updateObj(state, {game: state.game.right()});
      case 'DOWN':
        return updateObj(state, {game: state.game.tick()});
      case 'FALL':
        return updateObj(state, {game: state.game.fall()});
      case 'HOLD':
        return updateObj(state, {game: state.game.hold()});
      case 'START':
        return updateObj(state, {status: 'paused'});
      default: return state; 
    }
  }
}

function updateObj(oldObject, newValues) {
  return Object.assign({}, oldObject, newValues);
}

function requestScores() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      store.dispatch({
        type: 'RECEIVED_SCORES', 
        scores: JSON.parse(xhr.responseText),
      });
    }
  };
  xhr.open("GET", './scores' , true);
  xhr.send(null);
}

function startNewGame(state) {
  clearTimeout(timer)
  timer = setTimeout(() => store.dispatch({ type: 'TICK' }),500);
  state.game = new Game();
  return updateObj( state, {
    status: 'playing',
    game: state.game.startNextGame(),
    scores: [],
    online: false
  });
}

// Keyboard control bindings
Mousetrap.bind('shift', function() { store.dispatch({type:'HOLD'}); });
Mousetrap.bind('enter', function() { store.dispatch({type:'START'}); });
Mousetrap.bind('space', function() { store.dispatch({type:'FALL'}); });
Mousetrap.bind('up', function() { store.dispatch({type:'ROTATE'}); });
Mousetrap.bind('left', function() { store.dispatch({type:'LEFT'}); });
Mousetrap.bind('right', function() { store.dispatch({type:'RIGHT'}); });
Mousetrap.bind('down', function() { store.dispatch({type:'DOWN'}); });

render(<MainView passedState={initialState} />, document.getElementById('container'));

let store = createStore(reducer);
store.subscribe( () => { 
  render(
    <MainView dispatch={store.dispatch} passedState={store.getState()} />,
    document.getElementById('container')
  );
});

let timer = {};
