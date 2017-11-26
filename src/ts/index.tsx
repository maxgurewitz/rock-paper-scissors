import * as React from 'react'
import { render } from 'react-dom'
import { connect, Provider } from 'react-redux'
import { createStore } from 'redux'

interface NoOp {};

type Msg = NoOp;

const update = (state : State, action : Msg) => { 
    return state;
};

interface State {
    selections: number;
}

const initialState : State = {
    selections: 0
};

const store = createStore(update, initialState);

interface View {
    (payload: {state : State, actions : Actions}): JSX.Element;
}

const view : View = ({state, actions}) => (<div> tic tac toe</div>);

interface Actions {}

const actions : Actions = {};

const App = connect((state : State) => ({state}), () => ({actions}))(view);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
)
