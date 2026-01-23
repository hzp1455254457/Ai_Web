import { ref } from 'vue'

export function useStream() {
  const streamContent = ref('')
  const isStreaming = ref(false)

  const startStream = () => {
    streamContent.value = ''
    isStreaming.value = true
  }

  const appendChunk = (chunk: string) => {
    streamContent.value += chunk
  }

  const endStream = () => {
    isStreaming.value = false
  }

  const reset = () => {
    streamContent.value = ''
    isStreaming.value = false
  }

  return {
    streamContent,
    isStreaming,
    startStream,
    appendChunk,
    endStream,
    reset,
  }
}
