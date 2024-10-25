import LinkGroup from "./components/LinkGroup";
import { LinkInfo } from "./types";

export default function LinkGroups({linkData}: {linkData: LinkInfo[][]}) {
  const renderLinkGroups = linkData.map((links, index) => {
    return (
      <LinkGroup links={links} key={index} />
    )
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
      {renderLinkGroups}
    </div>
  )
}