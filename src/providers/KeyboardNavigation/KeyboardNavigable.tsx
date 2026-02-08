import { useCallback, useRef, type FC, type FocusEvent, type MouseEvent, type ReactNode } from 'react';
import { useKeyboardNavigation } from './KeyboardNavigationProvider';

interface KeyboardNavigableProps {
	children: ReactNode;
	targetSelector?: string;
	locksNavOnActivate?: boolean;
	onActivate?: () => void;
	onFocus?: () => void;
	onBlur?: () => void;
}

const KeyboardNavigable: FC<KeyboardNavigableProps> = ({ children, targetSelector, locksNavOnActivate, onActivate, onFocus, onBlur }) => {
	const { register, unregister, lock } = useKeyboardNavigation();
	const registeredRef = useRef<HTMLElement | null>(null);

	const handleRef = useCallback(
		(el: HTMLDivElement | null) => {
			const prev = registeredRef.current;
			const target = targetSelector ? el?.closest<HTMLElement>(targetSelector) : el;

			if (prev && prev !== target) {
				unregister(prev);
			}

			registeredRef.current = target ?? null;
			register(target ?? null);
		},
		[register, unregister, targetSelector]
	);

	const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
		if (e.target !== e.currentTarget) return;

		if (locksNavOnActivate) lock();
		onActivate?.();
	}, [locksNavOnActivate, lock, onActivate]);

	const handleFocus = useCallback((e: FocusEvent<HTMLDivElement>) => {
		if (e.target !== e.currentTarget) return;
		onFocus?.();
	}, [onFocus]);

	const handleBlur = useCallback((e: FocusEvent<HTMLDivElement>) => {
		if (e.target !== e.currentTarget) return;
		onBlur?.();
	}, [onBlur]);

	return (
		<div ref={handleRef} onClick={handleClick} onFocus={handleFocus} onBlur={handleBlur}>
			{children}
		</div>
	);
};

export default KeyboardNavigable;
