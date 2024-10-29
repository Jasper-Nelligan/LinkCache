import LinkGroup from "./components/LinkGroup";
import { Button } from "./components/ui/button";
import { LinkGroupInfo } from "./types";
import { Plus } from 'lucide-react';

function LinkGroups({ linkGroupInfoArray, onOpenModal }: { linkGroupInfoArray: LinkGroupInfo[], onOpenModal: (linkGroupId: number) => void }) {
  const renderLinkGroups = linkGroupInfoArray.map((info, index) => {
    return (
      <LinkGroup linkGroupInfo={info} key={index} onOpenModal={onOpenModal} />
    );
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
      {renderLinkGroups}
      <div className="flex justify-center items-center rounded-md border-2 border-dashed p-4 cursor-pointer">
        <Button asChild onClick={() => onOpenModal(-1)}>
            <Plus size={48} color="#ffffff" />
        </Button>
      </div>
    </div>
  );
}

export default LinkGroups;