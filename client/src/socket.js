import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.MODE === "development"
    ? "https://cuemath-backend-px4o.onrender.com/"
    : "/";

const socket = io(socketUrl);
export default socket;
