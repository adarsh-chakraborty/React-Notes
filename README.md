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
***
# Connecting to a Database

**TLDR: You don't.**

This is by far the most awaited section for me to learn, Sending HTTP Requests is my favorite thing to do in applications. I just love working with APIs.

In my personal projects, I will undoubtly use `reactQuery` library to send http requests, because I am amazed by the simplicity and the features that it provides.

Here we will use normal `fetch api` which is available in all modern browsers now a days. Alternative methods to send http requests could be `Ajax` (why) and `Axios` library.

##  How to Not Connect to a Database.

In general, browser side apps be it react or any other client side app, should never talk to a database directly.

Because it is highly insecure, and bad practice, Javascript code is exposed to the end user hence your database credentials would be exposed with it.

#### React --> Database ✘
#### React --> [ API ] -> Database ✓

* **API stands for Application Programming Interface.**

### Sending a GET Request.

```javascript
// A Regular javascript function

function fetchBooksHandler() {
    // Using fetch API. 
    // Default method is GET so we don't set one here.
    // fetch returns a promise that will eventually yield data.

    fetch('http://adarsh.gq/library/books')
    .then(response => {
        // This as well returns promise.
        return response.json();
    })
    .then(data => {
        // Do something with data, transform it (If required)
        const transformedBooks = data.map((book) => {
            return {
                newKeys: book.someKey,
                someMoreKeys: book.someData
            }
        });
        // Store it some state.
        setBookState(transformedBooks);
    });
}
```

- Same thing with async await.

```javascript
async function fetchBooksHandler() {

    const res = await fetch('http://adarsh.gq/library/books')
    const data = await res.json();

    const transformedBooks = data.map((book) => {
            return {
                newKeys: book.someKey,
                someMoreKeys: book.someData
            }
        });

    setBookState(transformedBooks);
}
```

# Loading State

We can manage a loading state in react to show a loading spinner or text to the user, while the browser fetches data from an API.

```javascript
const SomeComponent = (props) => {
    const [books,setBookState] = useState([]);
    const [isLoading,setIsLoading] = useState([]);

    async function fetchBooksHandler() {
        setIsLoading(true);
        // after fetch ...
             ... setIsLoading(false);
    }

    return (
        <>
        // Conditional Rendering. 
        // Not Loading + Has atleast 1 Movie then Show Book Component
        {!isLoading && books.length > 0 && <SomeBookComponent />}
        {!isLoading && books.length == 0 && <p>Some fall back text, No books found etc<p>}
        // .. Loading
        {isLoading && <SomeSpinnerComponent />}
        </>
    )

}
```

# Handling HTTP errors

Not always we get what we want in life (lol), same applies with http requests.

Catch block of fetch API will catch erros If you are unable to send a request technically, for example Network Error. (No Internet)

But If you could technically send a request to a server, It's considered as valid request even tho the response has error status code.

Server can send various type of responses.
- 2XX - OK Sucesss
- 3XX - Redirections
- 4XX - Client Errors (Forbiddon, Bad Req)
- 5XX - Server Errors (Server failure or server side code failure)

So, you can discriminate these errors in `response.ok` object and manage a error state. 

```javascript
const SomeComponent = (props) => {
    const [books,setBookState] = useState([]);
    const [isLoading,setIsLoading] = useState([]);
    const [error,setError] = useState(null);

    async function fetchBooksHandler() {
        setLoading(true);
        setError(null);

        try{

            const res = await fetch('http://adarsh.gq/library/books')
            // Check status code
            if(res.ok){
                // stop execution and go to catch block
                throw new Error("Something went wrong");
            }

            return await res.json();

        }catch(e){
            setError(e.message);
        }
        // Set loading to false either way
        setIsLoading(false);
     
    }

    return (
        <>
        // Conditional Rendering. 
        // Not Loading + Has atleast 1 Movie then Show Book Component
        {!isLoading && books.length > 0 && <SomeBookComponent />}
        // If not loading, and we have no movies and has no error then show fallback text
        {!isLoading && books.length == 0 && !error && <p>Some fall back text if not loading,no errors, No books found etc<p>}
        // .. Loading
        {isLoading && <SomeSpinnerComponent />}
        // If not loading and we have a error then display it.
        {!isLoading && error && <SomeSpinnerComponent />}
        </>
    )

}
```

