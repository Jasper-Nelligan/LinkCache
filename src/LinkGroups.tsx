import LinkGroup from "./components/LinkGroup";
import { LinkInfo } from "./types";

export default function LinkGroups() {
  const tempLinks: LinkInfo[] = [
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
      <LinkGroup links={tempLinks}/>
    </div>
  )
}