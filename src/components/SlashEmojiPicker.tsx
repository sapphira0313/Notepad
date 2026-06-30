"use client";

import React, { useState, useEffect, useRef } from "react";

interface EmojiItem {
  emoji: string;
  name: string;
  category: string;
}

const EMOJIS: EmojiItem[] = [
  { emoji: "😀", name: "笑脸", category: "表情" },
  { emoji: "😃", name: "大笑", category: "表情" },
  { emoji: "😄", name: "眯眼笑", category: "表情" },
  { emoji: "😁", name: "露齿笑", category: "表情" },
  { emoji: "😆", name: "斜眼笑", category: "表情" },
  { emoji: "😅", name: "苦笑", category: "表情" },
  { emoji: "🤣", name: "笑哭", category: "表情" },
  { emoji: "😂", name: "喜极而泣", category: "表情" },
  { emoji: "🙂", name: "微笑", category: "表情" },
  { emoji: "😊", name: "害羞笑", category: "表情" },
  { emoji: "😇", name: "天使", category: "表情" },
  { emoji: "🥰", name: "喜爱", category: "表情" },
  { emoji: "😍", name: "花痴", category: "表情" },
  { emoji: "🤩", name: "星星眼", category: "表情" },
  { emoji: "😘", name: "飞吻", category: "表情" },
  { emoji: "😗", name: "亲亲", category: "表情" },
  { emoji: "😚", name: "害羞亲亲", category: "表情" },
  { emoji: "😙", name: "微笑亲亲", category: "表情" },
  { emoji: "🥲", name: "含泪笑", category: "表情" },
  { emoji: "😋", name: "馋嘴", category: "表情" },
  { emoji: "😛", name: "吐舌", category: "表情" },
  { emoji: "😜", name: "眨眼吐舌", category: "表情" },
  { emoji: "🤪", name: "搞笑", category: "表情" },
  { emoji: "😝", name: "眯眼吐舌", category: "表情" },
  { emoji: "🤑", name: "发财", category: "表情" },
  { emoji: "🤗", name: "拥抱", category: "表情" },
  { emoji: "🤭", name: "捂嘴笑", category: "表情" },
  { emoji: "🤫", name: "嘘", category: "表情" },
  { emoji: "🤔", name: "思考", category: "表情" },
  { emoji: "🤐", name: "闭嘴", category: "表情" },
  { emoji: "🤨", name: "怀疑", category: "表情" },
  { emoji: "😐", name: "面无表情", category: "表情" },
  { emoji: "😑", name: "无语", category: "表情" },
  { emoji: "😶", name: "沉默", category: "表情" },
  { emoji: "😏", name: "得意", category: "表情" },
  { emoji: "😒", name: "不爽", category: "表情" },
  { emoji: "🙄", name: "翻白眼", category: "表情" },
  { emoji: "😬", name: "尴尬", category: "表情" },
  { emoji: "😮‍💨", name: "叹气", category: "表情" },
  { emoji: "🤥", name: "说谎", category: "表情" },
  { emoji: "😌", name: "释然", category: "表情" },
  { emoji: "😔", name: "沮丧", category: "表情" },
  { emoji: "😪", name: "困倦", category: "表情" },
  { emoji: "🤤", name: "流口水", category: "表情" },
  { emoji: "😴", name: "睡觉", category: "表情" },
  { emoji: "😷", name: "口罩", category: "表情" },
  { emoji: "🤒", name: "发烧", category: "表情" },
  { emoji: "🤕", name: "头疼", category: "表情" },
  { emoji: "🤢", name: "恶心", category: "表情" },
  { emoji: "🤮", name: "呕吐", category: "表情" },
  { emoji: "🥵", name: "热", category: "表情" },
  { emoji: "🥶", name: "冷", category: "表情" },
  { emoji: "🥴", name: "醉了", category: "表情" },
  { emoji: "😵", name: "晕", category: "表情" },
  { emoji: "😵‍💫", name: "眩晕", category: "表情" },
  { emoji: "🤯", name: "爆炸头", category: "表情" },
  { emoji: "🤠", name: "牛仔", category: "表情" },
  { emoji: "🥳", name: "派对", category: "表情" },
  { emoji: "🥸", name: "伪装", category: "表情" },
  { emoji: "😎", name: "酷", category: "表情" },
  { emoji: "🤓", name: "书呆子", category: "表情" },
  { emoji: "🧐", name: "单片眼镜", category: "表情" },
  { emoji: "😕", name: "困惑", category: "表情" },
  { emoji: "😟", name: "担心", category: "表情" },
  { emoji: "🙁", name: "不开心", category: "表情" },
  { emoji: "☹️", name: "悲伤", category: "表情" },
  { emoji: "😮", name: "惊讶", category: "表情" },
  { emoji: "😯", name: "沉默惊讶", category: "表情" },
  { emoji: "😲", name: "震惊", category: "表情" },
  { emoji: "😳", name: "脸红", category: "表情" },
  { emoji: "🥺", name: "恳求", category: "表情" },
  { emoji: "😦", name: "皱眉", category: "表情" },
  { emoji: "😧", name: "苦恼", category: "表情" },
  { emoji: "😨", name: "害怕", category: "表情" },
  { emoji: "😰", name: "焦虑", category: "表情" },
  { emoji: "😥", name: "失望", category: "表情" },
  { emoji: "😢", name: "哭泣", category: "表情" },
  { emoji: "😭", name: "大哭", category: "表情" },
  { emoji: "😱", name: "尖叫", category: "表情" },
  { emoji: "😖", name: "困扰", category: "表情" },
  { emoji: "😣", name: "坚持", category: "表情" },
  { emoji: "😞", name: "失望", category: "表情" },
  { emoji: "😓", name: "冷汗", category: "表情" },
  { emoji: "😩", name: "疲惫", category: "表情" },
  { emoji: "😫", name: "累", category: "表情" },
  { emoji: "🥱", name: "打哈欠", category: "表情" },
  { emoji: "😤", name: "生气", category: "表情" },
  { emoji: "😡", name: "愤怒", category: "表情" },
  { emoji: "😠", name: "不满", category: "表情" },
  { emoji: "🤬", name: "骂人", category: "表情" },
  { emoji: "😈", name: "小恶魔", category: "表情" },
  { emoji: "👿", name: "恶魔", category: "表情" },
  { emoji: "💀", name: "骷髅", category: "表情" },
  { emoji: "☠️", name: "骷髅头", category: "表情" },
  { emoji: "💩", name: "便便", category: "表情" },
  { emoji: "🤡", name: "小丑", category: "表情" },
  { emoji: "👹", name: "妖怪", category: "表情" },
  { emoji: "👺", name: "天狗", category: "表情" },
  { emoji: "👻", name: "幽灵", category: "表情" },
  { emoji: "👽", name: "外星人", category: "表情" },
  { emoji: "👾", name: "外星怪物", category: "表情" },
  { emoji: "🤖", name: "机器人", category: "表情" },
  { emoji: "❤️", name: "爱心", category: "表情" },
  { emoji: "🧡", name: "橙色心", category: "表情" },
  { emoji: "💛", name: "黄色心", category: "表情" },
  { emoji: "💚", name: "绿色心", category: "表情" },
  { emoji: "💙", name: "蓝色心", category: "表情" },
  { emoji: "💜", name: "紫色心", category: "表情" },
  { emoji: "🖤", name: "黑色心", category: "表情" },
  { emoji: "🤍", name: "白色心", category: "表情" },
  { emoji: "🤎", name: "棕色心", category: "表情" },
  { emoji: "💔", name: "心碎", category: "表情" },
  { emoji: "❣️", name: "心叹号", category: "表情" },
  { emoji: "💕", name: "两颗心", category: "表情" },
  { emoji: "💞", name: "旋转心", category: "表情" },
  { emoji: "💓", name: "跳动心", category: "表情" },
  { emoji: "💗", name: "成长心", category: "表情" },
  { emoji: "💖", name: "闪亮心", category: "表情" },
  { emoji: "💘", name: "丘比特", category: "表情" },
  { emoji: "💝", name: "礼物心", category: "表情" },
  { emoji: "💟", name: "心装饰", category: "表情" },
  { emoji: "⭐", name: "星星", category: "表情" },
  { emoji: "🌟", name: "闪亮星", category: "表情" },
  { emoji: "✨", name: "闪烁", category: "表情" },
  { emoji: "💫", name: "眩晕", category: "表情" },
  { emoji: "🔥", name: "火焰", category: "表情" },
  { emoji: "💥", name: "爆炸", category: "表情" },
  { emoji: "🚀", name: "火箭", category: "表情" },
  { emoji: "🎉", name: "庆祝", category: "表情" },
  { emoji: "🎊", name: "彩带", category: "表情" },
  { emoji: "👏", name: "鼓掌", category: "表情" },
  { emoji: "🙌", name: "举手", category: "表情" },
  { emoji: "🙏", name: "祈祷", category: "表情" },
  { emoji: "🤝", name: "握手", category: "表情" },
  { emoji: "💪", name: "加油", category: "表情" },
  { emoji: "👊", name: "拳头", category: "表情" },
  { emoji: "✊", name: "紧握", category: "表情" },
  { emoji: "🎯", name: "目标", category: "表情" },
  { emoji: "💎", name: "钻石", category: "表情" },

  { emoji: "📄", name: "文档", category: "文档" },
  { emoji: "📝", name: "笔记", category: "文档" },
  { emoji: "📋", name: "清单", category: "文档" },
  { emoji: "📌", name: "书签", category: "文档" },
  { emoji: "📑", name: "目录", category: "文档" },
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
  { emoji: "📖", name: "阅读", category: "文档" },
  { emoji: "📜", name: "卷轴", category: "文档" },
  { emoji: "✍️", name: "写字", category: "文档" },
  { emoji: "💻", name: "电脑", category: "文档" },
  { emoji: "🖥️", name: "显示器", category: "文档" },
  { emoji: "📊", name: "图表", category: "文档" },
  { emoji: "📈", name: "上涨", category: "文档" },
  { emoji: "📉", name: "下跌", category: "文档" },
  { emoji: "🗂️", name: "文件夹整理", category: "文档" },
  { emoji: "🗃️", name: "档案柜", category: "文档" },
  { emoji: "📰", name: "报纸", category: "文档" },
  { emoji: "🔖", name: "标签", category: "文档" },
  { emoji: "🏷️", name: "价格标签", category: "文档" },
  { emoji: "📍", name: "位置", category: "文档" },

  { emoji: "📅", name: "日历", category: "时间" },
  { emoji: "📆", name: "日程", category: "时间" },
  { emoji: "⏰", name: "闹钟", category: "时间" },
  { emoji: "⏱️", name: "秒表", category: "时间" },
  { emoji: "⏲️", name: "计时器", category: "时间" },
  { emoji: "⏳", name: "沙漏", category: "时间" },
  { emoji: "⌛", name: "沙漏完成", category: "时间" },
  { emoji: "🕐", name: "一点", category: "时间" },
  { emoji: "🕑", name: "两点", category: "时间" },
  { emoji: "🕒", name: "三点", category: "时间" },
  { emoji: "🕓", name: "四点", category: "时间" },
  { emoji: "🕔", name: "五点", category: "时间" },
  { emoji: "🕕", name: "六点", category: "时间" },
  { emoji: "🕖", name: "七点", category: "时间" },
  { emoji: "🕗", name: "八点", category: "时间" },
  { emoji: "🕘", name: "九点", category: "时间" },
  { emoji: "🕙", name: "十点", category: "时间" },
  { emoji: "🕚", name: "十一点", category: "时间" },
  { emoji: "🕛", name: "十二点", category: "时间" },
  { emoji: "🌑", name: "新月", category: "时间" },
  { emoji: "🌒", name: "蛾眉月", category: "时间" },
  { emoji: "🌓", name: "上弦月", category: "时间" },
  { emoji: "🌔", name: "盈凸月", category: "时间" },
  { emoji: "🌕", name: "满月", category: "时间" },
  { emoji: "🌖", name: "亏凸月", category: "时间" },
  { emoji: "🌗", name: "下弦月", category: "时间" },
  { emoji: "🌘", name: "残月", category: "时间" },
  { emoji: "☀️", name: "太阳", category: "时间" },
  { emoji: "🌙", name: "月亮", category: "时间" },
  { emoji: "🌈", name: "彩虹", category: "时间" },
  { emoji: "🌤️", name: "晴", category: "时间" },
  { emoji: "⛅", name: "多云", category: "时间" },
  { emoji: "🌥️", name: "阴", category: "时间" },
  { emoji: "☁️", name: "云", category: "时间" },
  { emoji: "🌧️", name: "下雨", category: "时间" },
  { emoji: "⛈️", name: "雷雨", category: "时间" },
  { emoji: "🌩️", name: "闪电", category: "时间" },
  { emoji: "❄️", name: "雪花", category: "时间" },
  { emoji: "⛄", name: "雪人", category: "时间" },
  { emoji: "🌀", name: "龙卷风", category: "时间" },
  { emoji: "🌪️", name: "旋风", category: "时间" },
  { emoji: "🌫️", name: "雾", category: "时间" },
  { emoji: "🌬️", name: "风", category: "时间" },

  { emoji: "📊", name: "图表", category: "数据" },
  { emoji: "📈", name: "上涨", category: "数据" },
  { emoji: "📉", name: "下跌", category: "数据" },
  { emoji: "🧮", name: "算盘", category: "数据" },
  { emoji: "💰", name: "钱袋", category: "数据" },
  { emoji: "💴", name: "日元", category: "数据" },
  { emoji: "💵", name: "美元", category: "数据" },
  { emoji: "💶", name: "欧元", category: "数据" },
  { emoji: "💷", name: "英镑", category: "数据" },
  { emoji: "🪙", name: "硬币", category: "数据" },
  { emoji: "🔢", name: "数字键盘", category: "数据" },
  { emoji: "🔤", name: "ABC", category: "数据" },
  { emoji: "🔡", name: "大写", category: "数据" },
  { emoji: "🔠", name: "大写字母", category: "数据" },
  { emoji: "Ⓜ️", name: "M", category: "数据" },
  { emoji: "ℹ️", name: "信息", category: "数据" },

  { emoji: "👤", name: "用户", category: "人物" },
  { emoji: "👥", name: "多人", category: "人物" },
  { emoji: "👨", name: "男人", category: "人物" },
  { emoji: "👩", name: "女人", category: "人物" },
  { emoji: "👴", name: "老人", category: "人物" },
  { emoji: "👵", name: "老奶奶", category: "人物" },
  { emoji: "🧑", name: "成人", category: "人物" },
  { emoji: "👨‍💼", name: "白领", category: "人物" },
  { emoji: "👩‍💼", name: "女白领", category: "人物" },
  { emoji: "👨‍💻", name: "程序员", category: "人物" },
  { emoji: "👩‍💻", name: "女程序员", category: "人物" },
  { emoji: "👨‍🎨", name: "艺术家", category: "人物" },
  { emoji: "👩‍🎨", name: "女艺术家", category: "人物" },
  { emoji: "👨‍🔬", name: "科学家", category: "人物" },
  { emoji: "👩‍🔬", name: "女科学家", category: "人物" },
  { emoji: "👨‍⚕️", name: "医生", category: "人物" },
  { emoji: "👩‍⚕️", name: "女医生", category: "人物" },
  { emoji: "👨‍🎓", name: "男学生", category: "人物" },
  { emoji: "👩‍🎓", name: "女学生", category: "人物" },
  { emoji: "👨‍🏫", name: "男教师", category: "人物" },
  { emoji: "👩‍🏫", name: "女教师", category: "人物" },
  { emoji: "👮", name: "警察", category: "人物" },
  { emoji: "👮‍♀️", name: "女警察", category: "人物" },
  { emoji: "🕵️", name: "侦探", category: "人物" },
  { emoji: "🕵️‍♀️", name: "女侦探", category: "人物" },
  { emoji: "🤴", name: "王子", category: "人物" },
  { emoji: "👸", name: "公主", category: "人物" },
  { emoji: "🧔", name: "胡子", category: "人物" },

  { emoji: "💬", name: "评论", category: "社交" },
  { emoji: "💭", name: "思考", category: "社交" },
  { emoji: "🗨️", name: "对话", category: "社交" },
  { emoji: "📢", name: "喇叭", category: "社交" },
  { emoji: "📣", name: "喊话", category: "社交" },
  { emoji: "📧", name: "邮件", category: "社交" },
  { emoji: "✉️", name: "信封", category: "社交" },
  { emoji: "📨", name: "来信", category: "社交" },
  { emoji: "📤", name: "发信", category: "社交" },
  { emoji: "📥", name: "接收", category: "社交" },
  { emoji: "📦", name: "包裹", category: "社交" },
  { emoji: "💾", name: "保存", category: "社交" },
  { emoji: "🔔", name: "通知", category: "社交" },
  { emoji: "🔕", name: "静音", category: "社交" },
  { emoji: "🔊", name: "大声", category: "社交" },
  { emoji: "🔉", name: "中等", category: "社交" },
  { emoji: "🔈", name: "小声", category: "社交" },
  { emoji: "📳", name: "振动", category: "社交" },
  { emoji: "📴", name: "关闭", category: "社交" },
  { emoji: "📞", name: "电话", category: "社交" },
  { emoji: "📟", name: "寻呼机", category: "社交" },
  { emoji: "📠", name: "传真", category: "社交" },
  { emoji: "📡", name: "卫星", category: "社交" },
  { emoji: "📺", name: "电视", category: "社交" },
  { emoji: "📻", name: "收音机", category: "社交" },

  { emoji: "🔍", name: "搜索", category: "工具" },
  { emoji: "🔎", name: "放大镜", category: "工具" },
  { emoji: "🔗", name: "链接", category: "工具" },
  { emoji: "🛠️", name: "工具", category: "工具" },
  { emoji: "⚙️", name: "设置", category: "工具" },
  { emoji: "🔧", name: "扳手", category: "工具" },
  { emoji: "🔨", name: "锤子", category: "工具" },
  { emoji: "🪛", name: "螺丝刀", category: "工具" },
  { emoji: "🔩", name: "螺栓", category: "工具" },
  { emoji: "⛏️", name: "镐", category: "工具" },
  { emoji: "🛡️", name: "盾牌", category: "工具" },
  { emoji: "⚔️", name: "剑", category: "工具" },
  { emoji: "🗡️", name: "匕首", category: "工具" },
  { emoji: "🏹", name: "弓箭", category: "工具" },
  { emoji: "🎯", name: "目标", category: "工具" },
  { emoji: "🎮", name: "游戏机", category: "工具" },
  { emoji: "🎲", name: "骰子", category: "工具" },
  { emoji: "🧩", name: "拼图", category: "工具" },

  { emoji: "🔒", name: "锁定", category: "安全" },
  { emoji: "🔓", name: "解锁", category: "安全" },
  { emoji: "🔏", name: "签署", category: "安全" },
  { emoji: "🔐", name: "密码", category: "安全" },
  { emoji: "🔑", name: "钥匙", category: "安全" },
  { emoji: "⚠️", name: "警告", category: "安全" },
  { emoji: "🚫", name: "禁止", category: "安全" },
  { emoji: "⛔", name: "禁止标志", category: "安全" },
  { emoji: "📵", name: "禁止手机", category: "安全" },
  { emoji: "🔞", name: "成人内容", category: "安全" },
  { emoji: "☢️", name: "放射性", category: "安全" },
  { emoji: "☣️", name: "生物危害", category: "安全" },

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
  { emoji: "🔺", name: "向上三角", category: "状态" },
  { emoji: "🔻", name: "向下三角", category: "状态" },
  { emoji: "◀️", name: "向左", category: "状态" },
  { emoji: "▶️", name: "向右", category: "状态" },
  { emoji: "↗️", name: "右上", category: "状态" },
  { emoji: "↘️", name: "右下", category: "状态" },
  { emoji: "↙️", name: "左下", category: "状态" },
  { emoji: "↖️", name: "左上", category: "状态" },
  { emoji: "↕️", name: "上下", category: "状态" },
  { emoji: "↔️", name: "左右", category: "状态" },
  { emoji: "🔀", name: "随机", category: "状态" },
  { emoji: "🔁", name: "重复", category: "状态" },
  { emoji: "🔄", name: "刷新", category: "状态" },

  { emoji: "🎨", name: "调色板", category: "创意" },
  { emoji: "🎭", name: "面具", category: "创意" },
  { emoji: "🎪", name: "帐篷", category: "创意" },
  { emoji: "✨", name: "闪烁", category: "创意" },
  { emoji: "💫", name: "眩晕", category: "创意" },
  { emoji: "🌟", name: "星星", category: "创意" },
  { emoji: "🎬", name: "电影", category: "创意" },
  { emoji: "🎤", name: "麦克风", category: "创意" },
  { emoji: "🎧", name: "耳机", category: "创意" },
  { emoji: "🎼", name: "乐谱", category: "创意" },
  { emoji: "🎹", name: "钢琴", category: "创意" },
  { emoji: "🎸", name: "吉他", category: "创意" },
  { emoji: "🎺", name: "小号", category: "创意" },
  { emoji: "🎷", name: "萨克斯", category: "创意" },
  { emoji: "🥁", name: "鼓", category: "创意" },
  { emoji: "🎻", name: "小提琴", category: "创意" },
  { emoji: "🎵", name: "音符", category: "创意" },
  { emoji: "🎶", name: "音乐", category: "创意" },

  { emoji: "💻", name: "电脑", category: "设备" },
  { emoji: "🖥️", name: "显示器", category: "设备" },
  { emoji: "📱", name: "手机", category: "设备" },
  { emoji: "⌨️", name: "键盘", category: "设备" },
  { emoji: "🖱️", name: "鼠标", category: "设备" },
  { emoji: "🖨️", name: "打印机", category: "设备" },
  { emoji: "📷", name: "相机", category: "设备" },
  { emoji: "🎥", name: "摄像机", category: "设备" },
  { emoji: "📺", name: "电视", category: "设备" },
  { emoji: "🎮", name: "游戏机", category: "设备" },
  { emoji: "🔌", name: "插头", category: "设备" },
  { emoji: "💡", name: "灯泡", category: "设备" },
  { emoji: "🔦", name: "手电筒", category: "设备" },
  { emoji: "🕯️", name: "蜡烛", category: "设备" },

  { emoji: "🏠", name: "房子", category: "生活" },
  { emoji: "🏡", name: "别墅", category: "生活" },
  { emoji: "🚗", name: "汽车", category: "生活" },
  { emoji: "✈️", name: "飞机", category: "生活" },
  { emoji: "⛵", name: "帆船", category: "生活" },
  { emoji: "🚲", name: "自行车", category: "生活" },
  { emoji: "🍎", name: "苹果", category: "生活" },
  { emoji: "🍊", name: "橙子", category: "生活" },
  { emoji: "🍋", name: "柠檬", category: "生活" },
  { emoji: "🍌", name: "香蕉", category: "生活" },
  { emoji: "🍉", name: "西瓜", category: "生活" },
  { emoji: "🍇", name: "葡萄", category: "生活" },
  { emoji: "🍓", name: "草莓", category: "生活" },
  { emoji: "🍑", name: "桃子", category: "生活" },
  { emoji: "🍒", name: "樱桃", category: "生活" },
  { emoji: "🥝", name: "猕猴桃", category: "生活" },
  { emoji: "🍅", name: "番茄", category: "生活" },
  { emoji: "🥑", name: "牛油果", category: "生活" },
  { emoji: "🌽", name: "玉米", category: "生活" },
  { emoji: "🥕", name: "胡萝卜", category: "生活" },
  { emoji: "🥦", name: "西兰花", category: "生活" },
  { emoji: "🍔", name: "汉堡", category: "生活" },
  { emoji: "🍟", name: "薯条", category: "生活" },
  { emoji: "🍕", name: "比萨", category: "生活" },
  { emoji: "🌭", name: "热狗", category: "生活" },
  { emoji: "🍿", name: "爆米花", category: "生活" },
  { emoji: "🍦", name: "冰淇淋", category: "生活" },
  { emoji: "🍰", name: "蛋糕", category: "生活" },
  { emoji: "🎂", name: "生日蛋糕", category: "生活" },
  { emoji: "🍩", name: "甜甜圈", category: "生活" },
  { emoji: "🍪", name: "饼干", category: "生活" },
  { emoji: "☕", name: "咖啡", category: "生活" },
  { emoji: "🍵", name: "茶", category: "生活" },
  { emoji: "🍺", name: "啤酒", category: "生活" },
  { emoji: "🍷", name: "红酒", category: "生活" },
  { emoji: "🥤", name: "饮料", category: "生活" },
  { emoji: "🌸", name: "樱花", category: "生活" },
  { emoji: "🌺", name: "芙蓉", category: "生活" },
  { emoji: "🌻", name: "向日葵", category: "生活" },
  { emoji: "🌹", name: "玫瑰", category: "生活" },
  { emoji: "🌷", name: "郁金香", category: "生活" },
  { emoji: "🌳", name: "树", category: "生活" },
  { emoji: "🏢", name: "办公楼", category: "生活" },
  { emoji: "🏬", name: "商店", category: "生活" },
  { emoji: "🏭", name: "工厂", category: "生活" },
  { emoji: "🏥", name: "医院", category: "生活" },
  { emoji: "🏦", name: "银行", category: "生活" },
  { emoji: "🏫", name: "学校", category: "生活" },
  { emoji: "🏯", name: "城堡", category: "生活" },
  { emoji: "🏰", name: "宫殿", category: "生活" },
  { emoji: "💒", name: "教堂", category: "生活" },
  { emoji: "🕌", name: "清真寺", category: "生活" },

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
  { emoji: "🐔", name: "鸡", category: "动物" },
  { emoji: "🐧", name: "企鹅", category: "动物" },
  { emoji: "🐦", name: "鸟", category: "动物" },
  { emoji: "🦆", name: "鸭子", category: "动物" },
  { emoji: "🦅", name: "鹰", category: "动物" },
  { emoji: "🦉", name: "猫头鹰", category: "动物" },
  { emoji: "🐝", name: "蜜蜂", category: "动物" },
  { emoji: "🦋", name: "蝴蝶", category: "动物" },
  { emoji: "🐌", name: "蜗牛", category: "动物" },
  { emoji: "🐛", name: "毛毛虫", category: "动物" },
  { emoji: "🐢", name: "乌龟", category: "动物" },
  { emoji: "🐍", name: "蛇", category: "动物" },
  { emoji: "🦎", name: "蜥蜴", category: "动物" },
  { emoji: "🦖", name: "恐龙", category: "动物" },
  { emoji: "🦕", name: "长颈龙", category: "动物" },
  { emoji: "🐙", name: "章鱼", category: "动物" },
  { emoji: "🦑", name: "乌贼", category: "动物" },
  { emoji: "🦐", name: "虾", category: "动物" },
  { emoji: "🦞", name: "龙虾", category: "动物" },
  { emoji: "🦀", name: "螃蟹", category: "动物" },
  { emoji: "🐟", name: "鱼", category: "动物" },
  { emoji: "🐬", name: "海豚", category: "动物" },
  { emoji: "🦈", name: "鲨鱼", category: "动物" },
  { emoji: "🐳", name: "鲸鱼", category: "动物" },
  { emoji: "🐋", name: "鲸鱼喷水", category: "动物" },
  { emoji: "🦔", name: "刺猬", category: "动物" },
  { emoji: "🦇", name: "蝙蝠", category: "动物" },
  { emoji: "🐗", name: "野猪", category: "动物" },
  { emoji: "🐺", name: "狼", category: "动物" },
  { emoji: "🦒", name: "长颈鹿", category: "动物" },
  { emoji: "🦘", name: "袋鼠", category: "动物" },
  { emoji: "🦥", name: "树懒", category: "动物" },
  { emoji: "🐉", name: "龙", category: "动物" },
  { emoji: "🦄", name: "独角兽", category: "动物" },
  { emoji: "🐴", name: "马", category: "动物" },

  { emoji: "🎬", name: "电影", category: "娱乐" },
  { emoji: "🎲", name: "骰子", category: "娱乐" },
  { emoji: "🎳", name: "保龄球", category: "娱乐" },
  { emoji: "🎰", name: "老虎机", category: "娱乐" },
  { emoji: "🎮", name: "游戏", category: "娱乐" },
  { emoji: "🎯", name: "靶子", category: "娱乐" },
  { emoji: "🎸", name: "吉他", category: "娱乐" },
  { emoji: "🎹", name: "电子琴", category: "娱乐" },
  { emoji: "🎺", name: "小号", category: "娱乐" },
  { emoji: "🎷", name: "萨克斯", category: "娱乐" },
  { emoji: "🥁", name: "鼓", category: "娱乐" },
  { emoji: "🎻", name: "小提琴", category: "娱乐" },
  { emoji: "🎤", name: "麦克风", category: "娱乐" },
  { emoji: "🎧", name: "耳机", category: "娱乐" },
  { emoji: "🎼", name: "乐谱", category: "娱乐" },
  { emoji: "🎵", name: "音符", category: "娱乐" },
  { emoji: "🎶", name: "音乐符号", category: "娱乐" },
];

