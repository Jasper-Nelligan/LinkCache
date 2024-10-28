import { useState } from 'react';
import "../index.css";
import Header from "./Header";
import LinkGroups from "./LinkGroups";
import LinkGroupModal from './components/LinkGroupModal';
import { initialLinkGroupInfo } from "./constants"

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <LinkGroups linkGroupInfoArray={fakeLinkGroupInfo} onOpenModal={handleOpenModal} />
      <LinkGroupModal linkGroupInfo={initialLinkGroupInfo} onClose={handleCloseModal} isModalOpen={isModalOpen}/>
    </>
  );
}

export default App;