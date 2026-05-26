import { useState } from 'react'
import AddPerson from './components/AddPerson.jsx'
import AddExpense from './components/AddExpense.jsx'
import ExpenseList from './components/ExpenseList.jsx'
import BalanceSummary from './components/BalanceSummary.jsx'
import './App.css'

let nextPersonId = 1
let nextExpenseId = 1

export default function App() {
  const [people, setPeople] = useState([
    { id: 0, name: 'Alice' },
    { id: 1, name: 'Bob' },
    { id: 2, name: 'Charlie' },
  ])
  const [expenses, setExpenses] = useState([])
  const [tab, setTab] = useState('expenses')

  nextPersonId = people.length
  nextExpenseId = expenses.length

  function addPerson(name) {
    setPeople([...people, { id: nextPersonId++, name }])
  }

  function removePerson(id) {
    const used = expenses.some((e) => e.paidBy === id || e.splitAmong.includes(id))
    if (used) {
      alert('Impossible de supprimer un participant qui a des dépenses associées.')
      return
    }
    setPeople(people.filter((p) => p.id !== id))
  }

  function addExpense(exp) {
    setExpenses([...expenses, { id: nextExpenseId++, ...exp }])
  }

  function deleteExpense(id) {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Expense Splitter</h1>
          <p className="text-gray-500 mt-1">Partagez vos dépenses simplement</p>
        </header>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Participants</h2>
          <AddPerson onAdd={addPerson} />
          <div className="flex flex-wrap gap-2 mt-3">
            {people.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {p.name}
                {people.length > 1 && (
                  <button
                    onClick={() => removePerson(p.id)}
                    className="ml-0.5 text-indigo-400 hover:text-red-500 transition-colors leading-none cursor-pointer"
                    title="Supprimer"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-1 mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          <button
            onClick={() => setTab('expenses')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === 'expenses'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Dépenses
          </button>
          <button
            onClick={() => setTab('balances')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === 'balances'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Balances
          </button>
        </div>

        {tab === 'expenses' ? (
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Nouvelle dépense</h2>
              {people.length > 0 ? (
                <AddExpense people={people} onAdd={addExpense} />
              ) : (
                <p className="text-gray-500 text-sm">Ajoutez des participants pour créer une dépense.</p>
              )}
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <ExpenseList people={people} expenses={expenses} onDelete={deleteExpense} />
              {expenses.length === 0 && (
                <p className="text-gray-500 text-sm">Aucune dépense pour le moment.</p>
              )}
            </section>
          </div>
        ) : (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <BalanceSummary people={people} expenses={expenses} />
          </section>
        )}
      </div>
    </div>
  )
}
