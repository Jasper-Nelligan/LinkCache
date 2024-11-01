import { useEffect, useState } from 'react';
import "../index.css";
import Header from "./Header";
import LinkGroups from "./LinkGroups";
import LinkGroupModal from './components/LinkGroupModal';
import { emptyLinkGroupInfo, initialLinkGroupInfo } from "./constants"
import { addLinkGroupToLocalStorage, removeLinkGroupFromLocalStorage } from './utils';
import { LinkGroupInfo } from './types';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkGroupInfoArray, setLinkGroupInfoArray] = useState<LinkGroupInfo[]>([]);
  const [selectedLinkGroupId, setSelectedLinkGroupId] = useState<number>(-1);
  const [nextId, setNextId] = useState<number>(-1);

  useEffect(() => {
    const linkGroupsInfo = JSON.parse(localStorage.getItem("linkGroups") || '[]');
    if (linkGroupsInfo.length === 0) {
      linkGroupsInfo.push(initialLinkGroupInfo);
      addLinkGroupToLocalStorage(initialLinkGroupInfo);
    }

    // Find the maximum ID
    const maxId = linkGroupsInfo.reduce((max: number, group: { id: number; }) => {
      return group.id > max ? group.id : max;
    }, 0);
    setNextId(maxId + 1);

    setLinkGroupInfoArray(linkGroupsInfo);
  }, []);

  const handleOpenModal = (linkGroupId: number) => {
    setSelectedLinkGroupId(linkGroupId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleDeleteGroup = (linkGroupId: number) => {
    removeLinkGroupFromLocalStorage(linkGroupId);
    setLinkGroupInfoArray(linkGroupInfoArray.filter((group: LinkGroupInfo) => group.id !== linkGroupId));
  }

  const onModalSubmit = (linkGroupInfo: LinkGroupInfo) => {
    if (linkGroupInfo.id === -1) {
      linkGroupInfo.id = nextId;
    }

    addLinkGroupToLocalStorage(linkGroupInfo);

    // Check if the group already exists
    const existingIndex = linkGroupInfoArray.findIndex((group: LinkGroupInfo) => group.id === linkGroupInfo.id);
    // If it exists, update it, otherwise add it
    if (existingIndex !== -1) {
      setLinkGroupInfoArray(linkGroupInfoArray.map((group: LinkGroupInfo) => group.id === linkGroupInfo.id ? linkGroupInfo : group));
    } else {
      setLinkGroupInfoArray([...linkGroupInfoArray, linkGroupInfo]);
    }
  }

  return (
    <>
      <Header />
      <LinkGroups linkGroupInfoArray={linkGroupInfoArray} onOpenModal={handleOpenModal} />
      <LinkGroupModal
        linkGroupInfo={linkGroupInfoArray.find(group => group.id === selectedLinkGroupId) ?? emptyLinkGroupInfo}
        onClose={handleCloseModal}
        isModalOpen={isModalOpen}
        onFormSubmit={onModalSubmit}
        onDeleteGroup={handleDeleteGroup}
      />
    </>
  );
}