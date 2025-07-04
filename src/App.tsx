import { useState } from "react";
import {
  CometChatMessageComposer,
  CometChatMessageHeader,
  CometChatMessageList,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatSelector } from "./components/CometChatSelector/CometChatSelector";
import "./App.css";
import '@cometchat/chat-uikit-react/css-variables.css';
import './cometchatConfig'
import './components/Login'
import { CometChatThreadedMessages } from "./components/CometChatThreadMessages/CometChatThreadedMessage";

function App() {
  const [selectedUser, setSelectedUser] = useState<CometChat.User | undefined>(undefined);
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group | undefined>(undefined);
  const [threadMessage, setThreadMessage] = useState<CometChat.BaseMessage | null>(null);

  return (
    <div className="app-layout">
      {/* LEFT: Sidebar for selecting conversations */}
      <div className="conversations-wrapper">
        <CometChatSelector
          onSelectorItemClicked={(activeItem) => {
            let item = activeItem;
            if (activeItem instanceof CometChat.Conversation) {
              item = activeItem.getConversationWith();
            }

            if (item instanceof CometChat.User) {
              setSelectedUser(item as CometChat.User);
              setSelectedGroup(undefined);
            } else if (item instanceof CometChat.Group) {
              setSelectedUser(undefined);
              setSelectedGroup(item as CometChat.Group);
            } else {
              setSelectedUser(undefined);
              setSelectedGroup(undefined);
            }

            setThreadMessage(null); // Clear thread when switching
          }}
        />
      </div>

      {(selectedUser || selectedGroup) ? (
        <>
          {/* MIDDLE: Main chat view */}
          <div className="messages-wrapper">
            <CometChatMessageHeader user={selectedUser} group={selectedGroup} />
            <CometChatMessageList
              user={selectedUser}
              group={selectedGroup}
              onThreadRepliesClick={(message) => setThreadMessage(message)}
            />
            <CometChatMessageComposer
              user={selectedUser}
              group={selectedGroup}
            />
          </div>

          {/* RIGHT: Threaded messages */}
          {threadMessage && (
            <div className="thread-pane">
              <CometChatThreadedMessages
                message={threadMessage}
                selectedItem={selectedUser || selectedGroup}
                onClose={() => setThreadMessage(null)}
                showComposer={true}
              />
            </div>
          )}
        </>
      ) : (
        <div className="empty-conversation">Select Conversation to start</div>
      )}
    </div>
  );
}

export default App;
