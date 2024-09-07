'use client'

import { TodoList } from '@/features/todos'

export default function Component() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <h1 className="text-2xl font-bold">Todo List</h1>
      </header>
      <TodoList />
    </div>
  )
}
