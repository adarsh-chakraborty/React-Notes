# React Hooks

## useState
**Syntax:**
```javascript
const [stateName, setStateFn] = useState(<initialState>);
```
Returns an array with exactly two values, one is the state and a function to set the state, respectively. 
## useReducer

**Syntax:**
```javascript
import { useState } from 'react';

const [state, dispatchFn] = useReducer(reducerFn, initialState, initFn);

```

**Explation:**
useReducer, just like useState returns an array with exactly two values, so we can use array destructing to pull out those two values.

The two values: `state` : Latest statesnapshot & `dispatchFn` function to update the state snapshot.
but `dispatchFn` works differently, Instead of setting the state value directly, we will dispatch an action.

and, that dispatch fn will be consumed by the first arguement you pass to useReducer.

```javascript
import { useReducer } from 'react';

// reducerFn; first arguement
(prevState, action) => newState
```
A Function that is **triggered automatically** once an action is **dispatched** (via dispatchFn), and it returns the latest state Snapshot.

**InitialState & initFn**
The rest two arguements are used to set initialState and a function to setInitial state respectively. (A function that should run to set initialState, i.e. response from Http req)

**Dispatch Function:** Dispatch function can be called just like any other function.

```javascript
dispatchEmail('identifier'); // identifier can be anything, a string or object
// It makes sense to pass an object with an identifier, so we can also add some payload.

dispatchEmail({type: 'USER_INPUT', val: e.target.value}); // identifier, Payload.
```

The above dismatchEmail function will trigger the reducer function to execute.( First arugement of reducerFn);
```javascript
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
***
# React Context (Context API)

Create a context file in your project. `Kebab case` naming convention is prefered. e.g. `auth-context.js`

     Context is basically like an app wide or component wide state.

```javascript
import React from 'react';

const AuthContext = React.createContext('Default state');

export default AuthContext;
```
- `createContext` returns something intresting, It would be a component or an object, that also contains component.

- TLDR: AuthContext itself is not a component here, but It's an object that will contain components.

Now to use context in the app, we need to do 2 things.

- Provide the context. *(Wrap components inside provider)*
- Consume the context. *(Listen to context changes)*

```javascript
// Wrap the component that requires access to Context API.
// AuthContext itself is not a component, but it has a method 'Provider' which is a component
// and we need component in our jsx code, that's why we wrap it like this

// import context
import AuthContext from './context/AuthContext.js';
// value is what we want to pass the data, 
// It can be any value, a String (why), an object and functions or all 3 inside 1 object. BEST XD
<AuthContext.Provider value={{isLoggedin: isLoggedIn, onLogout, logoutHandler}}> 
<OtherComponents />
</AuthContext.Provider>

```

First part is done, now the next part.

There are **2 ways** we can consume the context api.

<details>
      <summary>Using a consume function (Lame)</summary>
      
   ```
        // In the component return statement, Wrap all JSX code using context consumer.
        return(
            <AuthContext.Consumer>
                // Consumer takes a child,
                // that is a function which receives the data from context file as arguement.
                {(ctx) => { 
                    return (// All JSX code, use ctx to get data)
                }}
          </AuthContext.Consumer>
        )
   ```
</details>

<details>
      <summary>Using a React Hook (prefered)</summary>
      
   ```
        // import 
        import { useContext } from '../conext/auth-context.js';

        // inside component
        const ctx = useContext(AuthContext); // pass the context, returns context.

        // and that's it, LMAO
        // Consume the ctx as you like. ctx.isLoggedIn, ctx.onLogout xD
   ```
</details>
