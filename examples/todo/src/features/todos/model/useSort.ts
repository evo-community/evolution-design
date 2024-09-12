import type { Todo } from './domain'
import { useState } from 'react'

export function useSort(todos: Todo[]) {
  const [sortBy, setSortBy] = useState('date')

  const sortedTodos = todos.sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    else {
      return a.text.localeCompare(b.text)
    }
  })

  return {
    sortBy,
    setSortBy,
    sortedTodos,
  }
}
