export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl: string;
  pdfUrl?: string;
  price: number;
  isPremium: boolean;
  category: string;
  rating?: number;
  reviews?: number;
  createdAt: string;
}

export type TeachingType = 'video' | 'text_video' | 'text_photo' | 'text';

export interface Teaching {
  id: string;
  title: string;
  description: string;
  type: TeachingType;
  videoUrl?: string;
  content?: string;
  images?: string[];
  isPremium: boolean;
  category: string;
  duration?: string;
  rating?: number;
  views?: number;
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'book' | 'teaching';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  externalSaleId?: string;
  provider?: 'internal' | 'chariow';
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  isAdminReply: boolean;
  read: boolean;
  createdAt: string;
}

export interface CommunityMember {
  id: string;
  userId: string;
  user: User;
  bio?: string;
  interests: string[];
  joinedAt: string;
}

export interface CartItem {
  id: string;
  type: 'book' | 'teaching';
  item: Book | Teaching;
  quantity: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: Book | Teaching, type: 'book' | 'teaching') => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export interface AdminContextType {
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;
}
