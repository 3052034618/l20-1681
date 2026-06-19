import Taro from '@tarojs/taro';
import { create } from 'zustand';
import type { Book, UrgePost, NotifyItem, UserInfo, BookStatus } from '@/types';
import { mockBooks, mockUrgePosts, mockNotifies, mockUser } from '@/data/mock';
import { getBookStatus } from '@/utils';

const STORAGE_KEY = 'zhuiGengApp';

interface PersistedState {
  books: Book[];
  urgePosts: UrgePost[];
  notifies: NotifyItem[];
  user: UserInfo;
}

const loadPersisted = (): PersistedState | null => {
  try {
    const raw = Taro.getStorageSync(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw as string) as PersistedState;
      if (parsed.books && parsed.books.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[Store] loadPersisted failed:', e);
  }
  return null;
};

const savePersisted = (state: PersistedState) => {
  try {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[Store] savePersisted failed:', e);
  }
};

const persisted = loadPersisted();
const initialBooks = persisted ? persisted.books.map((b) => ({ ...b, status: getBookStatus(b.lastChapterAt) })) : mockBooks;
const initialUrgePosts = persisted ? persisted.urgePosts : mockUrgePosts;
const initialNotifies = persisted ? persisted.notifies : mockNotifies;
const initialUser = persisted ? persisted.user : mockUser;

interface AppState {
  books: Book[];
  urgePosts: UrgePost[];
  notifies: NotifyItem[];
  user: UserInfo;
  activeStatus: BookStatus | 'all';
  addBook: (book: Book) => void;
  removeBook: (id: string) => void;
  updateBookReminder: (id: string, reminder: Book['reminder']) => void;
  toggleLikeUrge: (id: string) => void;
  addUrgePost: (post: Omit<UrgePost, 'id' | 'userId' | 'userName' | 'userAvatar' | 'likes' | 'isLiked' | 'createdAt' | 'mergedCount'>) => void;
  markNotifyRead: (id: string) => void;
  markAllNotifyRead: () => void;
  setActiveStatus: (status: BookStatus | 'all') => void;
  getFilteredBooks: () => Book[];
  refreshBookStatus: () => void;
}

const persistState = (state: { books: Book[]; urgePosts: UrgePost[]; notifies: NotifyItem[]; user: UserInfo }) => {
  savePersisted({
    books: state.books,
    urgePosts: state.urgePosts,
    notifies: state.notifies,
    user: state.user
  });
};

export const useAppStore = create<AppState>((set, get) => ({
  books: initialBooks,
  urgePosts: initialUrgePosts,
  notifies: initialNotifies,
  user: initialUser,
  activeStatus: 'all',

  addBook: (book) => {
    set((state) => {
      const newState = {
        books: [book, ...state.books],
        user: { ...state.user, subscribedCount: state.user.subscribedCount + 1 }
      };
      persistState({ ...state, ...newState });
      return newState;
    });
  },

  removeBook: (id) => {
    set((state) => {
      const newState = {
        books: state.books.filter((b) => b.id !== id),
        user: { ...state.user, subscribedCount: Math.max(0, state.user.subscribedCount - 1) }
      };
      persistState({ ...state, ...newState });
      return newState;
    });
  },

  updateBookReminder: (id, reminder) => {
    set((state) => {
      const newState = {
        books: state.books.map((b) => (b.id === id ? { ...b, reminder } : b))
      };
      persistState({ ...state, ...newState });
      return newState;
    });
  },

  toggleLikeUrge: (id) => {
    set((state) => {
      const targetPost = state.urgePosts.find((p) => p.id === id);
      const wasLiked = targetPost?.isLiked ?? false;
      const newState = {
        urgePosts: state.urgePosts.map((p) =>
          p.id === id
            ? {
                ...p,
                isLiked: !p.isLiked,
                likes: p.isLiked ? p.likes - 1 : p.likes + 1,
                mergedCount: !p.isLiked ? p.mergedCount + 1 : p.mergedCount
              }
            : p
        ),
        user: {
          ...state.user,
          likedCount: state.user.likedCount + (wasLiked ? -1 : 1)
        }
      };
      persistState({ ...state, ...newState });
      return newState;
    });
  },

  addUrgePost: (post) => {
    const state = get();
    const newPost: UrgePost = {
      ...post,
      id: `urge_${Date.now()}`,
      userId: state.user.id,
      userName: state.user.name,
      userAvatar: state.user.avatar,
      likes: 0,
      isLiked: false,
      createdAt: Date.now(),
      mergedCount: 0
    };
    set((s) => {
      const newState = {
        urgePosts: [newPost, ...s.urgePosts],
        user: { ...s.user, urgeCount: s.user.urgeCount + 1 },
        books: s.books.map((b) =>
          b.id === post.bookId ? { ...b, urgeCount: b.urgeCount + 1 } : b
        )
      };
      persistState({ ...s, ...newState });
      return newState;
    });
  },

  markNotifyRead: (id) => {
    set((state) => {
      const newState = {
        notifies: state.notifies.map((n) => (n.id === id ? { ...n, read: true } : n))
      };
      persistState({ ...state, ...newState });
      return newState;
    });
  },

  markAllNotifyRead: () => {
    set((state) => {
      const newState = {
        notifies: state.notifies.map((n) => ({ ...n, read: true }))
      };
      persistState({ ...state, ...newState });
      return newState;
    });
  },

  setActiveStatus: (status) => {
    set({ activeStatus: status });
  },

  getFilteredBooks: () => {
    const state = get();
    if (state.activeStatus === 'all') return state.books;
    return state.books.filter((b) => b.status === state.activeStatus);
  },

  refreshBookStatus: () => {
    set((state) => {
      const newState = {
        books: state.books.map((b) => ({ ...b, status: getBookStatus(b.lastChapterAt) }))
      };
      persistState({ ...state, ...newState });
      return newState;
    });
  }
}));
