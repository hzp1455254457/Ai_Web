import { ref } from 'vue'

export function useError() {
  const error = ref<string | null>(null)

  const setError = (message: string) => {
    error.value = message
  }

  const clearError = () => {
    error.value = null
  }

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message)
    } else {
      setError('An unknown error occurred')
    }
  }

  return {
    error,
    setError,
    clearError,
    handleError,
  }
}
