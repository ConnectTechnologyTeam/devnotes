import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, 
  Folder, 
  Tag, 
  FileText, 
  Settings, 
  Search, 
  Menu,
  PenTool 
} from 'lucide-react';

interface MobileDrawerProps {
  children: React.ReactNode;
}

export const MobileDrawer = ({ children }: MobileDrawerProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/categories', label: 'Categories', icon: Folder },
    { path: '/tags', label: 'Tags', icon: Tag },
    ...(user ? [{ path: '/my-articles', label: 'My Articles', icon: FileText }] : []),
    ...(user?.role === 'ADMIN' ? [{ path: '/admin', label: 'Admin', icon: Settings }] : []),
  ];

  const closeDrawer = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-bold text-lg">DevNotes</span>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeDrawer}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Write Button */}
            {user && (
              <div className="mt-6">
                <Link to="/create" onClick={closeDrawer}>
                  <Button className="w-full justify-start" size="lg">
                    <PenTool className="h-5 w-5 mr-3" />
                    Write Article
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* User section at bottom */}
          {user && (
            <div className="p-4 border-t">
              <Link 
                to="/profile" 
                onClick={closeDrawer}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.name[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};