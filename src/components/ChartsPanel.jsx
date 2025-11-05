// src/components/ChartsPanel.jsx
import React, { useContext, useMemo, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { Bar, Line, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { groupByMonthDetailed, groupByCategory } from '../utils/helpers'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend)

const PALETTE = [
  '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0',
  '#845EF7', '#FF8A65', '#7C4DFF', '#00C853',
  '#FF5252', '#FFA000', '#00BCD4', '#8BC34A'
]

function buildCategoryColorMap(categories = []) {
  const map = {}
  categories.forEach((c, i) => map[c.id] = PALETTE[i % PALETTE.length])
  return map
}

export default function ChartsPanel() {
  const { state } = useContext(AppContext)

  const barRef = useRef(null)
  const lineRef = useRef(null)
  const pieRef = useRef(null)

  const months = useMemo(() => groupByMonthDetailed(state.transactions), [state.transactions])
  const cats = useMemo(() => groupByCategory(state.transactions, state.categories), [state.transactions, state.categories])
  const catColorMap = useMemo(() => buildCategoryColorMap(state.categories), [state.categories])

  // Bar: income vs expense
  const barLabels = months.map(m => m.month)
  const incomeData = months.map(m => Number(m.income.toFixed(2)))
  const expenseData = months.map(m => Number(m.expense.toFixed(2)))

  const barData = {
    labels: barLabels,
    datasets: [
      { label: 'Income', data: incomeData, backgroundColor: '#10B981' }, // green
      { label: 'Expense', data: expenseData, backgroundColor: '#EF4444' } // red
    ]
  }
  const barOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
    interaction: { mode: 'index', intersect: false },
    scales: { y: { ticks: { callback: v => `₹${v}` } } }
  }

  // Line: net (income - expense)
  const lineData = {
    labels: barLabels,
    datasets: [{
      label: 'Net',
      data: months.map(m => Number(m.net.toFixed(2))),
      borderColor: '#0EA5E9',
      backgroundColor: 'rgba(14,165,233,0.12)',
      tension: 0.25,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: months.map(m => (m.net >= 0 ? '#10B981' : '#EF4444'))
    }]
  }
  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: true }, tooltip: { callbacks: { label: ctx => `₹${ctx.parsed.y}` } } },
    scales: { y: { ticks: { callback: v => `₹${v}` } } }
  }

  // Pie: category breakdown
  const pieLabels = cats.map(c => c.name)
  const pieValues = cats.map(c => c.value)
  const pieColors = cats.map(c => {
    const catObj = state.categories.find(x => x.name === c.name)
    return catObj ? (catColorMap[catObj.id] || PALETTE[0]) : PALETTE[0]
  })
  const pieData = { labels: pieLabels, datasets: [{ data: pieValues, backgroundColor: pieColors, hoverOffset: 8 }] }
  const pieOptions = { responsive: true, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: ctx => `${ctx.label}: ₹${ctx.parsed}` } } } }

  // Transactions rows for PDF table
  const tableRows = state.transactions.map(tx => ([
    new Date(tx.date).toLocaleDateString(),
    tx.note || '',
    (state.categories.find(c => c.id === tx.category)?.name) || tx.category || 'Other',
    tx.type,
    `₹${Number(tx.amount).toFixed(2)}`
  ]))

  // Build the jsPDF document (shared by preview and download)
  function buildPDFDocument() {
    const doc = new jsPDF('p', 'mm', 'a4')

    // --- Profile header (avatar + details) ---
    if (state.user?.avatar) {
      try {
        doc.addImage(state.user.avatar, 'PNG', 160, 12, 30, 30)
      } catch (e) {
        console.warn('avatar image add failed', e)
      }
    }
    doc.setFontSize(14)
    doc.text(state.user?.name || 'Guest User', 14, 20)
    doc.setFontSize(10)
    doc.text(state.user?.email || '', 14, 26)
    const currencySymbol = state.user?.currency === 'INR' ? '₹' : (state.user?.currency === 'USD' ? '$' : (state.user?.currency === 'EUR' ? '€' : state.user?.currency || ''))
    doc.text(`Currency: ${state.user?.currency || 'INR'}   Salary: ${currencySymbol}${Number(state.user?.salary || 0).toLocaleString()}`, 14, 34)

    // Title & time
    doc.setFontSize(12)
    doc.text(`Expense Report`, 14, 44)
    doc.setFontSize(9)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 50)

    // Bar chart
    if (barRef.current && barRef.current.toBase64Image) {
      try {
        const barImg = barRef.current.toBase64Image()
        doc.addImage(barImg, 'PNG', 10, 56, 190, 70)
      } catch (err) {
        console.warn('Bar image failed', err)
        doc.text('Bar chart not available', 14, 64)
      }
    } else {
      doc.text('No bar chart data', 14, 64)
    }

    // Line chart on next page
    if (lineRef.current && lineRef.current.toBase64Image) {
      doc.addPage()
      doc.setFontSize(12)
      doc.text('Monthly Net Trend', 14, 18)
      try {
        const lineImg = lineRef.current.toBase64Image()
        doc.addImage(lineImg, 'PNG', 14, 26, 180, 80)
      } catch (err) {
        console.warn('Line image failed', err)
        doc.text('Line chart not available', 14, 36)
      }
    }

    // Pie chart
    if (pieRef.current && pieRef.current.toBase64Image) {
      doc.addPage()
      doc.setFontSize(12)
      doc.text('Category Breakdown', 14, 18)
      try {
        const pieImg = pieRef.current.toBase64Image()
        doc.addImage(pieImg, 'PNG', 30, 28, 150, 110)
      } catch (err) {
        console.warn('Pie image failed', err)
        doc.text('Pie chart not available', 14, 36)
      }
    }

    // Summary + transactions
    doc.addPage()
    doc.setFontSize(12)
    doc.text('Summary', 14, 18)
    const totalIncome = state.transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0)
    const totalExpense = state.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0)
    doc.setFontSize(10)
    doc.text(`Total income: ₹${totalIncome.toFixed(2)}`, 14, 28)
    doc.text(`Total expense: ₹${totalExpense.toFixed(2)}`, 14, 36)
    doc.text(`Net balance: ₹${(totalIncome - totalExpense).toFixed(2)}`, 14, 44)

    const head = [['Date', 'Note', 'Category', 'Type', 'Amount']]
    autoTable(doc, {
      head,
      body: tableRows,
      startY: 56,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [14,165,233] },
      theme: 'striped',
      margin: { left: 8, right: 8 },
      pageBreak: 'auto'
    })

    return doc
  }

  // Download file
  function downloadPDF() {
    try {
      const doc = buildPDFDocument()
      doc.save('expense-report-full.pdf')
    } catch (e) {
      console.error('PDF download failed', e)
      alert('Failed to generate PDF for download')
    }
  }

  // Preview: open PDF in new tab
  function previewPDF() {
    try {
      const doc = buildPDFDocument()
      // create blob and open in new tab
      const blob = doc.output('blob')
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')

      // revoke after some time to free memory
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (e) {
      console.error('PDF preview failed', e)
      alert('Failed to generate PDF preview')
    }
  }

  return (
    <div className="card chart-wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Reports & Export</h3>
        <div className="chart-actions">
          <button className="btn secondary" onClick={() => navigator.share ? navigator.share({ title: 'Expense Tracker', text: 'My expense report' }) : alert('Share not available')}>Share</button>
          <button className="btn" onClick={previewPDF}>Preview PDF</button>
          <button className="btn" onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="card" style={{ marginBottom: 12 }}>
          <h4 style={{ marginTop: 0 }}>Income vs Expense (per month)</h4>
          {barLabels.length ? <Bar ref={barRef} data={barData} options={barOptions} /> : <p className="small-muted">Add transactions to see monthly bars</p>}
        </div>

        <div className="card" style={{ marginBottom: 12 }}>
          <h4 style={{ marginTop: 0 }}>Net Trend</h4>
          {lineData.labels.length ? <Line ref={lineRef} data={lineData} options={lineOptions} /> : <p className="small-muted">Add transactions to see trend</p>}
        </div>

        <div className="card">
          <h4 style={{ marginTop: 0 }}>Category Breakdown</h4>
          {pieLabels.length ? <Pie ref={pieRef} data={pieData} options={pieOptions} /> : <p className="small-muted">No category data yet</p>}
        </div>
      </div>
    </div>
  )
}
