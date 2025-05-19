"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Calendar,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  Settings,
  CheckSquare,
  Users,
  X
} from "lucide-react";
import { User } from "@/lib/types";
import { users, notifications } from "@/lib/mock-data";

function MobileSidebar({ 
  isOpen, 
  setIsOpen, 
  userName,
  userRole,
}: { 
  isOpen: boolean; 
  setIsOpen: (open: boolean) => void;
  userName: string;
  userRole: string;
}) {
  const pathname = usePathname();
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background p-6 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-1">
          <div className="flex flex-col items-center py-4 mb-6">
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt={userName} />
              <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-medium">{userName}</h3>
              <p className="text-sm text-muted-foreground capitalize">{userRole}</p>
            </div>
          </div>
          
          <Link 
            href="/dashboard" 
            className={cn(
              "flex items-center py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
              pathname === "/dashboard" && "bg-accent text-accent-foreground font-medium"
            )}
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link 
            href="/tasks" 
            className={cn(
              "flex items-center py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
              (pathname === "/tasks" || pathname.startsWith("/tasks/")) && "bg-accent text-accent-foreground font-medium"
            )}
            onClick={() => setIsOpen(false)}
          >
            <CheckSquare className="mr-3 h-5 w-5" />
            Tasks
          </Link>
          <Link 
            href="/calendar" 
            className={cn(
              "flex items-center py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
              pathname === "/calendar" && "bg-accent text-accent-foreground font-medium"
            )}
            onClick={() => setIsOpen(false)}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Calendar
          </Link>
          <Link 
            href="/team" 
            className={cn(
              "flex items-center py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
              pathname === "/team" && "bg-accent text-accent-foreground font-medium"
            )}
            onClick={() => setIsOpen(false)}
          >
            <Users className="mr-3 h-5 w-5" />
            Team
          </Link>
          <Link 
            href="/analytics" 
            className={cn(
              "flex items-center py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
              pathname === "/analytics" && "bg-accent text-accent-foreground font-medium"
            )}
            onClick={() => setIsOpen(false)}
          >
            <PieChart className="mr-3 h-5 w-5" />
            Analytics
          </Link>
          <Link 
            href="/settings" 
            className={cn(
              "flex items-center py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
              pathname === "/settings" && "bg-accent text-accent-foreground font-medium"
            )}
            onClick={() => setIsOpen(false)}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </div>
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/login");
      return;
    }
    
    // Get user info - in a real app, this would come from your auth provider
    const userId = localStorage.getItem("userId");
    const foundUser = users.find(user => user.id === userId) || {
      id: "user-new",
      name: localStorage.getItem("userName") || "New User",
      email: localStorage.getItem("userEmail") || "user@example.com",
      role: "user" as const,
    };
    
    setCurrentUser(foundUser);
    
    // Count unread notifications
    const unreadCount = notifications.filter(
      n => n.userId === userId && !n.read
    ).length;
    setUnreadNotifications(unreadCount);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  if (!currentUser) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:w-72 md:flex md:flex-col md:bg-card md:border-r">
        <div className="p-6">
          <Link 
            href="/dashboard" 
            className="flex items-center space-x-2 mb-8"
          >
            <CheckSquare className="h-6 w-6" />
            <span className="text-xl font-bold">TaskFlow</span>
          </Link>
          <div className="space-y-1">
            <Link 
              href="/dashboard" 
              className={cn(
                "flex items-center py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/dashboard" && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link 
              href="/tasks" 
              className={cn(
                "flex items-center py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                (pathname === "/tasks" || pathname.startsWith("/tasks/")) && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <CheckSquare className="mr-3 h-5 w-5" />
              Tasks
            </Link>
            <Link 
              href="/calendar" 
              className={cn(
                "flex items-center py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/calendar" && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Calendar
            </Link>
            <Link 
              href="/team" 
              className={cn(
                "flex items-center py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/team" && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <Users className="mr-3 h-5 w-5" />
              Team
            </Link>
            <Link 
              href="/analytics" 
              className={cn(
                "flex items-center py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/analytics" && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <PieChart className="mr-3 h-5 w-5" />
              Analytics
            </Link>
            <Link 
              href="/settings" 
              className={cn(
                "flex items-center py-3 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/settings" && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </div>
        </div>
        <div className="mt-auto p-6 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        userName={currentUser.name}
        userRole={currentUser.role}
      />
      
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center justify-between px-4 border-b bg-background md:hidden">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(true)}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="flex items-center">
            <CheckSquare className="h-5 w-5 mr-2" />
            <span className="font-bold">TaskFlow</span>
          </Link>
        </div>
        <div className="flex items-center">
          <Link href="/notifications" className="relative p-2">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                {unreadNotifications}
              </span>
            )}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Desktop top bar */}
      <div className="hidden md:fixed md:top-0 md:right-0 md:left-72 md:z-30 md:h-16 md:flex md:items-center md:justify-between md:px-6 md:border-b md:bg-background">
        <div className="flex-1 max-w-lg">
          <form>
            <div className="relative">
              <Input
                placeholder="Search..."
                className="pl-10 bg-muted"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </form>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/notifications" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                {unreadNotifications}
              </span>
            )}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Main content */}
      <div className="md:pl-72 pt-16">
        <main className="container max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}