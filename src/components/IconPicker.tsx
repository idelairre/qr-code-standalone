import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Dialog,
    Grid,
    Heading,
    HStack,
    Input,
    Portal,
    Select,
    Text,
    VStack,
} from '@chakra-ui/react';
import { createListCollection } from '@chakra-ui/react';
import { LuSearch, LuX, LuCheck, LuRefreshCw } from 'react-icons/lu';

// Import all icon libraries from react-icons
import * as FaIcons from 'react-icons/fa';
import * as Fa6Icons from 'react-icons/fa6';
import * as FiIcons from 'react-icons/fi';
import * as HiIcons from 'react-icons/hi';
import * as Hi2Icons from 'react-icons/hi2';
import * as IoIcons from 'react-icons/io';
import * as Io5Icons from 'react-icons/io5';
import * as LuIcons from 'react-icons/lu';
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import * as TbIcons from 'react-icons/tb';
import * as VscIcons from 'react-icons/vsc';
import * as WiIcons from 'react-icons/wi';
import * as GiIcons from 'react-icons/gi';

interface IconPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectIcon: (iconName: string, iconComponent: React.ComponentType<unknown> | React.ReactElement) => void;
    selectedIcon?: string;
}

interface IconItem {
    name: string;
    component: React.ComponentType<unknown>;
    category: string;
    library: string;
}

