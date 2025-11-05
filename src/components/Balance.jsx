import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { calculateTotals } from '../utils/helpers'

export default function Balance() {
  const { state } = useContext(AppContext)
  const { income, expense, balance } = calculateTotals(state.transactions)

  return (
    <div className="card balance">
      <h2>Balance: ₹{balance.toFixed(2)}</h2>
      <div>
        <span className="income">Income: ₹{income.toFixed(2)}</span> | 
        <span className="expense"> Expense: ₹{expense.toFixed(2)}</span>
      </div>
    </div>
  )
}
