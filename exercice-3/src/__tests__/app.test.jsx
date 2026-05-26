import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { computeBalances } from '../components/BalanceSummary.jsx'
import AddPerson from '../components/AddPerson.jsx'
import AddExpense from '../components/AddExpense.jsx'
import ExpenseList from '../components/ExpenseList.jsx'
import BalanceSummary from '../components/BalanceSummary.jsx'

const alice = { id: 0, name: 'Alice' }
const bob = { id: 1, name: 'Bob' }
const charlie = { id: 2, name: 'Charlie' }

const people = [alice, bob, charlie]

describe('computeBalances', () => {
  it('returns zero balances with no expenses', () => {
    const { balance, settlements } = computeBalances(people, [])
    expect(balance[0]).toBe(0)
    expect(balance[1]).toBe(0)
    expect(balance[2]).toBe(0)
    expect(settlements).toEqual([])
  })

  it('calculates a simple split evenly', () => {
    const expenses = [
      { id: 0, description: 'Dinner', amount: 30, paidBy: 0, splitAmong: [0, 1, 2] },
    ]
    const { balance, settlements } = computeBalances(people, expenses)
    // Alice paid 30, split 3 ways → each owes 10
    expect(balance[0]).toBeCloseTo(20) // paid 30, owes 10 → +20
    expect(balance[1]).toBeCloseTo(-10)
    expect(balance[2]).toBeCloseTo(-10)
    expect(settlements).toEqual([
      { from: 1, to: 0, amount: 10 },
      { from: 2, to: 0, amount: 10 },
    ])
  })

  it('handles multiple expenses', () => {
    const expenses = [
      { id: 0, description: 'Dinner', amount: 30, paidBy: 0, splitAmong: [0, 1] },
      { id: 1, description: 'Taxi', amount: 20, paidBy: 1, splitAmong: [0, 1] },
    ]
    const { balance, settlements } = computeBalances(people, expenses)
    // Alice paid 30 for [0,1] → each owes 15. Alice: +15
    // Bob paid 20 for [0,1] → each owes 10. Bob: +10
    // Alice total: +15 - 10 = +5
    // Bob total: -15 + 10 = -5
    expect(balance[0]).toBeCloseTo(5)
    expect(balance[1]).toBeCloseTo(-5)
    expect(settlements).toEqual([{ from: 1, to: 0, amount: 5 }])
  })

  it('handles expense where payer is not included in split', () => {
    const expenses = [
      { id: 0, description: 'Gift', amount: 30, paidBy: 0, splitAmong: [1, 2] },
    ]
    const { balance, settlements } = computeBalances(people, expenses)
    // Alice paid 30, split among Bob & Charlie → each owes 15
    expect(balance[0]).toBeCloseTo(30)
    expect(balance[1]).toBeCloseTo(-15)
    expect(balance[2]).toBeCloseTo(-15)
  })

  it('balances with zero settlement when everything is even', () => {
    const expenses = [
      { id: 0, description: 'Dinner', amount: 30, paidBy: 0, splitAmong: [0, 1, 2] },
      { id: 1, description: 'Lunch', amount: 30, paidBy: 1, splitAmong: [0, 1, 2] },
      { id: 2, description: 'Brunch', amount: 30, paidBy: 2, splitAmong: [0, 1, 2] },
    ]
    const { balance, settlements } = computeBalances(people, expenses)
    expect(balance[0]).toBeCloseTo(0)
    expect(balance[1]).toBeCloseTo(0)
    expect(balance[2]).toBeCloseTo(0)
    expect(settlements).toEqual([])
  })
})

