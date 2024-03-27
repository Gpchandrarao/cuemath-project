import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.MODE === "development" ? "http://localhost:4412" : "/";

const socket = io(socketUrl);
export default socket;
