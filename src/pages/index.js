import {useState, useEffect} from 'react';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import axios from 'axios';
const inter = Inter({ subsets: ['latin'] })
const modelURL= 'https://api.openai.com/v1/chat/completions'
export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = (message)=>{
    const headers= {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MODEL_API_KEY}`
    }
    const data = {
      model: 'gpt-3.5-turbo-0301',
      messages: [{"role": "user", "content": message}]
    }

    setIsLoading(true);

    axios.post(modelURL, data, {headers}).then((response)=> {
      console.log({response})
      setChatLog((prevChatLog)=>[...prevChatLog, {type: 'bot', message: response.data.choices[0].message.content}])
      setIsLoading(false)
    }).catch((error)=> {
      setIsLoading(false);
      console.error(error)
    })


  }
  const handleSubmit = (event)=> {
    event.preventDefault();
    setChatLog((prevChatLog) =>[...prevChatLog, {type: 'user', message: inputValue }]);
    sendMessage(inputValue);
    setInputValue('');
  }

  return (
      <>
    <h1>EarnestGPT</h1>
        {
          chatLog.map((message, index)=> (
              <div key={'index'}>{message.message}</div>
          ))
        }
      <form onSubmit={handleSubmit}>
        <input type='text'
               placeholder={'Add a message here'}
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}/>
        <button type={'submit'}>Send </button>
      </form>
      </>
  )
}
