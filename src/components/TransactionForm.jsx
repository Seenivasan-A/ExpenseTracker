// src/components/TransactionForm.jsx
import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { v4 as uuidv4 } from 'uuid'

export default function TransactionForm() {
  const { state, dispatch } = useContext(AppContext)
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(state.categories[0]?.id || '')
  const [note, setNote] = useState('')
  const [tags, setTags] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [recurring, setRecurring] = useState('none') // none, monthly

  useEffect(() => {
    if (!state.categories.find(c => c.id === category)) setCategory(state.categories[0]?.id || '')
  }, [state.categories])

  function handleSubmit(e) {
    e.preventDefault()
    const n = Number(amount)
    if (!amount || isNaN(n) || n <= 0) return alert('Enter a valid amount')
    const tx = {
      id: uuidv4(),
      type,
      amount: n,
      category,
      note,
      tags: tags.split(',').map(s=>s.trim()).filter(Boolean),
      date: new Date(date).toISOString(),
      recurring // store the string for future processing
    }
    dispatch({ type: 'ADD_TX', payload: tx })
    setAmount(''); setNote(''); setTags(''); setRecurring('none')
  }

  return (
    <div className="card">
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit} style={{marginTop:8}}>
        <div className="form-row">
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input type="number" step="0.01" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />

          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {state.categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </div>

        <div className="form-row" style={{marginTop:10}}>
          <input type="text" placeholder="Note / Description" value={note} onChange={e=>setNote(e.target.value)} style={{flex:1}} />
          <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />
          <select value={recurring} onChange={e=>setRecurring(e.target.value)}>
            <option value="none">No repeat</option>
            <option value="monthly">Monthly</option>
          </select>

          <button className="btn" type="submit">Add</button>
        </div>
      </form>
    </div>
  )
}
