import { useCallback, useEffect, useRef, type FC } from 'react';
import { EraserIcon, SearchIcon } from '@/libs/ui/icons';
import { Input, type InputRef } from 'antd';
import { useKeyboardNavigation } from '@/providers/KeyboardNavigation';

type SearchBarProps = {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar: FC<SearchBarProps> = ({ value, onChange }) => {
    const { register, lock, unlock, isLocked } = useKeyboardNavigation();
    const inputRef = useRef<InputRef>(null);
    const escaping = useRef(false);

    const handleRef = useCallback((el: HTMLDivElement | null) => {
        register(el);
    }, [register]);

    const handleFocus = useCallback(() => {
        if (escaping.current) {
            escaping.current = false;
            return;
        }
        if (isLocked()) return;
        lock();
        requestAnimationFrame(() => inputRef.current?.focus());
    }, [lock, isLocked]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const nativeInput = inputRef.current?.input;
            if (e.key === 'Escape' && nativeInput && document.activeElement === nativeInput) {
                e.preventDefault();
                escaping.current = true;
                inputRef.current?.blur();
                unlock();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [unlock]);

    return (
        <div ref={handleRef} onFocus={handleFocus}>
            <Input
                ref={inputRef}
                value={value}
                placeholder='Search for a movie'
                className="search-bar"
                prefix={<SearchIcon />}
                onChange={onChange}
                allowClear={{ clearIcon: <EraserIcon /> }}
            />
        </div>
    );
};

export default SearchBar;
