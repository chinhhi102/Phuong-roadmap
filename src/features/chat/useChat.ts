import { useEffect, useState } from 'react'
import { chatEngine, type ChatData } from './chatSync'

/** Live chat data (messages + buzzes), kept in sync across tabs/devices. */
export function useChat(): ChatData {
  const [data, setData] = useState<ChatData>(() => chatEngine.get())
  useEffect(() => chatEngine.subscribe(setData), [])
  return data
}
