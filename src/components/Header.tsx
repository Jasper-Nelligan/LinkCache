import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../providers/theme-provider'

export default function Header() {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = () => {
    if (theme === "light") setTheme("dark")
    else setTheme("light")
  }

  return (
    <header className="p-5 flex flex-col md:flex-row justify-between items-center">
      <div className="order-2 md:order-1 flex items-center sm:mt-4 mt-8 md:mt-0">
        <img src="/linkcache_logo.png" alt="Logo" className="h-16 w-16" />
        <div className="ml-2">
          <h1 className="text-primary text-3xl font-bold">Link Cache</h1>
          <h2 className="text-secondary text-xl font-bold text">Effortless Access to Your Favourite Links</h2>
        </div>
      </div>
      <div className="order-1 md:order-2 flex flex-col md:flex-row items-center md:mt-0">
          <div className="flex space-x-4 mt-4 md:mt-0 md:mr-4">
            <Button onClick={() => handleThemeChange()} variant="ghost" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
      </div>
    </header>
  );
}