### Using useEffect to fetch data.

```javascript
import {useEffect, useCallback} from 'react';

const SomeComponent = (props) => {
    const [books,setBookState] = useState([]);
    const [isLoading,setIsLoading] = useState([]);
    const [error,setError] = useState(null);

    const fetchBooksHandler = useCallback(async () => {
        setLoading(true);
        setError(null);

        try{

            const res = await fetch('http://adarsh.gq/library/books')
            // Check status code
            if(res.ok){
                // stop execution and go to catch block
                throw new Error("Something went wrong");
            }

            return await res.json();

        }catch(e){
            setError(e.message);
        }
        // Set loading to false either way
        setIsLoading(false);
     
    },[]); // No dependency cuz fetch is global, and set functions never changes.

    useEffect(() => {
        // Calling the function as soon as the component loads.
        fetchMoviesHandler();
    },[fetchMoviesHandler]);

}
```
***
# Custom Hooks

- Custom hooks in the end are just functions but they are function that can contain stateful logic.

- Unlike regular functions, Custom hooks can use other react hooks.

- It's simple mechanism of re-using logic.

# How to build custom hooks

- Create a new folder `hooks` probably.
- Create a new .js file. `kebab-case` naming convention is preferred.
- Export a function, function name must start with `use`. e.g. `useCounter`
- If custom hooks uses state, effects, it will be tied to the component which uses it.
- Which means every component will have their own state and useEffect, and so data is not shared only logic is.
- We can configure custom hooks, Make it accept parameters just like built-in hooks.
- You can also receive an entire function in arguement and execute it. `setCounter(counterUpdateFn())`



```javascript
const useCounter = (forwards = true) => { 
    // Receive forward as arguement to configure hook. Default is true
    // Do something with state maybe. 
    const [count,setCount] = useState(0)
    // Add the parameter (if any) in useEffect dependency.
    useEffect(() => {
        const interval = setInterval(() => {
        if(forwards)
             setCounter((prevCounter) => prevCounter+1);
        else 
            setCounter((prevCounter) => prevCounter-1);
        }, 1000);

        return () => clearInterval(interval);
        
    },[forwards]);

    return count;

}

export default useCounter;
```
***
### More Realistic usage of custom hooks.

We can outsource the logic or parts of the logic to fetch data from API or submit data to an api.

Let's goooo

- Create a `hooks` folder.
- Create a new js file, `kebab-case` naming convention is prefered.
- Export a function, function name **must** start with `use`. e.g. `useHttp`


```javascript
import {useState,useCallback} from 'react';

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = useCallback(async (reqConfig,callbackFn) => {
        setIsLoading(true);
        setError(null);

        try{
            const response = await fetch(`http://adarsh.gq/library`, { 
                method: reqConfig.method ? reqConfig.method : 'GET',
                headers: reqConfig.headers ? reqConfig.headers : {},
                body: reqConfig.body ? JSON.stringify(reqConfig.body) : null
            });

            if(!response.ok){
                throw new Error("Internal Server Error, try again!");
            }

            const data = await response.json();
            // Send the data back
            callbackFn(data);

        }catch(e){
            setError(e.message || "Internal Server Error, Try again!");
        }
         setIsLoading(false);
         
    },[]); // No External Dependency.
    // Needs no dependency bcuz all the data it's working on is received in parameter.

    // Return so we can have access to these functions from components.
    return {
        isLoading: isLoading,
        error: error,
        sendRequest: sendRequest,
    }
};

export default useHttp;
```

Now that we have configured our very own custom hook, Let's use it in our components.

```javascript
import useHttp from '../hooks/use-http';

