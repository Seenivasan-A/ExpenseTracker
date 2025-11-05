// src/sample-data.js
import { v4 as uuidv4 } from 'uuid'

const now = new Date()
const iso = d => new Date(d).toISOString()

// Create sample transactions across multiple months for better charts
const SAMPLE = {
  transactions: [
    // Jan
    { id: uuidv4(), type: 'income', amount: 50000, date: iso(new Date(now.getFullYear(), now.getMonth()-3, 1)), category: 'c_salary', note: 'Salary Jan' },
    { id: uuidv4(), type: 'expense', amount: 8000, date: iso(new Date(now.getFullYear(), now.getMonth()-3, 5)), category: 'c_rent', note: 'Rent' },
    { id: uuidv4(), type: 'expense', amount: 1200, date: iso(new Date(now.getFullYear(), now.getMonth()-3, 8)), category: 'c_food', note: 'Groceries' },
    { id: uuidv4(), type: 'expense', amount: 600, date: iso(new Date(now.getFullYear(), now.getMonth()-3, 12)), category: 'c_transport', note: 'Commute' },

    // Feb
    { id: uuidv4(), type: 'income', amount: 50000, date: iso(new Date(now.getFullYear(), now.getMonth()-2, 1)), category: 'c_salary', note: 'Salary Feb' },
    { id: uuidv4(), type: 'expense', amount: 8200, date: iso(new Date(now.getFullYear(), now.getMonth()-2, 5)), category: 'c_rent', note: 'Rent' },
    { id: uuidv4(), type: 'expense', amount: 1500, date: iso(new Date(now.getFullYear(), now.getMonth()-2, 10)), category: 'c_shopping', note: 'Clothes' },
    { id: uuidv4(), type: 'expense', amount: 700, date: iso(new Date(now.getFullYear(), now.getMonth()-2, 14)), category: 'c_food', note: 'Eating out' },

    // Mar
    { id: uuidv4(), type: 'income', amount: 52000, date: iso(new Date(now.getFullYear(), now.getMonth()-1, 1)), category: 'c_salary', note: 'Salary Mar' },
    { id: uuidv4(), type: 'expense', amount: 8300, date: iso(new Date(now.getFullYear(), now.getMonth()-1, 4)), category: 'c_rent', note: 'Rent' },
    { id: uuidv4(), type: 'expense', amount: 1800, date: iso(new Date(now.getFullYear(), now.getMonth()-1, 9)), category: 'c_food', note: 'Groceries' },
    { id: uuidv4(), type: 'expense', amount: 900, date: iso(new Date(now.getFullYear(), now.getMonth()-1, 16)), category: 'c_transport', note: 'Intercity' },

    // Current month
    { id: uuidv4(), type: 'income', amount: 54000, date: iso(new Date(now.getFullYear(), now.getMonth(), 1)), category: 'c_salary', note: 'Salary Current' },
    { id: uuidv4(), type: 'expense', amount: 8500, date: iso(new Date(now.getFullYear(), now.getMonth(), 3)), category: 'c_rent', note: 'Rent' },
    { id: uuidv4(), type: 'expense', amount: 2000, date: iso(new Date(now.getFullYear(), now.getMonth(), 6)), category: 'c_shopping', note: 'Gadgets' },
    { id: uuidv4(), type: 'expense', amount: 1100, date: iso(new Date(now.getFullYear(), now.getMonth(), 8)), category: 'c_food', note: 'Meals & Snacks' },
    { id: uuidv4(), type: 'expense', amount: 700, date: iso(new Date(now.getFullYear(), now.getMonth(), 10)), category: 'c_transport', note: 'Fuel' },

    // extra misc
    { id: uuidv4(), type: 'expense', amount: 400, date: iso(new Date(now.getFullYear(), now.getMonth(), 12)), category: 'c_entertainment', note: 'Movie' },
    { id: uuidv4(), type: 'expense', amount: 300, date: iso(new Date(now.getFullYear(), now.getMonth(), 15)), category: 'c_coffee', note: 'Coffee' },
  ]
}

export default SAMPLE
