// src/components/TransactionList.jsx
import React, { useContext, useMemo } from 'react'
import { AppContext } from '../context/AppContext'

const DEFAULT_PALETTE = [
  '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0',
  '#845EF7', '#FF8A65', '#7C4DFF', '#00C853',
  '#FF5252', '#FFA000', '#00BCD4', '#8BC34A'
]

function makeCategoryColorMap(categories = [], palette = DEFAULT_PALETTE) {
  const map = {}
  categories.forEach((c, idx) => {
    map[c.id] = palette[idx % palette.length]
  })
  return map
}

export default function TransactionList(){
  const { state, dispatch } = useContext(AppContext)
  const catColorMap = useMemo(()=> makeCategoryColorMap(state.categories), [state.categories])

  function deleteTx(id){
    if (window.confirm('Delete this transaction?')) dispatch({ type: 'DELETE_TX', payload: id })
  }

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Transactions</h3>
      <div className="tx-list">
        {state.transactions.length===0 && <p className="small-muted">No transactions yet</p>}
        {state.transactions.map(tx => {
          const c = state.categories.find(cc => cc.id === tx.category)
          const color = c ? (catColorMap[c.id] || '#888') : '#888'
          return (
            <div key={tx.id} className="tx-item">
              <div className="tx-left">
                <div style={{width:10, height:10, borderRadius:999, background: color, marginRight:8}} />
                <div style={{display:'flex', flexDirection:'column', minWidth:0}}>
                  <div className="tx-note">{tx.note || (tx.type==='income' ? 'Income' : 'Expense')}</div>
                  <div className="tx-meta">
                    {new Date(tx.date).toLocaleDateString()} · {c?.name || tx.category}
                    {tx.tags && tx.tags.length ? <span className="tag">{tx.tags.join(', ')}</span> : null}
                    {tx.recurring && tx.recurring!=='none' ? <span className="tag">Repeats: {tx.recurring}</span> : null}
                  </div>
                </div>
              </div>

              <div style={{textAlign:'right', minWidth:120}}>
                <div className={tx.type==='income' ? 'income' : 'expense'}>₹{Number(tx.amount).toFixed(2)}</div>
                <div style={{marginTop:6}}>
                  <button className="btn secondary" onClick={()=>deleteTx(tx.id)}>Delete</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
