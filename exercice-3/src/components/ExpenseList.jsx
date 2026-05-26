export default function ExpenseList({ expenses, people, onDelete }) {
  function getPersonName(id) {
    return people.find((p) => p.id === id)?.name ?? 'Inconnu'
  }

  if (expenses.length === 0) return null

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-800">Dépenses</h2>
      <div className="space-y-2">
        {expenses.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-800">{exp.description}</p>
              <p className="text-sm text-gray-500">
                {exp.amount.toFixed(2)} € · payé par {getPersonName(exp.paidBy)}
                {' · '}réparti entre {exp.splitAmong.map(getPersonName).join(', ')}
              </p>
            </div>
            <button
              onClick={() => onDelete(exp.id)}
              className="ml-3 text-gray-400 hover:text-red-500 transition-colors text-lg leading-none cursor-pointer"
              title="Supprimer"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