const CATEGORIES = ["表情", "文档", "时间", "数据", "人物", "社交", "工具", "安全", "状态", "创意", "设备", "生活", "动物", "娱乐"];

interface SlashEmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function SlashEmojiPicker({ onSelect, onClose }: SlashEmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim()
    ? EMOJIS.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.emoji.includes(searchQuery)
      )
    : [];

  const emojisByCategory = EMOJIS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, EmojiItem[]>);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={pickerRef}
      className="fixed z-50 bg-popover border border-border rounded-xl shadow-2xl min-w-[360px] max-h-[550px] overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="border-b border-border px-3 py-2">
        <div className="relative">
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索表情..."
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="p-3 max-h-[460px] overflow-y-auto">
        {searchQuery ? (
          searchResults.length > 0 ? (
            <div className="grid grid-cols-9 gap-1">
              {searchResults.map((item) => (
                <button
                  key={item.emoji}
                  onClick={() => {
                    onSelect(item.emoji);
                    onClose();
                  }}
                  className="w-8 h-8 flex items-center justify-center text-lg rounded-md hover:bg-accent transition-colors"
                  title={item.name}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              没有找到匹配的表情
            </div>
          )
        ) : (
          <div className="space-y-3">
            {CATEGORIES.map((category) => (
              <div key={category}>
                <div className="text-xs text-muted-foreground font-medium px-1 py-0.5">
                  {category}
                </div>
                <div className="grid grid-cols-9 gap-1 mt-1">
                  {emojisByCategory[category]?.map((item) => (
                    <button
                      key={item.emoji}
                      onClick={() => {
                        onSelect(item.emoji);
                        onClose();
                      }}
                      className="w-8 h-8 flex items-center justify-center text-lg rounded-md hover:bg-accent transition-colors"
                      title={item.name}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}