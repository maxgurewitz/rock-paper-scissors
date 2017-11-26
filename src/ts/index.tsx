import * as React from 'react'
import { render } from 'react-dom'
import { connect, Provider } from 'react-redux'
import { get, clone } from 'lodash';
import { createStore } from 'redux'

interface NoOp {
  type: 'noOp'
};

interface SelectHand {
  type: 'selectHand',
  hand: Hand
}

interface Init {
  type: '@@redux/INIT'
}

type Msg = NoOp | SelectHand | Init;

enum Hand {
  Paper,
  Rock,
  Scissors
}

const initialState: State = {
  userSelection: null,
  aiSelection: Hand.Paper,
  playRecord: null
};

function firstHandBeatsSecond(hand1: Hand, hand2: Hand): Boolean {
  const diff = hand1 - hand2;
  return diff === -1 || diff == 2;
}

const update = (oldState: State, msg: Msg): State => {
  const state = clone(oldState);

  switch (msg.type) {
    case 'selectHand':
      if (state.aiSelection !== null) {
        state.userSelection = msg.hand;

        const winBit = Number(firstHandBeatsSecond(msg.hand, state.aiSelection));

        state.playRecord = state.playRecord ? {
          gamesPlayed: state.playRecord.gamesPlayed + 1,
          aiWinPercentage: ((state.playRecord.aiWinPercentage * state.playRecord.gamesPlayed) + winBit) / (state.playRecord.gamesPlayed + 1)
        } : {
            gamesPlayed: 1,
            aiWinPercentage: winBit
          };
        console.log('loc1')
      }

      return state;

    case '@@redux/INIT':
      return initialState;

    case 'noOp':
      return state;
  }
};

interface State {
  userSelection: Hand | null,
  playRecord: null | {
    aiWinPercentage: number
    gamesPlayed: number
  },
  aiSelection: Hand | null,
}

const store = createStore(update);

interface View {
  (payload: { state: State, actions: Actions }): JSX.Element;
}

const view: View = ({ state, actions }) =>
  (<div>
    <div> selected {state.userSelection} </div>
    <div> win percentage {get(state, 'playRecord.aiWinPercentage')} </div>
    <button onClick={() => actions.selectHand(Hand.Rock)}> Rock </button>
    <button onClick={() => actions.selectHand(Hand.Paper)}> Paper </button>
    <button onClick={() => actions.selectHand(Hand.Scissors)}> Scissors </button>
  </div>);

interface Actions {
  selectHand(hand: Hand): void;
}

function dispatch(msg: Msg) {
  store.dispatch(msg);
}

const actions: Actions = {
  selectHand(hand) {
    dispatch({
      type: 'selectHand',
      hand
    });
  }
};

const App = connect((state: State) => ({ state }), () => ({ actions }))(view);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
