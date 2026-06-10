const GROQ_API_KEY = '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'

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

export type Business = {
  name: string
  services: string
  hours: string
  pricing: string
  booking_info: string
  location: string
  bot_name: string
}

export async function sendMessage(
  messages: Message[],
  business: Business
): Promise<string> {
  const systemPrompt = `You are ${business.bot_name}, the friendly AI receptionist for ${business.name}. Services: ${business.services}. Hours: ${business.hours}. Pricing: ${business.pricing}. How to book: ${business.booking_info}. Keep replies short, 2-4 sentences. Be warm and friendly.`

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          }))
        ],
        max_tokens: 300
      })
    }
  )

  const data = await response.json()
  console.log('Groq response:', data)
  
  if (data.error) {
    console.error('Groq error:', data.error)
    return "I'm having a quick issue — please try again!"
  }
  
  return data.choices?.[0]?.message?.content ?? "Please try again!"
}