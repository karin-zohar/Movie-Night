import type { FC, ReactNode } from "react";
import Header from "../Header/Header";
import "./main-layout.style.css";

import clsx from "clsx";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: FC<MainLayoutProps> = ({ children }) => {

  const { theme } = {theme: 'light'};
  return (
    <div className={clsx("main-layout", "theme", theme)}>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
