// src/components/Profile.jsx
import React, { useContext, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'

const CURRENCIES = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' }
]

export default function Profile(){
  const { state, dispatch } = useContext(AppContext)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(state.user?.name || '')
  const [email, setEmail] = useState(state.user?.email || '')
  const [currency, setCurrency] = useState(state.user?.currency || 'INR')
  const [salary, setSalary] = useState(state.user?.salary || 0)
  const fileRef = useRef(null)

  // keep local inputs in sync if state.user changes elsewhere
  React.useEffect(() => {
    setName(state.user?.name || '')
    setEmail(state.user?.email || '')
    setCurrency(state.user?.currency || 'INR')
    setSalary(state.user?.salary || 0)
  }, [state.user])

  function save(){
    dispatch({ type: 'UPDATE_PROFILE', payload: { name, email, currency, salary: Number(salary) } })
    setEditing(false)
  }

  function handleAvatarFile(e){
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = function(evt){
      const dataUrl = evt.target.result
      // store base64 as avatar in user
      dispatch({ type: 'UPDATE_PROFILE', payload: { avatar: dataUrl } })
    }
    reader.readAsDataURL(file)
  }

  function removeAvatar(){
    dispatch({ type: 'UPDATE_PROFILE', payload: { avatar: null } })
  }

  const initials = (state.user?.name || 'U').split(' ').map(s=>s[0]||'').slice(0,2).join('').toUpperCase()

  return (
    <div className="card profile" style={{display:'flex', alignItems:'center', justifyContent:'flex-end', gap:12}}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div className="avatar" title={state.user?.name || 'User'} style={{width:56, height:56, fontSize:18}}>
          {state.user?.avatar ? (
            <img src={state.user.avatar} alt="avatar" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:999}} />
          ) : initials}
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontWeight:700}}>{state.user?.name || 'Guest User'}</div>
          <div className="small-muted">{state.user?.email || 'No email set'}</div>
          <div className="small-muted" style={{marginTop:4, fontSize:12}}>
            {state.user?.currency || 'INR'} · Monthly salary: {state.user?.currency === 'INR' ? '₹' : (state.user?.currency === 'USD' ? '$' : '')}{Number(state.user?.salary||0).toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{marginLeft:12}}>
        {editing ? (
          <div style={{display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end', minWidth:240}}>
            <div style={{display:'flex', gap:8, width:'100%'}}>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" style={{flex:1}} />
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{flex:1}} />
            </div>

            <div style={{display:'flex', gap:8, width:'100%'}}>
              <select value={currency} onChange={e=>setCurrency(e.target.value)}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
              </select>
              <input type="number" value={salary} onChange={e=>setSalary(e.target.value)} placeholder="Monthly salary" />
            </div>

            <div style={{display:'flex', gap:8, width:'100%', justifyContent:'flex-end', alignItems:'center'}}>
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleAvatarFile} />
              <button className="btn secondary" onClick={()=>fileRef.current && fileRef.current.click()}>Upload avatar</button>
              <button className="btn secondary" onClick={removeAvatar}>Remove avatar</button>
              <button className="btn" onClick={save}>Save</button>
              <button className="btn secondary" onClick={()=>setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <button className="btn" onClick={()=>setEditing(true)}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  )
}
