'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { Send, Loader2, AlertCircle, MessageSquare, ArrowLeft, Trash2 } from 'lucide-react';

export default function AdminChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState({
    conversations: true,
    messages: false,
    sending: false
  });
  const [error, setError] = useState({
    conversations: null,
    messages: null,
    sending: null
  });
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [messageStatus, setMessageStatus] = useState({});

  // Check if user is admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.role !== 'admin') {
        setError(prev => ({
          ...prev,
          conversations: 'Access denied. Admin only.'
        }));
        return;
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      newSocket.emit('join', user._id);
    });

    newSocket.on('connect_error', (err) => {
      setError(prev => ({
        ...prev,
        conversations: 'Failed to connect to chat server. Please refresh the page.'
      }));
    });

    newSocket.on('newMessage', (message) => {
      if (selectedConversation && 
          (message.senderId === selectedConversation.userId || message.receiverId === selectedConversation.userId)) {
        setMessages(prev => [...prev, message]);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, selectedConversation]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    // Fetch conversations
    const fetchConversations = async () => {
      try {
        setLoading(prev => ({ ...prev, conversations: true }));
        const response = await fetch('http://localhost:5000/api/admin-chat/conversations', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching conversations:', errorData);
          throw new Error(errorData.message || 'Failed to fetch conversations');
        }

        const data = await response.json();
        console.log('Fetched conversations:', data);
        
        // If no conversations exist, create a test conversation
        if (data.length === 0) {
          console.log('No conversations found, creating a test conversation...');
          try {
            // Get the first non-admin user
            const usersResponse = await fetch('http://localhost:5000/users', {
              credentials: 'include'
            });
            const users = await usersResponse.json();
            const regularUser = users.find(u => u.role === 'user');
            
            if (regularUser) {
              const sendResponse = await fetch('http://localhost:5000/api/admin-chat/send', {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  receiverId: regularUser._id,
                  message: `Hello ${regularUser.displayName}, this is a test message from the admin.`
                })
              });

              if (sendResponse.ok) {
                console.log('Test message sent successfully');
                // Fetch conversations again to get the new conversation
                const updatedResponse = await fetch('http://localhost:5000/api/admin-chat/conversations', {
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
                const updatedData = await updatedResponse.json();
                // Format the conversations data
                const formattedConversations = updatedData.map(conv => ({
                  _id: conv._id,
                  userId: conv.userId || conv.receiverId,
                  userName: conv.userName || 'Unknown User',
                  lastMessage: conv.lastMessage?.message || conv.message || 'No messages yet',
                  unreadCount: conv.unreadCount || 0
                }));
                setConversations(formattedConversations);
              }
            }
          } catch (error) {
            console.error('Error creating test conversation:', error);
          }
        } else {
          // Format the conversations data
          const formattedConversations = data.map(conv => ({
            _id: conv._id,
            userId: conv.userId || conv.receiverId,
            userName: conv.userName || 'Unknown User',
            lastMessage: conv.lastMessage?.message || conv.message || 'No messages yet',
            unreadCount: conv.unreadCount || 0
          }));
          setConversations(formattedConversations);
        }
        setError(prev => ({ ...prev, conversations: null }));
      } catch (error) {
        console.error('Error in fetchConversations:', error);
        setError(prev => ({ ...prev, conversations: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, conversations: false }));
      }
    };

    fetchConversations();
  }, [user, router]);

  useEffect(() => {
    // Fetch messages when a user is selected
    const fetchMessages = async () => {
      if (selectedConversation) {
        try {
          const response = await fetch(`http://localhost:5000/api/admin-chat/history/${selectedConversation.userId}`, {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!response.ok) {
            if (response.status === 401) {
              router.push('/login');
              return;
            }
            throw new Error('Failed to fetch messages');
          }
          
          const data = await response.json();
          setMessages(data);
          
          // Mark messages as read
          await fetch(`http://localhost:5000/api/admin-chat/read/${selectedConversation.userId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();
  }, [selectedConversation, router]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading.sending) return;

    const messageId = Date.now().toString();
    const tempMessage = {
      _id: messageId,
      sender: "admin",
      senderId: user._id,
      receiverId: selectedConversation.userId,
      message: newMessage,
      status: "sending",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMessage]);
    setMessageStatus(prev => ({ ...prev, [messageId]: "sending" }));
    setNewMessage("");
    setLoading(prev => ({ ...prev, sending: true }));

    try {
      const response = await fetch('http://localhost:5000/api/admin-chat/send', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          receiverId: selectedConversation.userId,
          message: newMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessageStatus(prev => ({ ...prev, [messageId]: "sent" }));
      setError(prev => ({ ...prev, sending: null }));
    } catch (error) {
      console.error('Error sending message:', error);
      setError(prev => ({ ...prev, sending: 'Failed to send message. Please try again.' }));
      setMessageStatus(prev => ({ ...prev, [messageId]: "error" }));
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sending":
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case "error":
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin-chat/conversation/${conversationId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }

      // Remove the conversation from the list
      setConversations(prev => prev.filter(conv => conv._id !== conversationId));
      
      // If the deleted conversation was selected, clear the selection
      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setError(prev => ({
        ...prev,
        conversations: 'Failed to delete conversation. Please try again.'
      }));
    }
  };

  if (error.conversations) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error.conversations}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading.conversations) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations Panel */}
        <div className="w-80 border-r border-gray-200 flex flex-col relative">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 group relative ${
                  selectedConversation?._id === conv._id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{conv.userName}</span>
                  <div className="flex items-center gap-2">
                    {conv.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv._id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {typeof conv.lastMessage === 'string' ? conv.lastMessage : conv.lastMessage?.message || 'No messages yet'}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.back()}
            className="absolute top-4 right-4 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">
                  Chat with {selectedConversation.userName}
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {loading.messages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : error.messages ? (
                  <div className="flex items-center justify-center h-full text-red-500">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    <p>{error.messages}</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-4 ${
                        msg.sender === "admin" ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          msg.sender === "admin"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {msg.message}
                          {msg.sender === "admin" && getMessageStatusIcon(messageStatus[msg._id])}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {loading.sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
                {error.sending && (
                  <p className="text-red-500 text-sm mt-2">{error.sending}</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 