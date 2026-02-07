
import { MoonIcon, SunIcon } from "@/libs/ui/icons";
import { useTheme, type Theme } from "@/store";
import GenSelect from "@/libs/ui/components/GenSelect/GenSelect";
import { useCallback, useEffect, useState, type ComponentType } from "react";
import { KeyboardNavigable } from "@/providers/KeyboardNavigation";
import { useKeyboardNavigation } from "@/providers/KeyboardNavigation";

const themeOptionsData: { value: Theme; icon: ComponentType; label: string }[] = [
    { value: "light", icon: SunIcon, label: "Light Mode" },
    { value: "dark", icon: MoonIcon, label: "Dark Mode" },
];

const themeOptions = themeOptionsData.map(({ value, icon: Icon, label }) => ({
    label: <span><Icon /> <span> {label}</span></span>,
    value,
    title: label,
}));

const DROPDOWN_CLASS = "select-theme-dropdown";

const SelectTheme = () => {
    const { theme, setTheme } = useTheme();
    const { unlock } = useKeyboardNavigation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const handleActivate = () => {
        const currentIndex = themeOptionsData.findIndex(o => o.value === theme);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
        setDropdownOpen(true);
    };

    const closeDropdown = useCallback(() => {
        setDropdownOpen(false);
        unlock();
    }, [unlock]);

    const handleChange = useCallback((value: Theme) => {
        setTheme(value);
        setDropdownOpen(false);
        unlock();
    }, [setTheme, unlock]);

    const handleDropdownVisibleChange = (open: boolean) => {
        setDropdownOpen(open);
        if (!open) unlock();
    };

    // Keyboard navigation when dropdown is open
    useEffect(() => {
        if (!dropdownOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setHighlightedIndex(prev =>
                        Math.min(prev + 1, themeOptionsData.length - 1)
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setHighlightedIndex(prev => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                    e.preventDefault();
                    handleChange(themeOptionsData[highlightedIndex].value);
                    break;
                case 'Escape':
                case 'ArrowLeft':
                    e.preventDefault();
                    closeDropdown();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dropdownOpen, highlightedIndex, closeDropdown, handleChange]);

    // Visual highlight for the active option in the dropdown
    useEffect(() => {
        if (!dropdownOpen) return;

        let cancelled = false;

        const updateHighlight = () => {
            if (cancelled) return;
            const dropdown = document.querySelector(`.${DROPDOWN_CLASS}`);
            if (!dropdown) {
                requestAnimationFrame(updateHighlight);
                return;
            }
            const options = dropdown.querySelectorAll('.ant-select-item-option');
            options.forEach((opt, i) => {
                opt.classList.remove('ant-select-item-option-active');
                opt.classList.toggle('keyboard-highlighted', i === highlightedIndex);
            });
        };

        requestAnimationFrame(updateHighlight);
        return () => { cancelled = true; };
    }, [dropdownOpen, highlightedIndex]);

    return (
        <KeyboardNavigable interactive onActivate={handleActivate}>
            <GenSelect
                open={dropdownOpen}
                onDropdownVisibleChange={handleDropdownVisibleChange}
                options={themeOptions}
                value={theme}
                onChange={handleChange}
                popupClassName={DROPDOWN_CLASS}
            />
        </KeyboardNavigable>
    );
};

export default SelectTheme;
