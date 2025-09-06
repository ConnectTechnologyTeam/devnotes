export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
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
  { id: '1', email: 'admin@devnotes.com', name: 'Admin User', role: 'ADMIN' },
  { id: '2', email: 'john@example.com', name: 'John Developer', role: 'USER' },
  { id: '3', email: 'jane@example.com', name: 'Jane Smith', role: 'USER' },
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

// Mock authentication state
export let currentUser: User | null = null;

export const mockAuth = {
  login: async (email: string, password: string): Promise<User> => {
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      currentUser = user;
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
    return newUser;
  },
  
  logout: () => {
    currentUser = null;
  },
  
  getCurrentUser: () => currentUser,
};