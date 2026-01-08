import React, { useState, useRef, useEffect } from 'react';
import { Smile, Heart, ThumbsUp, Search, Clock } from 'lucide-react';

interface EmojiCategory {
  name: string;
  icon: React.ReactNode;
  emojis: string[];
}

interface EnhancedEmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: '常用',
    icon: <Clock className="w-4 h-4" />,
    emojis: ['😀', '😂', '😍', '🥰', '😘', '😊', '😉', '😎', '🤔', '😅', '😭', '😱']
  },
  {
    name: '笑脸',
    icon: <Smile className="w-4 h-4" />,
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳']
  },
  {
    name: '手势',
    icon: <ThumbsUp className="w-4 h-4" />,
    emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏']
  },
  {
    name: '爱心',
    icon: <Heart className="w-4 h-4" />,
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟']
  },
  {
    name: '动物',
    icon: <span className="text-sm">🐶</span>,
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺']
  },
  {
    name: '食物',
    icon: <span className="text-sm">🍎</span>,
    emojis: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄']
  }
];

const EnhancedEmojiPicker: React.FC<EnhancedEmojiPickerProps> = ({
  onEmojiSelect,
  onClose,
  isOpen
}) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentEmojis');
    return saved ? JSON.parse(saved) : ['😀', '😂', '😍', '👍', '❤️', '🎉'];
  });
  
  const pickerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    
    // 更新最近使用的表情
    const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 12);
    setRecentEmojis(newRecent);
    localStorage.setItem('recentEmojis', JSON.stringify(newRecent));
    
    onClose();
  };

  const getFilteredEmojis = () => {
    if (!searchQuery) {
      return activeCategory === 0 ? recentEmojis : EMOJI_CATEGORIES[activeCategory - 1]?.emojis || [];
    }
    
    // 简单的搜索逻辑，实际项目中可以使用更复杂的emoji搜索库
    const allEmojis = EMOJI_CATEGORIES.flatMap(cat => cat.emojis);
    return allEmojis.filter(emoji => {
      // 这里可以添加更复杂的搜索逻辑，比如根据emoji名称搜索
      return true; // 暂时返回所有emoji
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={pickerRef}
      className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      {/* 搜索框 */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索表情..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 分类标签 */}
      {!searchQuery && (
        <div className="flex border-b border-gray-100 overflow-x-auto">
          <button
            onClick={() => setActiveCategory(0)}
            className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors ${
              activeCategory === 0
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Clock className="w-4 h-4" />
          </button>
          {EMOJI_CATEGORIES.map((category, index) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(index + 1)}
              className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors ${
                activeCategory === index + 1
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title={category.name}
            >
              {category.icon}
            </button>
          ))}
        </div>
      )}

      {/* 表情网格 */}
      <div className="p-3 max-h-64 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {getFilteredEmojis().map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() => handleEmojiClick(emoji)}
              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
        
        {getFilteredEmojis().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Smile className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">
              {searchQuery ? '未找到匹配的表情' : '暂无表情'}
            </p>
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 rounded-b-lg">
        点击表情发送，最近使用的表情会显示在常用分类中
      </div>
    </div>
  );
};

export default EnhancedEmojiPicker;