// Virtual scrolling hook
const useVirtualScroll = (items: IconItem[], itemHeight: number, containerHeight: number, columns: number, isMounted: boolean = true, scrollContainerRef?: React.RefObject<HTMLDivElement | null>) => {
    const [scrollTop, setScrollTop] = useState(0);
    const [actualHeight, setActualHeight] = useState(containerHeight);

    const itemsPerRow = columns;
    const rowHeight = itemHeight;
    const totalRows = Math.ceil(items.length / itemsPerRow);
    const totalHeight = totalRows * rowHeight;

    const startRow = Math.floor(scrollTop / rowHeight);
    const endRow = Math.min(
        startRow + Math.ceil(actualHeight / rowHeight) + 1,
        totalRows
    );

    // Ensure at least the first few rows are visible if container height is not properly calculated
    const minVisibleRows = Math.min(5, totalRows); // Show more rows initially
    const effectiveEndRow = actualHeight > 0 ? endRow : Math.max(endRow, minVisibleRows);

    // If we don't have a proper height yet, show at least the first few rows
    // Also ensure icons are visible when dialog is first mounted
    const finalEndRow = (actualHeight <= 0 || !isMounted) ? minVisibleRows : effectiveEndRow;

    const visibleItems = useMemo(() => {
        const visible = [];
        for (let row = startRow; row < finalEndRow; row++) {
            for (let col = 0; col < itemsPerRow; col++) {
                const index = row * itemsPerRow + col;
                if (index < items.length) {
                    visible.push({
                        ...items[index],
                        index,
                        row,
                        col
                    });
                }
            }
        }
        return visible;
    }, [items, startRow, finalEndRow, itemsPerRow]);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);

    const updateHeight = useCallback((height: number) => {
        setActualHeight(height);
    }, []);

    const resetScroll = useCallback(() => {
        setScrollTop(0);
        // Also reset the actual DOM scroll position
        if (scrollContainerRef?.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [scrollContainerRef]);

    return {
        visibleItems,
        totalHeight,
        handleScroll,
        updateHeight,
        resetScroll
    };
};

const IconPicker: React.FC<IconPickerProps> = ({ isOpen, onClose, onSelectIcon, selectedIcon }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLibrary, setSelectedLibrary] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);


    // Create comprehensive icon collection with optimized loading
    const allIcons = useMemo(() => {
        const icons: IconItem[] = [];

        // Helper function to add icons from a library
        const addIcons = (iconLibrary: Record<string, unknown>, libraryName: string, category: string) => {
            Object.entries(iconLibrary).forEach(([name, component]) => {
                if (typeof component === 'function') {
                    icons.push({
                        name: name.replace(/^[A-Z]/, (match) => match.toLowerCase()),
                        component: component as React.ComponentType<unknown>,
                        category,
                        library: libraryName
                    });
                }
            });
        };

        // Add icons from all libraries
        addIcons(FaIcons, 'Font Awesome', 'General');
        addIcons(Fa6Icons, 'Font Awesome 6', 'General');
        addIcons(FiIcons, 'Feather', 'General');
        addIcons(HiIcons, 'Heroicons', 'General');
        addIcons(Hi2Icons, 'Heroicons 2', 'General');
        addIcons(IoIcons, 'Ionicons', 'General');
        addIcons(Io5Icons, 'Ionicons 5', 'General');
        addIcons(LuIcons, 'Lucide', 'General');
        addIcons(MdIcons, 'Material Design', 'General');
        addIcons(RiIcons, 'Remix', 'General');
        addIcons(SiIcons, 'Simple Icons', 'Brands');
        addIcons(TbIcons, 'Tabler', 'General');
        addIcons(VscIcons, 'VS Code', 'Development');
        addIcons(WiIcons, 'Weather Icons', 'Weather');
        addIcons(GiIcons, 'Game Icons', 'Gaming');

        return icons;
    }, []);

    // Debounced search term for better performance
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Filter icons based on search and category with optimized filtering
    const filteredIcons = useMemo(() => {
        if (!debouncedSearchTerm && selectedCategory === 'all' && selectedLibrary === 'all') {
            return allIcons;
        }

        const filtered = allIcons.filter(icon => {
            const matchesSearch = !debouncedSearchTerm || icon.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
            const matchesLibrary = selectedLibrary === 'all' || icon.library === selectedLibrary;

            return matchesSearch && matchesCategory && matchesLibrary;
        });

        return filtered;
    }, [allIcons, debouncedSearchTerm, selectedCategory, selectedLibrary]);

    // Get unique categories and libraries
    const categories = useMemo(() => {
        const cats = Array.from(new Set(allIcons.map(icon => icon.category)));
        const items = [
            { value: 'all', label: 'All Categories' },
            ...cats.map(cat => ({ value: cat, label: cat }))
        ];
        return createListCollection({ items });
    }, [allIcons]);

    const libraries = useMemo(() => {
        const libs = Array.from(new Set(allIcons.map(icon => icon.library)));
        const items = [
            { value: 'all', label: 'All Libraries' },
            ...libs.map(lib => ({ value: lib, label: lib }))
        ];
        return createListCollection({ items });
    }, [allIcons]);

    const handleIconSelect = (iconName: string, iconComponent: React.ComponentType<unknown> | React.ReactElement) => {
        onSelectIcon(iconName, iconComponent);
        onClose();
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedLibrary('all');
    };

    // Responsive column calculation
    const getColumns = useCallback(() => {
        if (typeof window === 'undefined') return 4;
        const width = window.innerWidth;
        if (width < 640) return 4;      // mobile
        if (width < 768) return 6;      // small tablet
        if (width < 1024) return 8;     // tablet
        return 10;                      // desktop
    }, []);

    const [columns, setColumns] = useState(4);

    useEffect(() => {
        const updateColumns = () => setColumns(getColumns());
        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    // Virtual scrolling configuration
    const itemHeight = 100; // Height of each icon item (increased for mobile)
    const containerHeight = 500; // Default height, will be overridden by actual height

    const { visibleItems, totalHeight, handleScroll, updateHeight, resetScroll } = useVirtualScroll(
        filteredIcons,
        itemHeight,
        containerHeight,
        columns,
        isMounted,
        scrollContainerRef
    );

    // Consolidated effect for modal state, scroll reset, and height management
    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            // Reset scroll position when modal opens to ensure it starts at the top
            resetScroll();
        } else {
            setIsMounted(false);
            // Reset scroll position when modal closes
            resetScroll();
        }
    }, [isOpen]);

    // Consolidated effect for height calculations and resize handling
    useEffect(() => {
        if (!isOpen || !scrollContainerRef.current) return;

        const updateHeightCallback = () => {
            if (scrollContainerRef.current) {
                const height = scrollContainerRef.current.clientHeight;
                updateHeight(height);
            }
        };

        // Immediate update when icons change or modal opens
        updateHeightCallback();

        // Multiple timing strategies for robust height calculation
        const timers = [
            setTimeout(updateHeightCallback, 50),   // Quick update for icon changes
            setTimeout(updateHeightCallback, 100),  // DOM rendering delay
            setTimeout(updateHeightCallback, 500),  // Fallback for complex layouts
        ];

        // Add resize listener
        window.addEventListener('resize', updateHeightCallback);

        return () => {
            // Cleanup all timers and event listener
            timers.forEach(timer => clearTimeout(timer));
            window.removeEventListener('resize', updateHeightCallback);
        };
    }, [isOpen, filteredIcons]);

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW="95vw"
                        w="full"
                        maxH="90vh"
                        h="90vh"
                        display="flex"
                        flexDirection="column"
                        overflow="hidden"
                        bg="bg"
                        color="fg"
                        borderRadius="sm"
                        boxShadow="none"
                        border="none"
                    >
                        <Dialog.Header flexShrink={0} p={4}>
                            <HStack justify="space-between" align="center" w="full">
                                <Heading size="lg">Select Icon</Heading>
                                <Button variant="ghost" size="lg" onClick={onClose} minH="44px" minW="44px">
                                    <LuX size={24} />
                                </Button>
                            </HStack>
                        </Dialog.Header>

                        <Dialog.Body p={0} flex="1" overflow="hidden">
                            <VStack gap={0} h="full" overflow="hidden">
                                {/* Search and Filters */}
                                <Box p={4} w="full" borderBottom="1px solid" borderColor="border" flexShrink={0}>
                                    <VStack gap={4} align="stretch" w="full">
                                        {/* Search */}
                                        <Box position="relative" w="full">
                                            <Input
                                                placeholder="Search icons..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                pl={12}
                                                size="lg"
                                                w="full"
                                                h="48px"
                                                fontSize="md"
                                            />
                                            <Box position="absolute" left={4} top="50%" transform="translateY(-50%)">
                                                <LuSearch size={20} color="fg.muted" />
                                            </Box>
                                        </Box>

                                        {/* Filters */}
                                        <HStack gap={3} wrap="wrap" w="full">
                                            <Box flex="1" minW="140px" maxW="200px">
                                                <Select.Root
                                                    collection={categories}
                                                    value={[selectedCategory]}
                                                    onValueChange={(e) => setSelectedCategory(e.value[0])}
                                                >
                                                    <Select.HiddenSelect />
                                                    <Select.Control>
                                                        <Select.Trigger w="full" h="48px">
                                                            <Select.ValueText placeholder="Category" />
                                                        </Select.Trigger>
                                                        <Select.IndicatorGroup>
                                                            <Select.Indicator />
                                                        </Select.IndicatorGroup>
                                                    </Select.Control>
                                                    <Portal>
                                                        <Select.Positioner>
                                                            <Select.Content>
                                                                {categories.items.map((cat) => (
                                                                    <Select.Item key={cat.value} item={cat}>
                                                                        {cat.label}
                                                                        <Select.ItemIndicator />
                                                                    </Select.Item>
                                                                ))}
                                                            </Select.Content>
                                                        </Select.Positioner>
                                                    </Portal>
                                                </Select.Root>
                                            </Box>
                                            <Box flex="1" minW="140px" maxW="200px">
                                                <Select.Root
                                                    collection={libraries}
                                                    value={[selectedLibrary]}
                                                    onValueChange={(e) => setSelectedLibrary(e.value[0])}
                                                >
                                                    <Select.HiddenSelect />
                                                    <Select.Control>
                                                        <Select.Trigger w="full" h="48px">
                                                            <Select.ValueText placeholder="Library" />
                                                        </Select.Trigger>
                                                        <Select.IndicatorGroup>
                                                            <Select.Indicator />
                                                        </Select.IndicatorGroup>
                                                    </Select.Control>
                                                    <Portal>
                                                        <Select.Positioner>
                                                            <Select.Content>
                                                                {libraries.items.map((lib) => (
                                                                    <Select.Item key={lib.value} item={lib}>
                                                                        {lib.label}
                                                                        <Select.ItemIndicator />
                                                                    </Select.Item>
                                                                ))}
                                                            </Select.Content>
                                                        </Select.Positioner>
                                                    </Portal>
                                                </Select.Root>
                                            </Box>
                                            <Button size="lg" variant="outline" onClick={handleReset} flexShrink={0} h="48px" minW="100px">
                                                <LuRefreshCw style={{ marginRight: "8px" }} size={18} />
                                                Reset
                                            </Button>
                                        </HStack>

                                        {/* Results count and loading indicator */}
                                        <HStack justify="space-between" align="center" w="full">
                                            <Text fontSize="sm" color="fg.muted">
                                                {isLoading ? 'Searching...' : `${filteredIcons.length} icons found`}
                                            </Text>
                                            {isLoading && (
                                                <Box
                                                    w={4}
                                                    h={4}
                                                    border="2px solid"
                                                    borderColor="blue.200"
                                                    borderTopColor="blue.500"
                                                    borderRadius="full"
                                                    animation="spin 1s linear infinite"
                                                    css={{
                                                        '@keyframes spin': {
                                                            '0%': { transform: 'rotate(0deg)' },
                                                            '100%': { transform: 'rotate(360deg)' }
                                                        }
                                                    }}
                                                />
                                            )}
                                        </HStack>
                                    </VStack>
                                </Box>

                                {/* Virtualized Icons Grid */}
                                <Box flex="1" w="full" overflow="hidden" minH={0}>
                                    <Box
                                        ref={scrollContainerRef}
                                        h="full"
                                        overflowY="auto"
                                        overflowX="hidden"
                                        onScroll={handleScroll}
                                        css={{
                                            '&::-webkit-scrollbar': {
                                                width: '8px',
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                background: 'transparent',
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                background: '#cbd5e0',
                                                borderRadius: '4px',
                                            },
                                            '&::-webkit-scrollbar-thumb:hover': {
                                                background: '#a0aec0',
                                            },
                                        }}
                                    >
                                        <Box
                                            position="relative"
                                            height={`${totalHeight}px`}
                                            p={4}
                                            w="full"
                                        >
                                            <Grid
                                                templateColumns={`repeat(${columns}, 1fr)`}
                                                gap={2}
                                                position="absolute"
                                                top={0}
                                                left={0}
                                                right={0}
                                                w="full"
                                                transform={`translateY(${Math.floor(visibleItems[0]?.row || 0) * itemHeight}px)`}
                                            >
                                                {visibleItems.map((icon) => {
                                                    const IconComponent = icon.component;
                                                    const isSelected = selectedIcon === icon.name;

                                                    return (
                                                        <Button
                                                            key={`${icon.library}-${icon.name}-${icon.index}`}
                                                            variant="ghost"
                                                            size="lg"
                                                            h={`${itemHeight - 4}px`}
                                                            p={3}
                                                            w="full"
                                                            minW={0}
                                                            minH="60px"
                                                            onClick={() => handleIconSelect(icon.name, icon.component)}
                                                            bg={isSelected ? "blue.100" : "transparent"}
                                                            _dark={{
                                                                bg: isSelected ? "blue.900" : "transparent"
                                                            }}
                                                            _hover={{
                                                                bg: isSelected ? "blue.200" : "gray.100",
                                                                _dark: {
                                                                    bg: isSelected ? "blue.800" : "gray.700"
                                                                }
                                                            }}
                                                            position="relative"
                                                        >
                                                            <VStack gap={1} align="center">
                                                                <IconComponent />
                                                                <Text
                                                                    fontSize="sm"
                                                                    textAlign="center"
                                                                    w="full"
                                                                    minW={0}
                                                                    fontWeight="medium"
                                                                    style={{
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    {icon.name}
                                                                </Text>
                                                                {isSelected && (
                                                                    <Box
                                                                        position="absolute"
                                                                        top={1}
                                                                        right={1}
                                                                        bg="blue.500"
                                                                        borderRadius="full"
                                                                        p={0.5}
                                                                    >
                                                                        <LuCheck size={8} color="white" />
                                                                    </Box>
                                                                )}
                                                            </VStack>
                                                        </Button>
                                                    );
                                                })}
                                            </Grid>

                                            {filteredIcons.length === 0 && (
                                                <Box
                                                    textAlign="center"
                                                    py={8}
                                                    position="absolute"
                                                    top="50%"
                                                    left="50%"
                                                    transform="translate(-50%, -50%)"
                                                    w="full"
                                                >
                                                    <Text color="fg.muted" fontSize="lg">
                                                        No icons found
                                                    </Text>
                                                    <Text color="fg.muted" fontSize="sm" mt={2}>
                                                        Try adjusting your search or filters
                                                    </Text>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </VStack>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default IconPicker;