const App(){
   
    // Needs arguements
    // showBooks as callbackFn
    const {isLoading, error, sendRequest} = useHttp();

     useEffect (() => {
        const showBooks = (bookObj) => {
            // do something with bookObj.
            // setState, and SetState won't change so need to add it in dependency.
        };

        sendRequest({method: 'GET'},showBooks);
     },[sendRequest]); // showBooks is not an External Dependency.

     // sendReq is defined inside App() so it should be added as dependency.
    
}
```
***
# Forms and User Input
### Form Validation
Forms might seem simple and trivial but they are not, Forms can actually be complex from a developer's point of view because they can consume a broad variety of states.

### When can we validate

- When form is submitted.
- When a Input lost focus.
- On Every Keystroke.

### First step: Fetch Input value

AFAIK, We can get user Input in two ways. Both have different use-cases.

- Manage a state on every keystroke.
- Use a ref to get Input when required.

If the Input value is being manipulated, We should consider using state because **React should be the thing manipulating the DOM** and not us. So it's not a good practice to manipulate DOM directly.

### Step Two: Adding Basic Validation

- Checking if the enteredName is empty.

```javascript
if(enteredName.trim() === ''){
    return;
}
```

### Step Three: User Feedback

We can feed user some information about what's wrong with his entered data.

After Checking if the input is valid, we can provide some feedback based on it.
```javascript
const enteredNameIsValid = enteredName.trim() !== ''
const nameInputIsInvalid = !enteredNameIsValid && enteredNameTouched;

```
***
# Redux

Redux is a third party state management library for cross component or app wide state.

It helps us to manage state that affects our application app wide or cross component.

We can split the defination of state in 3 main kind of state.

Colons can be used to align columns.

| Local State | Cross-Component State | App-Wide State  |
| ------------- |:-------------:| -----:|
| State that belongs to a single component.| State that effects multiple components. | State that effects the entire app. (All components) |
| E.g. Listening to user Input using  states.| E.g. Open/Close state of a modal overlay.      |   E.g. user authentication |
| *Managed by useState() or useReducer()* | *Managed by useState() or useReducer() with props* (Prop chain/drilling)     |  *Requires prop chain/drilling* |


React context is a built-in feature of React, to share data across app. Redux solves the same problem, It manage cross components or app-wide states.

## Why Redux

- Managing context is quite complex, we can endup with nested JSX context providers.
- If not that we can surely endup with a large context that cares about everything (Auth, Cart, User etc).
- Another potential disadvantages is performance, It's not optimized for high frequency changes. (e.g. Input)

### How Redux works

Redux is all about one central data store (state) for the entire application.
In this one store (state) we will store everything (auth,user).

**Central Data Store --  (subscribe) --> components**

If the data changes, Central Data stores notifies the component so it can react accordingly.

#### So how to manipulate data in the store

**Important Rule:** Components **never directly** changes the data in the store, Instead we use reducer functions.

**Reducer functions:** This reducer is not that useReducer() hook, reducer function in-general is a concept of functions that takes some input and transform it, e.g. Reduce a list of number to sum of number.
Reducer function is a standard javascript function, It will receive 2 parameter and produce a new state.

 `(OldState, Action) => NewState`

and, there should be no sideeffects inside reducer function. (Local Storage/Http fetch)

**Action:** Components dispatches action, which is forwarded to reducer functions.

#### Components --(dispatch)--> Action --(Forwarded to)--> Reducer Function

#### Installing Redux
```
npm i redux react-redux 
```

- Create a new folder in src. `store` is prefered.
- Create a new .js file. `index.js`
- Create a store in store/index.js.

```javascript
// index.js
import { createStore } from 'redux';

const counterReducer = (state = {counter: 0}, action) => {
    if (action.type === 'inc') {
        return { counter: state.counter + 1 };
    }
    if (action.type === 'dec') {
        return { counter: state.counter - 1 };
    }
    if (action.type === 'custom') {
        // get payload from action
        return { counter: state.counter + action.payload };
    }
    return state; // Return Initial state.
}

