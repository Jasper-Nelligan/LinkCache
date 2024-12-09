import { useEffect, useState } from 'react';
import "../index.css";
import Header from "./components/Header";
import LinkGroups from "./LinkGroups";
import LinkGroupModal from './components/LinkGroupModal';
import { emptyLinkGroupInfo, initialLinkGroupInfo } from "./constants"
import { addLinkGroupToLocalStorage, removeLinkGroupFromLocalStorage, getNextID } from './utils';
import { LinkGroupInfo } from './types';

export default function App() {
  const [isLinkGroupFormOpen, setIsLinkGroupFormOpen] = useState(false);
  const [linkGroupInfoArray, setLinkGroupInfoArray] = useState<LinkGroupInfo[]>([]);
  const [selectedLinkGroupId, setSelectedLinkGroupId] = useState<number>(-1);
  const [nextId, setNextId] = useState<number>(-1);

  useEffect(() => {
    const fetchLinkGroupsFromLocalStorage = () => {
      const linkGroupsInfo = JSON.parse(localStorage.getItem("linkGroups") || '[]');
      if (linkGroupsInfo.length === 0) {
        linkGroupsInfo.push(initialLinkGroupInfo);
        addLinkGroupToLocalStorage(initialLinkGroupInfo);
      }

      setNextId(getNextID(linkGroupsInfo));
      setLinkGroupInfoArray(linkGroupsInfo);
    }

    fetchLinkGroupsFromLocalStorage();
  }, []);

  const handleOpenLinkGroupForm = (linkGroupId: number) => {
    setSelectedLinkGroupId(linkGroupId);
    setIsLinkGroupFormOpen(true);
  };

  const handleCloseLinkGroupForm = () => {
    setIsLinkGroupFormOpen(false);
  };

  const handleDeleteGroup = (linkGroupId: number) => {
    const updatedLinkGroupInfoArray = linkGroupInfoArray.filter((group: LinkGroupInfo) => group.id !== linkGroupId);
    removeLinkGroupFromLocalStorage(linkGroupId);
    setLinkGroupInfoArray(updatedLinkGroupInfoArray);
  }

  const onLinkGroupFormSubmit = (linkGroupInfo: LinkGroupInfo) => {
    if (linkGroupInfo.id === -1) {
      linkGroupInfo.id = nextId;
    }

    // Check if the group already exists
    const existingIndex = linkGroupInfoArray.findIndex((group: LinkGroupInfo) => group.id === linkGroupInfo.id);
    // If it exists, update it, otherwise add it
    if (existingIndex !== -1) {
      setLinkGroupInfoArray(linkGroupInfoArray.map((group: LinkGroupInfo) => group.id === linkGroupInfo.id ? linkGroupInfo : group));
    } else {
      setLinkGroupInfoArray([...linkGroupInfoArray, linkGroupInfo]);
    }

    addLinkGroupToLocalStorage(linkGroupInfo);
  }

  return (
    <>
      <Header />
      <LinkGroups linkGroupInfoArray={linkGroupInfoArray} onOpenModal={handleOpenLinkGroupForm} />
      <LinkGroupModal
        linkGroupInfo={linkGroupInfoArray.find(group => group.id === selectedLinkGroupId) ?? emptyLinkGroupInfo}
        onClose={handleCloseLinkGroupForm}
        isModalOpen={isLinkGroupFormOpen}
        onFormSubmit={onLinkGroupFormSubmit}
        onDeleteGroup={handleDeleteGroup}
      />
    </>
  );
}