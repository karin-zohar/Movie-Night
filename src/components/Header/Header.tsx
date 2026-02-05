import type { FC } from "react";
import "./header.style.css";
import Navigation from "./components/Navigation/Navigation";

type HeaderProps = {};

const Header: FC<HeaderProps> = ({}) => {
  return (
    <header className="app-header">
      <Navigation />
    </header>
  );
};

export default Header;