const store = createStore(counterReducer); // needs a reducerFn.

export default store;
```

- Provide the store to our react application, for that go to the highest level possible in our app. (App Root Component)

```javascript
// import component from react-redux
import {Provider} from 'react-redux';

// Wrap entire app inside the provider component & provide store.
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
```

Now that we have provided the store and the component has access to it, but they can't dispatch any action or subscribe yet, so

```javascript
import {useSelector} from 'react-redux';

// in a component
const counter = useSelector(state => state.counter); 
// We need to pass a fn to useSelector, which will be executed by react-redux.
// It determines which piece of data we wanna extract from store.
// useSelector allows us to get a slice of the state from central store.
// useSelector also automatically subscribes to store for this component so we get latest counter everytime counter changes in redux store, automatically :O
// So basically, it re-evaluates the component for you, and if component is unmounted, it will automatically clear the subscription as well.

// use the counter in any JSX
return (<p>{counter}</p>)
```

#### Dispatching actions

We need to import another hook for that, `useDispatch` which doesn't need any arguements but returns a dispatchFn which we can execute.

```javascript
import {useDispatch} from 'react-redux';
const dispatch = useDispatch();

const incrementHandler = () => {
    dispatch({type: 'inc'}); // identifier
}

const decrementHandler = () => {
    dispatch({type: 'dec'});
}

const handlerWithPayload = () => {
    dispatch({type: 'custom', payload: 5});
}

// Now we can pass the handler to any prop whereever needed.
```
***
# Redux Toolkit

Redux toolkit helps us to use Redux in such a way where we don't have to worry about accidently mutating our state, making typos in identifiers or even making clashing identifiers suppose if many developers are working on same project.

To get started with Redux toolkit, we need to install it.
#### Install
```
npm i @reduxjs/toolkit 
```

#### Redux is included in toolkit, so we can uninstall redux entry from package.json

**How to use Redux toolkit**

index.js
```javascript

import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialState = { counter: 0, showCounter: true };

// Needs object as arguement to prepare a slice of global state.
const counterSlice = createSlice({
    name: 'counter', // identifier
    initialState: initialState,
    reducers: {
        increment(state) {
            // Mutation is allowed here because It will internally create a new state and override it.
            state.counter++;
         },
        decrement(state) { 
            state.counter--;
        },
        increase(state, action) {
            // with payload. (payload key is required, key is not upto us. It is set by toolkit)
            state.counter = state.counter + action.payload;
         },
        toggleCounter(state) {
            state.showCounter = !state.showCounter;
        }
    }

})


// not using createStore but configureStore.
// configure store returns a store and needs a object
const store = configureStore({
    // 1 reducer is required for global state.
    reducer: counterSlice.reducer,
    /*
    If we have multiple slices, pass an object with custom keys
    reducer: {counter: counterSlice.reducer, something: somethingSlice.reducer }
    It will be merged into one reducer automatically by toolkit
    */
});

export default store;
export const counterActions = counterSlice.actions; // has all the reducer actions
```

#### Using it in our components

```javascript
import {useSelector, useDispatch} from 'react-redux';
import {counterActions} from '../store/index.js';

// In a component
const dispatch = useDispatch();
const counter = useSelector(state => state.counter); 

const incrementHandler = () => {
    // That's how we dispatch actions
    dispatch(counterActions.increment());
}

