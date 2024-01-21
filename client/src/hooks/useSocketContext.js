import { useContext } from "react";
import { SocketContext } from "../contexts/socketContext";

const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("Socket context must be used inside socket Provider!");
    }
    return context;
};

export default useSocketContext;