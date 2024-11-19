import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './providers/theme-provider'
import { useAuth } from './providers/authProvider';
import { useEffect, useState } from 'react';
import { getUserEmail } from './backend';

export default function Header({ onLoginClicked, onRegisterClicked }: { onLoginClicked: () => void, onRegisterClicked: () => void }) {
  const { theme, setTheme } = useTheme()
  const { isAuthenticated, logout } = useAuth();
  const [ userName, setUserName ] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserEmailFromBackend = async () => {
      if (isAuthenticated) {
        const email = await getUserEmail();
        const username = email.split('@')[0];
        setUserName(username);
      }
    }

    fetchUserEmailFromBackend();
  }, [isAuthenticated])

  const handleThemeChange = () => {
    if (theme === "light") setTheme("dark")
    else setTheme("light")
  }
  
  return (
    <header className="p-5 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/linkcache_logo.png" alt="Logo" className="h-16 w-16" />
        <div className="ml-2">
          <h1 className="text-primary text-3xl font-bold">Link Cache</h1>
          <h2 className="text-secondary text-xl font-bold text">Effortless Access to Your Favourite Links</h2>
        </div>
      </div>
      {isAuthenticated && (
        <div className="flex justify-center items-center">
          <p>Welcome, {userName}!</p>
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </div>
      )}
      {!isAuthenticated && (
        <div className="flex space-x-4 mr-4">
          <Button onClick={() => handleThemeChange()} variant="ghost" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button variant="ghost" onClick={onLoginClicked}>Login</Button>
          <Button variant="outline" onClick={onRegisterClicked}>Register</Button>
        </div>
      )}
    </header>
  )
}