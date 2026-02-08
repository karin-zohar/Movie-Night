import { forwardRef } from "react";
import { Select, type RefSelectProps, type SelectProps } from "antd";
import { ArrowDownIcon } from "@/libs/ui/icons";
import clsx from "clsx";
import "./gen-select.style.css";

const GenSelect = forwardRef<RefSelectProps, SelectProps>((props, ref) => (
  <Select
    ref={ref}
    className={clsx("gen-select", props.className)}
    variant="borderless"
    suffixIcon={<ArrowDownIcon />}
    {...props}
  />
));

GenSelect.displayName = "GenSelect";

export default GenSelect;
