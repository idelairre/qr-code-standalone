import type { IconButtonProps, SpanProps } from "@chakra-ui/react"
import {
    ClientOnly,
    IconButton,
    Skeleton,
    Span
} from "@chakra-ui/react"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"

// Context
const ColorModeContext = React.createContext<{
    colorMode: 'light' | 'dark';
    toggleColorMode: () => void;
    setColorMode: (mode: 'light' | 'dark') => void;
}>({
    colorMode: 'light',
    toggleColorMode: () => { },
    setColorMode: () => { },
});

export interface ColorModeProviderProps {
    children: React.ReactNode;
    storageKey?: string;
    defaultTheme?: 'light' | 'dark' | 'system';
}

export function ColorModeProvider({
    children,
    storageKey = 'qr-code-color-mode',
    defaultTheme = 'system',
}: ColorModeProviderProps) {
    const [colorMode, setColorMode] = React.useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(storageKey);
            if (saved === 'light' || saved === 'dark') return saved;
            if (defaultTheme === 'system') {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            return defaultTheme;
        }
        return 'light';
    });
    const [mounted, setMounted] = React.useState(false);

    // On mount, sync with localStorage and system
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(storageKey);
            if (saved === 'light' || saved === 'dark') {
                setColorMode(saved);
            } else if (defaultTheme === 'system') {
                setColorMode(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            } else {
                setColorMode(defaultTheme);
            }
            setMounted(true);
        }
    }, [defaultTheme, storageKey]);

    // Update <html> class and localStorage
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(colorMode);
            localStorage.setItem(storageKey, colorMode);
        }
    }, [colorMode, storageKey]);

    const toggleColorMode = React.useCallback(() => {
        setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    const setColorModeValue = React.useCallback((value: 'light' | 'dark') => {
        setColorMode(value);
    }, []);

    const contextValue = React.useMemo(
        () => ({ colorMode, toggleColorMode, setColorMode: setColorModeValue }),
        [colorMode, toggleColorMode, setColorModeValue]
    );

    return (
        <ColorModeContext.Provider value={contextValue}>
            {mounted ? children : null}
        </ColorModeContext.Provider>
    );
}

export type ColorMode = "light" | "dark"

export interface UseColorModeReturn {
    colorMode: ColorMode
    setColorMode: (colorMode: ColorMode) => void
    toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
    const context = React.useContext(ColorModeContext);
    if (!context) {
        throw new Error('useColorMode must be used within a ColorModeProvider');
    }
    return context;
}

export function useColorModeValue<T>(lightValue: T, darkValue: T): T {
    const { colorMode } = useColorMode();
    return colorMode === "dark" ? darkValue : lightValue;
}

export function ColorModeIcon() {
    const { colorMode } = useColorMode();
    return colorMode === "dark" ? <LuMoon size={18} /> : <LuSun size={18} />;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> { }

export const ColorModeButton = React.forwardRef<
    HTMLButtonElement,
    ColorModeButtonProps
>(function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode();
    return (
        <ClientOnly fallback={<Skeleton boxSize="8" />}>
            <IconButton
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle color mode"
                size="sm"
                ref={ref}
                {...props}
            >
                <ColorModeIcon />
            </IconButton>
        </ClientOnly>
    );
});

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
    function LightMode(props, ref) {
        return (
            <Span
                color="fg"
                display="contents"
                className="chakra-theme light"
                colorPalette="gray"
                colorScheme="light"
                ref={ref}
                {...props}
            />
        );
    },
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
    function DarkMode(props, ref) {
        return (
            <Span
                color="fg"
                display="contents"
                className="chakra-theme dark"
                colorPalette="gray"
                colorScheme="dark"
                ref={ref}
                {...props}
            />
        );
    },
);
