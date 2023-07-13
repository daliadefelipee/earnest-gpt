import {useState, useEffect} from 'react';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import axios from 'axios';
import TypingAnimation from '@/components/TypingAnimation';
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
      <div className={"container mx-auto max-w-auto"}>
        <div className={"flex flex-col h-screen bg-white"}>
    <h1 className={"bg-gradient-to-r from-green-500 to-purple-800 text-transparent bg-clip-text py-3 font-bold text-3xl justify-start"}>earnestGPT</h1>
          <div className={"flex-grow p-6"}>
            <div className={"flex flex-col space-y-4"}>
              {
                chatLog.map((message, index)=> (
                    <div key={index} className={`flex ${message.type === 'user'? 'justify-end' : 'justify-start'}`}>
                      <div className={`${message.type === 'user' ? 'bg-purple-500' : 'bg-gray-800'} rounded-lg p-4 text-white max-w-sm `}>
                      {message.message}
                      </div>
                    </div>
                ))
              }
              {
                isLoading &&
                  <div key={chatLog.length} className={"flex justify-start"}>
                  <div className={"bg-gray-800 rounded-lg p-4 text-white max-w-sm"}>
                    <TypingAnimation/>
                  </div>
                  </div>
              }
            </div>
          </div>

      <form onSubmit={handleSubmit} className={"flex-none p-6"}>
        <div className={"flex rounded-lg border border-gray-700 bg-gray-800"}>
        <input className={"flex-grow px-4 py-2 bg-transparent text-white focus:outline:none"}
            type='text'
               placeholder={'Add a message here'}
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}/>
        <button className={"bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"} type={'submit'}>Send </button>
        </div>
        </form>
        </div>
      </div>
  )
}
