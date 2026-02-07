import { useCallback, useRef, type FC, type MouseEvent, type ReactNode } from 'react';
import { useKeyboardNavigation } from './KeyboardNavigationProvider';

interface KeyboardNavigableProps {
	children: ReactNode;
	targetSelector?: string;
	interactive?: boolean;
	onActivate?: () => void;
}

const KeyboardNavigable: FC<KeyboardNavigableProps> = ({ children, targetSelector, interactive, onActivate }) => {
	const { register, lock } = useKeyboardNavigation();
	const wrapperRef = useRef<HTMLDivElement>(null);

	const handleRef = useCallback(
		(el: HTMLDivElement | null) => {
			wrapperRef.current = el;
			const target = targetSelector ? el?.closest<HTMLElement>(targetSelector) : el;
			register(target ?? null);
		},
		[register, targetSelector]
	);

	const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
		if (e.target !== e.currentTarget) return;

		if (interactive) lock();
		onActivate?.();
	}, [interactive, lock, onActivate]);

	return (
		<div ref={handleRef} onClick={handleClick}>
			{children}
		</div>
	);
};

export default KeyboardNavigable;
