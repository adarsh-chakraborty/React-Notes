# React Hooks

## useState
**Syntax:**
```javascript
const [stateName, setStateFn] = useState("initialState");
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

***

### Custom Context Component
  

  ```javascript
import React from 'react';

const AuthContext = React.createComponent({isLoggedIn: false, onLogout: () => {}, onLogin: () => {}});

// Create a component in the context file which returns AuthContext.Provider

export const AuthContextProvider = (props) => {
    return (
        <AuthContext.Provider>
        {props.children}
        </AuthContext.Provider>
    )

}


export default AuthContext;
  ```
  **Now that we have a component in the context, we can create a state to manage the logic.**

  ```javascript
export const AuthContextProvider = (props) => {

    const [isLoggedIn,setIsLoggedIn] = useState(false);

    const logoutHandler = () => {
        setIsLoggedIn(false);
    }

     const loginHandler = () => {
        setIsLoggedIn(true);
    }
    return (
        <AuthContext.Provider value={{
            isLoggedIn: isLoggedIn, // pass state
            onLogout: logoutHandler, // pass pointer
            onLogin: loginHandler,
            }}>
        {props.children}
        </AuthContext.Provider>
    )

}

export default AuthContext;
  ```
Wrap the components inside our new AuthContextProvider component.
  ```javascript
  import {AuthContextProvider} from './context/authContext.js'

// in a component, probably root
  return(<AuthContextProvider><OtherComponents/></AuthContextProvider>);
  ```
  Now we can import the context file in any component (that is wrapped inside our custom component),
  and access those function using

  ```javascript
  import {useContext} from 'react';
  import AuthContext from '../context/authContext.js';

    // in a component
    const ctx = useContext(AuthContext);
  ```

Now all variables & functions are accessable on ctx.
ctx.isLoggedIn,ctx.onLogout,ctx.onLogin to be used or passed to dom elements.

### Limitations of Context API

- Not Optimized for high frequency changes. (Multiple times per second)
- It's shouldn't be replaced with all components.

***

# Rules of using React Hooks

### All Hooks
- React hooks can only be called inside React function component.
- React hooks must be called in top level functional component or custom react hook function.
### useEffect
- All the surrounding data which is not coming from the browser or from outside component function, must be added in dependency array.
- So, all the data from inside your component function && is Used inside UseEffect must go in dependency array.
***
# forwardRef
We cannot pass a ref to a function, It would throw an Error i.e. Function component cannot be given refs.
We need to use forwardRef to access functions/variables outside of a component using refs. (Not recommended)

In the component itself, we need to import an hook. i.e `useImperativeHandle` from `react`. 

It means `not by state management` but directly managing it.


Call the useImperativeHandle and pass 2 things.

1. Component ref 
2. A function that should return an object.
    It contains the data which we will be able to use from outside.

```javascript
    // A Component which has to be exported, forwarded and should accept a ref.
   // Wrap the component in a special react function that returns a component. React.forwardRef()
    
    const Input = React.forwardRef((props, ref) => {
    useImperativeHandle(ref,() => {
        // returns an object
        return {
            // any key; internal function which can be called from outside.
            focus: activate,
        }
    });

    });
    
    export default Input;
```

- Forward ref returns a react component.
- We can only access the content which is exposed through useImperativeHandle.
- Now we can simply useRef and access functions, components directly.

    ```javascript
    
    const someRef = useRef();

    someRef.current.focus(); // is accessible cuz it's exposed.
    return <someComponent ref={inputRef} />
    
    ```
***

# React Behind the Scenes

Let's see how react works behind the scene.

     React is a javascript library for building user Interfaces.

### TLDR: React -> ReactDOM -> Browser

React is concerned about components. (State,Props or Context)
It doesn't care about the html and what user sees in the Browser.

React uses Virtual DOM, It only sends changes the between VirtualDOM Snapshot & Real DOM,and does not re-render the entire DOM, that's make it fast and performance efficient.

Child components gets re-evaluated with parent state change, as child component is basically a function called in a return statement in parent component, but that does not mean the realdom is touched.

**Components:** 
- Re-evaluated whenever props, state or context changes.
- React executes component functions.

**Real DOM:** 
- Changes to the real DOM are only made for differences between evaluations.

TLDR:
- If Parent component is re-executed, all it's child component will get re-evaluated.

### So that's alot of function calls for a application, mostly waste.

To tell react to re-evaluate component only if the prop changed, we can use `memo`.

**Useage**
```javascript
// Any functional component.
const Component2 = (props) => {};
// we export the component with React.memo method.
export default React.memo(Component2);
```

Memo saves previous props values and compares it with the new props.
Comes at a cost, isn't it. So use we have to use it wisely.

Till now, It will work for primitive types but Arrays & Objects would be re-created everytime.

# useCallback

To make it work for Objects, We have to use `useCallback` hook.

`useCallback` allows us to store a function across components execution, so it doesn't get recreated.

It will save a function of our choice and always re-use that same function among component re-evaluation.

**Useage:** Using it is simple, just wrap the function we wanna save, with it.
```javascript
const myFunctionName = () => {
    // Do something;
}

```

will be written like...

```javascript
import {useCallback} from 'react';

const myFunctionName = useCallback(() => {
    // Do something;
},[]); 
// [] is array of dependencies.
// Anything from surrounding environment, has to be passed in dependencies.
// e.g. state, props or context should be specified here.

```

### How does it work?

Functions in javascript are closures, that means when a function is created it looks all it's surrounding variables to be used in functions.

But that is a problem in our case, as we need latest values in our functions, hence they are added in the dependencies, which basically means whenever the dependencies change, the function is recreated and the newly created latest function is stored for further use. If the dependencies doesn't change, the function too doesn't get recreated.

# Summary

- In react apps, we work with functional components, that has one job is to return html from jsx.
- We work with props, state and context to make changes in data and parts of the application.
- Whenever the state changed, the functional component is executed again. 
- React takes the result of this latest evaluation and compares it with last snapshot and forwards it to ReactDOM.
- And the Only changes gets added in the Real DOM.
- In the process, many components gets re-executed unnecessarly.
- To Avoid such unnecessarly executed, we use `React.memo` to tell react that don't re-executed this component unless the props changed.
- However, While it will work for primitive data tyes, It won't work for Reference data types. e.g. Objects,Functions,Arrays.
- So To make it work with Reference data types, we use `useCallback` hook to store the function and not re-create it as long as certain dependencies doesn't change.
- And With that, React.memo would be able to tell if the function has changed or not, and will prevent unnecessary executions.

***
# useMemo

We have `useCallback` to store functions that only recreate them when some input changed.

We have `useMemo` that allows us to store all other kind of data.

`useMemo` accepts two arguements.

* Function, However the function itself won't be stored but the value it returned. 
* Dependency Array.

```javascript
import {useMemo} from 'react';

const sortedData = useMemo();

```
