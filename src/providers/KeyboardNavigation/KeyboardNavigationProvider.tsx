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

interface StableActionsContextType {
    register: (el: HTMLElement | null) => void;
    unregister: (el: HTMLElement | null) => void;
    lock: () => void;
    unlock: () => void;
    isLocked: () => boolean;
}

const StableActionsContext = createContext<StableActionsContextType | null>(null);

const HANDLED_KEYS = ['Tab', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Enter', 'Escape'];

interface KeyboardNavigationProviderProps {
    children: ReactNode;
    onExit?: () => void;
    exitKeys?: string[];
}

export const KeyboardNavigationProvider: FC<KeyboardNavigationProviderProps> = ({
    children,
    onExit,
    exitKeys = ['Escape'],
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeIndexRef = useRef(activeIndex);
    activeIndexRef.current = activeIndex;

    const elements = useRef<HTMLElement[]>([]);
    const locked = useRef(false);

    const onExitRef = useRef(onExit);
    onExitRef.current = onExit;
    const exitKeysRef = useRef(exitKeys);
    exitKeysRef.current = exitKeys;

    const register = useCallback((el: HTMLElement | null) => {
        if (el && !elements.current.includes(el)) {
            el.tabIndex = -1;
            elements.current.push(el);
        }
    }, []);

    const unregister = useCallback((el: HTMLElement | null) => {
        if (!el) return;
        const index = elements.current.indexOf(el);
        if (index === -1) return;
        elements.current.splice(index, 1);
        setActiveIndex(prev => Math.min(prev, Math.max(elements.current.length - 1, 0)));
    }, []);

    const lock = useCallback(() => {
        locked.current = true;
    }, []);

    const unlock = useCallback(() => {
        locked.current = false;
        elements.current[activeIndexRef.current]?.focus({ preventScroll: true });
    }, []);

    const isLocked = useCallback(() => locked.current, []);

    useEffect(() => {
        const active = elements.current[activeIndex];
        if (!active) return;

        active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        active.focus({ preventScroll: true });

        // Reclaim focus when it escapes to <body> during keyboard navigation.
        // Skipped when locked, since interactive components (e.g. search, dropdowns)
        // intentionally move focus to their own elements.
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

            if (!HANDLED_KEYS.includes(e.key)) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            if (onExitRef.current && exitKeysRef.current.includes(e.key)) {
                onExitRef.current();
                return;
            }

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
                    elements.current[activeIndexRef.current]?.click();
                    break;
                case 'Escape':
                    (document.activeElement as HTMLElement)?.blur();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, []);

    useEffect(() => {
        const preventWheel = (e: WheelEvent) => {
            e.preventDefault();
        };

        window.addEventListener('wheel', preventWheel, { passive: false });
        return () => window.removeEventListener('wheel', preventWheel);
    }, []);

    const stableValue = useMemo(() =>
        ({ register, unregister, lock, unlock, isLocked }),
        [register, unregister, lock, unlock, isLocked]);

    return (
        <StableActionsContext.Provider value={stableValue}>
            {children}
        </StableActionsContext.Provider>
    );
};

export const useKeyboardNavigation = () => {
    const context = useContext(StableActionsContext);
    if (!context) {
        throw new Error('useKeyboardNavigation must be used within a KeyboardNavigationProvider');
    }
    return context;
};
