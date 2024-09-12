import type { Todo } from './domain'
import { create } from 'zustand'

const defaultState = [
  {
    id: 1,
    text: 'Finish project proposal',
    completed: false,
    createdAt: '2023-06-01',
  },
  {
    id: 2,
    text: 'Schedule meeting with client',
    completed: false,
    createdAt: '2023-06-02',
  },
  { id: 3, text: 'Buy groceries', completed: false, createdAt: '2023-06-03' },
  {
    id: 4,
    text: 'Clean the house',
    completed: false,
    createdAt: '2023-06-04',
  },
  { id: 5, text: 'Call mom', completed: false, createdAt: '2023-06-05' },
]

interface TodoState {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (todoId: Todo['id']) => void
  deleteTodo: (todoId: Todo['id']) => void
}

export const useTodos = create<TodoState>()(set => ({
  todos: defaultState,
  addTodo: (text: string) => {
    set(prevState => ({
      todos: [
        ...prevState.todos,
        {
          id: prevState.todos.length + 1,
          text,
          completed: false,
          createdAt: new Date().toISOString().slice(0, 10),
        },
      ],
    }))
  },
  toggleTodo: (todoId: Todo['id']) => {
    set(prevState => ({
      todos: prevState.todos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, completed: !todo.completed }
        }
        return todo
      }),
    }))
  },
  deleteTodo: (todoId: Todo['id']) => {
    set(prevState => ({
      todos: prevState.todos.filter((todo) => {
        return todo.id !== todoId
      }),
    }))
  },
}))
