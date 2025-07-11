import "./CometChatThreadedMessages.css";
import {
  CometChatMessageComposer,
  CometChatMessageList,
  CometChatTextHighlightFormatter,
  CometChatThreadHeader,
  CometChatUIKit,
  CometChatUserEvents,
  getLocalizedString,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { useEffect, useMemo, useState } from "react";

interface ThreadProps {
  message: CometChat.BaseMessage;
  selectedItem?: CometChat.User | CometChat.Group | CometChat.Conversation | CometChat.Call;
  onClose?: () => void;
  showComposer?: boolean;
  searchKeyword?: string;
}

export const CometChatThreadedMessages = ({
  message,
  selectedItem,
  onClose = () => {},
  showComposer = false,
  searchKeyword,
}: ThreadProps) => {
  const [parentMessage, setParentMessage] = useState<CometChat.BaseMessage | null>(null);

  // Fetch complete parent message if needed
  useEffect(() => {
    const fetchParentMessage = async () => {
      try {
        const fullMessage = await CometChat.getMessageDetails(message.getId());
        setParentMessage(fullMessage);
      } catch (error) {
        console.error("Failed to fetch parent message:", error);
      }
    };
    fetchParentMessage();
  }, [message]);

  const user = useMemo(() => {
    if (selectedItem instanceof CometChat.User) return selectedItem;
    if (
      selectedItem instanceof CometChat.Conversation &&
      selectedItem.getConversationType?.() === CometChat.RECEIVER_TYPE.USER
    ) {
      return selectedItem.getConversationWith() as CometChat.User;
    }
    return undefined;
  }, [selectedItem]);

  const group = useMemo(() => {
    if (selectedItem instanceof CometChat.Group) return selectedItem;
    if (
      selectedItem instanceof CometChat.Conversation &&
      selectedItem.getConversationType?.() === CometChat.RECEIVER_TYPE.GROUP
    ) {
      return selectedItem.getConversationWith() as CometChat.Group;
    }
    return undefined;
  }, [selectedItem]);

  const formatters = useMemo(() => {
    const dataSource = CometChatUIKit.getDataSource?.();
    const baseFormatters = dataSource?.getAllTextFormatters?.({}) || [];
    return searchKeyword?.trim()
      ? [...baseFormatters, new CometChatTextHighlightFormatter(searchKeyword)]
      : baseFormatters;
  }, [searchKeyword]);

  const messagesRequestBuilder = useMemo(() => {
    const builder = new CometChat.MessagesRequestBuilder()
      .setParentMessageId(message.getId())
      .setLimit(50);

    if (user) builder.setUID(user.getUid());
    if (group) builder.setGUID(group.getGuid());

    return builder;
  }, [message, user, group]);

  if (!parentMessage) return null;

  return (
    <div className="cometchat-threaded-message">
      <div className="cometchat-threaded-message-header">
        <CometChatThreadHeader parentMessage={parentMessage} onClose={onClose} />
      </div>

      <div className="cometchat-threaded-message-list">
        <CometChatMessageList
          parentMessageId={parentMessage.getId()}
          user={user}
          group={group}
          messagesRequestBuilder={messagesRequestBuilder}
          textFormatters={formatters}
        />
      </div>

      {showComposer ? (
        <div className="cometchat-threaded-message-composer">
          <CometChatMessageComposer
            parentMessageId={parentMessage.getId()}
            user={user}
            group={group}
          />
        </div>
      ) : user?.getBlockedByMe?.() ? (
        <div
          className="message-composer-blocked"
          onClick={() => {
            CometChat.unblockUsers([user.getUid()]).then(() => {
              user.setBlockedByMe(false);
              CometChatUserEvents.ccUserUnblocked.next(user);
            });
          }}
        >
          <div className="message-composer-blocked__text">
            {getLocalizedString("cannot_send_to_blocked_user")}{" "}
            <span className="message-composer-blocked__text-unblock">
              {getLocalizedString("click_to_unblock")}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
