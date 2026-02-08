
import { MoonIcon, SunIcon } from "@/libs/ui/icons";
import { useTheme, type Theme } from "@/store";
import GenSelect from "@/libs/ui/components/GenSelect/GenSelect";
import type { RefSelectProps } from "antd";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { KeyboardNavigable, useKeyboardNavigation } from "@/providers/KeyboardNavigation";

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
    const { unlock } = useKeyboardNavigation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const selectRef = useRef<RefSelectProps>(null);

    const handleActivate = useCallback(() => {
        setDropdownOpen(true);
    }, []);

    useEffect(() => {
        if (!dropdownOpen) return;
        const id = requestAnimationFrame(() => {
            selectRef.current?.focus();
        });
        return () => cancelAnimationFrame(id);
    }, [dropdownOpen]);

    const handleOpenChange = useCallback((visible: boolean) => {
        setDropdownOpen(visible);
        if (!visible) unlock();
    }, [unlock]);

    const handleChange = useCallback((value: Theme) => {
        setTheme(value);
        setDropdownOpen(false);
        unlock();
    }, [setTheme, unlock]);

    return (
        <KeyboardNavigable locksNavOnActivate onActivate={handleActivate}>
            <GenSelect
                ref={selectRef}
                open={dropdownOpen}
                onOpenChange={handleOpenChange}
                options={themeOptions}
                value={theme}
                onChange={handleChange}
            />
        </KeyboardNavigable>
    );
};

export default SelectTheme;
