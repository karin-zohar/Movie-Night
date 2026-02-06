import type { FC } from "react";
import { Spin } from "antd";
import Icon from "@ant-design/icons";
import './gen-spinner.style.css';
import { SpinnerIcon } from "@/libs/ui/icons";

type GenSpinnerProps = {
  size?: "small" | "default" | "large";
};

const GenSpinner: FC<GenSpinnerProps> = ({ size = "large" }) => {
  return (
    <div className="gen-spinner-container">
      <Spin size={size} indicator={<Icon component={SpinnerIcon} spin />} />
    </div>
  );
};

export default GenSpinner;
