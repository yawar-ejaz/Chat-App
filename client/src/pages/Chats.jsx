import ChatWindow from "../components/ChatWindow";
import MyChats from "../components/MyChats";

const Chats = () => {
  return (
    <main className="h-[100dvh] w-full overflow-hidden">
      <section className="fixed inset-y-0 w-80 border-r ">
        <MyChats />
      </section>
      <section className="h-full pl-80 w-full">
        <ChatWindow />
      </section>
    </main>
  );
};

export default Chats;
