import { useCallback, type FC } from "react";
import { Button, Drawer } from "antd";
import NavContent from "./NavContent";
import GenCloseButton from "@/libs/ui/components/GenCloseButton/GenCloseButton";
import clsx from "clsx";
import { MenuIcon } from "@/libs/ui/icons/index";
import { useTheme } from "@/store";
import { KeyboardNavigable, KeyboardNavigationProvider, useKeyboardNavigation } from "@/providers/KeyboardNavigation";

type NavDrawerProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const DRAWER_EXIT_KEYS = ['Escape', 'ArrowLeft'];

const NavDrawer: FC<NavDrawerProps> = ({ open, onOpen, onClose }) => {
  const { theme } = useTheme();
  const { lock, unlock } = useKeyboardNavigation();

  const handleOpen = useCallback(() => {
    onOpen();
    lock();
  }, [onOpen, lock]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleAfterOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      unlock();
    }
  }, [unlock]);

  return (
    <>
      <div className="open-nav-drawer-button-container">
        <KeyboardNavigable onActivate={handleOpen}>
          <Button
            className={clsx("open-nav-drawer-button", {
              "drawer-open": open,
            })}
            type="text"
            onClick={onOpen}
            icon={<MenuIcon />}
          />
        </KeyboardNavigable>
      </div>
      <Drawer
        closable={false}
        className={clsx("nav-drawer")}
        rootClassName={clsx("theme", theme)}
        open={open}
        onClose={handleClose}
        afterOpenChange={handleAfterOpenChange}
        destroyOnClose
      >
        <KeyboardNavigationProvider onExit={handleClose} exitKeys={DRAWER_EXIT_KEYS}>
          <div className="nav-drawer-close-wrapper">
            <KeyboardNavigable onActivate={handleClose}>
              <GenCloseButton onClose={handleClose} size="large" />
            </KeyboardNavigable>
          </div>
          <NavContent layout={"vertical"} closeDrawer={handleClose} />
        </KeyboardNavigationProvider>
      </Drawer>
    </>
  );
};

export default NavDrawer;
