"use client";

import React, { useState, useEffect, useRef } from "react";

interface EmojiItem {
  emoji: string;
  name: string;
  category: string;
}

const RAW_EMOJIS: EmojiItem[] = [
  { emoji: "📄", name: "文档", category: "文档" },
  { emoji: "📝", name: "笔记", category: "文档" },
  { emoji: "📋", name: "清单", category: "文档" },
  { emoji: "📌", name: "书签", category: "文档" },
  { emoji: "⭐", name: "收藏", category: "文档" },
  { emoji: "📑", name: "目录", category: "文档" },
  { emoji: "📃", name: "文件", category: "文档" },
  { emoji: "📁", name: "文件夹", category: "文档" },
  { emoji: "📂", name: "打开文件夹", category: "文档" },
  { emoji: "📎", name: "回形针", category: "文档" },
  { emoji: "📏", name: "尺子", category: "文档" },
  { emoji: "✏️", name: "铅笔", category: "文档" },
  { emoji: "📐", name: "三角尺", category: "文档" },
  { emoji: "🗒️", name: "记事本", category: "文档" },
  { emoji: "📔", name: "笔记本", category: "文档" },
  { emoji: "📕", name: "红书", category: "文档" },
  { emoji: "📗", name: "绿书", category: "文档" },
  { emoji: "📘", name: "蓝书", category: "文档" },
  { emoji: "📙", name: "橙书", category: "文档" },
  { emoji: "📚", name: "书籍", category: "文档" },

  { emoji: "📊", name: "图表", category: "数据" },
  { emoji: "📈", name: "上涨", category: "数据" },
  { emoji: "📉", name: "下跌", category: "数据" },
  { emoji: "🧮", name: "算盘", category: "数据" },
  { emoji: "💰", name: "钱袋", category: "数据" },
  { emoji: "💴", name: "日元", category: "数据" },
  { emoji: "💵", name: "美元", category: "数据" },
  { emoji: "💶", name: "欧元", category: "数据" },

  { emoji: "💡", name: "想法", category: "创意" },
  { emoji: "🔥", name: "热门", category: "创意" },
  { emoji: "🎨", name: "调色板", category: "创意" },
  { emoji: "🎭", name: "面具", category: "创意" },
  { emoji: "🎪", name: "帐篷", category: "创意" },
  { emoji: "✨", name: "闪烁", category: "创意" },
  { emoji: "💫", name: "眩晕", category: "创意" },
  { emoji: "🌟", name: "星星", category: "创意" },
  { emoji: "💎", name: "钻石", category: "创意" },
  { emoji: "🎯", name: "目标", category: "创意" },

  { emoji: "💬", name: "评论", category: "社交" },
  { emoji: "💭", name: "思考", category: "社交" },
  { emoji: "🗨️", name: "对话", category: "社交" },
  { emoji: "📢", name: "喇叭", category: "社交" },
  { emoji: "📣", name: "喊话", category: "社交" },
  { emoji: "📮", name: "邮箱", category: "社交" },
  { emoji: "📧", name: "邮件", category: "社交" },
  { emoji: "✉️", name: "信封", category: "社交" },
  { emoji: "📨", name: "来信", category: "社交" },
  { emoji: "📤", name: "发信", category: "社交" },

  { emoji: "📖", name: "阅读", category: "学习" },
  { emoji: "🔬", name: "显微镜", category: "学习" },
  { emoji: "🔭", name: "望远镜", category: "学习" },
  { emoji: "🧪", name: "试管", category: "学习" },
  { emoji: "🧬", name: "DNA", category: "学习" },
  { emoji: "📡", name: "卫星", category: "学习" },
  { emoji: "🖥️", name: "电脑", category: "学习" },
  { emoji: "💻", name: "笔记本", category: "学习" },
  { emoji: "📱", name: "手机", category: "学习" },

  { emoji: "💼", name: "公文包", category: "工作" },
  { emoji: "🏢", name: "办公楼", category: "工作" },
  { emoji: "🏬", name: "商场", category: "工作" },
  { emoji: "🏭", name: "工厂", category: "工作" },
  { emoji: "🚀", name: "火箭", category: "工作" },
  { emoji: "📅", name: "日历", category: "工作" },
  { emoji: "📆", name: "日程", category: "工作" },

  { emoji: "⌨️", name: "键盘", category: "设备" },
  { emoji: "🖱️", name: "鼠标", category: "设备" },
  { emoji: "🖨️", name: "打印机", category: "设备" },
  { emoji: "📷", name: "相机", category: "设备" },
  { emoji: "🎥", name: "摄像机", category: "设备" },
  { emoji: "📺", name: "电视", category: "设备" },
  { emoji: "🎮", name: "游戏机", category: "设备" },

  { emoji: "🔍", name: "搜索", category: "工具" },
  { emoji: "🔗", name: "链接", category: "工具" },
  { emoji: "📥", name: "接收", category: "工具" },
  { emoji: "📦", name: "包裹", category: "工具" },
  { emoji: "💾", name: "保存", category: "工具" },
  { emoji: "📍", name: "位置", category: "工具" },
  { emoji: "🔖", name: "标签", category: "工具" },
  { emoji: "🏷️", name: "价格标签", category: "工具" },
  { emoji: "🔔", name: "通知", category: "工具" },
  { emoji: "🛠️", name: "工具", category: "工具" },
  { emoji: "⚙️", name: "设置", category: "工具" },
  { emoji: "🔧", name: "扳手", category: "工具" },
  { emoji: "🔨", name: "锤子", category: "工具" },
  { emoji: "🪛", name: "螺丝刀", category: "工具" },

  { emoji: "🔒", name: "锁定", category: "安全" },
  { emoji: "🔓", name: "解锁", category: "安全" },
  { emoji: "🔏", name: "签署", category: "安全" },
  { emoji: "🔐", name: "密码", category: "安全" },
  { emoji: "🔑", name: "钥匙", category: "安全" },
  { emoji: "🛡️", name: "盾牌", category: "安全" },
  { emoji: "⚖️", name: "天平", category: "安全" },
  { emoji: "🔞", name: "成人", category: "安全" },
  { emoji: "🚫", name: "禁止", category: "安全" },
  { emoji: "⚠️", name: "警告", category: "安全" },

  { emoji: "⏰", name: "闹钟", category: "时间" },
  { emoji: "🕐", name: "一点", category: "时间" },
  { emoji: "⏳", name: "沙漏", category: "时间" },
  { emoji: "⌛", name: "沙漏完成", category: "时间" },
  { emoji: "⏱️", name: "秒表", category: "时间" },
  { emoji: "⏲️", name: "计时器", category: "时间" },
  { emoji: "🕒", name: "三点", category: "时间" },
  { emoji: "🕕", name: "六点", category: "时间" },

  { emoji: "✅", name: "完成", category: "状态" },
  { emoji: "❌", name: "错误", category: "状态" },
  { emoji: "❓", name: "疑问", category: "状态" },
  { emoji: "❗", name: "感叹", category: "状态" },
  { emoji: "⭕", name: "圆圈", category: "状态" },
  { emoji: "🔴", name: "红色", category: "状态" },
  { emoji: "🟡", name: "黄色", category: "状态" },
  { emoji: "🟢", name: "绿色", category: "状态" },
  { emoji: "🔵", name: "蓝色", category: "状态" },
  { emoji: "⚪", name: "白色", category: "状态" },
  { emoji: "⚫", name: "黑色", category: "状态" },
  { emoji: "🟠", name: "橙色", category: "状态" },
  { emoji: "🟣", name: "紫色", category: "状态" },
  { emoji: "🟤", name: "棕色", category: "状态" },

  { emoji: "😀", name: "开心", category: "表情" },
  { emoji: "😎", name: "酷", category: "表情" },
  { emoji: "🤔", name: "思考", category: "表情" },
  { emoji: "🎉", name: "庆祝", category: "表情" },
  { emoji: "💪", name: "加油", category: "表情" },
  { emoji: "❤️", name: "爱心", category: "表情" },
  { emoji: "💯", name: "满分", category: "表情" },
  { emoji: "🌈", name: "彩虹", category: "表情" },
  { emoji: "😊", name: "微笑", category: "表情" },
  { emoji: "😂", name: "笑哭", category: "表情" },
  { emoji: "🥰", name: "喜欢", category: "表情" },
  { emoji: "😴", name: "睡觉", category: "表情" },
  { emoji: "🤯", name: "爆炸头", category: "表情" },
  { emoji: "😅", name: "冒汗", category: "表情" },
  { emoji: "🙂", name: "笑脸", category: "表情" },
  { emoji: "😉", name: "眨眼", category: "表情" },
  { emoji: "😍", name: "花痴", category: "表情" },
  { emoji: "🤩", name: "星星眼", category: "表情" },

  { emoji: "🔺", name: "红三角", category: "颜色" },
  { emoji: "🔻", name: "倒红三角", category: "颜色" },
  { emoji: "🔸", name: "橙色方块", category: "颜色" },
  { emoji: "🔹", name: "蓝色方块", category: "颜色" },

  { emoji: "🎬", name: "电影", category: "娱乐" },
  { emoji: "🎲", name: "骰子", category: "娱乐" },
  { emoji: "🎳", name: "保龄球", category: "娱乐" },
  { emoji: "🎰", name: "老虎机", category: "娱乐" },

  { emoji: "🎤", name: "麦克风", category: "音乐" },
  { emoji: "🎧", name: "耳机", category: "音乐" },
  { emoji: "🎼", name: "乐谱", category: "音乐" },
  { emoji: "🎹", name: "钢琴", category: "音乐" },
  { emoji: "🎸", name: "吉他", category: "音乐" },
  { emoji: "🎺", name: "小号", category: "音乐" },
  { emoji: "🎷", name: "萨克斯", category: "音乐" },
  { emoji: "🥁", name: "鼓", category: "音乐" },
  { emoji: "🎻", name: "小提琴", category: "音乐" },
  { emoji: "🎵", name: "音符", category: "音乐" },
  { emoji: "🎶", name: "音乐", category: "音乐" },
  { emoji: "🔊", name: "喇叭", category: "音乐" },
  { emoji: "🔉", name: "中音量", category: "音乐" },
  { emoji: "🔈", name: "低音量", category: "音乐" },
  { emoji: "🔇", name: "静音", category: "音乐" },

  { emoji: "📇", name: "名片", category: "商务" },
  { emoji: "💳", name: "信用卡", category: "商务" },
  { emoji: "🧾", name: "收据", category: "商务" },
  { emoji: "🖋️", name: "钢笔", category: "商务" },
  { emoji: "✒️", name: "墨水笔", category: "商务" },
  { emoji: "🗂️", name: "文件盒", category: "商务" },

  { emoji: "🏠", name: "房子", category: "生活" },
  { emoji: "🏡", name: "别墅", category: "生活" },
  { emoji: "🚗", name: "汽车", category: "生活" },
  { emoji: "✈️", name: "飞机", category: "生活" },
  { emoji: "⛵", name: "帆船", category: "生活" },
  { emoji: "🚲", name: "自行车", category: "生活" },
  { emoji: "🏃", name: "跑步", category: "生活" },
  { emoji: "🍎", name: "苹果", category: "生活" },
  { emoji: "🍕", name: "披萨", category: "生活" },
  { emoji: "☕", name: "咖啡", category: "生活" },
  { emoji: "🍵", name: "茶", category: "生活" },
  { emoji: "🌸", name: "樱花", category: "生活" },
  { emoji: "🌺", name: "芙蓉", category: "生活" },
  { emoji: "🌻", name: "向日葵", category: "生活" },
  { emoji: "🌹", name: "玫瑰", category: "生活" },
  { emoji: "🌷", name: "郁金香", category: "生活" },
  { emoji: "🌳", name: "树", category: "生活" },
  { emoji: "🌲", name: "松树", category: "生活" },

  { emoji: "🐶", name: "狗", category: "动物" },
  { emoji: "🐱", name: "猫", category: "动物" },
  { emoji: "🐭", name: "老鼠", category: "动物" },
  { emoji: "🐹", name: "仓鼠", category: "动物" },
  { emoji: "🐰", name: "兔子", category: "动物" },
  { emoji: "🦊", name: "狐狸", category: "动物" },
  { emoji: "🐻", name: "熊", category: "动物" },
  { emoji: "🐼", name: "熊猫", category: "动物" },
  { emoji: "🐨", name: "考拉", category: "动物" },
  { emoji: "🐯", name: "老虎", category: "动物" },
  { emoji: "🦁", name: "狮子", category: "动物" },
  { emoji: "🐮", name: "牛", category: "动物" },
  { emoji: "🐷", name: "猪", category: "动物" },
  { emoji: "🐸", name: "青蛙", category: "动物" },
  { emoji: "🐵", name: "猴子", category: "动物" },
  { emoji: "🦄", name: "独角兽", category: "动物" },
  { emoji: "🐝", name: "蜜蜂", category: "动物" },
  { emoji: "🦋", name: "蝴蝶", category: "动物" },
  { emoji: "🐢", name: "乌龟", category: "动物" },
  { emoji: "🐬", name: "海豚", category: "动物" },

  { emoji: "🧡", name: "橙心", category: "符号" },
  { emoji: "💛", name: "黄心", category: "符号" },
  { emoji: "💚", name: "绿心", category: "符号" },
  { emoji: "💙", name: "蓝心", category: "符号" },
  { emoji: "💜", name: "紫心", category: "符号" },
  { emoji: "🖤", name: "黑心", category: "符号" },
  { emoji: "🤍", name: "白心", category: "符号" },
  { emoji: "💔", name: "心碎", category: "符号" },
  { emoji: "💕", name: "两颗心", category: "符号" },
  { emoji: "💖", name: "闪亮的心", category: "符号" },
  { emoji: "💗", name: "跳动的心", category: "符号" },
  { emoji: "💝", name: "礼物心", category: "符号" },
  { emoji: "💧", name: "水滴", category: "符号" },
  { emoji: "❄️", name: "雪花", category: "符号" },
];

