export interface ChatMessage {
  id: string;
  senderId: string;
  sender: {
    id: string;
    username: string;
    fullName: string;
    isVip?: boolean;
  };
  receiverId: string;
  receiver: {
    id: string;
    username: string;
    fullName: string;
  };
  content: string;
  type: MessageType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum MessageType {
  TEXT = 'TEXT',
  EMOJI = 'EMOJI',
  SYSTEM = 'SYSTEM',
}

export interface ChatConversation {
  id: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}

export interface ChatParticipant {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    isVip?: boolean;
  };
  conversationId: string;
  lastReadAt?: string;
}

export interface SendMessageDto {
  receiverId: string;
  content: string;
  type: MessageType;
}

// 常用emoji列表
export const COMMON_EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
  '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
  '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
  '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
  '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
  '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
  '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥',
  '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧',
  '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
  '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑',
  '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻',
  '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
  '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚',
  '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
  '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
  '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️',
  '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈',
];

export interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}
