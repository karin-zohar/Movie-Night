import { type FC } from "react";
import { Select, type SelectProps } from "antd";
import { ArrowDownIcon } from "@/libs/ui/icons";
import clsx from "clsx";
import "./gen-select.style.css";

const GenSelect: FC<SelectProps> = ({ ...props }) => {
  return (
    <Select
      className={clsx("gen-select", props.className)}
      variant="borderless"
      suffixIcon={<ArrowDownIcon />}
      {...props}
    />
  );
};

export default GenSelect;
