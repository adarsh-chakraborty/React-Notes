# Redux

![Redux](https://i.postimg.cc/XvG3rCjn/getting-started-with-redux-1096x453.png)

# Install & Use Redux in your react project.

## Install the following packages in your project:

```
npm i redux react-redux redux-thunk redux-devtools-extension
```

## Create the Redux Store

We need to create a file to store redux states, It will act as central store for our application.

- Create a folder named `store` in your `src` folder.
- Create a `.js` file. `Kebab-Case` naming convention is prefered.`

`store/store.js`
```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({});
const initialState = {};
const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
```

Now we need a Provider and pass the store to it, to be able to use this store in the app.
So, In the Index.js file, Wrap the app with store and pass the store.

`src/index.js`
```javascript
import { Provider } from 'react-redux';
import store from './store/store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

```

### Now we have successfully setup an empty store.

Let's create some redux & action.

- Create a folder for your all `reducers`.
- Create a `.js` for each reducer.

`productListReducer.js`

```javascript
export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case 'PRODUCT_LIST_REQUEST':
      return { loading: true, products: [] };
    case 'PRODUCT_LIST_SUCCESS':
      return { loading: false, products: action.payload };
    case 'PRODUCT_LIST_FAIL':
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

```

Now we have created a reducer, now we have to import it in our store, to be able to use it.

```javascript
import { productListReducer } from '../reducers/productReducers';

const reducer = combineReducers({ productList: productListReducer });
```

*Here, `productList` will be our key to access this part of store/state.*

The Identifiers can be outsourced to a separate file, where we can manage all our constants.

```javascript
export const PRODUCT_LIST_REQUEST = 'PRODUCT_LIST_REQUEST1';
export const PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS2';
export const PRODUCT_LIST_FAIL = 'PRODUCT_LIST_FAIL3';
```

### Creating Actions

Create a folder for `actions` and create a file for our `productActions`

`productActions.js`
```javascript
import axios from 'axios';
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL
} from '../constants/productConstants';

export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data } = await axios.get('/api/products');
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (e) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        e.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
}
```

Now everything's all set-up and good, we can now use it in our components wherever required.

```javascript
import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);

  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);
  return (
    <>
      <h1>Latest Products</h1>
      {loading && <h2>Loading...</h2>}
      {error && <h2>{error}...</h2>}
      {!error && !loading && (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
```


That's all.

### Practice: Making a Reducer for Product Details.

- Define the Constants for the new actions.

```javascript
export const PRODUCT_LIST_REQUEST = 'PRODUCT_LIST_REQUEST1';
export const PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS2';
export const PRODUCT_LIST_FAIL = 'PRODUCT_LIST_FAIL3';

export const PRODUCT_DETAIL_REQUEST = 'PRODUCT_DETAIL_REQUEST1';
export const PRODUCT_DETAIL_SUCCESS = 'PRODUCT_DETAIL_SUCCESS2';
export const PRODUCT_DETAIL_FAIL = 'PRODUCT_DETAIL_FAIL3';
```

Next, We go to reducer and create another reducer, we can keep related reducers in same file.

```javascript
export const productDetailReducer = (
  state = { product: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAIL_REQUEST:
      return { loading: true, ...state };
    case PRODUCT_DETAIL_SUCCESS:
      return { loading: false, product: action.payload };
    case PRODUCT_DETAIL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
```

Now, we need to add this reducer in our `store.js`

```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  productListReducer,
  productDetail: productDetailReducer
} from '../reducers/productReducers';

const reducer = combineReducers({
  productList: productListReducer,
  productDetailReducer
});
const initialState = {};
const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
```

- All we did is we imported the reducer and added it to combine reducer function with a new key `productDetail`.


Now, we need to create an action for this new reducer.

`actions/productActions.js`
```javascript

export const listProductDetail = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAIL_REQUEST });
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch({ type: PRODUCT_DETAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAIL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};
```

All done, now we can use dispatch this action from our component.

```javascript
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProductDetail } from '../actions/productActions';

const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const productDetail = useSelector((state) => state.productDetail);
  const { loading, error, product } = productDetail;
  useEffect(() => {
    dispatch(listProductDetail(id));
  }, [id, dispatch]);

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {loading && <Loader></Loader>}
      {error && <Message variant="danger">{error}</Message>}
      {!loading && !error && (
        // show the data
      )}
    </>
  );
};

export default ProductScreen;
```

