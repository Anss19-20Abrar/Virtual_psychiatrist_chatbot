import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from "firebase/auth";
import ContactUs from './ContactUs';
import axios from 'axios';
import { collection, doc, getDoc, getDocs, deleteDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Ensure proper import paths


const examples = [
  "How to manage stress and anxiety effectively?",
  "Tips for improving sleep quality and overcoming insomnia.",
  "Dealing with feelings of loneliness and isolation.",
  "Coping strategies for handling depression and low mood.",
  "Tips to manage anger and frustration in daily life.",
  "Plan for building self-confidence and overcoming self-doubt."
];

const Chat = ({ currentUserUID }) => {
  const [chat, setChat] = useState([]);
  const [messagess, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [title, setTitle] = useState('');
  const [input, setInput] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isContactUsVisible, setIsContactUsVisible] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const getChat = async () => {
    if (!currentUserUID) return;

    try {
      const userMessagesRef = collection(firestore, `chats/${currentUserUID}/messages`);

      // Get all documents in the 'messages' collection
      const querySnapshot = await getDocs(userMessagesRef);

      let allMessagesByDate = {};

      querySnapshot.forEach((doc) => {
        const conversationData = doc.data();
        if (conversationData && conversationData.messages) {
          conversationData.messages.forEach(message => {
            const dateKey = message.timestamp.split('T')[0]; // Extract the date in YYYY-MM-DD format
            if (!allMessagesByDate[dateKey]) {
              allMessagesByDate[dateKey] = [];
            }
            allMessagesByDate[dateKey].push(message);
          });
        }
      });

      // Sort messages within each date
      for (const date in allMessagesByDate) {
        allMessagesByDate[date].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      }

      const sortedDates = Object.keys(allMessagesByDate).sort((a, b) => new Date(b) - new Date(a));

      let sortedChatHistory = {};
      sortedDates.forEach(date => {
        sortedChatHistory[date] = allMessagesByDate[date];
      });

      setChatHistory(sortedChatHistory);
      return allMessagesByDate;
    } catch (error) {
      console.error('Error getting chat:', error);
      return {};
    }
  };

  // Load chat history on component mount or when currentUserUID changes
  useEffect(() => {
    

    // Select Chat From history so i can check our previous interaction with bot
    const fetchChatHistory = async () => {
      try {
        // console.log('Fetching chat history...');
        const userMessagesRef = collection(firestore, `chats/${currentUserUID}/messages`);
        const chatSnapshot = await getDocs(userMessagesRef);
        const chatData = chatSnapshot.docs.map(doc => ({
          date: doc.id,
          messages: doc.data().messages,
        }));
        // console.log('Fetched chat data:', chatData);
        setChatHistory(chatData);
      
      } catch (error) {
        // console.error('Error fetching chat history:', error);
        setChatHistory([]);
      }
    };

    getChat()
    fetchChatHistory();
    
  }, [currentUserUID]);


  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  // Delete Chat
  const handleDeleteChat = async (date) => {
    try {
      const userMessagesRef = collection(firestore, `chats/${currentUserUID}/messages`);
      const conversationDocRef = doc(userMessagesRef, date);

      // Remove the document from Firestore
      await deleteDoc(conversationDocRef);
    setConversationStarted(false);


      // Update the state to remove the messages for the specified date
      setChatHistory((prevChatHistory) => {
        if (!Array.isArray(prevChatHistory)) return [];
        return prevChatHistory.filter(chat => chat.date !== date);
      });

      console.log(`Deleted chat for date: ${date}`);
      setMessages([])
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };



  // Handle sending a new message
  const handleSend = async () => {
    if (input.trim() === '') return;
    setConversationStarted(true);

    const userMessage = { text: input, timestamp: new Date().toISOString(), sender: 'user' };
    setMessages((prevChat) => [...prevChat, userMessage]);
    setInput('');

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_LINK,
        {
          model: import.meta.env.VITE_MODEL_NAME,
          messages: [
            ...messagess.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text })),
            { role: 'user', content: "Hello" },
            { role: 'assistant', content: "Hi! How are you feeling today?" },
            { role: 'user', content: "If your question is not about mental health, please ask about mental health topics instead." },
            { role: 'assistant', content: "Please ask about mental health topics instead. Feel free to ask any questions related to mental health, and I'll do my best to assist you." },
            { role: 'user', content: "You are a Mental health Therapist you are going to provide therapy to the patients who are struglling with depression, anxiety, sucidial thoughts, PTSD, bullying" },
            { role: 'assistant', content: "Absolutely, I'm here to help." },
            { role: 'user', content: "You are a helpful, empathetic, and supportive assistant specializing in mental health support. You provide information, resources, and a listening ear to those seeking help. Your responses are compassionate, non-judgmental, and focused on promoting well-being. You understand the importance of confidentiality and safety, and you always encourage users to seek professional help when needed. If a user's question does not pertain to mental health, please generate a prompt indicating that the question is not about mental health and encourage the user to ask about mental health instead. When responding to mental health-related questions, you: 1. Listen actively and validate the person's feelings. 2. Provide evidence-based information and resources. 3. Encourage positive coping strategies and self-care. 4. Offer gentle reminders about the importance of professional help. 5. Avoid giving medical diagnoses or personal opinions. 6. Promote a safe and supportive environment. Example Responses: 1. I'm really sorry you're feeling this way. It sounds really tough. Talking to a mental health professional could be very helpful, and I'm here to listen and support you. 2. Taking care of yourself is very important. Have you tried activities that help you relax, like going for a walk, practicing mindfulness, or engaging in a hobby you enjoy? 3. It can be really hard to deal with anxiety. Deep breathing exercises, progressive muscle relaxation, and speaking with a therapist are some ways that might help manage these feelings. 4. Remember, it's okay to ask for help. Therapists, counselors, and support groups are there to provide you with the support you need." },
            { role: 'assistant', content: "Feel free to ask any questions you have, and I'll do my best to help you." },
            { role: 'user', content: input }
          ],
          max_tokens: 512,
          temperature: 0.2,
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_AWS_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botReply = response.data.choices[0].message.content.trim();
      const botMessage = { text: botReply, timestamp: new Date().toISOString(), sender: 'assistant' };
      const newMessages = [userMessage, botMessage];

      setMessages((prevChat) => [...prevChat, botMessage]);

      // Set up Firestore references
      const today = new Date();
      const dateKey = today.toISOString().split('T')[0]; // Get YYYY-MM-DD format
      const userMessagesRef = collection(firestore, `chats/${currentUserUID}/messages`);

      // Check if the conversation document already exists
      const conversationDocRef = doc(userMessagesRef, dateKey);
      const conversationDocSnapshot = await getDoc(conversationDocRef);

      if (conversationDocSnapshot.exists()) {
        // Conversation document exists, update it with new messages
        await updateDoc(conversationDocRef, {
          messages: arrayUnion(...newMessages)
        });
      } else {
        // Conversation document doesn't exist, create it with initial messages
        await setDoc(conversationDocRef, {
          messages: newMessages
        });
      }

      console.log('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };



  const handleNewChat = () => {
    setConversationStarted(false);
    setMessages([]);

  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const toggleContactUs = () => {
    setIsContactUsVisible(!isContactUsVisible);
  };
  // get date from specific click
  const handleDateClick = (date) => {
    setConversationStarted(true);
    setSelectedDate(date);
    
    // Find the object in chatHistory with the matching date
    const chatHistoryItem = chatHistory.find(item => item.date === date);
    const selectedMessages = chatHistoryItem ? chatHistoryItem.messages : [];
    setMessages(selectedMessages);
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log('Sign-out successful.');
    }).catch((error) => {
      console.error('An error happened during logout:', error);
    });
  };

  return (
    <div className='h-screen w-screen flex bg-[#050509]'>
      <div className='w-[20%] h-screen bg-[#0c0c15] text-white p-4 flex flex-col'>
        <div className='h-[5%]'>
          <button className='w-full h-[50px] border rounded hover:bg-slate-600' onClick={handleNewChat}>
            + New Chat
          </button>
        </div>
        <div className='p-4'>

        </div>
        <div className='h-[80%] overflow-y-auto shadow-lg hide-scroll-bar mb-4' >
          {Array.isArray(chatHistory) && chatHistory.length > 0 ? (
            chatHistory.map(({ date }, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className='py-3 text-center rounded mt-4 text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer'
              >
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
                <span className='text-left mr-0 text-m inline-block float-left truncate'>
                  {getDayOfWeek(date)}
                </span>
                <img
                  className='h-5 ml-9 inline-block float-right'
                  src="src/img/icons8-delete-48.png"
                  alt="deleteIcon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(date);
                  }}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-3">No chat history available</div>
          )}
        </div>


        <div className='h-[20%] border-t flex flex-col items-center justify-between '>
          <div className='py-3 text-center rounded text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer mt-2' onClick={handleLogout}>
            <span className='mr-4'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-logout"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" /></svg>
            </span>
            Logout
          </div>
          <div className='py-3 text-center rounded text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer' onClick={toggleContactUs}>
            <span className='mr-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='icon icon-tabler icon-tabler-mail'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path stroke='none' d='M0 0h24V0H0z' fill='none'></path>
                <path d='M3 8l9 6l9 -6'></path>
                <path d='M21 8v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-8'></path>
              </svg>
            </span>
            Contact us
          </div>
        </div>
      </div>



      {isContactUsVisible && <ContactUs toggleContactUs={toggleContactUs} />}

      <div className='w-[80%] h-screen flex flex-col justify-between'>
        <div className='flex-grow overflow-auto p-4'>
          {!conversationStarted ? (
            <div className='h-[80%] flex flex-col justify-center items-center text-white'>
              <div className='text-4xl font-bold mb-7'>Virtual Psychiatrist</div>
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
          ) : (
            messagess.map((message, index) => (
            <div
              key={index}
              className={`w-[60%] mx-auto mb-4 p-6 text-white flex items-start ${message.sender === 'bot' ? 'bg-slate-900 rounded' : 'bg-slate-800 rounded'}`}
            >
              <span className='mr-4 p-2 text-white rounded-full'>
                {message.sender === 'user' ? (
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
                {message.text}
              </div>
            </div>
          )))}
        </div>
        
        <div className='h-[20%] p-8 bg-[#050509]'>
          <div className='w-full flex justify-center relative'>
            <input
              type='text'
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className='w-[70%] rounded-lg p-4 pr-16 bg-slate-800 text-white'
              placeholder='Type your message here...'
            />
            <span className='absolute right-[16.5%] top-4 cursor-pointer flex' onClick={handleSend}>
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
          <small className='text-slate-500 mt-2 block text-center'>AI can generate incorrect information.</small>
        </div>
      </div>
    </div>
  );
};

export default Chat;
