import { combineReducers, configureStore } from '@reduxjs/toolkit'
import usersReducer from '../features/userSlice'
import onlineUsersReducer from '../features/onlineUsersSlice'
import gameReducer from '../features/gameSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import challengeReducer from '../features/challengeSlice';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({ 
  users: usersReducer,
  onlineUsers: onlineUsersReducer,
  game: gameReducer,
  challenges: challengeReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
})

export const persistor = persistStore(store);