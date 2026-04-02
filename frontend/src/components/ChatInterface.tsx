import React, { useState, useEffect, useRef } from 'react';
import IntroModal from './IntroModal';

// ==========================================
// 1. Types & Interfaces
// ==========================================
export interface Message {
  id: string;
  role: 'user' | 'ai' | 'error';
  content: string;
  subject?: string;
}

// Renamed from ChatThreads/ChatSession to singular ChatThread for clarity
export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

type Mode = 'general' | 'email';

const DEFAULT_AI_MESSAGE: Message = {
  id: 'welcome-msg',
  role: 'ai',
  content: "Hi! I'm your English polishing assistant. Paste any text or draft an email, and I'll help you make it sound professional and native."
};

// ==========================================
// 2. Sub-Components (UI purely for display)
// ==========================================
const TypingIndicator = () => (
  <div className="flex items-start gap-4 max-w-4xl animate-fade-in">
    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-amber-900/10">
      <span className="material-symbols-outlined text-white text-lg">smart_toy</span>
    </div>
    <div className="bg-white px-4 py-4 rounded-2xl rounded-tl-none shadow-sm border border-amber-100 flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-[bounce_1.4s_infinite_0s]"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-[bounce_1.4s_infinite_0.2s]"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-[bounce_1.4s_infinite_0.4s]"></div>
    </div>
  </div>
);

