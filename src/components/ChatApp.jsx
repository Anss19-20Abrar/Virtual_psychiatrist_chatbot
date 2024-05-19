import  { useState, useEffect } from 'react';
import { app } from '../firebase';
import { getDatabase, } from "firebase/database";
const db = getDatabase(app)

const examples = [
"How to manage stress and anxiety effectively?",
"Tips for improving sleep quality and overcoming insomnia.",
"Dealing with feelings of loneliness and isolation.",
"Coping strategies for handling depression and low mood.",
"Techniques for managing anger and frustration in daily life.",
"Strategies for building self-confidence and overcoming self-doubt."
];

const Chat = () => {
  const [chat, setChat] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [title, setTitle] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    const chatRef = db.ref('chats');
    chatRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setChat(Object.values(data));
      }
    });

    const historyRef = db.ref('chatHistory');
    historyRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setChatHistory(Object.values(data));
      }
    });

    return () => {
      chatRef.off('value');
      historyRef.off('value');
    };
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const newChatRef = db.ref('chats').push();
      newChatRef.set({ role: 'user', content: input });

      setInput('');

      try {
        const response = await fetch('YOUR_CHATGPT_API_ENDPOINT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any other headers if required
          },
          body: JSON.stringify({ message: input }),
        });

        if (response.ok) {
          const data = await response.json();
          const { reply } = data; // Assuming your API returns a 'reply' field
          const newResponseRef = db.ref('chats').push();
          newResponseRef.set({ role: 'assistant', content: reply });
        } else {
          console.error('Failed to fetch response from ChatGPT API');
        }
      } catch (error) {
        console.error('Error fetching response from ChatGPT API:', error);
      }
    }
  };

  const handleNewChat = () => {
    setChat([]);
    setTitle('');
  };

  return (
    <div className='h-screen w-screen flex bg-[#050509]'>
      <div className='w-[20%] h-screen bg-[#0c0c15] text-white p-4'>
        <div className='h-[5%]'>
          <button className='w-full h-[50px] border rounded hover:bg-slate-600' onClick={handleNewChat}>
            + New Chat
          </button>
        </div>
        <div className='h-[70%] overflow-scroll shadow-lg hide-scroll-bar mb-4'>
          {chatHistory.map((item, index) => (
            <div key={index} className='py-3 text-center rounded mt-4 text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer'>
              <span className='mr-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='icon icon-tabler icon-tabler-message'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                  <path d='M8 9h8'></path>
                  <path d='M8 13h6'></path>
                  <path d='M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z'></path>
                </svg>
              </span>
              <span className='text-left'>{item.title}</span>
            </div>
          ))}
        </div>
        <div className='overflow-scroll shadow-lg hide-scroll-bar h-[20%] border-t'>
          {[1, 2].map((item, index) => (
            <div key={index} className='py-3 text-center rounded mt-4 text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer'>
              <span className='mr-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='icon icon-tabler icon-tabler-settings-code'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                  <path d='M11.482 20.924a1.666 1.666 0 0 1 -1.157 -1.241a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.312 .318 1.644 1.794 .995 2.697'></path>
                  <path d='M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0'></path>
                  <path d='M20 21l2 -2l-2 -2'></path>
                  <path d='M17 17l-2 2l2 2'></path>
                </svg>
              </span>
              Code Settings
            </div>
          ))}
        </div>
      </div>
      <div className='w-[80%]'>
        {chat.length > 0 ? (
          <div className='h-[80%] overflow-scroll hide-scroll-bar pt-8'>
            {chat.map((item, index) => (
              <div
                key={index}
                className={`w-[60%] mx-auto p-6 text-white flex ${
                  item.role === 'assistant' && 'bg-slate-900 rounded'
                }`}
              >
                <span className='mr-8 p-2 bg-slate-500 text-white rounded-full h-full'>
                  {item.role === 'user' ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='icon icon-tabler icon-tabler-user-bolt'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      strokeWidth='2'
                      stroke='currentColor'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                      <path d='M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0'></path>
                      <path d='M6 21v-2a4 4 0 0 1 4 -4h4c.267 0 .529 .026 .781 .076'></path>
                      <path d='M19 16l-2 3h4l-2 3'></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='icon icon-tabler icon-tabler-robot'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      strokeWidth='2'
                      stroke='currentColor'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                      <path d='M7 7h10a2 2 0 0 1 2 2v1l1 1v3l-1 1v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-3l-1 -1v-3l1 -1v-1a2 2 0 0 1 2 -2z'></path>
                      <path d='M10 16h4'></path>
                      <circle cx='8.5' cy='11.5' r='.5' fill='currentColor'></circle>
                      <circle cx='15.5' cy='11.5' r='.5' fill='currentColor'></circle>
                      <path d='M9 7l-1 -4'></path>
                      <path d='M15 7l1 -4'></path>
                    </svg>
                  )}
                </span>
                <div className='leading-loose' style={{ whiteSpace: 'break-spaces' }}>
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='h-[80%] flex flex-col justify-center items-center text-white'>
            <div className='text-4xl font-bold mb-8'>Virtual psychiatrist</div>
            <div className='flex flex-wrap justify-around max-w-[900px]'>
              {examples.map((item, index) => (
                <div
                  key={index}
                  className='text-lg font-light mt-4 p-4 border rounded cursor-pointer min-w-[400px] hover:bg-slate-800'
                  onClick={() => setInput(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className='h-[20%]'>
          <div className='flex flex-col items-center justify-center w-full h-full text-white'>
            <div className='w-[60%] flex justify-center relative'>
              <input
                type='text'
                onChange={(e) => setInput(e.target.value)}
                value={input}
                className='w-full rounded-lg p-4 pr-16 bg-slate-800 text-white'
                placeholder='Type your message here...'
              />
              <span className='absolute right-4 top-4 cursor-pointer' onClick={handleSend}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='icon icon-tabler icon-tabler-send'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                  <path d='M10 14l11 -11'></path>
                  <path d='M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5'></path>
                </svg>
              </span>
            </div>
            <small className='text-slate-500 mt-2'>AI can generate incorrect information.</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;







// const ChatApp = () => {
//   const [messages, setMessages] = useState([
//     { text: 'Hello! How can I assist you?', type: 'bot' },
//   ]);

//   const handleUserInput = (text) => {
//     setMessages([...messages, { text, type: 'user' }]);

//     setTimeout(() => {
//       setMessages([...messages, { text: 'Sorry, I am a mock bot. I cannot assist you.', type: 'bot' }]);
//     }, 1000);
//   };

//   return (
//     <div className="chat-app">
//       <header className="header">
//         <h1>Chat with Me!</h1>
//       </header>
//       <div className="chat-container">
//         <div className="chat-history-container">
//           <ChatHistory messages={messages} />
//         </div>
//         <div className="new-chat-container">
//           <UserInput onSubmit={handleUserInput} />
//         </div>
//       </div>
//       <footer className="footer">
//         <p>© 2024 Virtual Psychiatrist Inc. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default ChatApp;
