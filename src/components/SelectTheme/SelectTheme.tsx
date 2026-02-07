
import { MoonIcon, SunIcon } from "@/libs/ui/icons";
import { useTheme } from "@/store";
import GenSelect from "@/libs/ui/components/GenSelect/GenSelect";

const SelectTheme = () => {
    const { theme, setTheme } = useTheme();
    const themeOptions = [
        {
            label: <SunIcon />,
            value: "light",
            title: 'Light mode'
        },
        {
            label: <MoonIcon />,
            value: "dark",
            title: 'Dark Mode'
        },
    ];


    return (
        <GenSelect
            options={themeOptions}
            value={theme}
            onChange={(value) => setTheme(value)}
        />
    );
};

export default SelectTheme;
