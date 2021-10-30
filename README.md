# React Hooks

## useState
**Syntax:**
```
const [stateName, setStateFn] = useState(<initialState>);
```
Returns an array with exactly two values, one is the state and a function to set the state, respectively. 
## useReducer

**Syntax:**
```
import { useState } from 'react';

const [state, dispatchFn] = useReducer(reducerFn, initialState, initFn);

```

**Explation:**
useReducer, just like useState returns an array with exactly two values, so we can use array destructing to pull out those two values.

The two values: `state` : Latest statesnapshot & `dispatchFn` function to update the state snapshot.
but `dispatchFn` works differently, Instead of setting the state value directly, we will dispatch an action.

and, that dispatch fn will be consumed by the first arguement you pass to useReducer.

```
import { useReducer } from 'react';

// reducerFn; first arguement
(prevState, action) => newState
```
A Function that is **triggered automatically** once an action is **dispatched** (via dispatchFn), and it returns the latest state Snapshot.

**InitialState & initFn**
The rest two arguements are used to set initialState and a function to setInitial state respectively. (A function that should run to set initialState, i.e. response from Http req)

**Dispatch Function:** Dispatch function can be called just like any other function.

```
dispatchEmail('identifier'); // identifier can be anything, a string or object
// It makes sense to pass an object with an identifier, so we can also add some payload.

dispatchEmail({type: 'USER_INPUT', val: e.target.value}); // identifier, Payload.
```

The above dismatchEmail function will trigger the reducer function to execute.( First arugement of reducerFn);
```
import { useReducer } from 'react';

// reducerFn; first arguement
(state, action) => {
    // state is the latest state, provided by react. 
    // action is what passed from the dispatchFn. e.g object in this case
    if(action.type === 'USER_INPUT'){
        // do something and return new state.
        return {};
    }
    if(action.type === 'SOME_IDENTIFIER'){
        // do something and return new state.
        return {};
    }
    // default state
    return {};
}
```

*So basically, dispatchFn calls the reducerFn and passes the arguements, which will be available in the reducer `action` (2nd arguement), 1st arguement is latest `state` (prev state).*
