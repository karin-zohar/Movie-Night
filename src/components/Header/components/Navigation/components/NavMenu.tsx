import type { FC } from "react";
import { HeartFilledIcon, HomeIcon } from "@/libs/ui/icons";
import { Menu, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

type NavMenuProps = {
  layout: "horizontal" | "vertical";
  closeDrawer?: () => void;
};

type MenuItem = Required<MenuProps>["items"][number];

const NavMenu: FC<NavMenuProps> = ({ layout, closeDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      label: "Home",
      key: "/",
      icon: <HomeIcon />,
    },
    {
      label: "My Favorites",
      key: "/my-favorites",
      icon: <HeartFilledIcon />,
    },
  ];

  const handleItemClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
    closeDrawer?.();
  };

  return (
    <Menu
      items={menuItems}
      mode={layout}
      className="menu"
      onClick={handleItemClick}
      selectedKeys={[location.pathname]}
    />
  );
};

export default NavMenu;
