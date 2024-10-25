import { Button } from '@/components/ui/button'


export default function Header() {
  return (
    <header className="p-5 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/linkcache_logo.png" alt="Logo" className="h-16 w-16" />
        <div className="ml-2">
          <h1 className="text-brand-primary text-3xl font-bold">Link Cache</h1>
          <h2 className="text-brand-secondary text-xl font-bold text">Effortless Access to Your Favourite Links</h2>
        </div>
      </div>
      <div className="flex space-x-4 mr-4">
        <Button variant="ghost">Login</Button>
        <Button variant="outline">Sign up</Button>
      </div>
    </header>
  )
}