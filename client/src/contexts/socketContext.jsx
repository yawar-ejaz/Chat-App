import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuthContext from "../hooks/useAuthContext";

export const SocketContext = createContext({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;

    const socketInstance = io(import.meta.env.VITE_SERVER_URL);

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("error", (error) => console.error(error));

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