const seenEmojis = new Set<string>();
const ALL_EMOJIS: EmojiItem[] = RAW_EMOJIS.filter((item) => {
  if (seenEmojis.has(item.emoji)) {
    return false;
  }
  seenEmojis.add(item.emoji);
  return true;
});

const CATEGORY_ICONS: Record<string, string> = {
  "常用": "⭐",
  "文档": "📄",
  "数据": "📊",
  "创意": "💡",
  "社交": "💬",
  "学习": "📚",
  "工作": "💼",
  "设备": "💻",
  "工具": "🔧",
  "安全": "🔒",
  "时间": "⏰",
  "状态": "✅",
  "表情": "😀",
  "颜色": "🎨",
  "娱乐": "🎮",
  "音乐": "🎵",
  "商务": "📇",
  "生活": "🏠",
  "动物": "🐶",
  "符号": "❤️",
};

const CATEGORIES = [
  "常用",
  "表情",
  "文档",
  "数据",
  "创意",
  "社交",
  "学习",
  "工作",
  "设备",
  "工具",
  "安全",
  "时间",
  "状态",
  "颜色",
  "娱乐",
  "音乐",
  "商务",
  "生活",
  "动物",
  "符号",
];

const STORAGE_KEY = "emoji_usage_count";

function getUsageCount(): Record<string, number> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveUsageCount(usage: Record<string, number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch {
    // ignore
  }
}

