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
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const systemPrompt = `You are ${business.bot_name}, the friendly AI receptionist for ${business.name}.

Today is ${today}.

Business hours: ${business.hours}
Services: ${business.services}
Pricing: ${business.pricing}
How to book: ${business.booking_info}
Location: ${business.location}

STRICT RULES:
1. Keep replies to 2-4 sentences max
2. Be warm and friendly
3. NEVER make up availability or book appointments yourself — always direct them to call or use the booking link
4. If someone asks about availability on a day outside business hours tell them you are closed that day and give the actual hours
5. NEVER confirm or check a schedule — you do not have access to any calendar
6. Never make up services prices or information not listed above
7. If you don't know something say the team will follow up and ask for their contact info
8. For emergencies give contact info immediately`

  const response = await fetch(
    'https://desklo-worker.connorcarson222.workers.dev',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          }))
        ]
      })
    }
  )

  const data = await response.json()

  if (data.error) {
    console.error('Groq error:', data.error)
    return "I'm having a quick issue — please try again!"
  }

  return data.choices?.[0]?.message?.content ?? "Please try again!"
}