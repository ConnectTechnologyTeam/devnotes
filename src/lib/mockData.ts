export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
}

// Local-only type for storing credentials in localStorage for demo auth
type StoredUser = User & { password: string };

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';
  authorId: string;
  author: User;
  categoryId: string;
  category: Category;
  tags: Tag[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  rejectNote?: string;
}

// Mock data
export const mockCategories: Category[] = [
  { id: '1', name: 'Java', slug: 'java' },
  { id: '2', name: 'Spring Framework', slug: 'spring' },
  { id: '3', name: 'Microservices', slug: 'microservices' },
  { id: '4', name: 'Architecture', slug: 'architecture' },
  { id: '5', name: 'DevOps', slug: 'devops' },
];

export const mockTags: Tag[] = [
  { id: '1', name: 'Spring Boot', slug: 'spring-boot' },
  { id: '2', name: 'JPA', slug: 'jpa' },
  { id: '3', name: 'REST API', slug: 'rest-api' },
  { id: '4', name: 'Docker', slug: 'docker' },
  { id: '5', name: 'Kubernetes', slug: 'kubernetes' },
  { id: '6', name: 'Clean Code', slug: 'clean-code' },
  { id: '7', name: 'Testing', slug: 'testing' },
  { id: '8', name: 'Security', slug: 'security' },
];

export const mockUsers: User[] = [
  { id: '1', email: 'admin@devnotes.com', name: 'Admin User', role: 'ADMIN' },
  { id: '2', email: 'john@example.com', name: 'John Developer', role: 'USER' },
  { id: '3', email: 'jane@example.com', name: 'Jane Smith', role: 'USER' },
];

export const mockArticles: Article[] = [];

// Mock authentication state with localStorage persistence
export let currentUser: User | null = null;

// Initialize currentUser from localStorage on module load
const initializeUser = () => {
  try {
    const storedUser = localStorage.getItem('devnotes_user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    localStorage.removeItem('devnotes_user');
  }
};

// Initialize user on module load
initializeUser();

export const mockAuth = {
  login: async (email: string, password: string): Promise<User> => {
    // 1) Check registered users stored locally with passwords
    try {
      const raw = localStorage.getItem('devnotes_users');
      if (raw) {
        const storedUsers: StoredUser[] = JSON.parse(raw);
        const found = storedUsers.find(u => u.email === email);
        if (found && found.password === password) {
          const user: User = { id: found.id, email: found.email, name: found.name, role: found.role, avatarUrl: found.avatarUrl };
          currentUser = user;
          localStorage.setItem('devnotes_user', JSON.stringify(user));
          return user;
        }
      }
    } catch {}

    // 2) Fallback to built-in demo accounts (use password "password")
    const demo = mockUsers.find(u => u.email === email);
    if (demo && password === 'password') {
      currentUser = demo;
      localStorage.setItem('devnotes_user', JSON.stringify(demo));
      return demo;
    }

    throw new Error('Invalid credentials');
  },
  
  register: async (email: string, password: string, name: string): Promise<User> => {
    // Disallow duplicate emails
    const existing = [...mockUsers].find(u => u.email === email);
    try {
      const raw = localStorage.getItem('devnotes_users');
      const storedUsers: StoredUser[] = raw ? JSON.parse(raw) : [];
      if (storedUsers.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }

      const newUser: StoredUser = {
        id: Date.now().toString(),
        email,
        name,
        role: 'USER',
        password,
      };
      // Persist to local storage user registry
      storedUsers.push(newUser);
      localStorage.setItem('devnotes_users', JSON.stringify(storedUsers));

      // Also add to in-memory list (without password) so article author info is consistent
      const publicUser: User = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
      mockUsers.push(publicUser);
      currentUser = publicUser;
      localStorage.setItem('devnotes_user', JSON.stringify(publicUser));
      return publicUser;
    } catch (e: any) {
      // Re-throw known error, else generic
      if (e && e.message) throw e;
      throw new Error('Registration failed');
    }
  },
  
  logout: () => {
    currentUser = null;
    // Remove from localStorage
    localStorage.removeItem('devnotes_user');
  },
  
  getCurrentUser: () => currentUser,
  
  // Check if user is logged in
  isLoggedIn: () => currentUser !== null,
  
  // Refresh user data from localStorage (useful after page reload)
  refreshUser: () => {
    initializeUser();
    return currentUser;
  },
};

// Articles are no longer persisted in localStorage. All public content comes from CMS.
const initializeArticles = () => {};
const saveArticlesToStorage = () => {};

// Mock article management
export const mockArticleService = {
  createArticle: async (): Promise<Article> => {
    throw new Error('Article creation is handled by CMS. Please use /admin to publish.');
  },

  updateArticle: async (): Promise<Article> => {
    throw new Error('Article updates are handled by CMS. Please use /admin.');
  },

  deleteArticle: async (): Promise<void> => {
    throw new Error('Article deletion is handled by CMS. Please use /admin.');
  },

  getArticleById: (id: string): Article | undefined => {
    return mockArticles.find(article => article.id === id);
  },

  getArticlesByAuthor: (authorId: string): Article[] => {
    return mockArticles.filter(article => article.authorId === authorId);
  },

  getPublishedArticles: (): Article[] => {
    return [];
  },

  getPendingArticles: (): Article[] => {
    return [];
  },

  getAllArticles: (): Article[] => {
    return [];
  },

  // Refresh articles from localStorage (useful after page reload)
  refreshArticles: () => {
    return [];
  },
};