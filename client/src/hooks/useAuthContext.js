import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Auth context must be used inside authContext Provider!");
    }
    return context;
}

export default useAuthContext;