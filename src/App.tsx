import { useEffect, useState } from 'react';
import "../index.css";
import Header from "./Header";
import LinkGroups from "./LinkGroups";
import LinkGroupModal from './components/LinkGroupModal';
import { initialLinkGroupInfo } from "./constants"
import { addLinkGroupToLocalStorage } from './utils';
import { LinkGroupInfo } from './types';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkGroupInfoArray, setLinkGroupInfoArray] = useState<LinkGroupInfo[]>([]);
  const [selectedLinkGroupId, setSelectedLinkGroupId] = useState<number>(0);
  let nextId: number = 0;

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
    nextId = maxId + 1;

    setLinkGroupInfoArray(linkGroupsInfo);
  }, []);

  const handleOpenModal = (linkGroupId: number) => {
    setSelectedLinkGroupId(linkGroupId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onModalSubmit = (linkGroupInfo: LinkGroupInfo) => {
    if (linkGroupInfo.id === undefined) {
      linkGroupInfo.id = nextId;
    }
    addLinkGroupToLocalStorage(linkGroupInfo);
    const existingIndex = linkGroupInfoArray.findIndex((group: LinkGroupInfo) => group.id === linkGroupInfo.id);
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
        linkGroupInfo={linkGroupInfoArray[selectedLinkGroupId] ?? initialLinkGroupInfo}
        onClose={handleCloseModal}
        isModalOpen={isModalOpen}
        onFormSubmit={onModalSubmit}
      />
    </>
  );
}