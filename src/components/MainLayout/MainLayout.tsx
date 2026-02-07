import type { FC, ReactNode } from "react";
import Header from "../Header/Header";
import { useTheme } from "@/store";
import clsx from "clsx";
import "./main-layout.style.css";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: FC<MainLayoutProps> = ({ children }) => {

  const { theme } = useTheme();
  return (
    <div className={clsx("main-layout", "theme", theme)}>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
