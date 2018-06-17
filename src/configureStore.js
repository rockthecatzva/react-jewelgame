import { createStore, applyMiddleware, compose } from 'redux'
//import { createLogger } from 'redux-logger'
import rootReducer from './reducers'

//const loggerMiddleware = createLogger()

export default function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    compose(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() )
    //compose(applyMiddleware(thunkMiddleware))
    
  )
}