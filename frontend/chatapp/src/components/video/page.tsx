"use client"
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Button } from '../ui/button';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';

export default function WebRTC() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [connected, setConnected] = useState(false);
    const [videoStarted, setVideoStarted] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const socketRef = useRef(null);
    const pcRef = useRef(null);
    const localStreamRef = useRef(null);

    useEffect(() => {
        socketRef.current = io.connect('http://localhost:4000');

        socketRef.current.on('offer', handleReceiveOffer);
        socketRef.current.on('answer', handleReceiveAnswer);
        socketRef.current.on('candidate', handleNewICECandidateMsg);

        socketRef.current.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const startMedia = async () => {
        try {
            localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideoRef.current.srcObject = localStreamRef.current;
            createPeerConnection();
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    };

    const createPeerConnection = () => {
        pcRef.current = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        pcRef.current.onicecandidate = event => {
            if (event.candidate) {
                socketRef.current.emit('candidate', event.candidate);
            }
        };

        pcRef.current.ontrack = event => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        localStreamRef.current.getTracks().forEach(track => {
            pcRef.current.addTrack(track, localStreamRef.current);
        });
    };

    const initiateCall = async () => {
        try {
            if (!pcRef.current) createPeerConnection();
            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            socketRef.current.emit('offer', offer);
        } catch (error) {
            console.error('Error creating offer.', error);
        }
    };

    const handleReceiveOffer = async (offer) => {
        if (!pcRef.current) createPeerConnection();

        try {
            await pcRef.current.setRemoteDescription(offer);
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            socketRef.current.emit('answer', answer);
        } catch (error) {
            console.error('Error handling offer.', error);
        }
    };

    const handleReceiveAnswer = async (answer) => {
        try {
            await pcRef.current.setRemoteDescription(answer);
        } catch (error) {
            console.error('Error handling answer.', error);
        }
    };

    const handleNewICECandidateMsg = async (candidate) => {
        try {
            await pcRef.current.addIceCandidate(candidate);
        } catch (error) {
            console.error('Error adding received ICE candidate.', error);
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            socketRef.current.emit('message', newMessage);
            setMessages(prevMessages => [...prevMessages, `Me: ${newMessage}`]);
            setNewMessage('');
        }
    };

    const toggleVideo = () => {
        if (videoStarted) {
            // Stop video
            localStreamRef.current.getTracks().forEach(track => track.stop());
            pcRef.current.close();
            pcRef.current = null;
            setVideoStarted(false);
        } else {
            // Start video
            setVideoStarted(true);
            startMedia();
            initiateCall();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <header className="bg-black text-white w-full py-4 flex justify-center">
                <h1 className="text-lg">Meet</h1>
            </header>
            <main className="flex-grow flex flex-col items-center py-6 px-4">
                <p className="text-center mb-8">Connect with your friends through chat or video call.</p>

                {!connected && (
                    <div className="space-y-4 w-full max-w-xs">
                        <Button className="w-full bg-black text-white py-2" onClick={() => setConnected(true)}>
                            Connect
                        </Button>
                    </div>
                )}

                {connected && (
                    <div className="w-full mt-4 relative">
                        <div className="absolute inset-0 bg-cover bg-center rounded-md" style={{ backgroundImage: `url('/images/image.jpg')`, height: '70vh' }}>
                            <div className="relative z-10 w-full h-full flex flex-col">
                                <div className="flex-grow overflow-y-auto p-4 bg-white bg-opacity-10 rounded-t-lg">
                                    <div className="p-3.5 flex items-center justify-between bg-black bg-opacity-10 rounded-t-lg">
                                        <h2 className="text-black">Chat</h2>
                                        <Button
                                            className={`px-4 py-2 rounded flex items-center ${videoStarted ? 'bg-red-600' : 'bg-black'} text-white`}
                                            onClick={toggleVideo}
                                        >
                                            <VideocamIcon />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-2`}
                                            >
                                                <p className="bg-white bg-opacity-90 text-black p-3 rounded-lg shadow-sm max-w-xs">
                                                    {msg}
                                                </p>
                                            </div>
                                        ))}
                                        <video ref={localVideoRef} autoPlay muted className={`w-full ${videoStarted ? 'block' : 'hidden'}`} />
                                        <video ref={remoteVideoRef} autoPlay className={`w-full ${videoStarted ? 'block' : 'hidden'}`} />
                                    </div>
                                </div>
                                <div className="flex items-center p-3.5 bg-white bg-opacity-20 border-t border-gray-300">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-grow bg-opacity-30 text-black px-2 py-2 rounded backdrop-blur-lg border border-gray-300"
                                    />
                                    <Button className="bg-black text-white px-4 ml-2 rounded" onClick={handleSendMessage}>
                                        <SendIcon />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
