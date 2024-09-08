import { Input } from '@/shared/ui/shadcn/input'

export function SearchTodos({
  searchText,
  setSearchText,
}: {
  searchText: string
  setSearchText: (text: string) => void
}) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search todos..."
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}
