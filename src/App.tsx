import React, { useState } from 'react';
import "../index.css";
import Header from "./Header";
import LinkGroups from "./LinkGroups";
import { LinkGroupInfo } from "./types";
import LinkGroupModal from './components/linkGroupModal';

const tempLinkGroupInfo: LinkGroupInfo[] = [
  {
    linkGroupName: "Social Media",
    color: "#ff5733",
    links: [
      {
        name: "Facebook",
        url: "https://facebook.com",
      },
      {
        name: "Twitter",
        url: "https://twitter.com",
      },
      {
        name: "Instagram",
        url: "https://instagram.com",
      },
      {
        name: "Reddit",
        url: "https://reddit.com",
      },
    ]
  },
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <LinkGroups linkGroupInfoArray={tempLinkGroupInfo} onOpenModal={handleOpenModal} />
      <LinkGroupModal onClose={handleCloseModal} isModalOpen={isModalOpen}/>
    </>
  );
}

export default App;