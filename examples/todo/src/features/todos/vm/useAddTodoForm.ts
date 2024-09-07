import { useTodos } from '../model/useTodos'

export function useAddTodoForm() {
  const addTodo = useTodos(state => state.addTodo)
  const handleAddTodo: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.target instanceof HTMLInputElement) {
      const trimmed = e.target.value.trim()
      if (e.key === 'Enter' && trimmed !== '') {
        addTodo(trimmed)
        e.target.value = ''
      }
    }
  }
  return { handleAddTodo }
}
