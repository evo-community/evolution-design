import { useState } from 'react'

type FilterStrings<T extends Record<string, unknown>> = {
  [KK in keyof T]: T[KK] extends string ? T[KK] : never;
}

export function useFilter<
  T extends Record<string, any>,
  K extends keyof FilterStrings<T>,
>(items: T[], key: NoInfer<K>) {
  const [searchText, setSearchText] = useState('')

  const filteredTodos = items.filter(item =>
    (item[key] as string).toLowerCase().includes(searchText.toLowerCase()),
  )

  return {
    searchText,
    setSearchText,
    filteredTodos,
  }
}
