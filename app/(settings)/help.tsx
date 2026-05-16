// File: app/(settings)/help.tsx

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserCircleIcon,
  ChevronRightIcon,
} from 'react-native-heroicons/outline';
import { SparklesIcon as SparklesSolid } from 'react-native-heroicons/solid';

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
}

// ─── Suggested questions ──────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  'How do I register a new business?',
  'Why is my booking not showing up?',
  'How do I update my business hours?',
  'How can I improve my response rate?',
  'What happens after I submit a bid?',
  'How do I add services to my business?',
];

// ─── Simulated AI responses ───────────────────────────────────────────────────

const AI_RESPONSES: Record<string, string> = {
  'how do i register a new business':
    'To register a new business:\n1. Go to **Account → My Business**\n2. Tap **Register a Business**\n3. Follow the 4-step wizard: fill in your business info, set your working hours, choose your service area, then review and submit.\n\nYour business will be reviewed within 24–48 hours. You\'ll get a notification once it\'s approved!',
  'why is my booking not showing up':
    'Bookings may not appear if:\n• The client hasn\'t confirmed yet (still pending)\n• The booking was cancelled\n• There is a sync issue — try pulling down to refresh on the Bookings screen.\n\nIf the issue persists, please describe what you\'re seeing and I\'ll help further.',
  'how do i update my business hours':
    'To update your working hours:\n1. Go to **Account → My Business**\n2. Tap the business → **Settings**\n3. Under **Preferences**, tap **Business Hours**\n4. Set each day to Working, Closed, or 24/7\n\nYour availability is updated instantly.',
  'how can i improve my response rate':
    'Here are a few tips to boost your response rate:\n• Enable push notifications so you never miss a request\n• Respond to bids within 1–2 hours of receiving them\n• Keep your business hours accurate\n• Write a clear, detailed business description\n\nProviders with a 90%+ response rate appear higher in search results.',
  'what happens after i submit a bid':
    'After submitting a bid:\n1. The client receives a notification and reviews your offer\n2. They may accept, negotiate, or decline\n3. If accepted, a **booking** is created and you\'ll be notified\n4. Confirm the booking to lock in the job\n\nYou can track all your bids under the **Bids** section.',
  'how do i add services to my business':
    'To add services:\n1. Go to **Account → My Business** → tap your business\n2. Tap **Services** from the business profile\n3. Tap **Add Service** and fill in the service details\n4. Save — your new service is immediately visible to clients',
};

function getAIReply(question: string): string {
  const key = question.toLowerCase().replace(/[?!.]/g, '').trim();
  for (const [pattern, response] of Object.entries(AI_RESPONSES)) {
    if (key.includes(pattern.split(' ').slice(0, 4).join(' '))) {
      return response;
    }
  }
  return "Thanks for your question! I'm here to help with anything related to your LookerService provider account — bookings, bids, business setup, and more.\n\nCould you give me a bit more detail so I can give you the most accurate answer?";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HelpScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      text: "Hi there! 👋 I'm your LookerService AI assistant.\n\nI can help you with account setup, bookings, bids, business management, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setSuggestionsVisible(false);
      setIsTyping(true);

      // Simulate AI thinking delay
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: getAIReply(trimmed),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
      }, 1200);

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    },
    [isTyping],
  );

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderBoldText = (text: string) => {
    // Split on **bold** markers and render alternating normal/bold spans
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return (
      <Text>
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <Text key={i} style={{ fontWeight: '700' }}>
              {part}
            </Text>
          ) : (
            <Text key={i}>{part}</Text>
          ),
        )}
      </Text>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient colors={['#F57C1F', '#E06A0F']} className="px-5 pt-4 pb-5">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <ArrowLeftIcon size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="w-9 h-9 bg-white/20 rounded-full items-center justify-center mr-3">
            <SparklesSolid size={20} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-base">AI Assistant</Text>
            <View className="flex-row items-center mt-0.5">
              <View className="w-2 h-2 bg-green-400 rounded-full mr-1.5" />
              <Text className="text-white/80 text-xs">Online · LookerService Support</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`mb-4 flex-row ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar — AI only */}
              {msg.role === 'assistant' && (
                <View className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <SparklesIcon size={16} color="#F57C1F" />
                </View>
              )}

              <View className={`max-w-[78%]`}>
                <View
                  className={`px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-orange-500 rounded-tr-sm'
                      : 'bg-white dark:bg-[#1E293B] rounded-tl-sm shadow-sm'
                  }`}
                >
                  <Text
                    className={`text-sm leading-5 ${
                      msg.role === 'user'
                        ? 'text-white'
                        : 'text-gray-800 dark:text-gray-100'
                    }`}
                  >
                    {msg.role === 'assistant'
                      ? renderBoldText(msg.text)
                      : msg.text}
                  </Text>
                </View>
                <Text
                  className={`text-xs text-gray-400 mt-1 ${
                    msg.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </Text>
              </View>

              {/* Avatar — user only */}
              {msg.role === 'user' && (
                <View className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center ml-2 mt-1 flex-shrink-0">
                  <UserCircleIcon size={20} color="#FFFFFF" />
                </View>
              )}
            </View>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <View className="mb-4 flex-row justify-start">
              <View className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full items-center justify-center mr-2 mt-1">
                <SparklesIcon size={16} color="#F57C1F" />
              </View>
              <View className="bg-white dark:bg-[#1E293B] px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                <View className="flex-row items-center" style={{ gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <View
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      style={{ opacity: 0.4 + i * 0.2 }}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Suggested Questions */}
          {suggestionsVisible && messages.length <= 1 && (
            <View className="mb-6">
              <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wide">
                Suggested questions
              </Text>
              {SUGGESTED_QUESTIONS.map((q) => (
                <TouchableOpacity
                  key={q}
                  onPress={() => sendMessage(q)}
                  className="flex-row items-center bg-white dark:bg-[#1E293B] rounded-xl px-4 py-3 mb-2 shadow-sm"
                  activeOpacity={0.7}
                >
                  <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">{q}</Text>
                  <ChevronRightIcon size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Spacer for input */}
          <View className="h-4" />
        </ScrollView>

        {/* Input Bar */}
        <View className="px-4 py-3 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
          <View className="flex-row items-end" style={{ gap: 10 }}>
            <View
              className="flex-1 bg-gray-100 dark:bg-[#0F172A] rounded-2xl px-4 py-3"
              style={{ minHeight: 44, maxHeight: 120 }}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ask me anything..."
                placeholderTextColor="#9CA3AF"
                multiline
                className="text-gray-900 dark:text-white text-sm"
                style={{ maxHeight: 96 }}
                onSubmitEditing={() => sendMessage(input)}
                blurOnSubmit={false}
              />
            </View>
            <TouchableOpacity
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="w-11 h-11 bg-orange-500 rounded-xl items-center justify-center"
              style={{ opacity: input.trim() && !isTyping ? 1 : 0.45 }}
              activeOpacity={0.8}
            >
              {isTyping ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <PaperAirplaneIcon size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-center text-xs text-gray-400 mt-2">
            AI responses are generated · For urgent issues contact support
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
