import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, company } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const userId = user?._id || company?._id;

  useEffect(() => {
    if (userId) {
      const newSocket = io("http://localhost:5000", {
        withCredentials: true,
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        newSocket.emit("join", userId);
      });

      return () => newSocket.close();
    }
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
