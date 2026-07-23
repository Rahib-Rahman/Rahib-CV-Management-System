import { io } from "socket.io-client";

const socket = io("https://rahib-cv-management-system.onrender.com", {
    transports: ["websocket"],
});

export default socket;