import React from 'react'
import Balance from './Balance'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import Filters from './Filters'
import ChartsPanel from './ChartsPanel'
import Profile from './Profile'

export default function Dashboard(){
  return (
    <>
      <div className="header">
        <div className="title">
          <h1>Expense Tracker</h1>
          <div className="subtitle">Clean, local-first finance dashboard</div>
        </div>
        <Profile />
      </div>

      <div className="grid">
        <div>
          <Balance />
          <TransactionForm />
          <Filters />
          <TransactionList />
        </div>
        <aside>
          <ChartsPanel />
        </aside>
      </div>
    </>
  )
}
