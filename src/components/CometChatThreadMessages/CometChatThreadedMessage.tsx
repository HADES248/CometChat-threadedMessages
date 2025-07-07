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
import { useMemo } from "react";

interface ThreadProps {
  message: CometChat.BaseMessage;
  selectedItem: CometChat.User | CometChat.Group | CometChat.Conversation | CometChat.Call | undefined;
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
  if (!message) return null;

  const formatters = useMemo(() => {
    const dataSource = CometChatUIKit.getDataSource?.();
    const baseFormatters = dataSource?.getAllTextFormatters?.({}) || [];
    return searchKeyword?.trim()
      ? [...baseFormatters, new CometChatTextHighlightFormatter(searchKeyword)]
      : baseFormatters;
  }, [searchKeyword]);

  const getSelectedUser = (): CometChat.User | undefined => {
    if (!selectedItem) return undefined;
    if (selectedItem instanceof CometChat.User) return selectedItem;
    if (
      selectedItem instanceof CometChat.Conversation &&
      selectedItem.getConversationType?.() === CometChat.RECEIVER_TYPE.USER
    ) {
      return selectedItem.getConversationWith() as CometChat.User;
    }
    return undefined;
  };

  const getSelectedGroup = (): CometChat.Group | undefined => {
    if (!selectedItem) return undefined;
    if (selectedItem instanceof CometChat.Group) return selectedItem;
    if (
      selectedItem instanceof CometChat.Conversation &&
      selectedItem.getConversationType?.() === CometChat.RECEIVER_TYPE.GROUP
    ) {
      return selectedItem.getConversationWith() as CometChat.Group;
    }
    return undefined;
  };

  const user = getSelectedUser();
  const group = getSelectedGroup();

  const messagesRequestBuilder = useMemo(() => {
    const builder = new CometChat.MessagesRequestBuilder()
      .setParentMessageId(message.getId())
      .setLimit(50);

    if (user) builder.setUID(user.getUid());
    if (group) builder.setGUID(group.getGuid());

    return builder;
  }, [message, user, group]);

  return (
    <div className="cometchat-threaded-message">
      <div className="cometchat-threaded-message-header">
        <CometChatThreadHeader parentMessage={message} onClose={onClose} />
      </div>

      <div className="cometchat-threaded-message-list">
        <CometChatMessageList
          parentMessageId={message.getId()}
          user={user}
          group={group}
          messagesRequestBuilder={messagesRequestBuilder}
          textFormatters={formatters}
        />
      </div>

      {showComposer ? (
        <div className="cometchat-threaded-message-composer">
          <CometChatMessageComposer
            parentMessageId={message.getId()}
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