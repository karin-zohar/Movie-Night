
import { MoonIcon, SunIcon } from "@/libs/ui/icons";
import { useTheme, type Theme } from "@/store";
import GenSelect from "@/libs/ui/components/GenSelect/GenSelect";
import { useCallback, useEffect, useState, type ComponentType } from "react";
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
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const handleActivate = useCallback(() => {
        const currentIndex = themeOptionsData.findIndex(o => o.value === theme);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
        setDropdownOpen(true);
    }, [theme]);

    const closeDropdown = useCallback(() => {
        setDropdownOpen(false);
        unlock();
    }, [unlock]);

    const handleChange = useCallback((value: Theme) => {
        setTheme(value);
        setDropdownOpen(false);
        unlock();
    }, [setTheme, unlock]);

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

        const applyHighlight = (dropdown: Element) => {
            const options = dropdown.querySelectorAll('.ant-select-item-option');
            options.forEach((opt, i) => {
                opt.classList.remove('ant-select-item-option-active');
                opt.classList.toggle('keyboard-highlighted', i === highlightedIndex);
            });
        };

        // If the dropdown is already in the DOM, highlight immediately
        const dropdown = document.querySelector('.ant-select-dropdown');
        if (dropdown) {
            applyHighlight(dropdown);
            return;
        }

        // Otherwise, wait for it to appear
        const observer = new MutationObserver(() => {
            const dropdown = document.querySelector('.ant-select-dropdown');
            if (dropdown) {
                applyHighlight(dropdown);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, [dropdownOpen, highlightedIndex]);

    return (
        <KeyboardNavigable locksNavOnActivate onActivate={handleActivate}>
            <GenSelect
                open={dropdownOpen}
                options={themeOptions}
                value={theme}
                onChange={handleChange}
            />
        </KeyboardNavigable>
    );
};

export default SelectTheme;
