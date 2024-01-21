import ChatWindow from "../components/ChatWindow";
import MyChats from "../components/MyChats";
import { useMediaQuery } from "usehooks-ts";
import useChatContext from "../hooks/useChatContext";

const Chats = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { selectedChatId } = useChatContext();

  return (
    <main className="h-[100dvh] w-full overflow-hidden">
      <section
        className={`md:fixed inset-y-0 w-80 border-r ${
          isMobile && (selectedChatId ? "hidden w-0" : "w-full")
        }`}
      >
        <MyChats />
      </section>
      <section
        className={`h-full md:pl-80 w-full ${
          isMobile && (selectedChatId ? "pl-0" : "hidden")
        }`}
      >
        <ChatWindow />
      </section>
    </main>
  );
};

export default Chats;
