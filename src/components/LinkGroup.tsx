import { Button } from '@/components/ui/button';
import { LinkGroupInfo } from '@/types';

function LinkGroup({ linkGroupInfo, onOpenModal }: { linkGroupInfo: LinkGroupInfo, onOpenModal: (linkGroupId: number) => void }) {
  const getURLIconSrc = (url: string): string => {
    const strippedURL = url.replace(/^https?:\/\//, '');
    return `https://icons.duckduckgo.com/ip2/${strippedURL}.ico`;
  };

  const renderLinks = linkGroupInfo.linkPairs.map((linkInfo, index) => (
    <div className="flex items-center" key={index}>
      <img src={getURLIconSrc(linkInfo.url)} alt={linkInfo.name} className="h-6 w-6" />
      <a href={linkInfo.url} className="text-blue-500 ml-2">{linkInfo.name}</a>
    </div>
  ));

  return (
    <div className="shadow rounded-lg overflow-hidden">
      <div style={{ backgroundColor: linkGroupInfo.color }} className="p-1 flex justify-between items-center">
        <div className="font-bold ml-2">{linkGroupInfo.linkGroupName}</div>
        <Button variant="ghost" size="icon" onClick={() => onOpenModal(linkGroupInfo.id)}>
          <img src="/edit_icon.png" alt="Edit link group" className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-y-4 p-4">
        {renderLinks}
      </div>
    </div>
  );
}

export default LinkGroup;