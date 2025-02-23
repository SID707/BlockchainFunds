import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';


const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatSession, setChatSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const initializeAI = async () => {
      try {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-pro",
        });

        const initialPrompt = {
          role: "user",
          parts: [{ text: `You are a helpful AI assistant.Strictly Do not answer anything other than the data provided in the prompt, if asked return Please ask a different question.Do not answer any generic questions. The data you should take as a reference is. Always answer big answers in markdown format` }]
        };

        const chat = model.startChat({
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
          },
          history: [initialPrompt],
        });

        setChatSession(chat);
      } catch (error) {
        console.error('Error initializing AI:', error);
      }
    };
    initializeAI();
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatSession) return;

    try {
        setIsLoading(true);
        setMessages(prev => [...prev, { text: newMessage, isBot: false }]);

        const result = await chatSession.sendMessage(newMessage);
        const response = await result.response;
        const botResponse = await response.text();

        setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    } catch (error) {
        console.error('Error getting AI response:', error);
        setMessages(prev => [...prev, {
            text: "Sorry, I'm having trouble responding right now.",
            isBot: true
        }]);
    } finally {
        setIsLoading(false);
        setNewMessage('');
    }
};


  return (
    <div className="chat-container">
      {/* Rest of the JSX remains the same */}
      {!isOpen && (
        <button className="chat-button" onClick={toggleChat}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 3c5.514 0 10 3.476 10 7.747 0 4.272-4.48 7.748-10 7.748-1.425 0-2.817-.2-4.126-.584l-3.872 3.874 1.134-2.694c-1.35-1.057-2.132-2.407-2.132-3.944 0-4.271 4.486-7.747 10-7.747zm0-2c-6.627 0-12 4.363-12 9.747 0 3.139 1.812 5.956 4.64 7.653l-2.833 6.747 7.415-4.619c1.156.387 2.375.585 3.642.585 6.627 0 12-4.363 12-9.747s-5.373-9.746-12-9.746z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className={`chat-window ${isOpen ? 'open' : ''}`}>
          <div className="chat-header">
            <h3>Chat Assistant</h3>
            <button className="close-btn" onClick={toggleChat}>×</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                {msg.isBot ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {isLoading && (
              <div className="loading-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#4A90E2">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .chat-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .chat-button {
          background: #6B46C1;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(107, 70, 193, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
              animation: bounceIn 0.5s ease-out;

        }

        .chat-button:hover {
          transform: scale(1.15);
          background: #553C9A;
        }

        @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 0.9;
      transform: scale(1.1);
    }
    80% {
      opacity: 1;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }


  .chat-window {
    width: 400px;
    height: 600px;
    background: #1A1A2E;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    display: flex;
    flex-direction: column;
    transform-origin: bottom right;
    animation: slideIn 0.3s ease-out forwards;
    opacity: 0;
  }
    @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.5) translateY(100px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.5) translateY(100px);
    }
  }

        .chat-header {
          padding: 16px;
          background: #6B46C1;
          color: white;
          border-radius: 16px 16px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0 8px;
        }

        .chat-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
              animation: messageAppear 0.3s ease-out forwards;

        }

         @keyframes messageAppear {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

        .message.user {
          background: #6B46C1;
          color: white;
          align-self: flex-end;
        }

        .message.bot {
          background: #2D3748;
          color: white;
          align-self: flex-start;
        }

        .chat-input {
          display: flex;
          padding: 16px;
          border-top: 1px solid #2D3748;
        }

        .chat-input input {
          flex: 1;
          border: 1px solid #553C9A;
          border-radius: 24px;
          padding: 12px 16px;
          margin-right: 8px;
          outline: none;
          background: #2D3748;
          color: white;
        }

        .chat-input input::placeholder {
          color: #A0AEC0;
        }

        .chat-input button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0 8px;
        }

        .chat-input button svg {
          fill: #6B46C1;
        }
          

        @media (max-width: 480px) {
          .chat-window {
            width: 90vw;
            height: 70vh;
            bottom: 20px;
            right: 20px;
          }
        },




           .loading-indicator {
            align-self: flex-start;
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            background: #2D3748;
            border-radius: 16px;
            animation: messageAppear 0.3s ease-out forwards;
        }

        .loading-indicator span {
            width: 8px;
            height: 8px;
            background: #6B46C1;
            border-radius: 50%;
            display: inline-block;
            animation: bounce 1.4s infinite ease-in-out both;
        }

        .loading-indicator span:nth-child(1) {
            animation-delay: -0.32s;
        }

        .loading-indicator span:nth-child(2) {
            animation-delay: -0.16s;
        }

        @keyframes bounce {
            0%, 80%, 100% {
                transform: scale(0);
                opacity: 0.3;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }

        .message.bot pre {
            background: rgba(0, 0, 0, 0.2);
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 8px 0;
        }

        .message.bot code {
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.9em;
        }

        .message.bot p {
            margin: 8px 0;
        }

        .message.bot ul, 
        .message.bot ol {
            margin-left: 20px;
        }

        .message.bot blockquote {
            border-left: 3px solid #6B46C1;
            margin: 8px 0;
            padding-left: 16px;
            color: #A0AEC0;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;