// Dispatching with payload.
const increaseHandler = () => {
    // That's how we dispatch actions
    let amount = 5;
    dispatch(counterActions.increment(amount)); // Pass the payload.
    // It adds the payload to the payload key so we can access action.payload in our reducer methods.
    // payload key is not upto us, It is required.
}
```
***
#### Manaing multiple Slices & Splitting code

```javascript
// index.js file
const store = configureStore({
	reducer: { counter: counterSlice.reducer, authentication: authSlice.reducer }
});
```
Now we can use these keys in useSelector, to selector these slices.

```javascript
const isAuth = useSelector((state) => state.authentication.isAuthenticated);
// where authentication is the key we used in reducer above.
```

#### Spliting our code

It's better to keep different slices in their own files, We can split our logic to different files and export them by default.

- Create a new file. `counter-slice.js`
- Move the initialState and counterSlice to that file.
- import the `{createSlice}` in the new file to use it.
- export default the counterSlice.reducer, we need only reducer in other file.
- export the the slice .actions. e.g `export const counterActions = counterSlice.actions`
- We can remove `{createSlice}` from index.js file.
- import all the slices from their respective files
- pass those imports to configureStore with custom keys
- Here we don't need to put .reducer because we only exported .reducer from the file.

***
# Advance Redux

As we know, Reducer functions must be pure, side-effects free and synchronous functions. This is not Redux specific but general reducer concept. useReducer also works in the same way.

So the reducers must return same kind of output, no side effects like A-Sync functions that blocks it, No code of that kind should be included in redux.

`Input (OldState,Action) => newState`

So, now the question is where should we put our side-effects? Because we have to dispatch actions that can send a http request.

We have two possible places where we can put our side-effects.

- In the component, dispatch the Fn only when the sideEffect is done.
- We write our own action creator functions instead of using default provided by redux toolkit.

## Refresher Practice

- Adding Redux to our project, again.

Install Redux toolkit library
```
npm i @reduxjs/toolkit react-redux
```

- Create a store folder, and index js file.
- Create files for slices.

```javascript
// demo slice
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
	name: 'ui',
	initialState: { cartIsVisible: false },
	reducers: {
		toggle(state) {
			state.cartIsVisible = !state.cartIsVisible;
		}
	}
});

export const uiActions = uiSlice.actions;
export default uiSlice;

```

#### Store Index file

```javascript
import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './ui.slice';

const store = configureStore({
	reducer: { ui: uiSlice.reducer }
});

export default store;

```

- Now that we have store, we need to provide it to our app.
- So import `{ Provider }` from `react-redux`
- import the store index js file. `import store from './store/index.js'
- and, Wrap the entire app with Provider and provide the store to it.

```javascript
ReactDOM.render(
	<Provider store={store}>
	<App />
	</Provider>,
	document.getElementById('root')
);
```

- Now that we have redux set-up, now we have to utilize it in our components.

As we know, there are two ways to send http requests while working with redux.

**Send the Http request in the component**

So, in any component we can use `useEffect` hook, pull out a data from store and watch the changes. so wheneever any data changed in the store, we can send a http request.

```javascript
let isInitial = true;

function App() {
	const showCart = useSelector((state) => state.ui.cartIsVisible);
	const cart = useSelector((state) => state.cart);

	useEffect(() => {
		if(isInitial){
            isInitial = false; 
            return;
        }
        // Doesn't send the data on component load.
        fetch(
			'https://fir-demo-a3f3e-default-rtdb.asia-southeast1.firebasedatabase.app/usercart.json',
			{
				method: 'PUT',
				body: JSON.stringify(cart)
			}
		);
	}, [cart]);
	return (
		<Layout>
			{showCart && <Cart />}
			<Products />
		</Layout>
	);
}
```

- Alternative Method, Creating our own Custom Action Creator Thunk.

A thunk is simply a function that delays an action until later.

A Action creator function that does **not** return the action itself but another function which eventually returns the action with `type` and `payload`.

How to write our own Custom action creator:

- Go to the end of the slice file.
- Create a function which returns another function.
- The returned function will receive `dispatch` function as parameter, as if we need to dispatch something inside.
- The returned function **can be async.**

```javascript
// This is a normal action which is created automatically.
// We don't create this on our own, It is created by Toolkit automatically.
const sendCartDataToFirebase = (data) => {
	return {type '', payload: ...};
}

// This is custom action creators that returns another function.
const sendCartDataToFirebase = (data) => {
	
    return (dispatchFn) => {
        dispatchFn();
    };
}
```


- Export a custom function which returns another function

