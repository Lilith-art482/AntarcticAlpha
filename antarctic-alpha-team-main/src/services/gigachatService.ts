/**
 * Сервис для работы с GigaChat API
 * Использует серверные API endpoints для обхода CORS
 */

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatCompletionResponse {
  choices: Array<{
    message: Message
    finish_reason: string
  }>
  created: number
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * Отправка сообщения в чат через серверный API
 */
export const sendMessage = async (
  messages: Message[],
  model: string = 'GigaChat:latest'
): Promise<string> => {
  try {
    const response = await fetch('/api/gigachat-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Chat request failed:', errorData)
      throw new Error(`Failed to send message: ${response.status}`)
    }

    const data: ChatCompletionResponse = await response.json()
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content
    }

    throw new Error('No response from GigaChat')
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}