describe('AddPerson', () => {
  it('calls onAdd with the trimmed name on submit', () => {
    const onAdd = vi.fn()
    render(<AddPerson onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('Nom du participant')
    fireEvent.change(input, { target: { value: '  David  ' } })
    fireEvent.click(screen.getByText('Ajouter'))

    expect(onAdd).toHaveBeenCalledWith('David')
  })

  it('does not call onAdd for empty input', () => {
    const onAdd = vi.fn()
    render(<AddPerson onAdd={onAdd} />)

    fireEvent.click(screen.getByText('Ajouter'))
    expect(onAdd).not.toHaveBeenCalled()
  })
})

describe('AddExpense', () => {
  it('renders with all people selected by default', () => {
    render(<AddExpense people={people} onAdd={() => {}} />)

    const buttons = screen.getAllByText('Alice')
    expect(buttons.length).toBeGreaterThan(0)
    expect(screen.getByText('Désélectionner tout')).toBeDefined()
  })

  it('calls onAdd with correct data on valid submit', () => {
    const onAdd = vi.fn()
    render(<AddExpense people={people} onAdd={onAdd} />)

    fireEvent.change(screen.getByPlaceholderText('Description (ex: Dîner)'), {
      target: { value: 'Dinner' },
    })
    fireEvent.change(screen.getByPlaceholderText('Montant'), {
      target: { value: '45' },
    })
    fireEvent.click(screen.getByText('Ajouter la dépense'))

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Dinner',
        amount: 45,
        paidBy: 0,
        splitAmong: [0, 1, 2],
      })
    )
  })

  it('toggles individual person selection', () => {
    render(<AddExpense people={people} onAdd={() => {}} />)

    const aliceBtn = screen.getByRole('button', { name: 'Alice' })
    fireEvent.click(aliceBtn)
    expect(aliceBtn.className).toContain('bg-white')

    fireEvent.click(aliceBtn)
    expect(aliceBtn.className).toContain('bg-indigo-100')
  })

  it('toggles all selection via button', () => {
    render(<AddExpense people={people} onAdd={() => {}} />)

    fireEvent.click(screen.getByText('Désélectionner tout'))
    expect(screen.getByText('Sélectionner tout')).toBeDefined()

    fireEvent.click(screen.getByText('Sélectionner tout'))
    expect(screen.getByText('Désélectionner tout')).toBeDefined()
  })

  it('changes the payer selection', () => {
    const onAdd = vi.fn()
    render(<AddExpense people={people} onAdd={onAdd} />)

    fireEvent.change(screen.getByDisplayValue('Alice'), { target: { value: '1' } })
    fireEvent.change(screen.getByPlaceholderText('Description (ex: Dîner)'), {
      target: { value: 'Drinks' },
    })
    fireEvent.change(screen.getByPlaceholderText('Montant'), {
      target: { value: '20' },
    })
    fireEvent.click(screen.getByText('Ajouter la dépense'))
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ paidBy: 1 })
    )
  })
})

describe('ExpenseList', () => {
  it('renders nothing when expenses is empty', () => {
    const { container } = render(
      <ExpenseList expenses={[]} people={people} onDelete={() => {}} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders expense details', () => {
    const expenses = [
      { id: 0, description: 'Dinner', amount: 45, paidBy: 0, splitAmong: [0, 1] },
    ]
    render(<ExpenseList expenses={expenses} people={people} onDelete={() => {}} />)

    expect(screen.getByText('Dinner')).toBeDefined()
    expect(screen.getByText(/45\.00/)).toBeDefined()
    const items = screen.getAllByText(/Alice/)
    expect(items.length).toBeGreaterThan(0)
    const bobItems = screen.getAllByText(/Bob/)
    expect(bobItems.length).toBeGreaterThan(0)
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    const expenses = [
      { id: 5, description: 'Dinner', amount: 45, paidBy: 0, splitAmong: [0, 1] },
    ]
    render(<ExpenseList expenses={expenses} people={people} onDelete={onDelete} />)

    fireEvent.click(screen.getByTitle('Supprimer'))
    expect(onDelete).toHaveBeenCalledWith(5)
  })
})

describe('BalanceSummary', () => {
  it('renders nothing when people is empty', () => {
    const { container } = render(
      <BalanceSummary people={[]} expenses={[]} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders balances and settlements', () => {
    const expenses = [
      { id: 0, description: 'Dinner', amount: 30, paidBy: 0, splitAmong: [0, 1, 2] },
    ]
    render(<BalanceSummary people={people} expenses={expenses} />)

    expect(screen.getByText('Balances')).toBeDefined()
    expect(screen.getByText('+20.00 €')).toBeDefined()
    expect(screen.getAllByText('-10.00 €').length).toBe(2)
  })

  it('shows balanced message when expenses are even', () => {
    const expenses = [
      { id: 0, description: 'Dinner', amount: 30, paidBy: 0, splitAmong: [0, 1, 2] },
      { id: 1, description: 'Lunch', amount: 30, paidBy: 1, splitAmong: [0, 1, 2] },
      { id: 2, description: 'Brunch', amount: 30, paidBy: 2, splitAmong: [0, 1, 2] },
    ]
    render(<BalanceSummary people={people} expenses={expenses} />)

    expect(screen.getByText('Tout est équilibré !')).toBeDefined()
  })

  it('handles fractional rounding in settlements', () => {
    const expenses = [
      { id: 0, description: 'Pizza', amount: 10, paidBy: 0, splitAmong: [0, 1, 2] },
    ]
    render(<BalanceSummary people={people} expenses={expenses} />)
    expect(screen.getByText('Balances')).toBeDefined()
    expect(screen.getByText('+6.67 €')).toBeDefined()
  })
})

describe('ExpenseList edge cases', () => {
  it('shows Inconnu for unknown payer', () => {
    const expenses = [
      { id: 0, description: 'Test', amount: 10, paidBy: 99, splitAmong: [0] },
    ]
    render(<ExpenseList expenses={expenses} people={people} onDelete={() => {}} />)
    expect(screen.getByText(/Inconnu/)).toBeDefined()
  })
})
