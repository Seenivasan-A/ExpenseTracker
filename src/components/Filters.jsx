import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

export default function Filters() {
  const { dispatch } = useContext(AppContext)

  return (
    <div className="card">
      <button onClick={() => dispatch({ type: 'RESET_SAMPLE' })}>Load Sample Data</button>
    </div>
  )
}
