import LinkGroup from "./components/LinkGroup";

export default function LinkGroups() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
      <LinkGroup />
      <LinkGroup />
      <LinkGroup />
      <LinkGroup />
      <LinkGroup />
      <LinkGroup />
      <LinkGroup />
      <LinkGroup />
      <LinkGroup />
    </div>
  )
}