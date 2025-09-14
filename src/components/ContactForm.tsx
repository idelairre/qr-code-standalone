import React from "react";
import {
    Box,
    Text,
    VStack,
    HStack,
    Stack,
    Field,
    Input,
    Select,
    Portal,
    Button,
} from "@chakra-ui/react";
import { LuTriangle, LuInfo, LuX } from "react-icons/lu";
import { useColorModeValue } from "./ui/color-mode";
import { createListCollection } from "@chakra-ui/react";
import { ContactInfo, validateVCardFields } from "../utils/vcardUtils";

interface ContactFormProps {
    contactInfo: ContactInfo;
    onInputChange: (field: keyof ContactInfo, value: string) => void;
    vcardVersion: "2.1" | "3.0" | "4.0" | "mecard";
    onVcardVersionChange: (version: string) => void;
    showV4Warning: boolean;
    onCloseV4Warning: () => void;
    mecardNickname: string;
    setMecardNickname: (value: string) => void;
    mecardBirthday: string;
    setMecardBirthday: (value: string) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
    contactInfo,
    onInputChange,
    vcardVersion,
    onVcardVersionChange,
    showV4Warning,
    onCloseV4Warning,
    mecardNickname,
    setMecardNickname,
    mecardBirthday,
    setMecardBirthday,
}) => {
    const textColor = useColorModeValue("gray.900", "gray.50");

    const phoneTypesCollection = createListCollection({
        items: [
            { label: "Mobile", value: "CELL" },
            { label: "Work", value: "WORK" },
            { label: "Home", value: "HOME" },
            { label: "Fax", value: "FAX" },
        ],
    });

    const emailTypesCollection = createListCollection({
        items: [
            { label: "Work", value: "WORK" },
            { label: "Personal", value: "HOME" },
        ],
    });

    const genderTypesCollection = createListCollection({
        items: [
            { label: "Male", value: "M" },
            { label: "Female", value: "F" },
            { label: "Other", value: "O" },
            { label: "Not specified", value: "N" },
            { label: "Unknown", value: "U" },
        ],
    });

    const vcardVersionsCollection = createListCollection({
        items: [
            { label: "vCard 2.1 (Maximum Compatibility)", value: "2.1" },
            { label: "vCard 3.0 (Recommended)", value: "3.0" },
            { label: "vCard 4.0 (Latest Standard)", value: "4.0" },
            { label: "MECARD (Compact Format)", value: "mecard" },
        ],
    });

    return (
        <VStack gap={6} align="stretch">
            {/* vCard Version Selection */}
            <Box>
                <Text mb={2} fontWeight="medium" color={textColor}>vCard Version</Text>
                <Select.Root
                    collection={vcardVersionsCollection}
                    value={[vcardVersion]}
                    onValueChange={(e) => onVcardVersionChange(e.value[0])}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select vCard version" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {vcardVersionsCollection.items.map((version) => (
                                    <Select.Item key={version.value} item={version}>
                                        {version.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Box>

            {/* vCard 4.0 Warning Alert */}
            {showV4Warning && (
                <Box
                    p={3}
                    bg="orange.50"
                    border="1px solid"
                    borderColor="orange.200"
                    borderRadius="md"
                    _dark={{
                        bg: "orange.900",
                        borderColor: "orange.700"
                    }}
                >
                    <HStack align="flex-start" gap={2}>
                        <LuTriangle
                            color="orange.500"
                            size={16}
                            style={{ marginTop: "2px", flexShrink: 0 }}
                        />
                        <VStack align="flex-start" gap={1} flex={1}>
                            <Text fontWeight="medium" color="orange.800" _dark={{ color: "orange.200" }}>
                                vCard 4.0 Compatibility Notice
                            </Text>
                            <Text fontSize="sm" color="orange.700" _dark={{ color: "orange.300" }}>
                                vCard 4.0 is the latest standard but may not be supported by all older devices and QR code scanners.
                                For maximum compatibility, consider using vCard 3.0 or 2.1 instead.
                            </Text>
                        </VStack>
                        <Button
                            size="xs"
                            variant="ghost"
                            color="orange.600"
                            _dark={{ color: "orange.300" }}
                            _hover={{
                                bg: "orange.100",
                                _dark: { bg: "orange.800" }
                            }}
                            onClick={onCloseV4Warning}
                            p={1}
                            minW="auto"
                            h="auto"
                        >
                            <LuX size={14} />
                        </Button>
                    </HStack>
                </Box>
            )}

            {/* MECARD Field Limitations Notice */}
            {vcardVersion === "mecard" && (
                <Box
                    p={3}
                    bg="blue.50"
                    border="1px solid"
                    borderColor="blue.200"
                    _dark={{
                        bg: "blue.900",
                        borderColor: "blue.700"
                    }}
                >
                    <HStack align="flex-start" gap={2}>
                        <LuInfo
                            color="blue.500"
                            size={16}
                            style={{ marginTop: "2px", flexShrink: 0 }}
                        />
                        <VStack align="flex-start" gap={1} flex={1}>
                            <Text fontWeight="medium" color="blue.800" _dark={{ color: "blue.200" }}>
                                MECARD Format Notice
                            </Text>
                            <Text fontSize="sm" color="blue.700" _dark={{ color: "blue.300" }}>
                                MECARD supports: Name, Phone, Email, Organization, Website, Note, Address, Birthday, and Nickname.
                                Prefix/Suffix, Department, Title, Phone/Email types, Gender, and Anniversary are not supported.
                                This creates smaller QR codes with essential contact information only.
                            </Text>
                        </VStack>
                    </HStack>
                </Box>
            )}

            {/* Validation Errors */}
            {(() => {
                const validation = validateVCardFields(contactInfo, vcardVersion);
                if (!validation.isValid) {
                    return (
                        <Box
                            p={3}
                            bg="red.50"
                            border="1px solid"
                            borderColor="red.200"
                            borderRadius="md"
                            _dark={{
                                bg: "red.900",
                                borderColor: "red.700"
                            }}
                        >
                            <HStack align="flex-start" gap={2}>
                                <LuTriangle
                                    color="red.500"
                                    size={16}
                                    style={{ marginTop: "2px", flexShrink: 0 }}
                                />
                                <VStack align="flex-start" gap={1} flex={1}>
                                    <Text fontWeight="medium" color="red.800" _dark={{ color: "red.200" }}>
                                        Validation Errors
                                    </Text>
                                    {validation.errors.map((error, index) => (
                                        <Text key={index} fontSize="sm" color="red.700" _dark={{ color: "red.300" }}>
                                            • {error}
                                        </Text>
                                    ))}
                                </VStack>
                            </HStack>
                        </Box>
                    );
                }
                return null;
            })()}

            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>First Name</Field.Label>
                    <Input
                        value={contactInfo.firstName}
                        onChange={(e) => onInputChange("firstName", e.target.value)}
                        placeholder="John"
                    />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label>Last Name</Field.Label>
                    <Input
                        value={contactInfo.lastName}
                        onChange={(e) => onInputChange("lastName", e.target.value)}
                        placeholder="Doe"
                    />
                </Field.Root>
            </Stack>

            {/* Prefix and Suffix - not supported in MECARD */}
            {vcardVersion !== "mecard" && (
                <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                    <Field.Root orientation="horizontal">
                        <Field.Label>Prefix</Field.Label>
                        <Input
                            value={contactInfo.prefix}
                            onChange={(e) => onInputChange("prefix", e.target.value)}
                            placeholder="Dr."
                        />
                    </Field.Root>
                    <Field.Root orientation="horizontal">
                        <Field.Label>Suffix</Field.Label>
                        <Input
                            value={contactInfo.suffix}
                            onChange={(e) => onInputChange("suffix", e.target.value)}
                            placeholder="Jr."
                        />
                    </Field.Root>
                </Stack>
            )}

            {/* Organization - supported in all vCard versions */}
            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Organization</Field.Label>
                    <Input
                        value={contactInfo.organization}
                        onChange={(e) => onInputChange("organization", e.target.value)}
                        placeholder="Company Name"
                    />
                </Field.Root>
                {/* Department/Org Unit - not supported in MECARD */}
                {vcardVersion !== "mecard" && (
                    <Field.Root orientation="horizontal">
                        <Field.Label>Department</Field.Label>
                        <Input
                            value={contactInfo.orgUnit}
                            onChange={(e) => onInputChange("orgUnit", e.target.value)}
                            placeholder="Engineering"
                        />
                    </Field.Root>
                )}
            </Stack>

            {/* Title - not supported in MECARD */}
            {vcardVersion !== "mecard" && (
                <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                    <Field.Root orientation="horizontal">
                        <Field.Label>Title</Field.Label>
                        <Input
                            value={contactInfo.title}
                            onChange={(e) => onInputChange("title", e.target.value)}
                            placeholder="Software Engineer"
                        />
                    </Field.Root>
                </Stack>
            )}

            {/* Phone - supported in all vCard versions */}
            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Phone</Field.Label>
                    <Input
                        value={contactInfo.phone}
                        onChange={(e) => onInputChange("phone", e.target.value)}
                        placeholder="+1234567890"
                    />
                </Field.Root>
                {/* Phone Type - not supported in MECARD */}
                {vcardVersion !== "mecard" && (
                    <Field.Root orientation="horizontal">
                        <Field.Label>Phone Type</Field.Label>
                        <Select.Root
                            collection={phoneTypesCollection}
                            value={[contactInfo.phoneType]}
                            onValueChange={(e) => onInputChange("phoneType", e.value[0])}
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select phone type" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {phoneTypesCollection.items.map((type) => (
                                            <Select.Item key={type.value} item={type}>
                                                {type.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Field.Root>
                )}
            </Stack>

            {/* Email - supported in all vCard versions */}
            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Email</Field.Label>
                    <Input
                        value={contactInfo.email}
                        onChange={(e) => onInputChange("email", e.target.value)}
                        placeholder="john@example.com"
                        type="email"
                    />
                </Field.Root>
                {/* Email Type - only show for vCard 2.1 and 3.0, not 4.0 or MECARD */}
                {(vcardVersion === "2.1" || vcardVersion === "3.0") && (
                    <Field.Root orientation="horizontal">
                        <Field.Label>Email Type</Field.Label>
                        <Select.Root
                            collection={emailTypesCollection}
                            value={[contactInfo.emailType]}
                            onValueChange={(e) => onInputChange("emailType", e.value[0])}
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select email type" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {emailTypesCollection.items.map((type) => (
                                            <Select.Item key={type.value} item={type}>
                                                {type.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Field.Root>
                )}
            </Stack>

            {/* Address - supported in all vCard versions */}
            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Street Address</Field.Label>
                    <Input
                        value={contactInfo.streetAddress || ""}
                        onChange={(e) => onInputChange("streetAddress", e.target.value)}
                        placeholder="123 Main St."
                    />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label>City</Field.Label>
                    <Input
                        value={contactInfo.city || ""}
                        onChange={(e) => onInputChange("city", e.target.value)}
                        placeholder="Springfield"
                    />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label>State/Province</Field.Label>
                    <Input
                        value={contactInfo.state || ""}
                        onChange={(e) => onInputChange("state", e.target.value)}
                        placeholder="IL"
                    />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label>Postal Code</Field.Label>
                    <Input
                        value={contactInfo.postalCode || ""}
                        onChange={(e) => onInputChange("postalCode", e.target.value)}
                        placeholder="12345"
                    />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label>Country</Field.Label>
                    <Input
                        value={contactInfo.country || ""}
                        onChange={(e) => onInputChange("country", e.target.value)}
                        placeholder="USA"
                    />
                </Field.Root>
            </Stack>

            {/* Birthday - supported in vCard 2.1, 3.0, 4.0 and MECARD */}
            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Birthday (YYYY-MM-DD)</Field.Label>
                    <Input
                        value={contactInfo.birthday || ""}
                        onChange={(e) => onInputChange("birthday", e.target.value)}
                        placeholder="1970-03-10"
                        type="date"
                    />
                </Field.Root>
            </Stack>

            {/* Gender - only supported in vCard 4.0 */}
            {vcardVersion === "4.0" && (
                <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                    <Field.Root orientation="horizontal">
                        <Field.Label>Gender</Field.Label>
                        <Select.Root
                            collection={genderTypesCollection}
                            value={[contactInfo.gender || ""]}
                            onValueChange={(e) => onInputChange("gender", e.value[0])}
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select gender" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {genderTypesCollection.items.map((gender) => (
                                            <Select.Item key={gender.value} item={gender}>
                                                {gender.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Field.Root>
                </Stack>
            )}

            {/* Anniversary - only supported in vCard 4.0 */}
            {vcardVersion === "4.0" && (
                <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                    <Field.Root orientation="horizontal">
                        <Field.Label>Anniversary (YYYY-MM-DD)</Field.Label>
                        <Input
                            value={contactInfo.anniversary || ""}
                            onChange={(e) => onInputChange("anniversary", e.target.value)}
                            placeholder="1990-10-21"
                            type="date"
                        />
                    </Field.Root>
                </Stack>
            )}

            {/* Website URL - supported in all vCard versions */}
            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Website</Field.Label>
                    <Input
                        value={contactInfo.url}
                        onChange={(e) => onInputChange("url", e.target.value)}
                        placeholder="https://example.com"
                        type="url"
                    />
                </Field.Root>
            </Stack>

            {/* Note - supported in all vCard versions */}
            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Note</Field.Label>
                    <Input
                        value={contactInfo.note}
                        onChange={(e) => onInputChange("note", e.target.value)}
                        placeholder="Scan to connect!"
                    />
                </Field.Root>
            </Stack>

            {/* MECARD specific fields */}
            {vcardVersion === "mecard" && (
                <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                    <Field.Root orientation="horizontal">
                        <Field.Label>Nickname</Field.Label>
                        <Input
                            value={mecardNickname}
                            onChange={(e) => setMecardNickname(e.target.value)}
                            placeholder="Johnny"
                        />
                    </Field.Root>
                    <Field.Root orientation="horizontal">
                        <Field.Label>Birthday (YYYYMMDD)</Field.Label>
                        <Input
                            value={mecardBirthday}
                            onChange={(e) => setMecardBirthday(e.target.value)}
                            placeholder="19700310"
                            maxLength={8}
                        />
                    </Field.Root>
                </Stack>
            )}
        </VStack>
    );
};

export default ContactForm;
