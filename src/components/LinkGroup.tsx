import { Button } from '@/components/ui/button';
import { LinkGroupInfo } from '@/types';

export default function LinkGroup({ linkGroupInfo }: {linkGroupInfo: LinkGroupInfo}) {
  const renderLinks = linkGroupInfo.links.map((linkInfo, index) => {
    return (
      <div className="flex items-center" key={index}>
        <img src={linkInfo.icon} alt={linkInfo.name} className="h-6 w-6" />
        <a href={linkInfo.url} className="text-blue-500 ml-2">{linkInfo.name}</a>
      </div>
    )
  });

  return (
    <div className="shadow rounded-lg overflow-hidden">
      <div style={{ backgroundColor: linkGroupInfo.color }} className="p-1 flex justify-between items-center">
        <div className="font-bold ml-2">{linkGroupInfo.linkGroupName}</div>
        <Button variant="ghost" size="icon">
          <img src="/edit_icon.png" alt="Edit Links" className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-y-4 p-4">
        {renderLinks}
      </div>
    </div>
  )
}