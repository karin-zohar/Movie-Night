import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type FC,
    type ReactNode,
} from 'react';

interface KeyboardNavigationContextType {
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    register: (el: HTMLElement | null) => void;
    lock: () => void;
    unlock: () => void;
    isLocked: () => boolean;
}

const KeyboardNavigationContext = createContext<KeyboardNavigationContextType | null>(null);

export const KeyboardNavigationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const elements = useRef<HTMLElement[]>([]);
    const locked = useRef(false);

    const register = useCallback((el: HTMLElement | null) => {
        if (el && !elements.current.includes(el)) {
            el.tabIndex = -1;
            elements.current.push(el);
        }
    }, []);

    const lock = useCallback(() => {
        locked.current = true;
    }, []);

    const unlock = useCallback(() => {
        locked.current = false;
        elements.current[activeIndex]?.focus({ preventScroll: true });
    }, [activeIndex]);

    const isLocked = useCallback(() => locked.current, []);

    useEffect(() => {
        const active = elements.current[activeIndex];
        if (!active) return;

        active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        active.focus({ preventScroll: true });

        const handleFocusOut = () => {
            if (!locked.current) {
                requestAnimationFrame(() => {
                    if (!locked.current) {
                        active.focus({ preventScroll: true });
                    }
                });
            }
        };

        active.addEventListener('focusout', handleFocusOut);
        return () => active.removeEventListener('focusout', handleFocusOut);
    }, [activeIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (locked.current) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                }
                return;
            }

            const handled = ['Tab', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Enter', 'Escape'];
            if (!handled.includes(e.key)) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            switch (e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    setActiveIndex(prev => Math.min(prev + 1, elements.current.length - 1));
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    setActiveIndex(prev => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                    elements.current[activeIndex]?.click();
                    break;
                case 'Escape':
                    (document.activeElement as HTMLElement)?.blur();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [activeIndex]);

    const providerValue = useMemo(() =>
        ({ activeIndex, setActiveIndex, register, lock, unlock, isLocked }),
        [activeIndex, setActiveIndex, register, lock, unlock, isLocked]);

    return (
        <KeyboardNavigationContext.Provider value={providerValue}>
            {children}
        </KeyboardNavigationContext.Provider>
    );
};

export const useKeyboardNavigation = () => {
    const context = useContext(KeyboardNavigationContext);
    if (!context) {
        throw new Error('useKeyboardNavigation must be used within a KeyboardNavigationProvider');
    }
    return context;
};
