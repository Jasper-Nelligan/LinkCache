import "../index.css"
import Header from "./Header"
import LinkGroups from "./LinkGroups"
import { LinkInfo } from "./types"

const tempLinkData: LinkInfo[][] = [
  [
    {
      name: "Facebook",
      url: "https://facebook.com",
      icon: "/facebook_logo.png"
    },
    {
      name: "Twitter",
      url: "https://twitter.com",
      icon: "/x_logo.png"
    },
    {
      name: "Instagram",
      url: "https://instagram.com",
      icon: "/instagram_logo.png"
    },
    {
      name: "Reddit",
      url: "https://reddit.com",
      icon: "/reddit_logo.png"
    },
  ]
]

function App() {
  return (
    <>
      <Header />
      <LinkGroups linkData={tempLinkData} />
    </>
  )
}

export default App
