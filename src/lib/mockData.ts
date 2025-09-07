export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
}

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
  { id: '1', email: 'admin@devnotes.com', name: 'Admin User', role: 'ADMIN', avatarUrl: '/uploads/admin-avatar.png' },
  { id: '2', email: 'john@example.com', name: 'John Developer', role: 'USER', avatarUrl: '/uploads/john-avatar.png' },
  { id: '3', email: 'jane@example.com', name: 'Jane Smith', role: 'USER', avatarUrl: '/uploads/jane-avatar.png' },
];

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Building Microservices with Spring Boot',
    summary: 'Learn how to design and implement scalable microservices using Spring Boot, including best practices for service communication and data management.',
    content: `# Building Microservices with Spring Boot

Microservices architecture has become increasingly popular for building scalable and maintainable applications. Spring Boot provides excellent tools and frameworks to create robust microservices.

## Getting Started

To create a microservice with Spring Boot:

\`\`\`java
@SpringBootApplication
@RestController
public class UserServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
    
    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}
\`\`\`

## Key Considerations

1. **Service Discovery**: Use Eureka or Consul
2. **Configuration Management**: Externalize configuration
3. **Circuit Breaker**: Implement resilience patterns
4. **Monitoring**: Add comprehensive logging and metrics

The journey to microservices requires careful planning and consideration of the trade-offs involved.`,
    status: 'PUBLISHED',
    authorId: '2',
    author: mockUsers[1],
    categoryId: '3',
    category: mockCategories[2],
    tags: [mockTags[0], mockTags[2]],
    publishedAt: '2024-01-15',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Spring Security Best Practices',
    summary: 'A comprehensive guide to implementing security in Spring applications, covering authentication, authorization, and common security vulnerabilities.',
    content: `# Spring Security Best Practices

Security is paramount in any application. Spring Security provides a powerful framework for securing your applications.

## Authentication Setup

\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login();
        return http.build();
    }
}
\`\`\`

Remember to always validate input and use HTTPS in production.`,
    status: 'PUBLISHED',
    authorId: '3',
    author: mockUsers[2],
    categoryId: '1',
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[7]],
    publishedAt: '2024-01-12',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
  },
  {
    id: '3',
    title: 'Advanced JPA Techniques',
    summary: 'Deep dive into advanced JPA features including custom queries, performance optimization, and handling complex relationships.',
    content: `# Advanced JPA Techniques

JPA is more than just basic CRUD operations. Let's explore advanced features for complex scenarios.

## Custom Queries

\`\`\`java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u WHERE u.active = true AND u.lastLogin > :since")
    List<User> findActiveUsersSince(@Param("since") LocalDateTime since);
    
    @Modifying
    @Query("UPDATE User u SET u.lastLogin = :now WHERE u.id = :id")
    void updateLastLogin(@Param("id") Long id, @Param("now") LocalDateTime now);
}
\`\`\`

Performance is key when working with JPA at scale.`,
    status: 'PENDING',
    authorId: '2',
    author: mockUsers[1],
    categoryId: '1',
    category: mockCategories[0],
    tags: [mockTags[1], mockTags[0]],
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
  },
  {
    id: '4',
    title: 'Docker for Java Developers',
    summary: 'Learn how to containerize Java applications using Docker, including multi-stage builds and optimization techniques.',
    content: `# Docker for Java Developers

Containerization has revolutionized application deployment. Here's how to leverage Docker effectively for Java applications.

## Basic Dockerfile

\`\`\`dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app
COPY target/app.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

## Multi-stage Build

For production applications, use multi-stage builds to reduce image size.`,
    status: 'DRAFT',
    authorId: '2',
    author: mockUsers[1],
    categoryId: '5',
    category: mockCategories[4],
    tags: [mockTags[3], mockTags[0]],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
];

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
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      currentUser = user;
      // Save to localStorage
      localStorage.setItem('devnotes_user', JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid credentials');
  },
  
  register: async (email: string, password: string, name: string): Promise<User> => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'USER'
    };
    mockUsers.push(newUser);
    currentUser = newUser;
    // Save to localStorage
    localStorage.setItem('devnotes_user', JSON.stringify(newUser));
    return newUser;
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

// Initialize articles from localStorage
const initializeArticles = () => {
  try {
    const storedArticles = localStorage.getItem('devnotes_articles');
    if (storedArticles) {
      const parsedArticles = JSON.parse(storedArticles);
      // Merge with existing mock articles (keep original ones, add new ones)
      const existingIds = new Set(mockArticles.map(a => a.id));
      const newArticles = parsedArticles.filter((a: Article) => !existingIds.has(a.id));
      mockArticles.push(...newArticles);
    }
  } catch (error) {
    console.error('Error loading articles from localStorage:', error);
    localStorage.removeItem('devnotes_articles');
  }
};

// Initialize articles on module load
initializeArticles();

// Save articles to localStorage
const saveArticlesToStorage = () => {
  try {
    localStorage.setItem('devnotes_articles', JSON.stringify(mockArticles));
  } catch (error) {
    console.error('Error saving articles to localStorage:', error);
  }
};

// Mock article management
export const mockArticleService = {
  createArticle: async (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'author'>): Promise<Article> => {
    const user = mockAuth.getCurrentUser();
    if (!user) {
      throw new Error('User must be logged in to create articles');
    }

    const newArticle: Article = {
      id: Date.now().toString(),
      ...articleData,
      author: user,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    mockArticles.push(newArticle);
    saveArticlesToStorage();
    return newArticle;
  },

  updateArticle: async (id: string, updates: Partial<Article>): Promise<Article> => {
    const index = mockArticles.findIndex(article => article.id === id);
    if (index === -1) {
      throw new Error('Article not found');
    }

    const user = mockAuth.getCurrentUser();
    if (!user) {
      throw new Error('User must be logged in to update articles');
    }

    // Check if user owns the article or is admin
    if (mockArticles[index].authorId !== user.id && user.role !== 'ADMIN') {
      throw new Error('You can only update your own articles');
    }

    mockArticles[index] = {
      ...mockArticles[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    saveArticlesToStorage();
    return mockArticles[index];
  },

  deleteArticle: async (id: string): Promise<void> => {
    const index = mockArticles.findIndex(article => article.id === id);
    if (index === -1) {
      throw new Error('Article not found');
    }

    const user = mockAuth.getCurrentUser();
    if (!user) {
      throw new Error('User must be logged in to delete articles');
    }

    // Check if user owns the article or is admin
    if (mockArticles[index].authorId !== user.id && user.role !== 'ADMIN') {
      throw new Error('You can only delete your own articles');
    }

    mockArticles.splice(index, 1);
    saveArticlesToStorage();
  },

  getArticleById: (id: string): Article | undefined => {
    return mockArticles.find(article => article.id === id);
  },

  getArticlesByAuthor: (authorId: string): Article[] => {
    return mockArticles.filter(article => article.authorId === authorId);
  },

  getPublishedArticles: (): Article[] => {
    return mockArticles.filter(article => article.status === 'PUBLISHED');
  },

  getPendingArticles: (): Article[] => {
    return mockArticles.filter(article => article.status === 'PENDING');
  },

  getAllArticles: (): Article[] => {
    return mockArticles;
  },

  // Refresh articles from localStorage (useful after page reload)
  refreshArticles: () => {
    initializeArticles();
    return mockArticles;
  },
};