```javascript
import { uiActions } from './ui.slice';

export const sendCartDataToFirebase = (cart) => {
	// 2 paramters to note.
	// Parent Fn receives arguement.
	// Return Function receives dispatch function so we can dispatch again.

	// This parent Fn Receives data in arguement,
	// does nothing but return another function which can be Async!
	return async (dispatch) => {
		// Receives dispatch function in arguement
		dispatch(
			uiActions.showNotification({
				status: 'pending',
				title: 'Sending...',
				message: 'Updating cart...'
			})
		);

		const sendReq = async () => {
			const res = await fetch(
				'https://fir-demo-a3f3e-default-rtdb.asia-southeast1.firebasedatabase.app/usercart.json',
				{
					method: 'PUT',
					body: JSON.stringify(cart)
				}
			);

			if (!res.ok) {
				throw new Error('Cart was not updated, try again in some time!');
			}
		};

		try {
			await sendReq();
			dispatch(
				uiActions.showNotification({
					status: 'success',
					title: 'Success!',
					message: 'Cart updated!'
				})
			);
		} catch (e) {
			dispatch(
				uiActions.showNotification({
					status: 'error',
					title: 'Error!',
					message: e.message
				})
			);
		}
	};
};

```

Now we can simply execute the function from any component, (Inside useEffect for best practice)

```javascript
// In a component.
import { sendCartDataToFirebase } from './store/cart.slice';
let isInitial=true;

const App = () => {
    // Some state managed data
    const cart = useSelector(state => state.ui.cart); 

    useEffect(() => {
            if (isInitial) {
                isInitial = false;
                return;
            }

            // Dispatch the custom action creator, pass any data you want.
            dispatch(sendCartDataToFirebase(cart));
        }, [cart, dispatch]);
}    
```

# Redux Dev Tools

These are extra tools which makes it easier to debug redux and redux states. It's difficult to find erros in  our overall store as our porject grows. It also enables us to jump back to any previous state at a given time which is superuseful.

### How to Install

Just google, Redux dev tools and Install the extension or it's application. Extension is preferred as it's get added to our developer panel on browser.

***

# React Router
## Routing

I am gonna spare the details of why we need routing and it's advantages. Let's directly jump to how can we build a Multi-Page-Application (not really) with React.

### React Router v6 

- All Route should be wrapped with `Routes` component. Even If It's just 1 route.
- Switch gone, replaced with `<Routes>`
- Elements needs to be passed as props with `element` key.
- `exact` prop is gone, as React v6 has better algorithem.
- `activeClassName` prop is gone from NavLink.
- NavLink's prop `className` is now special classname, it does not accepts a css anymore but a function
- In that function, Information about the link and current state is passed to that func by react router.
- `isActive` property is prevent on that data which is passed, we can check and apply css conditionally.

```javascript
<NavLink className={ (navData) => {} } to="/products" />
<NavLink className={(navData) => navData.isActive ? classes.active : ''} to="/products" />
```
- `Redirect` component is gone, new `Navigate` component is added.
- `replace` prop can be added to fully replace page with current one.

```javascript
<Routes>
<Route path="/" element={ <Navigate to="/welcome" /> } />
<Route path="/" element={ <Navigate replace to="/welcome" /> } />
</Routes>
```
- Deeply Nested Descendant Routes must start with parent route. So add `*` in the end `/*` of parent route.
- Descendant Routes means more than one `<Routes>` deep nested in components, they will build on top of the route that rendered them. 
- In nested paths and Link component, Links that do not start with `/` are relative! so we don't need to provide full path while mathcing routes.

```javascript
<Routes>
<Route path="/welcome" element={ <Welcome /> } />
</Routes>

// Now somewhere in other Component, Welcome in our case.
<Routes>
// new-user is basically /welcome/new-user
    <Route path="new-user" element={ <Welcome /> } />
</Routes>
// Link components are relative as well.
<Link to="new-user">New User</Link> // will open /welcome/new-user 
```

