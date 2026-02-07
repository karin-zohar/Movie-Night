import { useCallback, useRef, type FC, type MouseEvent, type ReactNode } from 'react';
import { useKeyboardNavigation } from './KeyboardNavigationProvider';

interface KeyboardNavigableProps {
	children: ReactNode;
	targetSelector?: string;
	locksNavOnActivate?: boolean;
	onActivate?: () => void;
}

const KeyboardNavigable: FC<KeyboardNavigableProps> = ({ children, targetSelector, locksNavOnActivate, onActivate }) => {
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

	// Ignores clicks on child elements (e.g. Buttons) so they keep their own behavior.
	// Only reacts to clicks directly on the wrapper, which is what keyboard Enter triggers.
	const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
		if (e.target !== e.currentTarget) return;

		if (locksNavOnActivate) lock();
		onActivate?.();
	}, [locksNavOnActivate, lock, onActivate]);

	return (
		<div ref={handleRef} onClick={handleClick}>
			{children}
		</div>
	);
};

export default KeyboardNavigable;