function incrementUsage(emoji: string) {
  const usage = getUsageCount();
  usage[emoji] = (usage[emoji] || 0) + 1;
  saveUsageCount(usage);
}

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
  currentEmoji?: string;
}

export function EmojiPicker({ onSelect, onClose, position, currentEmoji }: EmojiPickerProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [usageCount, setUsageCount] = useState<Record<string, number>>(getUsageCount());
  const pickerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = searchQuery.trim()
    ? ALL_EMOJIS.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        pickerRef.current.style.left = `${position.x - rect.width}px`;
      }
      if (rect.bottom > window.innerHeight) {
        pickerRef.current.style.top = `${position.y - rect.height}px`;
      }
    }
  }, [position]);

  const handleSelectEmoji = (emoji: string) => {
    incrementUsage(emoji);
    setUsageCount(getUsageCount());
    onSelect(emoji);
    onClose();
  };

  const emojisByCategory = ALL_EMOJIS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, EmojiItem[]>);

  const sortedCategories = [...CATEGORIES].filter(c => c !== "常用");

  return (
    <div
      ref={pickerRef}
      className="emoji-picker fixed z-50 bg-popover border border-border rounded-lg shadow-xl py-2 min-w-[320px]"
      style={{ left: position.x, top: position.y }}
    >
      <div className="flex border-b border-border px-2">
        <button
          onClick={() => {
            setSearchOpen(!searchOpen);
            if (!searchOpen) {
              setSearchQuery("");
            }
          }}
          className={`p-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors ${
            searchOpen ? "text-foreground bg-accent" : ""
          }`}
          title="搜索图标"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${searchOpen ? "rotate-90" : ""}`}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          searchOpen ? "max-h-20" : "max-h-0"
        }`}
      >
        <div className="px-3 py-2">
          <input
            ref={searchInputRef}
            type="text"
            name="emoji-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索图标..."
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="p-2 max-h-[400px] overflow-y-auto">
        {searchQuery ? (
          searchResults.length > 0 ? (
            <div className="grid grid-cols-10 gap-1">
              {searchResults.map((item) => (
                <button
                  key={item.emoji}
                  onClick={() => handleSelectEmoji(item.emoji)}
                  className={`w-8 h-8 flex items-center justify-center text-lg rounded-md transition-colors relative ${
                    currentEmoji === item.emoji
                      ? "bg-primary/20 ring-2 ring-primary"
                      : "hover:bg-accent"
                  }`}
                  title={item.name}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              没有找到匹配的图标
            </div>
          )
        ) : (
          <>
            {sortedCategories.map((category) => {
              const emojis = emojisByCategory[category];
              if (!emojis || emojis.length === 0) return null;
              return (
                <div key={category} className="mb-1">
                  <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground/70 flex items-center gap-1">
                    <span>{CATEGORY_ICONS[category]}</span>
                    <span>{category}</span>
                  </div>
                  <div className="grid grid-cols-10 gap-1 px-1">
                    {emojis.map((item) => (
                      <button
                        key={item.emoji}
                        onClick={() => handleSelectEmoji(item.emoji)}
                        className={`w-8 h-8 flex items-center justify-center text-lg rounded-md transition-colors relative ${
                          currentEmoji === item.emoji
                            ? "bg-primary/20 ring-2 ring-primary"
                            : "hover:bg-accent"
                        }`}
                        title={item.name}
                      >
                        {item.emoji}
                        {usageCount[item.emoji] && usageCount[item.emoji] > 5 && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-[8px] text-background flex items-center justify-center">
                            ★
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
