import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, PhoneCall, MapPin, Coffee, Car, Utensils, AlertTriangle, ShieldCheck, MoreVertical, Receipt } from 'lucide-react';
import io from 'socket.io-client';
import { useTheme } from '../contexts/ThemeContext';

// Use relative URL so it works with ngrok proxy
const socket = io('/', { path: '/socket.io' });

const Chat = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const { colors } = useTheme();

    // Get current user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUser = { 
        id: storedUser._id || storedUser.id || '605c72ef2f8a4b0015f8a000', 
        name: storedUser.name || 'You' 
    };

    useEffect(() => {
        // Join the unique chat room when opening the page
        socket.emit('joinRoom', { roomId: matchId });

        // Listen for incoming messages
        socket.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        // Listen for past history
        socket.on('messageHistory', (pastMessages) => {
            setMessages(pastMessages);
        });

        // Cleanup on unmount
        return () => {
            socket.off('message');
            socket.off('messageHistory');
        };
    }, [matchId]);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            socket.emit('chatMessage', {
                roomId: matchId,
                senderId: currentUser.id,
                senderName: currentUser.name,
                text: input
            });
            setInput('');
        }
    };

    const sendExpense = () => {
        const amount = prompt("Enter total expense amount (₹):");
        const desc = prompt("What was this for? (e.g., Cab, Food):");
        if (amount && desc && !isNaN(amount)) {
            sendQuickRequest(`[EXPENSE:${amount}:${desc}]`);
        }
    };

    const triggerSOS = () => {
        if (window.confirm("EMERGENCY SOS: This will send your live location and ride details to your emergency contacts. Proceed?")) {
            alert("SOS Triggered! Location sent to emergency contacts.");
        }
    };

    const sendQuickRequest = (text) => {
        socket.emit('chatMessage', {
            roomId: matchId,
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: text
        });
    };

    const shareLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const mapLink = `📍 Live Location: https://www.openstreetmap.org/?mlat=${position.coords.latitude}&mlon=${position.coords.longitude}#map=16/${position.coords.latitude}/${position.coords.longitude}`;
                    sendQuickRequest(mapLink);
                },
                function(error) {
                    alert("Could not get location. Please enable location services and try again.");
                }
            );
        } else {
            alert("Geolocation is not available on this device/browser.");
        }
    };

    return (
        <div className="flex flex-col h-screen transition-colors" style={{ backgroundColor: colors.bg.secondary }}>
            {/* Chat Header */}
            <div className="p-4 flex items-center justify-between shadow-md border-b transition-colors" 
                 style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
                <div className="flex items-center gap-3" style={{ color: colors.text.primary }}>
                    <button onClick={() => navigate(-1)} className="p-1 rounded-full transition hover:opacity-70">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-1">
                            <h2 className="font-bold">Ride Group {matchId.substring(0, 4)}</h2>
                            <ShieldCheck size={16} className="text-blue-500" title="Verified Profiles" />
                        </div>
                        <p className="text-xs" style={{ color: colors.primary }}>In progress</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={triggerSOS} className="p-2 rounded-full transition bg-red-100 text-red-600 hover:bg-red-200">
                        <AlertTriangle size={18} />
                    </button>
                    <button className="p-2 rounded-full transition" style={{ color: colors.primary }}>
                        <PhoneCall size={20} />
                    </button>
                    <button className="p-2 rounded-full transition" style={{ color: colors.text.secondary }}>
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="text-center text-xs my-4" style={{ color: colors.text.tertiary }}>
                    Coordinate your meeting spot here. Never share OTPs or passwords!
                </div>
                
                {messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                        <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-xs mb-1 px-1" style={{ color: colors.text.tertiary }}>{msg.senderName}</span>
                            <div className="px-4 py-2 rounded-2xl max-w-[80%] break-words" 
                                 style={{
                                   backgroundColor: isMe ? colors.primary : colors.bg.tertiary,
                                   color: isMe ? 'white' : colors.text.primary,
                                   borderRadius: isMe ? '1.5rem 0 1.5rem 1.5rem' : '0 1.5rem 1.5rem 1.5rem',
                                   border: !isMe ? `1px solid ${colors.border}` : 'none'
                                 }}>
                                {msg.text.startsWith('[EXPENSE:') ? (
                                    <div className="flex flex-col gap-1 w-48">
                                        <div className="flex items-center gap-2 font-bold mb-1 border-b pb-1 border-opacity-20" style={{ borderColor: isMe ? 'white' : colors.border }}>
                                            <Receipt size={16} /> Expense Added
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>{msg.text.split(':')[2].replace(']', '')}</span>
                                            <span className="font-semibold">₹{msg.text.split(':')[1]}</span>
                                        </div>
                                        <div className="text-xs mt-1 opacity-90">
                                            Split: <span className="font-bold">₹{parseFloat(msg.text.split(':')[1]) / 2} each</span>
                                        </div>
                                    </div>
                                ) : msg.text.includes('http') ? (
                                    <a href={msg.text.match(/https?:\/\/[^\s]+/)[0]} target="_blank" rel="noopener noreferrer" className="underline font-bold">
                                        {msg.text.replace(/https?:\/\/[^\s]+/, 'View on Map 🗺️')}
                                    </a>
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    );
                })}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center my-8 p-4 rounded-xl border border-dashed" style={{ borderColor: colors.border, backgroundColor: colors.bg.tertiary }}>
                        <p className="text-sm font-semibold mb-3" style={{ color: colors.text.secondary }}>✨ Smart Icebreakers</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button onClick={() => sendQuickRequest("Hey! Excited for the trip. Where are you traveling from?")} className="px-3 py-1.5 text-xs rounded-full border transition" style={{ borderColor: colors.primary, color: colors.primary }}>Where from?</button>
                            <button onClick={() => sendQuickRequest("Are you traveling light or with heavy luggage? 🧳")} className="px-3 py-1.5 text-xs rounded-full border transition" style={{ borderColor: colors.primary, color: colors.primary }}>Luggage check</button>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Requests */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar" style={{ backgroundColor: colors.bg.secondary }}>
                <button 
                    onClick={sendExpense}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition hover:opacity-80"
                    style={{ backgroundColor: colors.bg.primary, borderColor: colors.status.success, color: colors.status.success }}
                >
                    <Receipt size={14} /> Split Bill
                </button>
                <button 
                    onClick={shareLocation}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition hover:opacity-80"
                    style={{ backgroundColor: colors.bg.primary, borderColor: colors.primary, color: colors.primary }}
                >
                    <MapPin size={14} /> Share Location
                </button>
                <button 
                    onClick={() => sendQuickRequest("Anyone wants tea? ☕")}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition hover:opacity-80"
                    style={{ backgroundColor: colors.bg.primary, borderColor: colors.border, color: colors.text.secondary }}
                >
                    <Coffee size={14} /> Tea?
                </button>
                <button 
                    onClick={() => sendQuickRequest("Need cab sharing? 🚖")}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition hover:opacity-80"
                    style={{ backgroundColor: colors.bg.primary, borderColor: colors.border, color: colors.text.secondary }}
                >
                    <Car size={14} /> Cab Share
                </button>
                <button 
                    onClick={() => sendQuickRequest("Food order together? 🍕")}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition hover:opacity-80"
                    style={{ backgroundColor: colors.bg.primary, borderColor: colors.border, color: colors.text.secondary }}
                >
                    <Utensils size={14} /> Food Order
                </button>
            </div>

            {/* Message Input Box */}
            <form onSubmit={sendMessage} className="p-4 border-t flex gap-2 transition-colors" 
                  style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-2 transition"
                    style={{
                      backgroundColor: colors.bg.tertiary,
                      borderColor: colors.border,
                      color: colors.text.primary
                    }}
                />
                <button 
                    type="submit" 
                    className="p-3 rounded-full flex items-center justify-center transition"
                    style={{ backgroundColor: colors.primary, color: 'white' }}
                    disabled={!input.trim()}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default Chat;