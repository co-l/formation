import { useState } from 'react'

export default function AddExpense({ people, onAdd }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(people[0]?.id ?? '')
  const [splitAmong, setSplitAmong] = useState(new Set())

  function togglePerson(id) {
    const next = new Set(splitAmong)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSplitAmong(next)
  }

  function toggleAll() {
    if (splitAmong.size === people.length) {
      setSplitAmong(new Set())
    } else {
      setSplitAmong(new Set(people.map((p) => p.id)))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!description.trim() || !amount || !paidBy || splitAmong.size === 0) return
    onAdd({
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy,
      splitAmong: [...splitAmong],
    })
    setDescription('')
    setAmount('')
    setSplitAmong(new Set())
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (ex: Dîner)"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Montant"
          min="0"
          step="0.01"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payé par</label>
        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
        >
          {people.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">Réparti entre</label>
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            {splitAmong.size === people.length ? 'Désélectionner tout' : 'Sélectionner tout'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {people.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => togglePerson(p.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                splitAmong.has(p.id)
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!description.trim() || !amount || !paidBy || splitAmong.size === 0}
      >
        Ajouter la dépense
      </button>
    </form>
  )
}
