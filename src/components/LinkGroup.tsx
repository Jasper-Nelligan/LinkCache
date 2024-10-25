import { Button } from '@/components/ui/button';

export default function LinkGroup() {
  return (
    <div className="shadow rounded-lg overflow-hidden">
      <div className="bg-gray-200 p-2 flex justify-between items-center">
        <div className="font-bold ml-2">Group 1</div>
        <Button variant="ghost" size="icon">
          <img src="/edit_icon.png" alt="Edit Links" className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center">
          <img src="/facebook_logo.png" alt="Facebook" className="h-6 w-6" />
          <a href="#" className="text-blue-500 ml-2">Facebook</a>
        </div>
        <div className="flex items-center">
          <img src="/facebook_logo.png" alt="Facebook" className="h-6 w-6" />
          <a href="#" className="text-blue-500 ml-2">Facebook</a>
        </div>
        <div className="flex items-center">
          <img src="/facebook_logo.png" alt="Facebook" className="h-6 w-6" />
          <a href="#" className="text-blue-500 ml-2">Facebook</a>
        </div>
        <div className="flex items-center">
          <img src="/facebook_logo.png" alt="Facebook" className="h-6 w-6" />
          <a href="#" className="text-blue-500 ml-2">Facebook</a>
        </div>
      </div>
    </div>
  )
}