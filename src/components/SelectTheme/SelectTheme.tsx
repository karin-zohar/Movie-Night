
import { MoonIcon, SunIcon } from "@/libs/ui/icons";
import { useTheme, type Theme } from "@/store";
import GenSelect from "@/libs/ui/components/GenSelect/GenSelect";
import type { ComponentType } from "react";

const themeOptionsData: { value: Theme; icon: ComponentType; label: string }[] = [
    { value: "light", icon: SunIcon, label: "Light Mode" },
    { value: "dark", icon: MoonIcon, label: "Dark Mode" },
];

const themeOptions = themeOptionsData.map(({ value, icon: Icon, label }) => ({
    label: <span><Icon /> <span> {label}</span></span>,
    value,
    title: label,
}));

const SelectTheme = () => {
    const { theme, setTheme } = useTheme();


    return (
        <GenSelect
            options={themeOptions}
            value={theme}
            onChange={(value: Theme) => setTheme(value)}
        />
    );
};

export default SelectTheme;
