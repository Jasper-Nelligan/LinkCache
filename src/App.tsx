import { useEffect, useState } from 'react';
import "../index.css";
import Header from "./Header";
import LinkGroups from "./LinkGroups";
import LinkGroupModal from './components/LinkGroupModal';
import { initialLinkGroupInfo } from "./constants"
import { addLinkGroupToLocalStorage } from './utils';
import { LinkGroupInfo } from './types';

const fakeLinkGroupInfo = [
  initialLinkGroupInfo,
  {
    linkGroupName: "Shopping",
    color: "#ff5733",
    links: [
      {
        name: "Amazon",
        url: "https://amazon.com",
      },
      {
        name: "Ebay",
        url: "https://ebay.com",
      },
      {
        name: "Walmart",
        url: "https://walmart.com",
      },
    ]
  },
  {
    linkGroupName: "News",
    color: "#ff5733",
    links: [
      {
        name: "CNN",
        url: "https://cnn.com",
      },
      {
        name: "BBC",
        url: "https://bbc.com",
      },
      {
        name: "Fox News",
        url: "https://foxnews.com",
      },
    ]
  }
]

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkGroupInfoArray, setLinkGroupInfoArray] = useState<LinkGroupInfo[]>([]);
  let nextId: number = 0;

  useEffect(() => {
    const linkGroupsData = JSON.parse(localStorage.getItem("linkGroups") || '[]');
    if (linkGroupsData.length === 0) {
      addLinkGroupToLocalStorage(initialLinkGroupInfo);
    }

    // Find the maximum ID
    const maxId = linkGroupsData.reduce((max: number, group: { id: number; }) => {
      return group.id > max ? group.id : max;
    }, 0);
    nextId = maxId + 1;

    setLinkGroupInfoArray(linkGroupsData);
  }, []);

  const handleOpenModal = () => {
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
        linkGroupInfo={linkGroupInfoArray[0]}
        onClose={handleCloseModal}
        isModalOpen={isModalOpen}
        onFormSubmit={onModalSubmit}
      />
    </>
  );
}

export default App;