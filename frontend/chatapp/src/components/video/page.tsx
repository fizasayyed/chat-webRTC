"use client"
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export default function WebRTC() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const socketRef = useRef(null);
    const pcRef = useRef(null);
    const localStreamRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io.connect('http://localhost:4000'); // Use the signaling server's address

        // Set up event listeners for WebRTC
        socketRef.current.on('offer', handleReceiveOffer);
        socketRef.current.on('answer', handleReceiveAnswer);
        socketRef.current.on('candidate', handleNewICECandidateMsg);

        socketRef.current.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });
        // Get local media
        startMedia();

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const startMedia = async () => {
        try {
            localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideoRef.current.srcObject = localStreamRef.current;
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

    const call = async () => {
        createPeerConnection();

        try {
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

    return (
        <div>
            <h1>WebRTC Video Chat</h1>
            <video ref={localVideoRef} autoPlay muted></video>
            <video ref={remoteVideoRef} autoPlay></video>
            <div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
            <div>
                <h2>Chat</h2>
                <div>
                    {messages.map((msg, index) => (
                        <p key={index}>{msg}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
