import { Input } from '@/shared/ui/shadcn/input'
import { useAddTodoForm } from '../vm/useAddTodoForm'

export function AddTodoForm() {
  const { handleAddTodo } = useAddTodoForm()
  return (
    <div className="mb-6">
      <Input
        type="text"
        placeholder="Add a new todo..."
        onKeyDown={handleAddTodo}
        className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}
