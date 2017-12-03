import * as React from 'react'
import { render } from 'react-dom'
import { connect, Provider } from 'react-redux'
import { get, clone } from 'lodash';
import axios from 'axios';
import { createStore } from 'redux'

interface NoOp {
  type: 'noOp'
};

interface SelectHand {
  type: 'selectHand',
  hand: Hand
}

interface AiSelectHand {
  type: 'aiSelectHand',
  hand: Hand
}

interface Init {
  type: '@@redux/INIT'
}

type Msg = NoOp | SelectHand | AiSelectHand | Init;

enum Hand {
  Paper,
  Rock,
  Scissors
}

const initialState: State = {
  userSelection: null,
  aiSelection: Hand.Paper,
  retrievalInProgress: false,
  playRecord: null

};

function mod(n : number, m : number) : number {
  return ((n % m) + m) % m;
}

function firstHandBeatsSecond(hand1: Hand, hand2: Hand): Boolean {
  return mod(hand1 - hand2, 3) == 2;
}

const update = (oldState: State, msg: Msg): State => {
  const state = clone(oldState);

  switch (msg.type) {
    case 'aiSelectHand':
      return state;

    case 'selectHand':
      if (state.aiSelection !== null) {
        state.userSelection = msg.hand;

        const winBit = Number(firstHandBeatsSecond(state.aiSelection, msg.hand));

        state.retrievalInProgress = true;

        let playRecord;

        if (state.playRecord) {
          const {aiWinPercentage, gamesPlayed} = state.playRecord;

          playRecord =  {
            gamesPlayed: gamesPlayed + 1,
            aiWinPercentage: ((aiWinPercentage * gamesPlayed) + winBit) / (gamesPlayed + 1)
          };

        } else {
          playRecord = {
            gamesPlayed: 1,
            aiWinPercentage: winBit
          }
        }

        state.playRecord = playRecord;
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
  retrievalInProgress:  boolean,
  aiSelection: Hand | null,
}

const store = createStore(update);

interface View {
  (payload: { state: State, actions: Actions }): JSX.Element;
}

const view: View = ({ state, actions }) =>
  (<div>
    <div> selected {state.userSelection} </div>
    <div> ai win percentage {get(state, 'playRecord.aiWinPercentage')} </div>
    <button disabled={state.retrievalInProgress} onClick={() => actions.selectHand(Hand.Rock)}> Rock </button>
    <button disabled={state.retrievalInProgress} onClick={() => actions.selectHand(Hand.Paper)}> Paper </button>
    <button disabled={state.retrievalInProgress} onClick={() => actions.selectHand(Hand.Scissors)}> Scissors </button>
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

    axios.get(`/get-hand?userHand=${hand}`)
      .then(response => dispatch({ type: 'aiSelectHand', hand: JSON.parse(response.data).hand }))
      .catch(err => {
        console.log('loc1', err);

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
