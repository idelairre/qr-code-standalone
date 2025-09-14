import React from 'react';
import {
    Button,
    CloseButton,
    ColorPicker,
    Dialog,
    Field,
    HStack,
    Slider,
    Switch,
    Text,
    VStack,
    parseColor,
    Portal,
} from '@chakra-ui/react';

interface ConversionOptions {
    threshold: number;
    color: string;
    background: string;
    optCurve: boolean;
    optTolerance: number;
    speckleSize: number;
}

interface ConversionOptionsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    options: ConversionOptions;
    onOptionsChange: (options: ConversionOptions) => void;
    subtextColor: string;
}

const ConversionOptionsDialog: React.FC<ConversionOptionsDialogProps> = ({
    isOpen,
    onClose,
    options,
    onOptionsChange,
    subtextColor,
}) => {
    const handleOptionChange = (key: keyof ConversionOptions, value: string | number | boolean) => {
        const newOptions = {
            ...options,
            [key]: value,
        };
        onOptionsChange(newOptions);
    };

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(e) => !e.open && onClose()}
            lazyMount
            scrollBehavior="inside"
            motionPreset="scale"
            restoreFocus
            size="lg"
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header flexShrink={0} p={6}>
                            <HStack justify="space-between" align="center" w="full">
                                <Dialog.Title fontSize="xl" fontWeight="semibold">
                                    PNG to SVG Conversion Options
                                </Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                </Dialog.CloseTrigger>
                            </HStack>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack gap={6} align="stretch">
                                <Text color={subtextColor} fontSize="sm">
                                    Adjust these settings to control how your PNG image is converted to SVG format.
                                </Text>

                                {/* Threshold Slider */}
                                <Field.Root>
                                    <HStack justify="space-between" align="center" mb={2}>
                                        <Field.Label fontSize="md" fontWeight="medium">
                                            Detail Level
                                        </Field.Label>
                                        <Text fontSize="md" fontWeight="medium" color="fg">
                                            {options.threshold}
                                        </Text>
                                    </HStack>
                                    <Slider.Root
                                        value={[options.threshold]}
                                        onValueChange={(details) => {
                                            handleOptionChange('threshold', details.value[0]);
                                        }}
                                        min={0}
                                        max={255}
                                        step={1}
                                        size="lg"
                                        key={`threshold-${options.threshold}`}
                                    >
                                        <Slider.Control>
                                            <Slider.Track>
                                                <Slider.Range />
                                            </Slider.Track>
                                            <Slider.Thumbs />
                                        </Slider.Control>
                                    </Slider.Root>
                                    <Field.HelperText>
                                        Lower values = more detail, higher values = simpler shapes
                                    </Field.HelperText>
                                </Field.Root>

                                {/* Optimize Curves Switch */}
                                <Field.Root>
                                    <HStack justify="space-between" align="center">
                                        <VStack align="start" gap={1}>
                                            <Field.Label fontSize="md" fontWeight="medium">
                                                Optimize Curves
                                            </Field.Label>
                                            <Field.HelperText>
                                                Smooth curves for better quality
                                            </Field.HelperText>
                                        </VStack>
                                        <Switch.Root
                                            checked={options.optCurve}
                                            onCheckedChange={(details) => handleOptionChange('optCurve', details.checked)}
                                            size="lg"
                                        >
                                            <Switch.Thumb />
                                        </Switch.Root>
                                    </HStack>
                                </Field.Root>

                                {/* Fill Color */}
                                <Field.Root>
                                    <Field.Label fontSize="md" fontWeight="medium">Fill Color</Field.Label>
                                    <ColorPicker.Root
                                        value={parseColor(options.color)}
                                        onValueChange={(details) => handleOptionChange('color', details.value.toString('hex'))}
                                        w="full"
                                    >
                                        <ColorPicker.HiddenInput />
                                        <ColorPicker.Control>
                                            <ColorPicker.Input />
                                            <ColorPicker.Trigger />
                                        </ColorPicker.Control>
                                        <Portal>
                                            <ColorPicker.Positioner>
                                                <ColorPicker.Content>
                                                    <ColorPicker.Area />
                                                    <HStack>
                                                        <ColorPicker.EyeDropper size="xs" variant="outline" />
                                                        <ColorPicker.Sliders />
                                                    </HStack>
                                                </ColorPicker.Content>
                                            </ColorPicker.Positioner>
                                        </Portal>
                                    </ColorPicker.Root>
                                    <Field.HelperText>
                                        Color used for the SVG paths
                                    </Field.HelperText>
                                </Field.Root>

                                {/* Background Color */}
                                <Field.Root>
                                    <Field.Label fontSize="md" fontWeight="medium">Background</Field.Label>
                                    <ColorPicker.Root
                                        value={options.background === 'transparent' ? parseColor('#ffffff') : parseColor(options.background)}
                                        onValueChange={(details) => {
                                            const hexValue = details.value.toString('hex');
                                            handleOptionChange('background', hexValue);
                                        }}
                                        w="full"
                                    >
                                        <ColorPicker.HiddenInput />
                                        <ColorPicker.Control>
                                            <ColorPicker.Input />
                                            <ColorPicker.Trigger />
                                        </ColorPicker.Control>
                                        <Portal>
                                            <ColorPicker.Positioner>
                                                <ColorPicker.Content>
                                                    <ColorPicker.Area />
                                                    <HStack>
                                                        <ColorPicker.EyeDropper size="xs" variant="outline" />
                                                        <ColorPicker.Sliders />
                                                    </HStack>
                                                </ColorPicker.Content>
                                            </ColorPicker.Positioner>
                                        </Portal>
                                    </ColorPicker.Root>
                                    <Field.HelperText>
                                        Background color (use "transparent" for no background)
                                    </Field.HelperText>
                                </Field.Root>

                                {/* Curve Tolerance Slider */}
                                <Field.Root>
                                    <HStack justify="space-between" align="center" mb={2}>
                                        <Field.Label fontSize="md" fontWeight="medium">
                                            Curve Smoothness
                                        </Field.Label>
                                        <Text fontSize="md" fontWeight="medium" color="fg">
                                            {options.optTolerance.toFixed(1)}
                                        </Text>
                                    </HStack>
                                    <Slider.Root
                                        value={[options.optTolerance]}
                                        onValueChange={(details) => handleOptionChange('optTolerance', details.value[0])}
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        size="lg"
                                        key={`optTolerance-${options.optTolerance}`}
                                    >
                                        <Slider.Control>
                                            <Slider.Track>
                                                <Slider.Range />
                                            </Slider.Track>
                                            <Slider.Thumbs />
                                        </Slider.Control>
                                    </Slider.Root>
                                    <Field.HelperText>
                                        Higher values = smoother curves
                                    </Field.HelperText>
                                </Field.Root>

                                {/* Speckle Size Slider */}
                                <Field.Root>
                                    <HStack justify="space-between" align="center" mb={2}>
                                        <Field.Label fontSize="md" fontWeight="medium">
                                            Detail Filter
                                        </Field.Label>
                                        <Text fontSize="md" fontWeight="medium" color="fg">
                                            {options.speckleSize}
                                        </Text>
                                    </HStack>
                                    <Slider.Root
                                        value={[options.speckleSize]}
                                        onValueChange={(details) => handleOptionChange('speckleSize', details.value[0])}
                                        min={0}
                                        max={10}
                                        step={1}
                                        size="lg"
                                        key={`speckleSize-${options.speckleSize}`}
                                    >
                                        <Slider.Control>
                                            <Slider.Track>
                                                <Slider.Range />
                                            </Slider.Track>
                                            <Slider.Thumbs />
                                        </Slider.Control>
                                    </Slider.Root>
                                    <Field.HelperText>
                                        Remove small details below this size
                                    </Field.HelperText>
                                </Field.Root>
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer p={6} flexShrink={0} borderTop="1px solid" borderColor="border">
                            <HStack gap={3} w="full" justify="stretch">
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" flex="1" h="50px" fontSize="md">
                                        Cancel
                                    </Button>
                                </Dialog.ActionTrigger>
                                <Button
                                    colorScheme="blue"
                                    onClick={onClose}
                                    flex="1"
                                    h="50px"
                                    fontSize="md"
                                >
                                    Apply Settings
                                </Button>
                            </HStack>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default ConversionOptionsDialog;
export type { ConversionOptions };
