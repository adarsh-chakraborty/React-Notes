const redux = require('redux');

const counterReducerFn = (oldState = { counter: 0 }, action) => {
    if (action.type === '++') {
        return {
            counter: oldState.counter +1,
        };
    }
    if (action.type === '--') {
        return {
            counter: oldState.counter -1,
        };
    }
    // return initial state. (Gets Executed upon Initialization)
    // Return unchanged, Initial state.
    return oldState;
}

const store = redux.createStore(counterReducerFn);
console.log("Initial state", store.getState());


// subscription
const counterSubscriber = () => {
    const latestState = store.getState();
    console.log(latestState);
    // getState is a method, which gives latest store snapshot.
}

store.subscribe(counterSubscriber); // Redux will execute this subscriber function whenever the store change.

/* Dispatching Action */
store.dispatch({ type: '++' });
store.dispatch({ type: '--' }); 
