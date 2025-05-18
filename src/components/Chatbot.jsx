import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getNeonColor } from "../utils/elementUtils";
import ReactMarkdown from "react-markdown";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const welcomeMessage =
    "👋 Hello! I'm your **Element Assistant**. I can help you with information about chemical elements, their properties, reactions, and more. What would you like to know about the periodic table?";

  const [messages, setMessages] = useState([
    { role: "model", content: welcomeMessage },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const filteredMessages = messages
        .filter((msg) => msg.content !== welcomeMessage)
        .map((msg) => ({
          role: msg.role === "assistant" ? "model" : msg.role,
          parts: [{ text: msg.content }],
        }));
      const chatOptions = {
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      };

      let systemMessage = {
        role: "user",
        parts: [
          {
            text: "You are a chemistry assistant for my element information website. Please follow these guidelines in all your responses: Focus exclusively on chemistry topics, especially the periodic table. Provide detailed element information including atomic number, symbol, weight, and key properties. Use proper notation for chemical formulas. Format responses clearly with markdown.",
          },
        ],
      };

      let modelResponse = {
        role: "model",
        parts: [
          {
            text: "I'll be your chemistry assistant focused on the periodic table and elements! I'll provide accurate information about element properties, chemical reactions, and related concepts using proper scientific notation. I'll include details like atomic numbers, symbols, weights, and key characteristics in my responses. I'll use markdown formatting to make information clear and readable. How can I help you with chemistry today?",
          },
        ],
      };

      if (filteredMessages.length > 0) {
        chatOptions.history = [
          systemMessage,
          modelResponse,
          ...filteredMessages,
        ];
      } else {
        chatOptions.history = [systemMessage, modelResponse];
      }

      const chat = model.startChat(chatOptions);
      const result = await chat.sendMessage(inputMessage);
      const response = await result.response;
      const text = response.text();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", content: text },
      ]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "model",
          content:
            "I'm sorry, there was an error processing your request. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content) => {
    return (
      <div className="prose prose-invert max-w-none text-sm">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              return inline ? (
                <code
                  className="bg-slate-600/50 rounded px-1 py-0.5 text-xs font-mono"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <pre
                  className="bg-slate-700/50 rounded-xl p-3 overflow-x-auto text-xs font-mono mt-2"
                  {...props}
                >
                  <code>{children}</code>
                </pre>
              );
            },
            p: ({ children }) => <p className="mb-2">{children}</p>,
            h1: ({ children }) => (
              <h1 className="text-lg font-bold mb-2">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-bold mb-2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-bold mb-1">{children}</h3>
            ),
            ul: ({ children }) => (
              <ul className="list-disc ml-4 mb-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal ml-4 mb-2">{children}</ol>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {" "}
      <button
        onClick={toggleChat}
        className="w-14 h-14 mb-4 rounded-full bg-slate-800/80 backdrop-blur-md text-white flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden border border-slate-700/50 noise-bg"
      >
        <span
          className="absolute inset-0 bg-purple-500/10 animate-pulse rounded-full scale-0 transition-all duration-700"
          style={{
            transform: isOpen ? "scale(0)" : "scale(1.5)",
            opacity: isOpen ? 0 : 0.2,
          }}
        ></span>
        <div className="glass-reflection rounded-full"></div>

        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>{" "}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden flex flex-col animate-fadeIn border border-slate-700/50 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/5 before:to-slate-800/5 before:pointer-events-none">
          <div className="glass-reflection"></div>
          <div className="noise-bg p-4 bg-slate-800/90 backdrop-blur-md text-white flex items-center justify-between relative border-b border-slate-700/50">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-9 h-9 rounded-full bg-slate-700/80 backdrop-blur-md flex items-center justify-center border border-slate-600/50 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg">Element Assistant</h3>
                <p className="text-xs text-slate-400">Powered by Gemini AI</p>
              </div>
            </div>
          </div>
          <div
            ref={chatContainerRef}
            className="flex-grow h-96 overflow-y-auto p-5 bg-slate-900/70 backdrop-blur-md flex flex-col gap-5 relative noise-bg"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#4B5563 #1F2937",
              backgroundImage:
                "radial-gradient(circle at 0% 100%, rgba(124, 58, 237, 0.08) 0%, rgba(0,0,0,0) 70%), radial-gradient(circle at 100% 0%, rgba(124, 58, 237, 0.05) 0%, rgba(0,0,0,0) 60%)",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } w-full`}
              >
                <div
                  className={`flex ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  } gap-3 max-w-[85%]`}
                >
                  {" "}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center noise-bg backdrop-blur-sm shadow-inner relative
                    ${
                      message.role === "user"
                        ? "bg-slate-700/80 border border-purple-500/30"
                        : "bg-slate-700/80 border border-slate-600/50"
                    }`}
                  >
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          message.role === "user"
                            ? "radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.12), transparent 70%)"
                            : "radial-gradient(circle at 30% 30%, rgba(203, 213, 225, 0.08), transparent 70%)",
                      }}
                    ></span>
                    {message.role === "user" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-purple-400 relative z-10"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-slate-400 relative z-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 backdrop-blur-md ${
                      message.role === "user"
                        ? "bg-slate-700/80 text-white border border-purple-500/30 shadow-lg"
                        : "bg-slate-800/80 text-white border border-slate-700/50 shadow-md"
                    }`}
                  >
                    {renderMessageContent(message.content)}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start w-full">
                <div className="flex flex-row gap-3 items-end max-w-[85%]">
                  {" "}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 flex items-center justify-center noise-bg shadow-inner relative">
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 30%, rgba(203, 213, 225, 0.08), transparent 70%)",
                      }}
                    ></span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-slate-400 relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-md">
                    <div className="flex space-x-2 items-center h-6">
                      <div className="w-2 h-2 bg-purple-400/80 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-purple-400/80 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400/80 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <form
            onSubmit={sendMessage}
            className="p-4 border-t border-slate-700/50 bg-slate-800/80 backdrop-blur-md flex relative noise-bg"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your question..."
              className="flex-grow p-3 rounded-l-xl bg-slate-700/60 backdrop-blur-sm text-white border-r-0 border border-slate-600/50 focus:outline-none focus:ring-1 focus:ring-purple-400/30 focus:border-purple-400/30 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-slate-700/80 hover:bg-slate-600/90 disabled:bg-slate-800/80 text-white p-3 rounded-r-xl border border-slate-600/50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm shadow-md"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ transform: "rotate(90deg)" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
