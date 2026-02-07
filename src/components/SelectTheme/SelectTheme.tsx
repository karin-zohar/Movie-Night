
import { MoonIcon, SunIcon } from "@/libs/ui/icons";
import { useTheme, type Theme } from "@/store";
import GenSelect from "@/libs/ui/components/GenSelect/GenSelect";

const themeOptions = [
    {
        label: <span><SunIcon /> <span> Light Mode</span></span>,
        value: "light",
        title: 'Light mode'
    },
    {
        label: <span><MoonIcon /> <span> Dark Mode</span></span>,
        value: "dark",
        title: 'Dark Mode'
    },
];

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