- Nested routes can be put as children in Routes.
```javascript
<Routes>
<Route path="/welcome/*" element={ <Welcome /> }>
    // Nested Route. /welcome/new-user
    <Route path="new-user" element={<p>Hello User</p>} />
</Route>
</Routes>
```

- But adding nested routing that way, How would we tell react router where to insert the data in the component?
- For that, there's a new component that is `Outlet`
- Just keeping the <Outlet /> inside the nested component is telling the router where to put the component data in nested route.
- Sometimes we need to Navigate when certain things happen, like http request is sent, or an action is finished or a button click.
- Before, `useHistroy` hook  was used to Navigate around but now it's gone. Instead now we have `useNavigate` hook.

```javascript
import {Link, useNavigate} from 'react-router-dom';

// useNavigate gives us a navigate function or object.
const navigate = useNavigate();

// to programatically navigate to somewhere using the navigate object. 
navigate('/welcome'); // but yeah mind it's a component so use it in useEffect or somewhere to avoid Infinite rendering.
// to redirect
navigate('/welcome', {replace: true}); // Replaces Navigation stack
navigate(-1); // We can also pass number for forward or backward navigation.
// -1 for previous page, -2 for page before-previous page, 1 for forward again. (Navigation stack)
```

- Promt was used to prevent accidently leaving page if have unsaved changes.
- But now it's gone, Implement your own logic now or don't upgrade to v6 for now.


### Installing React Router

```
npm i react-router-dom
```

### Usage

Simply, import `Route` and `Routes` from the `react-router-dom` package.

```javascript
import { Route, Routes } from 'react-router-dom';
import Products from './components/Products';
import Welcome from './components/Welcome';
import MainHeader from './components/MainHeader';

function App() {
	return (
		<div>
			<MainHeader />
			<main>
				<Routes>
					<Route path="/welcome" element={<Welcome />} />
					<Route path="/products" element={<Products />} />
				</Routes>
			</main>
		</div>
	);
}
```

Also, Wrap your entire `<App />` component with `BrowserRouter`.

```javascript
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root')
);

```

### Linking components.

We can link components by using the `Link` component.

```javascript
import { Link } from 'react-router-dom';

<Link to="/products">Our Products</Link>
```

### NavLink

NavLink component is used for navigation, as it provides extra functionality such as giving the active component.

NavLink accepts a function in `className`, and some information about active NavLink is passed. We can utilize that to find out which component is active and mark it as active in css.

```javascript
<NavLink className={(navData) => navData.isActive ? classes.active : '' } to="/welcome">Welcome</NavLink>
```

### Nested & Dynamic Routing

Dynamic routing can be setup with colon `:identifier`, which we can later grab inside component.

```javascript
<Routes>
	<Route path="/welcome" element={<Welcome />} />
	<Route path="/products/*" element={<Products />}>
		// /* enables nested child, it set as property of params object in the component.	
		// products/product-detail/anyProductID
		<Route
			path="product-detail/:productId"
			element={<ProductDetail />}
		/>
	</Route>
</Routes>
```
Now that we have setup a parameter for dynamic routing, we have to access it. So In a component..

```javascript
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
	const {productId} = useParams(); // grab the param
	// do something with param
	return (<p>{productId}</p>);
}
```

### Query Parameters

Query Parameters are some special Parameters we can find in the end of URLs. Difference between Params and Query Params is that Params are mandatory where Query can be optional to load the page.

Reading Query Parameters is easy.

We have to use `useLocation` hook from `react-router-dom`.

```javascript
import {useLocation} from 'react-router-dom';

// In a component
const location = useLocation();
const queryParms = new URLSearchParams(location.search);
// Now we can get the keys from queryParams object using get method.
const isSorting = queryParams.get('sort');

```

We can use `URLSearchParams()` function to convert the search to a Javascript Object. `URLSearchParams()` is a default Javascript Function available on Browser and nothign React specific.

We can perform various functions on the object such as `delete`, `get`, `has`, `keys` and more, all these functions are available in the `queryParams` object.







