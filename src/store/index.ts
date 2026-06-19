import { create } from 'zustand';
import type { Book, UrgePost, NotifyItem, UserInfo, BookStatus } from '@/types';
import { mockBooks, mockUrgePosts, mockNotifies, mockUser } from '@/data/mock';
import { getBookStatus } from '@/utils';

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

export const useAppStore = create<AppState>((set, get) => ({
  books: mockBooks,
  urgePosts: mockUrgePosts,
  notifies: mockNotifies,
  user: mockUser,
  activeStatus: 'all',

  addBook: (book) => {
    console.log('[Store] addBook:', book.title);
    set((state) => ({
      books: [book, ...state.books],
      user: { ...state.user, subscribedCount: state.user.subscribedCount + 1 }
    }));
  },

  removeBook: (id) => {
    console.log('[Store] removeBook id:', id);
    set((state) => ({
      books: state.books.filter((b) => b.id !== id),
      user: { ...state.user, subscribedCount: state.user.subscribedCount - 1 }
    }));
  },

  updateBookReminder: (id, reminder) => {
    console.log('[Store] updateBookReminder id:', id);
    set((state) => ({
      books: state.books.map((b) => (b.id === id ? { ...b, reminder } : b))
    }));
  },

  toggleLikeUrge: (id) => {
    console.log('[Store] toggleLikeUrge id:', id);
    set((state) => ({
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
        likedCount: state.user.likedCount + (state.urgePosts.find((p) => p.id === id)?.isLiked ? -1 : 1)
      }
    }));
  },

  addUrgePost: (post) => {
    console.log('[Store] addUrgePost for book:', post.bookTitle);
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
    set((s) => ({
      urgePosts: [newPost, ...s.urgePosts],
      user: { ...s.user, urgeCount: s.user.urgeCount + 1 },
      books: s.books.map((b) =>
        b.id === post.bookId ? { ...b, urgeCount: b.urgeCount + 1 } : b
      )
    }));
  },

  markNotifyRead: (id) => {
    console.log('[Store] markNotifyRead id:', id);
    set((state) => ({
      notifies: state.notifies.map((n) => (n.id === id ? { ...n, read: true } : n))
    }));
  },

  markAllNotifyRead: () => {
    console.log('[Store] markAllNotifyRead');
    set((state) => ({
      notifies: state.notifies.map((n) => ({ ...n, read: true }))
    }));
  },

  setActiveStatus: (status) => {
    console.log('[Store] setActiveStatus:', status);
    set({ activeStatus: status });
  },

  getFilteredBooks: () => {
    const state = get();
    if (state.activeStatus === 'all') return state.books;
    return state.books.filter((b) => b.status === state.activeStatus);
  },

  refreshBookStatus: () => {
    console.log('[Store] refreshBookStatus');
    set((state) => ({
      books: state.books.map((b) => ({ ...b, status: getBookStatus(b.lastChapterAt) }))
    }));
  }
}));
