export function computeBalances(people, expenses) {
  const balance = {}
  for (const p of people) balance[p.id] = 0

  for (const exp of expenses) {
    const share = exp.amount / exp.splitAmong.length
    balance[exp.paidBy] += exp.amount
    for (const pid of exp.splitAmong) {
      balance[pid] -= share
    }
  }

  const debts = []
  for (const p of people) {
    if (balance[p.id] < 0) {
      debts.push({ personId: p.id, amount: -balance[p.id] })
    }
  }
  const credits = []
  for (const p of people) {
    if (balance[p.id] > 0) {
      credits.push({ personId: p.id, amount: balance[p.id] })
    }
  }

  const settlements = []
  let i = 0, j = 0
  while (i < debts.length && j < credits.length) {
    const amount = Math.min(debts[i].amount, credits[j].amount)
    settlements.push({
      from: debts[i].personId,
      to: credits[j].personId,
      amount: Math.round(amount * 100) / 100,
    })
    debts[i].amount -= amount
    credits[j].amount -= amount
    if (debts[i].amount < 0.01) i++
    if (credits[j].amount < 0.01) j++
  }

  return { balance, settlements }
}

export default function BalanceSummary({ people, expenses }) {
  if (people.length === 0) return null

  const { balance, settlements } = computeBalances(people, expenses)

  function getName(id) {
    return people.find((p) => p.id === id)?.name ?? 'Inconnu'
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Balances</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {people.map((p) => {
          const bal = balance[p.id]
          const color = bal === 0 ? 'text-gray-500' : bal > 0 ? 'text-emerald-600' : 'text-red-500'
          return (
            <div key={p.id} className="bg-white p-3 rounded-lg border border-gray-200 text-center">
              <p className="font-medium text-gray-800">{p.name}</p>
              <p className={`text-lg font-semibold ${color}`}>
                {bal > 0 ? '+' : ''}{bal.toFixed(2)} €
              </p>
            </div>
          )
        })}
      </div>

      {settlements.length > 0 && (
        <div className="space-y-1.5">
          <h3 className="text-sm font-medium text-gray-600">Remboursements</h3>
          {settlements.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
              <span className="font-medium text-red-600">{getName(s.from)}</span>
              <span>doit</span>
              <span className="font-medium text-emerald-600">{s.amount.toFixed(2)} €</span>
              <span>à</span>
              <span className="font-medium">{getName(s.to)}</span>
            </div>
          ))}
        </div>
      )}

      {expenses.length > 0 && settlements.length === 0 && (
        <p className="text-sm text-gray-500 italic">Tout est équilibré !</p>
      )}
    </div>
  )
}
