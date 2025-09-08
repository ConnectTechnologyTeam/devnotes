import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail";
import Articles from "./pages/Articles";
import EditArticle from "./pages/EditArticle";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyArticles from "./pages/MyArticles";
import CreateArticle from "./pages/CreateArticle";
import AdminDashboard from "./pages/AdminDashboard";
import Categories from "./pages/Categories";
import Tags from "./pages/Tags";
import Posts from "./pages/Posts";
import NotFound from "./pages/NotFound";
import CategoryArticles from "./pages/CategoryArticles";
import TagArticles from "./pages/TagArticles";
import AdminUsers from "./pages/AdminUsers";
import UserProfile from "./pages/UserProfile";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug/edit" element={<EditArticle />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<AuthGuard />}>
            <Route path="/my-articles" element={<MyArticles />} />
            <Route path="/create" element={<CreateArticle />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<CategoryArticles />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/tags/:slug" element={<TagArticles />} />
          <Route path="/posts" element={<Posts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
