import { useEffect, useState } from 'react'

type LocalStorageValues = Record<string, string | null>

export const useLocalStorage = (keys: string[]) => {
  const [values, setValues] = useState<LocalStorageValues>(() =>
    keys.reduce((acc, key) => {
      acc[key] = localStorage.getItem(key)
      return acc
    }, {} as LocalStorageValues)
  )

  const setValue = (key: string, value: string | null) => {
    if (!keys.includes(key)) {
      console.warn(`Key "${key}" is not tracked by useLocalStorage.`)
      return
    }

    if (value === null) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, value)
    }

    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const removeValues = (keysToRemove: string | string[]) => {
    const keysArray = Array.isArray(keysToRemove) ? keysToRemove : [keysToRemove]

    setValues((prev) => {
      const updatedValues = { ...prev }
      keysArray.forEach((key) => {
        if (keys.includes(key)) {
          localStorage.removeItem(key)
          delete updatedValues[key]
        } else {
          console.warn(`Key "${key}" is not tracked by useLocalStorage.`)
        }
      })
      return updatedValues
    })
  }

  useEffect(() => {
    const handleStorageChange = () => {
      setValues(() =>
        keys.reduce((acc, key) => {
          acc[key] = localStorage.getItem(key)
          return acc
        }, {} as LocalStorageValues)
      )
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [keys])

  return [values, setValue, removeValues] as const
}
