/* eslint-disable */
"use client";
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

export default function WebRTC() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState(''); // for user's username
    const [connected, setConnected] = useState(false); // connection status
    const [videoStarted, setVideoStarted] = useState(false); // video call status
    const [hostClicked, setHostClicked] = useState(false); // to get username and avatar fields
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [isHost, setIsHost] = useState(false); // To identify if the client is a host

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io.connect('http://192.168.5.183:4000');

        // Set up event listeners for WebRTC signaling
        socketRef.current.on('offer', handleReceiveOffer);
        socketRef.current.on('answer', handleReceiveAnswer);
        socketRef.current.on('candidate', handleNewICECandidateMsg);

        socketRef.current.on('message', (message: any) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startMedia = async () => {
        try {
            localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideoRef.current.srcObject = localStreamRef.current;
            createPeerConnection(); // Setup peer connection when media is obtained
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    };

    const createPeerConnection = () => {
        peerRef.current = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        peerRef.current.onicecandidate = (event: { candidate: any; }) => {
            if (event.candidate) {
                socketRef.current.emit('candidate', event.candidate);
            }
        };

        peerRef.current.ontrack = (event: { streams: any[]; }) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        localStreamRef.current.getTracks().forEach((track: any) => {
            peerRef.current.addTrack(track, localStreamRef.current);
        });
    };

    const initiateCall = async () => {
        try {
            if (!peerRef.current) createPeerConnection();
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            socketRef.current.emit('offer', offer);
        } catch (error) {
            console.error('Error creating offer.', error);
        }
    };

    const handleReceiveOffer = async (offer: any) => {
        if (!peerRef.current) createPeerConnection();

        try {
            await peerRef.current.setRemoteDescription(offer);
            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);
            socketRef.current.emit('answer', answer);
        } catch (error) {
            console.error('Error handling offer.', error);
        }
    };

    const handleReceiveAnswer = async (answer: any) => {
        try {
            await peerRef.current.setRemoteDescription(answer);
        } catch (error) {
            console.error('Error handling answer.', error);
        }
    };

    const handleNewICECandidateMsg = async (candidate: any) => {
        try {
            await peerRef.current.addIceCandidate(candidate);
        } catch (error) {
            console.error('Error adding received ICE candidate.', error);
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                text: newMessage,
                sender: socketRef.current.id,
                username: username,
                avatar: 'https://github.com/shadcn.png'
            };
            socketRef.current.emit('message', message);
            setMessages(prevMessages => [...prevMessages, message]);
            setNewMessage('');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <header className="bg-black text-white w-full py-4 flex justify-center">
                <h1 className="text-lg">Meet</h1>
            </header>
            <main className="flex-grow flex flex-col items-center py-6 px-4">
                <p className="text-center mb-8">Connect with your friends through chat or video call.</p>

                {!connected && (
                    <div className="flex flex-col space-y-4 w-full max-w-xs items-center">
                        <Button className="w-full bg-black text-white py-2" onClick={() => setConnected(true)}>
                            Connect
                        </Button>
                        <Button className="w-full bg-black text-white py-2" onClick={() => {
                            setHostClicked(true);
                        }}>
                            Host
                        </Button>
                        {hostClicked && (
                            <div className="flex flex-row py-10 justify-center items-center">
                                <Avatar>
                                    <AvatarImage src={"https://github.com/shadcn.png"} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <Input
                                    className="mx-4 my-1.5"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Your name please..." />
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setConnected(true);
                                        setIsHost(true);
                                    }}>Enter</Button>
                            </div>
                        )}
                    </div>
                )}

                {connected && (
                    <div className="w-full mt-4 relative">
                        <div className="absolute inset-0 bg-cover bg-center rounded-md" style={{ backgroundImage: `url('/images/image.jpg')`, height: '70vh' }}>
                            <div className="relative z-10 w-full h-full flex flex-col">
                                <div className="flex-grow overflow-y-auto p-4 bg-white bg-opacity-10 rounded-t-lg scrollbar scrollbar-thin scrollbar-slate-800 scrollbar-track-gray-100">
                                    <div className="px-2.5 py-2 flex items-center justify-between bg-black bg-opacity-10 rounded-lg sticky top-0">
                                        {/* <h2 className="text-black">Chat</h2> */}
                                        <Avatar className="mr-2">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <h2 className="text-black">{username}</h2>
                                        <Button
                                            className={`bg-white text-white px-4 py-2 rounded ${videoStarted ? 'bg-red-500' : ''}`}
                                            onClick={() => {
                                                if (videoStarted) {
                                                    setVideoStarted(false);
                                                    localStreamRef.current.getTracks().forEach((track: { stop: () => any; }) => track.stop());
                                                } else {
                                                    setVideoStarted(true);
                                                    startMedia();
                                                    if (isHost) {
                                                        initiateCall();
                                                    }
                                                }
                                            }}
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <Image src="/images/video-camera.png" alt="video camera" height="20" width="20" />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`flex ${msg.sender === socketRef.current.id ? 'justify-end' : 'justify-start'} mb-2`}
                                            >
                                                <p className={`px-3 py-1.5 rounded-lg shadow-sm max-w-xs mt-1 ${msg.sender === socketRef.current.id ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                                    {msg.text}
                                                </p>
                                                <div ref={messagesEndRef} />
                                            </div>
                                        ))}
                                        <video ref={localVideoRef} autoPlay muted className={`w-full ${videoStarted ? 'block' : 'hidden'}`} />
                                        <video ref={remoteVideoRef} autoPlay className={`w-full ${videoStarted ? 'block' : 'hidden'}`} />
                                    </div>
                                </div>
                                <div className="flex items-center p-2 bg-white bg-opacity-20 border-t border-gray-300">
                                    <Input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-grow bg-opacity-30 text-black px-1 py-1 rounded backdrop-blur-lg border border-gray-300"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSendMessage();
                                        }}
                                    />
                                    <Button className="bg-white text-white px-2 ml-2 rounded" variant="ghost" size="sm" onClick={handleSendMessage}>
                                        <Image src="/images/message.png" alt="video camera" height="20" width="20" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main >
        </div >
    );

}
