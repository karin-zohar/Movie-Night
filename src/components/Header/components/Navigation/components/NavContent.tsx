import { type FC } from "react";
import NavMenu from "./NavMenu.tsx";
import SelectTheme from "@/components/SelectTheme/SelectTheme.tsx";

type NavContentProps = {
  layout: "horizontal" | "vertical";
  closeDrawer?: () => void;
};

const NavContent: FC<NavContentProps> = ({ layout, closeDrawer }) => {
  return (
    <>
      <NavMenu layout={layout} closeDrawer={closeDrawer} />
      <SelectTheme />
    </>
  )
};

export default NavContent;
