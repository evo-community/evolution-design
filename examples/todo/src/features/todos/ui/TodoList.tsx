import { useFilter } from '../model/useFilter.ts'
import { useSort } from '../model/useSort.ts'
import { useTodos } from '../model/useTodos.ts'
import { TodoItem } from '../ui/TodoItem.tsx'
import { AddTodoForm } from './AddTodoForm.tsx'
import { SearchTodos } from './SearchTodos.tsx'
import { SortTodos } from './SortTodos.tsx'
import { TodoListLayout } from './TodoListLayout.tsx'

export function TodoList() {
  const { todos } = useTodos()
  const { sortedTodos, sortBy, setSortBy } = useSort(todos)
  const { filteredTodos, searchText, setSearchText } = useFilter(
    sortedTodos,
    'text',
  )

  return (
    <TodoListLayout
      searchSlot={
        <SearchTodos searchText={searchText} setSearchText={setSearchText} />
      }
      sortSlot={<SortTodos setSortBy={setSortBy} sortBy={sortBy} />}
      addFormSlot={<AddTodoForm />}
      todoListSlot={filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    />
  )
}
