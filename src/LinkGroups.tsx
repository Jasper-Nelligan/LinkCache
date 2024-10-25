import LinkGroup from "./components/LinkGroup";
import { LinkGroupInfo } from "./types";

function LinkGroups({ linkGroupInfoArray, onOpenModal }: { linkGroupInfoArray: LinkGroupInfo[], onOpenModal: () => void }) {
  const renderLinkGroups = linkGroupInfoArray.map((info, index) => {
    return (
      <LinkGroup linkGroupInfo={info} key={index} onOpenModal={onOpenModal} />
    );
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
      {renderLinkGroups}
    </div>
  );
}

export default LinkGroups;