const MessageBubble = ({ msg }: { msg: Message }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isAI = msg.role === 'ai';
  const isError = msg.role === 'error';

  const handleCopy = () => {
    let copyText = msg.content;
    if (msg.subject) copyText = `Subject: ${msg.subject}\n\n${copyText}`;
    navigator.clipboard.writeText(copyText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Render User Message
  if (!isAI && !isError) {
    return (
      <div className="flex items-start justify-end gap-3 sm:gap-4 max-w-4xl ml-auto animate-fade-in-up">
        <div className="relative group max-w-[92%] sm:max-w-[80%]">
          <div className="bg-slate-900 px-4 py-3 rounded-2xl rounded-tr-none shadow-sm text-white leading-relaxed whitespace-pre-wrap">
            {msg.content}
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-white text-lg">person</span>
        </div>
      </div>
    );
  }

  // Render AI or Error Message
  return (
    <div className="flex items-start gap-3 sm:gap-4 max-w-4xl animate-fade-in-up">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-lg ${isError ? 'bg-red-500 shadow-red-500/20' : 'bg-primary shadow-amber-900/10'}`}>
        <span className="material-symbols-outlined text-white text-lg">{isError ? 'error' : 'smart_toy'}</span>
      </div>
      <div className="relative group max-w-[92%] sm:max-w-[80%]">
        <div className={`px-4 py-3 rounded-2xl rounded-tl-none shadow-sm leading-relaxed border ${isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-slate-800 border-amber-100'}`}>
          {msg.subject && (
            <div className="mb-2 pb-2 border-b border-amber-100">
              <span className="font-semibold text-primary">Subject: </span>
              <span className="text-slate-700">{msg.subject}</span>
            </div>
          )}
          <div className="whitespace-pre-wrap">{msg.content}</div>
          {!isError && (
            <button onClick={handleCopy} className="absolute -top-1 -right-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-amber-50 rounded-lg text-slate-500" title="Copy to clipboard">
              <span className="material-symbols-outlined text-base">{isCopied ? 'check' : 'content_copy'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. Layout Components
// ==========================================

// --- Sidebar Component ---
const Sidebar = ({ 
  chatThreads, 
  activeThreadId, 
  onSelectThread, 
  onCreateNewThread, 
  onDeleteThread,
  isOpen,
  onClose,
  onOpenIntro
}: { 
  chatThreads: ChatThread[], 
  activeThreadId: string | null, 
  onSelectThread: (id: string) => void, 
  onCreateNewThread: () => void,
  onDeleteThread: (id: string, event: React.MouseEvent) => void,
  isOpen: boolean,
  onClose: () => void,
  onOpenIntro: () => void
}) => {
  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-label="Close sidebar"
      />
      <aside className={`fixed inset-y-0 left-0 z-50 w-[min(20rem,85vw)] bg-white/95 backdrop-blur-sm flex flex-col border-r border-amber-200/70 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-80`}>
      {/* App Title */}
      <div className="p-4 sm:p-5 border-b border-amber-200/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-primary p-1.5 rounded-lg shadow-sm shadow-amber-900/10">
            <span className="material-symbols-outlined text-white text-xl">auto_fix_high</span>
          </div>
          <h1 className="font-bold text-lg tracking-tight text-slate-900 truncate">Polisher AI</h1>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenIntro}
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-amber-200 bg-white text-slate-700 shadow-sm transition hover:bg-amber-50 hover:text-slate-900"
            aria-label="Open introduction"
          >
            <span className="material-symbols-outlined text-xl">help</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-amber-50 transition-colors"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>

      {/* New Chat Action */}
      <div className="p-4 sm:p-5">
        <button 
          onClick={onCreateNewThread}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-amber-900/10"
        >
          <span className="material-symbols-outlined text-xl">add_box</span>
          <span>New Chat</span>
        </button>
      </div>

      {/* Thread History Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 custom-scrollbar max-h-[50vh] lg:max-h-none">
        <div className="mb-4">
          <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Recent History</p>
          <div className="space-y-0.5">
            {chatThreads.map((thread) => (
              <div 
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors group ${activeThreadId === thread.id ? 'bg-amber-100 text-slate-900' : 'hover:bg-amber-50 text-slate-600 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="material-symbols-outlined text-lg shrink-0">chat_bubble</span>
                  <span className="truncate text-sm">{thread.title}</span>
                </div>
                <button 
                  onClick={(event) => onDeleteThread(thread.id, event)}
                  className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:text-red-500 transition-opacity p-1 shrink-0 text-slate-500 lg:text-slate-400"
                  aria-label="Delete thread"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile Stub (Guest Mode) */}
      <div className="p-4 sm:p-5 mt-auto border-t border-amber-200/70 bg-white/60">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-white">GU</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">Guest User</p>
            <p className="text-xs text-slate-500">Local Environment</p>
          </div>
          <span className="material-symbols-outlined text-slate-500 text-lg group-hover:text-slate-700">settings</span>
        </div>
      </div>
    </aside>
    </>
  );
};

// --- Chat Window Component ---
const ChatWindow = ({ 
  activeThread, 
  onUpdateThread 
}: { 
  activeThread: ChatThread | undefined, 
  onUpdateThread: (updatedThread: ChatThread) => void 
}) => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<Mode>('general');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom whenever the active thread's messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  // Handle empty state when no thread is selected
  if (!activeThread) {
    return <main className="flex-1 flex min-w-0 items-center justify-center bg-background-light text-slate-500">Select or start a new chat</main>;
  }

  const handleMessageSubmit = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: inputText };
    
    // Auto-generate a title from the user's first prompt if it's a new chat
    let threadTitle = activeThread.title;
    if (activeThread.title === "New Chat") {
       threadTitle = inputText.slice(0, 20) + (inputText.length > 20 ? '...' : '');
    }

    // Optimistically update the UI with the user's message
    const pendingMessages = [...activeThread.messages, userMsg];
    onUpdateThread({ ...activeThread, title: threadTitle, messages: pendingMessages, updatedAt: Date.now() });
    
    setInputText('');
    setIsLoading(true);

    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    try {
      const response = await fetch(`${baseUrl}/api/v1/polish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_text: userMsg.content,
          tone_preference: "professional", 
          mode: mode,
          ...(mode === 'email' && { recipient, subject })
        })
      });

      if (response.status === 429) throw new Error("Too Many Requests. Please slow down.");
      if (!response.ok) throw new Error("Server Error. The backend is currently unavailable.");

      const data = await response.json();
      
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: data.polished_text,
        subject: data.subject
      };

      onUpdateThread({ ...activeThread, title: threadTitle, messages: [...pendingMessages, aiMsg], updatedAt: Date.now() });
    } catch (error: any) {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: 'error',
        content: error.message || "An unexpected error occurred during communication."
      };
      onUpdateThread({ ...activeThread, title: threadTitle, messages: [...pendingMessages, errMsg], updatedAt: Date.now() });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex min-w-0 flex-col bg-background-light h-screen relative">
      <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 border-b border-amber-200/70 bg-white/70 backdrop-blur-sm z-10 shrink-0 text-slate-900">
        <div className="flex items-center gap-3 min-w-0">
          <span className="material-symbols-outlined text-slate-500">alternate_email</span>
          <h2 className="font-semibold truncate">{activeThread.title}</h2>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 space-y-6 custom-scrollbar">
        {activeThread.messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        {isLoading && <TypingIndicator />}
        <div ref={chatEndRef} />
      </section>

      <footer className="px-4 pb-4 pt-2 sm:p-6 bg-background-light shrink-0 border-t border-amber-200/70">
        <div className="max-w-4xl mx-auto w-full">
          {/* Mode Toggles */}
          <div className="flex w-full sm:w-fit flex-col sm:flex-row gap-2 sm:gap-1 mb-4 bg-white/80 p-2 rounded-2xl border border-amber-200/70 shadow-sm">
            <button onClick={() => setMode('general')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'general' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'}`}>Text Message</button>
            <button onClick={() => setMode('email')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'email' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'}`}>Email</button>
          </div>
          
          {/* Expandable Email Context Fields */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden transition-all duration-300 ease-in-out ${mode === 'email' ? 'max-h-28 mb-3 opacity-100' : 'max-h-0 mb-0 opacity-0'}`}>
            <input value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none text-slate-900 placeholder:text-slate-400 shadow-sm" placeholder="Recipient Name" type="text" />
            <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none text-slate-900 placeholder:text-slate-400 shadow-sm" placeholder="Context / Subject intent" type="text" />
          </div>

          {/* Textarea & Actions */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-md overflow-hidden focus-within:border-primary/50 transition-colors">
            <textarea 
              value={inputText} onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleMessageSubmit(); } }}
              disabled={isLoading}
              className="w-full bg-transparent border-none focus:ring-0 text-slate-900 p-4 sm:p-5 resize-none min-h-[140px] custom-scrollbar outline-none" 
              placeholder="Type or paste the text you want to polish..."
            />
            <div className="px-4 py-3 bg-amber-50/70 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white rounded-lg text-slate-500 transition-colors"><span className="material-symbols-outlined">attach_file</span></button>
              </div>
              <button onClick={handleMessageSubmit} disabled={!inputText.trim() || isLoading} className="flex w-full sm:w-auto items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-900/10">
                <span>{isLoading ? 'Polishing...' : 'Polish'}</span>
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

// ==========================================
// 4. Main Orchestrator (The Smart Component)
// ==========================================
export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(true);
  const [isHelpTriggeredIntro, setIsHelpTriggeredIntro] = useState(false);
  // 1. Lazy Initialization: Pass a callback to useState to read from localStorage synchronously.
  // This prevents race conditions and avoids unnecessary JSON parsing on subsequent renders.
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => {
    const serializedThreadsData = localStorage.getItem('polisher_chat_history');

    if (serializedThreadsData) {
      const parsedChatThreads = JSON.parse(serializedThreadsData);
      if (parsedChatThreads.length > 0) return parsedChatThreads;
    }

    // Fallback: Initialize a default chat thread if no history exists.
    return [{
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [DEFAULT_AI_MESSAGE],
      updatedAt: Date.now()
    }];
  });

  // 2. Set the initial active thread based on the successfully loaded or initialized threads.
  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    return chatThreads.length > 0 ? chatThreads[0].id : null;
  });

  // 3. Single source of truth for persistence: Overwrite localStorage whenever chatThreads state changes.
  useEffect(() => {
    localStorage.setItem('polisher_chat_history', JSON.stringify(chatThreads));
  }, [chatThreads]);

  // Show intro modal by default unless the user opted out.
  useEffect(() => {
    const hideIntroModal = localStorage.getItem('hideIntroModal');
    setIsHelpTriggeredIntro(false);
    setIsIntroModalOpen(hideIntroModal !== 'true');
  }, []);

  const handleConfirmIntroModal = (dontShowAgain: boolean) => {
    if (dontShowAgain) {
      localStorage.setItem('hideIntroModal', 'true');
    }
    setIsIntroModalOpen(false);
  };

  // Handle the creation of a brand new, empty chat thread.
  const createNewChatThread = () => {
    const newThread: ChatThread = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [DEFAULT_AI_MESSAGE],
      updatedAt: Date.now()
    };
    setChatThreads(previousThreads => [newThread, ...previousThreads]);
    setActiveThreadId(newThread.id);
  };

  // Handle appending new messages to an existing thread and bubble it to the top of the list.
  const updateActiveChatThread = (updatedThread: ChatThread) => {
    setChatThreads(previousThreads => {
      const otherThreads = previousThreads.filter(thread => thread.id !== updatedThread.id);
      return [updatedThread, ...otherThreads].sort((a, b) => b.updatedAt - a.updatedAt);
    });
  };

  // Handle the deletion of a specific thread and gracefully fall back to another thread.
  const deleteChatThread = (targetThreadId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the parent container's onClick (thread selection) from firing.
    setChatThreads(previousThreads => {
      const remainingThreads = previousThreads.filter(thread => thread.id !== targetThreadId);
      
      // If the currently active thread is deleted, auto-select the next available thread.
      if (activeThreadId === targetThreadId) {
        setActiveThreadId(remainingThreads.length > 0 ? remainingThreads[0].id : null);
      }
      
      // If the user deletes all threads, auto-generate a new one to prevent a broken blank UI.
      if (remainingThreads.length === 0) {
        const fallbackThread: ChatThread = {
          id: crypto.randomUUID(),
          title: "New Chat",
          messages: [DEFAULT_AI_MESSAGE],
          updatedAt: Date.now()
        };
        // Push the active ID update to the end of the event loop to ensure state consistency.
        setTimeout(() => setActiveThreadId(fallbackThread.id), 0);
        return [fallbackThread];
      }
      
      return remainingThreads;
    });
  };

  return (
    <div className="relative flex min-h-screen w-full font-display overflow-x-hidden bg-background-light text-slate-900 lg:pl-80">
      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-white/90 text-slate-700 shadow-lg shadow-amber-900/10 backdrop-blur-sm transition hover:bg-amber-50 hover:text-slate-900 lg:hidden"
        aria-label="Open sidebar"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
      <Sidebar 
        chatThreads={chatThreads} 
        activeThreadId={activeThreadId} 
        onSelectThread={(id) => {
          setActiveThreadId(id);
          setIsSidebarOpen(false);
        }} 
        onCreateNewThread={() => {
          createNewChatThread();
          setIsSidebarOpen(false);
        }}
        onDeleteThread={deleteChatThread}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenIntro={() => {
          setIsHelpTriggeredIntro(true);
          setIsIntroModalOpen(true);
        }}
      />
      <ChatWindow 
        activeThread={chatThreads.find(thread => thread.id === activeThreadId)} 
        onUpdateThread={updateActiveChatThread} 
      />
      <IntroModal
        isOpen={isIntroModalOpen}
        onConfirm={handleConfirmIntroModal}
        onClose={() => setIsIntroModalOpen(false)}
        showDontShowOption={!isHelpTriggeredIntro}
      />
    </div>
  );
}