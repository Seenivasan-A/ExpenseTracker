// src/context/AppContext.jsx
import React, { createContext, useReducer, useEffect } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'
import SAMPLE from '../sample-data'

export const AppContext = createContext()

const LOCAL_KEY = 'expense_tracker_v1'

const initialState = {
  user: {
    name: 'Guest User',
    email: '',
    currency: 'INR',
    salary: 0,
    avatar: null // base64 data URL
  },
  transactions: [],
  categories: [
    { id: 'c_salary', name: 'Salary', type: 'income' },
    { id: 'c_rent', name: 'Rent', type: 'expense' },
    { id: 'c_food', name: 'Food', type: 'expense' },
    { id: 'c_transport', name: 'Transport', type: 'expense' },
    { id: 'c_shopping', name: 'Shopping', type: 'expense' },
    { id: 'c_entertainment', name: 'Entertainment', type: 'expense' },
    { id: 'c_coffee', name: 'Coffee', type: 'expense' }
  ]
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, ...action.payload }
    case 'ADD_TX':
      return { ...state, transactions: [action.payload, ...state.transactions] }
    case 'UPDATE_TX':
      return { ...state, transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) }
    case 'DELETE_TX':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) }
    case 'RESET_SAMPLE':
      return { ...state, transactions: SAMPLE.transactions }
    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const saved = loadFromStorage(LOCAL_KEY)
    if (saved) {
      // merge with initialState for missing fields
      dispatch({ type: 'LOAD', payload: { ...initialState, ...saved } })
    } else {
      dispatch({ type: 'LOAD', payload: { ...initialState, transactions: SAMPLE.transactions } })
    }
  }, [])

  useEffect(() => {
    saveToStorage(LOCAL_KEY, state)
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}
