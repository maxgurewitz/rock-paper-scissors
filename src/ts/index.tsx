import * as React from 'react'
import { render } from 'react-dom'
import { connect, Provider } from 'react-redux'
import {clone} from 'lodash';
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
    Rock,
    Paper,
    Scissors
}

const initialState : State = {
    userSelection: null,
    aiSelection: Hand.Paper
};

const update = (oldState : State, msg : Msg) : State => { 
    const state = clone(oldState);

    switch (msg.type) {
        case 'selectHand':
            state.userSelection = msg.hand;
            return state;

        case '@@redux/INIT':
            return initialState;

        case 'noOp':
            return state;
    }
};

interface State {
    userSelection: Hand | null,
    aiSelection: Hand
}

const store = createStore(update);

interface View {
    (payload: {state : State, actions : Actions}): JSX.Element;
}

const view : View = ({state, actions}) => 
(<div> 
    <div> selected {state.userSelection} </div>
    <button onClick={() => actions.selectHand(Hand.Rock)}> Rock </button>
    <button onClick={() => actions.selectHand(Hand.Paper)}> Paper </button>
    <button onClick={() => actions.selectHand(Hand.Scissors)}> Scissors </button>
 </div>);

interface Actions {
    selectHand(hand: Hand) : void;
}

function dispatch(msg : Msg) {
    store.dispatch(msg);
}

const actions : Actions = {
    selectHand(hand) {
        dispatch({ 
           type: 'selectHand',
           hand
        });
    }
};

const App = connect((state : State) => ({state}), () => ({actions}))(view);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
)
