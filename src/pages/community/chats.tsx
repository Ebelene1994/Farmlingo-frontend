"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ChatSidebar from "@/components/chat/chatSidebar";
import ChatHeader from "@/components/chat/chatHeader";
import MessageList from "@/components/chat/messageList";
import ReplyBar from "@/components/chat/replyBar";
import ChatFooter from "@/components/chat/messageInput";
import useUserStore from "@/store/userStore";

interface MessageReply {
  sender: string;
  text: string;
}
interface Message {
  id: number;
  sender: string;
  role: string;
  avatar: string;
  time: string;
  text?: string;
  images?: string[];
  file?: string | null;
  replyTo?: MessageReply;
  isSent: boolean;
  edited?: boolean;
}
interface Chat {
  id: number;
  name: string;
  avatar: string;
}

const chats: Chat[] = [
  { id: 1, name: "Gladys Nimo", avatar: "GN" },
  { id: 2, name: "Edem Nunu", avatar: "EN" },
  { id: 3, name: "Oboi Siki", avatar: "OS" },
  { id: 4, name: "Nana Yaa", avatar: "NY" },
  { id: 5, name: "Rejoice", avatar: "RE" },
];

const initialChatMessages: Record<number, Message[]> = {
  5: [
    {
      id: 1,
      sender: "Rejoice",
      avatar: "RE",
      role: "STUDENT",
      text: "Hi, let's have a meeting tomorrow...",
      images: ["https://picsum.photos/seed/cow1/400/300"], // ✅ Removed trailing spaces
      time: "3:12 pm",
      isSent: false,
    },
    {
      id: 2,
      sender: "You",
      avatar: "YO",
      role: "STUDENT",
      text: "Sure! Let's meet at 10 AM.",
      images: [],
      time: "3:14 pm",
      isSent: true,
    },
  ],
};

export default function ChatUI() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const [selectedChat, setSelectedChat] = useState<Chat>(chats[0]);
  const [chatMessages, setChatMessages] = useState<Record<number, Message[]>>(
    () => {
      const msgs: Record<number, Message[]> = {};
      chats.forEach((chat) => {
        msgs[chat.id] = initialChatMessages[chat.id] || [];
      });
      return msgs;
    }
  );

  useEffect(() => {
    if (userId) {
      const chatId = parseInt(userId, 10);
      const foundChat = chats.find((c) => c.id === chatId);
      if (foundChat) setSelectedChat(foundChat);
      else navigate(`/community/chats/${chats[0].id}`, { replace: true });
    } else {
      setSelectedChat(chats[0]);
    }
  }, [userId, navigate]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    navigate(`/community/chats/${chat.id}`);
  };

  const [message, setMessage] = useState("");
  const [nextMessageId, setNextMessageId] = useState(100);
  const [replyingTo, setReplyingTo] = useState<{
    id: number;
    sender: string;
    text: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMessages = chatMessages[selectedChat.id] || [];

  const resetFile = useCallback(() => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith("image/"))
      setFilePreview(URL.createObjectURL(file));
    else setFilePreview(null);
  };

  const handleEditMessage = (
    messageId: number | string,
    newText: string,
    newImages: string[]
  ) => {
    const idNum =
      typeof messageId === "number"
        ? messageId
        : parseInt(String(messageId), 10);
    setChatMessages((prev) => ({
      ...prev,
      [selectedChat.id]: prev[selectedChat.id].map((msg) =>
        msg.id === idNum
          ? { ...msg, text: newText, images: newImages, edited: true }
          : msg
      ),
    }));
  };

  const handleDeleteMessage = (messageId: number | string) => {
    const idNum =
      typeof messageId === "number"
        ? messageId
        : parseInt(String(messageId), 10);
    setChatMessages((prev) => ({
      ...prev,
      [selectedChat.id]: prev[selectedChat.id].filter(
        (msg) => msg.id !== idNum
      ),
    }));
  };

  // Get real user from store
  const { user } = useUserStore();

  const handleSend = () => {
    if (!message.trim() && !selectedFile) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    const newMsg: Message = {
      id: nextMessageId,
      sender: user?.firstName || "You",
      avatar: user?.imageUrl || "YO",
      role: "STUDENT", // Ideally fetching role from backend too, but defaulting is fine for now
      text: message.trim(),
      images: selectedFile && filePreview ? [filePreview] : [],
      file: selectedFile && !filePreview ? selectedFile.name : null,
      time: timeString,
      isSent: true,
      replyTo: replyingTo || undefined,
    };

    setChatMessages((prev) => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg],
    }));
    setMessage("");
    setReplyingTo(null);
    resetFile();
    setNextMessageId((prev) => prev + 1);
  };

  const handleReplyClick = (msg: Message) => {
    setReplyingTo({
      id: msg.id,
      sender: msg.sender,
      text:
        msg.text?.trim() ||
        (msg.images?.length
          ? "[Photo]"
          : msg.file
            ? `[File: ${msg.file}]`
            : ""),
    });
  };

  const showChatList = isMobile && !userId;
  const showChatThread = !showChatList;

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar: desktop always, mobile only when no chat selected */}
      {!isMobile || showChatList ? (
        <ChatSidebar
          chats={chats}
          selectedChatId={selectedChat.id}
          chatMessages={chatMessages}
          onSelectChat={handleSelectChat}
        />
      ) : null}

      {/* Main chat thread */}
      {showChatThread && (
        // ✅ Reserve space for footer + safe area on mobile
        <div className="flex-1 flex flex-col bg-white w-full pb-[80px] sm:pb-0">
          <ChatHeader selectedChat={selectedChat} />

          {/* ✅ Scrollable message area */}
          <div className="flex-1 overflow-y-auto px-4 pt-4">
            {currentMessages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">
                    Send a message to start the conversation
                  </p>
                </div>
              </div>
            ) : (
              <MessageList
                messages={currentMessages}
                onReply={handleReplyClick}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
              />
            )}
          </div>

          {/* ✅ Sticky footer area */}
          <div className="px-4 pt-2 pb-4 bg-white">
            {replyingTo && (
              <div className="mb-2">
                <ReplyBar
                  replyingTo={replyingTo}
                  onCancel={() => setReplyingTo(null)}
                />
              </div>
            )}

            <ChatFooter
              message={message}
              setMessage={setMessage}
              onSend={handleSend}
              fileInputRef={fileInputRef}
              onFileSelect={handleFileUpload}
              selectedFile={selectedFile}
              filePreview={filePreview}
              onRemoveFile={resetFile}
            />
          </div>
        </div>
      )}
    </div>
  );
}
