import "../index.css"
import Header from "./Header"
import LinkGroups from "./LinkGroups"
import { LinkGroupInfo } from "./types"

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
]

function App() {
  return (
    <>
      <Header />
      <LinkGroups linkGroupInfoArray={tempLinkGroupInfo} />
    </>
  )
}

export default App
