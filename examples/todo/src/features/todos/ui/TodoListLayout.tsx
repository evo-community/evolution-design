import type { ReactNode } from 'react'

export function TodoListLayout({
  searchSlot,
  todoListSlot,
  sortSlot,
  addFormSlot,
}: {
  searchSlot: ReactNode
  sortSlot: ReactNode
  todoListSlot: ReactNode
  addFormSlot: ReactNode
}) {
  return (
    <div className="flex-1 p-6">
      {addFormSlot}
      <div className="mb-6 flex items-center justify-between">
        {searchSlot}
        {sortSlot}
      </div>
      <div className="space-y-2">{todoListSlot}</div>
    </div>
  )
}
