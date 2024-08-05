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
var image_1 = require("next/image");
function WebRTC() {
    var _this = this;
    var _a = react_1.useState([]), messages = _a[0], setMessages = _a[1];
    var _b = react_1.useState(""), newMessage = _b[0], setNewMessage = _b[1];
    var _c = react_1.useState(false), connected = _c[0], setConnected = _c[1];
    var _d = react_1.useState(false), videoStarted = _d[0], setVideoStarted = _d[1];
    var localVideoRef = react_1.useRef(null);
    var remoteVideoRef = react_1.useRef(null);
    var socketRef = react_1.useRef(null);
    var pcRef = react_1.useRef(null);
    var localStreamRef = react_1.useRef(null);
    react_1.useEffect(function () {
        socketRef.current = socket_io_client_1["default"].connect("http://localhost:4000");
        socketRef.current.on("offer", handleReceiveOffer);
        socketRef.current.on("answer", handleReceiveAnswer);
        socketRef.current.on("candidate", handleNewICECandidateMsg);
        socketRef.current.on("message", function (message) {
            setMessages(function (prevMessages) { return __spreadArrays(prevMessages, [message]); });
        });
        return function () {
            socketRef.current.disconnect();
        };
    }, []);
    var startMedia = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = localStreamRef;
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: true
                        })];
                case 1:
                    _a.current = _b.sent();
                    localVideoRef.current.srcObject = localStreamRef.current;
                    createPeerConnection();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.error("Error accessing media devices.", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var createPeerConnection = function () {
        pcRef.current = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });
        pcRef.current.onicecandidate = function (event) {
            if (event.candidate) {
                socketRef.current.emit("candidate", event.candidate);
            }
        };
        pcRef.current.ontrack = function (event) {
            remoteVideoRef.current.srcObject = event.streams[0];
        };
        localStreamRef.current.getTracks().forEach(function (track) {
            pcRef.current.addTrack(track, localStreamRef.current);
        });
    };
    var initiateCall = function () { return __awaiter(_this, void 0, void 0, function () {
        var offer, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!pcRef.current)
                        createPeerConnection();
                    return [4 /*yield*/, pcRef.current.createOffer()];
                case 1:
                    offer = _a.sent();
                    return [4 /*yield*/, pcRef.current.setLocalDescription(offer)];
                case 2:
                    _a.sent();
                    socketRef.current.emit("offer", offer);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error creating offer.", error_2);
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
                    if (!pcRef.current)
                        createPeerConnection();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, pcRef.current.setRemoteDescription(offer)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, pcRef.current.createAnswer()];
                case 3:
                    answer = _a.sent();
                    return [4 /*yield*/, pcRef.current.setLocalDescription(answer)];
                case 4:
                    _a.sent();
                    socketRef.current.emit("answer", answer);
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error("Error handling offer.", error_3);
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
                    return [4 /*yield*/, pcRef.current.setRemoteDescription(answer)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error("Error handling answer.", error_4);
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
                    return [4 /*yield*/, pcRef.current.addIceCandidate(candidate)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error adding received ICE candidate.", error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleSendMessage = function () {
        if (newMessage.trim()) {
            var message = { text: newMessage, sender: "Me" };
            socketRef.current.emit("message", message.text);
            setMessages(function (prevMessages) { return __spreadArrays(prevMessages, ["Me: " + newMessage]); });
            setNewMessage("");
        }
    };
    var toggleVideo = function () {
        if (videoStarted) {
            // Stop video
            localStreamRef.current.getTracks().forEach(function (track) { return track.stop(); });
            pcRef.current.close();
            pcRef.current = null;
            setVideoStarted(false);
        }
        else {
            // Start video
            setVideoStarted(true);
            startMedia();
            initiateCall();
        }
    };
    return (react_1["default"].createElement("div", { className: "min-h-screen flex flex-col items-center bg-gray-100" },
        react_1["default"].createElement("header", { className: "bg-black text-white w-full py-4 flex justify-center" },
            react_1["default"].createElement("h1", { className: "text-lg" }, "Meet")),
        react_1["default"].createElement("main", { className: "flex-grow flex flex-col items-center py-6 px-4" },
            react_1["default"].createElement("p", { className: "text-center mb-8" }, "Connect with your friends through chat or video call."),
            !connected && (react_1["default"].createElement("div", { className: "space-y-4 w-full max-w-xs" },
                react_1["default"].createElement(button_1.Button, { className: "w-full bg-black text-white py-2", onClick: function () { return setConnected(true); } }, "Connect"))),
            connected && (react_1["default"].createElement("div", { className: "w-full mt-4 relative" },
                react_1["default"].createElement("div", { className: "absolute inset-0 bg-cover bg-center rounded-md", style: {
                        backgroundImage: "url('/images/image.jpg')",
                        height: "70vh"
                    } },
                    react_1["default"].createElement("div", { className: "relative z-10 w-full h-full flex flex-col" },
                        react_1["default"].createElement("div", { className: "flex-grow overflow-y-auto p-4 bg-white bg-opacity-10 rounded-t-lg" },
                            react_1["default"].createElement("div", { className: "p-3.5 flex items-center justify-between bg-black bg-opacity-10 rounded-t-lg sticky top-0" },
                                react_1["default"].createElement("h2", { className: "text-black" }, "Chat"),
                                react_1["default"].createElement(button_1.Button, { className: "px-4 py-2 rounded flex items-center " + (videoStarted ? "bg-red-600" : "bg-white") + " text-white", onClick: toggleVideo },
                                    react_1["default"].createElement(image_1["default"], { src: "/images/video-camera.png", height: "20", width: "20", alt: "video icon" }))),
                            react_1["default"].createElement("div", { className: "space-y-2" },
                                messages.map(function (msg, index) { return (react_1["default"].createElement("div", { key: index, className: "flex " + (msg.sender === "Me" ? "justify-start" : "justify-end") + " mb-2" },
                                    react_1["default"].createElement("p", { className: "bg-white bg-opacity-90 text-black p-3 rounded-lg shadow-sm max-w-xs" }, msg))); }),
                                react_1["default"].createElement("video", { ref: localVideoRef, autoPlay: true, muted: true, className: "w-full " + (videoStarted ? "block" : "hidden") }),
                                react_1["default"].createElement("video", { ref: remoteVideoRef, autoPlay: true, className: "w-full " + (videoStarted ? "block" : "hidden") }))),
                        react_1["default"].createElement("div", { className: "flex items-center p-3.5 bg-white bg-opacity-20 border-t border-gray-300" },
                            react_1["default"].createElement("input", { className: "flex-grow bg-opacity-30 text-black px-2 py-2 rounded backdrop-blur-lg border border-gray-300", type: "text", value: newMessage, placeholder: "Type a message...", onChange: function (e) { return setNewMessage(e.target.value); }, onKeyDown: function (e) {
                                    if (e.key === "Enter")
                                        handleSendMessage();
                                } }),
                            react_1["default"].createElement(button_1.Button, { className: "bg-white text-white px-4 ml-2 rounded", onClick: handleSendMessage },
                                react_1["default"].createElement(image_1["default"], { src: "/images/message.png", height: "20", width: "20", alt: "video icon" }))))))))));
}
exports["default"] = WebRTC;
