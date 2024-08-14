/* eslint-disable */
"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var socket_io_client_1 = require("socket.io-client");
var button_1 = require("../ui/button");
var input_1 = require("../ui/input");
var image_1 = require("next/image");
var avatar_1 = require("../ui/avatar");
var dropdown_1 = require("../dropdown");
function WebRTC() {
    var _this = this;
    var _a = react_1.useState([]), messages = _a[0], setMessages = _a[1];
    var _b = react_1.useState(''), newMessage = _b[0], setNewMessage = _b[1];
    var _c = react_1.useState(''), username = _c[0], setUsername = _c[1]; // for user's username
    var _d = react_1.useState(""), avatarUrl = _d[0], setAvatarUrl = _d[1]; // get url from dropdown
    var _e = react_1.useState(false), connected = _e[0], setConnected = _e[1]; // connection status
    var _f = react_1.useState(false), videoStarted = _f[0], setVideoStarted = _f[1]; // video call status
    var _g = react_1.useState(false), buttonClicked = _g[0], setButtonClicked = _g[1]; // to show username and avatar fields to host
    var _h = react_1.useState(false), connectClicked = _h[0], setConnectClicked = _h[1]; // to show username and avatar fields
    var _j = react_1.useState(false), isHost = _j[0], setIsHost = _j[1]; // To identify if the client is a host
    var _k = react_1.useState(false), isAudioMuted = _k[0], setIsAudioMuted = _k[1]; // To track video mute/ unmute
    var localVideoRef = react_1.useRef(null);
    var remoteVideoRef = react_1.useRef(null);
    var socketRef = react_1.useRef(null);
    var peerRef = react_1.useRef(null);
    var localStreamRef = react_1.useRef(null);
    var messagesEndRef = react_1.useRef(null);
    react_1.useEffect(function () {
        // Initialize socket connection
        socketRef.current = socket_io_client_1["default"].connect('http://localhost:4000');
        // Set up event listeners for WebRTC signaling
        socketRef.current.on('offer', handleReceiveOffer);
        socketRef.current.on('answer', handleReceiveAnswer);
        socketRef.current.on('candidate', handleNewICECandidateMsg);
        socketRef.current.on('message', function (message) {
            setMessages(function (prevMessages) { return __spreadArrays(prevMessages, [message]); });
        });
        return function () {
            socketRef.current.disconnect();
        };
    }, []);
    react_1.useEffect(function () {
        scrollToBottom();
    }, [messages]);
    var startMedia = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                        console.error('Media Devices API is not supported in this browser.');
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    _a = localStreamRef;
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true, audio: true })];
                case 2:
                    _a.current = _b.sent();
                    localVideoRef.current.srcObject = localStreamRef.current;
                    createPeerConnection(); // Setup peer connection when media is obtained
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error('Error accessing media devices.', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var createPeerConnection = function () {
        peerRef.current = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        peerRef.current.onicecandidate = function (event) {
            if (event.candidate) {
                socketRef.current.emit('candidate', event.candidate);
            }
        };
        peerRef.current.ontrack = function (event) {
            remoteVideoRef.current.srcObject = event.streams[0];
        };
        localStreamRef.current.getTracks().forEach(function (track) {
            peerRef.current.addTrack(track, localStreamRef.current);
        });
    };
    var initiateCall = function () { return __awaiter(_this, void 0, void 0, function () {
        var offer, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!peerRef.current)
                        createPeerConnection();
                    return [4 /*yield*/, peerRef.current.createOffer()];
                case 1:
                    offer = _a.sent();
                    return [4 /*yield*/, peerRef.current.setLocalDescription(offer)];
                case 2:
                    _a.sent();
                    socketRef.current.emit('offer', offer);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error creating offer.', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleReceiveOffer = function (offer) { return __awaiter(_this, void 0, void 0, function () {
        var answer, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!peerRef.current)
                        createPeerConnection();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, peerRef.current.setRemoteDescription(offer)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, peerRef.current.createAnswer()];
                case 3:
                    answer = _a.sent();
                    return [4 /*yield*/, peerRef.current.setLocalDescription(answer)];
                case 4:
                    _a.sent();
                    socketRef.current.emit('answer', answer);
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error('Error handling offer.', error_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleReceiveAnswer = function (answer) { return __awaiter(_this, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, peerRef.current.setRemoteDescription(answer)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error handling answer.', error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleNewICECandidateMsg = function (candidate) { return __awaiter(_this, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, peerRef.current.addIceCandidate(candidate)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error('Error adding received ICE candidate.', error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleSendMessage = function () {
        if (newMessage.trim()) {
            var message_1 = {
                text: newMessage,
                sender: socketRef.current.id,
                username: username,
                avatar: avatarUrl
            };
            socketRef.current.emit('message', message_1);
            setMessages(function (prevMessages) { return __spreadArrays(prevMessages, [message_1]); });
            setNewMessage('');
        }
    };
    var toggleMuteVideo = function () {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(function (track) {
                track.enabled = !track.enabled;
            });
            setIsAudioMuted(function (prevState) { return !prevState; });
        }
    };
    var scrollToBottom = function () {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    };
    return (React.createElement("div", { className: "min-h-screen flex flex-col items-center bg-gray-100" },
        React.createElement("header", { className: "bg-black text-white w-full py-4 flex justify-center" },
            React.createElement("h1", { className: "text-lg" }, "SneakSpeak")),
        React.createElement("main", { className: "flex-grow flex flex-col items-center py-6 px-4" },
            React.createElement("p", { className: "text-center mb-8" }, "Connect with anyone through Chat or Video Call(Glimpse)"),
            !connected && (React.createElement("div", { className: "flex flex-col space-y-4 w-full max-w-xs items-center" },
                React.createElement(button_1.Button, { className: "w-full bg-black text-white py-2", onClick: function () {
                        setConnectClicked(true);
                    } }, "Connect"),
                React.createElement(button_1.Button, { className: "w-full bg-black text-white py-2", onClick: function () {
                        setButtonClicked(true);
                    } }, "Host"),
                buttonClicked && (React.createElement("div", { className: "flex flex-row py-10 justify-center items-center" },
                    !avatarUrl && (React.createElement(dropdown_1["default"], { setAvatarUrl: setAvatarUrl })),
                    avatarUrl && (React.createElement(avatar_1.Avatar, null,
                        React.createElement(avatar_1.AvatarImage, { src: avatarUrl }),
                        React.createElement(avatar_1.AvatarFallback, null, "CN"))),
                    React.createElement(input_1.Input, { className: "mx-2 my-1.5", type: "text", value: username, onChange: function (e) { return setUsername(e.target.value); }, placeholder: "Name please..." }),
                    React.createElement(button_1.Button, { size: "sm", onClick: function () {
                            setConnected(true);
                            setIsHost(true);
                        } }, "Enter"))),
                connectClicked && (React.createElement("div", { className: "flex flex-row py-10 justify-center items-center" },
                    !avatarUrl && (React.createElement(dropdown_1["default"], { setAvatarUrl: setAvatarUrl })),
                    avatarUrl && (React.createElement(avatar_1.Avatar, null,
                        React.createElement(avatar_1.AvatarImage, { src: avatarUrl }),
                        React.createElement(avatar_1.AvatarFallback, null, "CN"))),
                    React.createElement(input_1.Input, { className: "mx-2 my-1.5", type: "text", value: username, onChange: function (e) { return setUsername(e.target.value); }, placeholder: "Your name please..." }),
                    React.createElement(button_1.Button, { size: "sm", onClick: function () {
                            setConnected(true);
                        } }, "Enter"))))),
            connected && (React.createElement("div", { className: "w-full mt-4 relative" },
                React.createElement("div", { className: "absolute inset-0 bg-cover bg-center rounded-md", style: { backgroundImage: "url('/images/image.jpg')", height: '70vh' } },
                    React.createElement("div", { className: "relative z-10 w-full h-full flex flex-col" },
                        React.createElement("div", { className: "flex-grow overflow-y-auto bg-white bg-opacity-10 rounded-t-lg scrollbar-thin scrollbar-slate-800 scrollbar-track-gray-100" },
                            React.createElement("div", { className: "px-2.5 py-2 flex items-center bg-black sticky top-0 z-10" },
                                React.createElement("h2", { className: "text-white text-md pl-1" },
                                    " ",
                                    videoStarted ? 'Glimpse' : 'SneakSpeak'),
                                React.createElement(button_1.Button, { className: "bg-white text-white px-4 py-2 ml-auto rounded", onClick: function () {
                                        if (!videoStarted) {
                                            setVideoStarted(true);
                                            startMedia();
                                            if (isHost) {
                                                initiateCall();
                                            }
                                        }
                                    }, variant: "ghost", size: "sm" },
                                    React.createElement(image_1["default"], { src: "/images/video-camera.png", alt: "video camera", height: "20", width: "20" }))),
                            React.createElement("div", { className: "space-y-1 px-2 " + (videoStarted ? 'hidden' : '') }, messages.map(function (msg, index) {
                                var _a;
                                return (React.createElement("div", { key: index, className: "flex overflow-y-auto " + (msg.sender === socketRef.current.id ? 'justify-end' : 'justify-start') },
                                    React.createElement(avatar_1.Avatar, { className: "mr-1 mt-1 w-8 h-8" },
                                        React.createElement(avatar_1.AvatarImage, { src: msg.avatar }),
                                        React.createElement(avatar_1.AvatarFallback, null, (_a = username[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase())),
                                    React.createElement("p", { className: "px-3 py-1.5 rounded-lg shadow-sm max-w-xs mt-1 " + (msg.sender === socketRef.current.id ? 'bg-black text-white justify-end' : 'bg-white text-black justify-start') + " " },
                                        React.createElement("small", { className: "text-gray-400 text-xs" },
                                            msg.username,
                                            ": "),
                                        msg.text),
                                    React.createElement("div", { ref: messagesEndRef })));
                            })),
                            videoStarted && (React.createElement(React.Fragment, null,
                                React.createElement("div", { className: "flex flex-col bg-black overflow-y-hidden" },
                                    React.createElement("div", { className: "relative w-auto mt-2 h-[24vh] rounded-md border-2 border-white mx-2" },
                                        React.createElement("video", { ref: localVideoRef, autoPlay: true, muted: true, className: "w-full h-full " + (videoStarted ? 'block' : 'hidden') }),
                                        React.createElement("span", { className: "absolute bottom-0.5 left-0.5 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded" }, username || "Me")),
                                    React.createElement("div", { className: "relative w-auto h-[24vh] my-2 rounded-md border-2 border-white mx-2" },
                                        React.createElement("video", { ref: remoteVideoRef, autoPlay: true, className: "w-full h-full " + (videoStarted ? 'block' : 'hidden') }),
                                        React.createElement("span", { className: "absolute bottom-0.5 left-0.5 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded" }, "Remote User"))),
                                React.createElement("div", { className: "flex flex-row justify-center h-18" },
                                    React.createElement("div", { className: 'h-16 w-full flex rounded justify-center items-center' },
                                        React.createElement(button_1.Button, { className: "bg-white rounded mr-4", variant: "ghost", size: "lg", onClick: toggleMuteVideo },
                                            React.createElement(image_1["default"], { src: isAudioMuted ? "/images/mute.png" : "/images/voice-call.png", alt: isAudioMuted ? "mute audio" : "unmute audio", height: "20", width: "20" })),
                                        React.createElement(button_1.Button, { className: "bg-white text-white rounded", variant: "ghost", size: "lg", onClick: function () { return setVideoStarted(false); } },
                                            React.createElement(image_1["default"], { src: "/images/phone-call-end.png", alt: "video camera", height: "20", width: "20" }))))))),
                        React.createElement("div", { className: "flex p-2 mt-auto bg-black bg-opacity-10 border-t border-gray-300 rounded-b-lg " + (videoStarted ? 'hidden' : '') },
                            React.createElement(input_1.Input, { type: "text", value: newMessage, onChange: function (e) { return setNewMessage(e.target.value); }, placeholder: "Type a message...", className: "flex-grow bg-opacity-30 text-black px-1 py-1 rounded backdrop-blur-lg border border-gray-300", onKeyDown: function (e) {
                                    if (e.key === "Enter")
                                        handleSendMessage();
                                } }),
                            React.createElement(button_1.Button, { className: "bg-white text-white px-2 ml-2 rounded", variant: "ghost", size: "sm", onClick: handleSendMessage },
                                React.createElement(image_1["default"], { src: "/images/message.png", alt: "video camera", height: "20", width: "20" }))))))))));
}
exports["default"] = WebRTC;
