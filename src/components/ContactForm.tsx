import {
   Box,
   Button,
   createListCollection,
   Field,
   HStack,
   Input,
   Portal,
   Select,
   SimpleGrid,
   Text,
   VStack,
} from "@chakra-ui/react";
import React, { useEffect, useId, useState } from "react";
import { LuInfo, LuTriangle, LuX } from "react-icons/lu";
import { ContactInfo, validateVCardFields } from "../utils/vcardUtils";
import { useColorModeValue } from "./ui/color-mode";
import VCardDatePicker from "./VCardDatePicker";

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
   /** Tighter grids and spacing for studio / dense layouts. */
   density?: "default" | "compact";
   /** Two-column grouping on wide screens so more fits above the fold. */
   panelLayout?: "linear" | "bento";
}

function mecard8ToIso(s: string): string {
   if (!/^\d{8}$/.test(s)) return "";
   return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

function isoToMecard8(iso: string): string {
   return iso.replace(/-/g, "");
}

/** Validation messages that refer to fields in the collapsible "extra" sections. */
function vcardErrorsNeedAdvancedFields(errors: string[]): boolean {
   return errors.some(
      (e) =>
         e.includes("URL must") ||
         e.includes("Birthday must") ||
         e.includes("Anniversary must") ||
         e.includes("Gender must") ||
         e.includes("Birthday time") ||
         e.includes("Anniversary time"),
   );
}

/** Soft panel: clear grouping without heavy chrome. */
export function FormPanel({
   title,
   children,
   compact,
}: {
   title: string;
   children: React.ReactNode;
   compact?: boolean;
}) {
   const titleId = useId();
   const borderColor = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
   const bg = useColorModeValue("white", "gray.950");
   const panelShadow = useColorModeValue("xs", "none");

   return (
      <Box
         role="group"
         aria-labelledby={titleId}
         w="full"
         borderRadius="lg"
         borderWidth="1px"
         borderColor={borderColor}
         bg={bg}
         px={3}
         py={compact ? 2.5 : 3.5}
         boxShadow={panelShadow}
      >
         <Text
            as="h3"
            id={titleId}
            fontSize="xs"
            fontWeight="semibold"
            color="fg.muted"
            textTransform="uppercase"
            letterSpacing="0.07em"
            mb={2.5}
         >
            {title}
         </Text>
         {children}
      </Box>
   );
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
   density = "default",
   panelLayout = "linear",
}) => {
   const [showAdvancedFields, setShowAdvancedFields] = useState(false);

   const muted = useColorModeValue("gray.600", "gray.400");
   const warnBg = useColorModeValue("orange.50", "orange.950");
   const warnBorder = useColorModeValue("orange.200", "orange.800");
   const infoBg = useColorModeValue("blue.50", "blue.950");
   const infoBorder = useColorModeValue("blue.200", "blue.800");
   const errBg = useColorModeValue("red.50", "red.950");
   const errBorder = useColorModeValue("red.200", "red.800");

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
         { label: "vCard 2.1 (classic / widest support)", value: "2.1" },
         { label: "vCard 3.0", value: "3.0" },
         { label: "vCard 4.0", value: "4.0" },
         { label: "MECARD (compact)", value: "mecard" },
      ],
   });

   const validation = validateVCardFields(contactInfo, vcardVersion);

   useEffect(() => {
      if (!showAdvancedFields && !validation.isValid && vcardErrorsNeedAdvancedFields(validation.errors)) {
         setShowAdvancedFields(true);
      }
   }, [showAdvancedFields, validation.isValid, validation.errors]);

   const compact = density === "compact";
   const bento = panelLayout === "bento";
   const sectionGap = compact ? 2.5 : 3.5;
   const fieldGap = compact ? ({ base: 1, md: 1 } as const) : ({ base: 1, md: 2 } as const);
   const cols2 = compact ? ({ base: 1, sm: 2, lg: 3, xl: 4 } as const) : ({ base: 1, md: 2 } as const);
   const cols2max = compact ? ({ base: 1, sm: 2, lg: 4 } as const) : ({ base: 1, md: 2 } as const);

   const statusStrip = (
      <VStack gap={2} align="stretch">
         {showV4Warning && (
            <Box p={2.5} borderRadius="md" bg={warnBg} borderWidth="1px" borderColor={warnBorder}>
               <HStack align="flex-start" gap={2}>
                  <LuTriangle size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                  <VStack align="flex-start" gap={0} flex={1}>
                     <Text fontSize="sm" fontWeight="medium">
                        vCard 4.0 compatibility
                     </Text>
                     <Text fontSize="xs" color={muted}>
                        Some older scanners only support 3.0 or 2.1.
                     </Text>
                  </VStack>
                  <Button size="xs" variant="ghost" onClick={onCloseV4Warning} p={1} minW="auto">
                     <LuX size={14} />
                  </Button>
               </HStack>
            </Box>
         )}

         {vcardVersion === "mecard" && (
            <Box p={2.5} borderRadius="md" bg={infoBg} borderWidth="1px" borderColor={infoBorder}>
               <HStack align="flex-start" gap={2}>
                  <LuInfo size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                  <Text fontSize="xs" color={muted}>
                     MECARD is compact: no prefix/suffix, department, title, typed phone/email,
                     gender, or anniversary.
                  </Text>
               </HStack>
            </Box>
         )}

         {!validation.isValid && (
            <Box p={2.5} borderRadius="md" bg={errBg} borderWidth="1px" borderColor={errBorder}>
               <HStack align="flex-start" gap={2}>
                  <LuTriangle size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                  <VStack align="flex-start" gap={0} flex={1}>
                     <Text fontSize="sm" fontWeight="medium">
                        Fix before sharing
                     </Text>
                     {validation.errors.map((error, index) => (
                        <Text key={index} fontSize="xs">
                           • {error}
                        </Text>
                     ))}
                  </VStack>
               </HStack>
            </Box>
         )}
      </VStack>
   );

   const elFormat = (
      <FormPanel title="vCard format" compact={compact}>
         <Field.Root w="full">
            <Field.Label textStyle="sm">Version</Field.Label>
            <Select.Root w="full"
               collection={vcardVersionsCollection}
               value={[vcardVersion]}
               size="sm"
               onValueChange={(e) => onVcardVersionChange(e.value[0])}
            >
               <Select.HiddenSelect />
               <Select.Control w="full">
                  <Select.Trigger w="full">
                     <Select.ValueText placeholder="Version" />
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
         </Field.Root>
      </FormPanel>
   );

   const elName = (
      <FormPanel title="Name" compact={compact}>
         <SimpleGrid w="full" columns={vcardVersion === "mecard" ? { base: 1, md: 2 } : cols2} gap={fieldGap}>
            <Field.Root w="full">
               <Field.Label textStyle="sm">First name</Field.Label>
               <Input w="full"
                  size="sm"
                  value={contactInfo.firstName}
                  onChange={(e) => onInputChange("firstName", e.target.value)}
                  placeholder="Jane"
               />
            </Field.Root>
            <Field.Root w="full">
               <Field.Label textStyle="sm">Last name</Field.Label>
               <Input w="full"
                  size="sm"
                  value={contactInfo.lastName}
                  onChange={(e) => onInputChange("lastName", e.target.value)}
                  placeholder="Doe"
               />
            </Field.Root>
            {vcardVersion !== "mecard" && (
               <>
                  <Field.Root w="full">
                     <Field.Label textStyle="sm">Prefix</Field.Label>
                     <Input w="full"
                        size="sm"
                        value={contactInfo.prefix}
                        onChange={(e) => onInputChange("prefix", e.target.value)}
                        placeholder="Dr."
                     />
                  </Field.Root>
                  <Field.Root w="full">
                     <Field.Label textStyle="sm">Suffix</Field.Label>
                     <Input w="full"
                        size="sm"
                        value={contactInfo.suffix}
                        onChange={(e) => onInputChange("suffix", e.target.value)}
                        placeholder="Jr."
                     />
                  </Field.Root>
               </>
            )}
         </SimpleGrid>
      </FormPanel>
   );

   const elWork = (
      <FormPanel title="Work" compact={compact}>
         <SimpleGrid w="full" columns={cols2} gap={fieldGap}>
            <Field.Root w="full">
               <Field.Label textStyle="sm">Organization</Field.Label>
               <Input w="full"
                  size="sm"
                  value={contactInfo.organization}
                  onChange={(e) => onInputChange("organization", e.target.value)}
                  placeholder="Acme Inc."
               />
            </Field.Root>
            {vcardVersion !== "mecard" && (
               <>
                  <Field.Root w="full">
                     <Field.Label textStyle="sm">Department</Field.Label>
                     <Input w="full"
                        size="sm"
                        value={contactInfo.orgUnit}
                        onChange={(e) => onInputChange("orgUnit", e.target.value)}
                        placeholder="Engineering"
                     />
                  </Field.Root>
                  <Box gridColumn="1 / -1" w="full" minW={0}>
                     <Field.Root w="full">
                        <Field.Label textStyle="sm">Title</Field.Label>
                        <Input w="full"
                           size="sm"
                           value={contactInfo.title}
                           onChange={(e) => onInputChange("title", e.target.value)}
                           placeholder="Role / title"
                        />
                     </Field.Root>
                  </Box>
               </>
            )}
         </SimpleGrid>
      </FormPanel>
   );

   const elContact = (
      <FormPanel title="Contact" compact={compact}>
         <SimpleGrid w="full" columns={cols2max} gap={fieldGap}>
            <Field.Root w="full">
               <Field.Label textStyle="sm">Phone</Field.Label>
               <Input w="full"
                  size="sm"
                  value={contactInfo.phone}
                  onChange={(e) => onInputChange("phone", e.target.value)}
                  placeholder="+1 555 0100"
                  type="tel"
               />
            </Field.Root>
            {vcardVersion !== "mecard" && (
               <Field.Root w="full">
                  <Field.Label textStyle="sm">Phone type</Field.Label>
                  <Select.Root w="full"
                     collection={phoneTypesCollection}
                     value={[contactInfo.phoneType]}
                     size="sm"
                     onValueChange={(e) => onInputChange("phoneType", e.value[0])}
                  >
                     <Select.HiddenSelect />
                     <Select.Control w="full">
                        <Select.Trigger w="full">
                           <Select.ValueText placeholder="Type" />
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
            <Field.Root w="full">
               <Field.Label textStyle="sm">Email</Field.Label>
               <Input w="full"
                  size="sm"
                  value={contactInfo.email}
                  onChange={(e) => onInputChange("email", e.target.value)}
                  placeholder="you@example.com"
                  type="email"
               />
            </Field.Root>
            {(vcardVersion === "2.1" || vcardVersion === "3.0") && (
               <Field.Root w="full">
                  <Field.Label textStyle="sm">Email type</Field.Label>
                  <Select.Root w="full"
                     collection={emailTypesCollection}
                     value={[contactInfo.emailType]}
                     size="sm"
                     onValueChange={(e) => onInputChange("emailType", e.value[0])}
                  >
                     <Select.HiddenSelect />
                     <Select.Control w="full">
                        <Select.Trigger w="full">
                           <Select.ValueText placeholder="Type" />
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
         </SimpleGrid>
      </FormPanel>
   );

   const elAddress = (
      <FormPanel title="Address" compact={compact}>
         <SimpleGrid w="full" columns={cols2} gap={fieldGap}>
            <Box gridColumn="1 / -1" w="full" minW={0}>
               <Field.Root w="full">
                  <Field.Label textStyle="sm">Street</Field.Label>
                  <Input w="full"
                     size="sm"
                     value={contactInfo.streetAddress || ""}
                     onChange={(e) => onInputChange("streetAddress", e.target.value)}
                     placeholder="123 Main St"
                  />
               </Field.Root>
            </Box>
            <Field.Root w="full">
               <Field.Label textStyle="sm">City</Field.Label>
               <Input w="full"
                  size="sm"
                  value={contactInfo.city || ""}
                  onChange={(e) => onInputChange("city", e.target.value)}
                  placeholder="City"
               />
            </Field.Root>
            <Field.Root w="full">
               <Field.Label textStyle="sm">State / region</Field.Label>
               <Input w="full"
                  size="sm"
                  value={contactInfo.state || ""}
                  onChange={(e) => onInputChange("state", e.target.value)}
                  placeholder="ST"
               />
            </Field.Root>
            <Field.Root w="full">
               <Field.Label textStyle="sm">Postal code</Field.Label>
               <Input w="full"
                  size="sm"
                  value={contactInfo.postalCode || ""}
                  onChange={(e) => onInputChange("postalCode", e.target.value)}
                  placeholder="12345"
               />
            </Field.Root>
            <Field.Root w="full">
               <Field.Label textStyle="sm">Country</Field.Label>
               <Input w="full"
                  size="sm"
                  value={contactInfo.country || ""}
                  onChange={(e) => onInputChange("country", e.target.value)}
                  placeholder="Country"
               />
            </Field.Root>
         </SimpleGrid>
      </FormPanel>
   );

   const elPersonal =
      vcardVersion !== "mecard" ? (
         <FormPanel title="Personal" compact={compact}>
            <VStack gap={compact ? 2 : 3} align="stretch">
               <SimpleGrid w="full" columns={{ base: 1, md: 2, lg: compact ? 3 : 2 }} gap={fieldGap}>
                  <VCardDatePicker
                     label="Birthday"
                     value={contactInfo.birthday || ""}
                     onChange={(iso) => onInputChange("birthday", iso)}
                  />
                  {vcardVersion === "4.0" && (
                     <Field.Root w="full">
                        <Field.Label textStyle="sm">Birthday time</Field.Label>
                        <Input w="full"
                           size="sm"
                           type="time"
                           value={contactInfo.birthdayTime || ""}
                           onChange={(e) => onInputChange("birthdayTime", e.target.value)}
                        />
                        <Field.HelperText fontSize="xs">Optional (vCard 4.0).</Field.HelperText>
                     </Field.Root>
                  )}
               </SimpleGrid>
               {vcardVersion === "4.0" && (
                  <>
                     <SimpleGrid w="full" columns={{ base: 1, md: 2, lg: compact ? 3 : 2 }} gap={fieldGap}>
                        <Field.Root w="full">
                           <Field.Label textStyle="sm">Gender</Field.Label>
                           <Select.Root w="full"
                              collection={genderTypesCollection}
                              value={contactInfo.gender ? [contactInfo.gender] : []}
                              size="sm"
                              onValueChange={(e) => onInputChange("gender", e.value[0] ?? "")}
                           >
                              <Select.HiddenSelect />
                              <Select.Control w="full">
                                 <Select.Trigger w="full">
                                    <Select.ValueText placeholder="Select" />
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
                        <Box />
                     </SimpleGrid>
                     <SimpleGrid w="full" columns={{ base: 1, md: 2, lg: compact ? 3 : 2 }} gap={fieldGap}>
                        <VCardDatePicker
                           label="Anniversary"
                           value={contactInfo.anniversary || ""}
                           onChange={(iso) => onInputChange("anniversary", iso)}
                        />
                        <Field.Root w="full">
                           <Field.Label textStyle="sm">Anniversary time</Field.Label>
                           <Input w="full"
                              size="sm"
                              type="time"
                              value={contactInfo.anniversaryTime || ""}
                              onChange={(e) => onInputChange("anniversaryTime", e.target.value)}
                           />
                        </Field.Root>
                     </SimpleGrid>
                  </>
               )}
            </VStack>
         </FormPanel>
      ) : null;

   const elMecard =
      vcardVersion === "mecard" ? (
         <FormPanel title="MECARD extras" compact={compact}>
            <SimpleGrid w="full" columns={{ base: 1, md: 2 }} gap={fieldGap}>
               <Field.Root w="full">
                  <Field.Label textStyle="sm">Nickname</Field.Label>
                  <Input w="full"
                     size="sm"
                     value={mecardNickname}
                     onChange={(e) => setMecardNickname(e.target.value)}
                     placeholder="Nickname"
                  />
               </Field.Root>
               <VCardDatePicker
                  label="Birthday"
                  value={mecard8ToIso(mecardBirthday)}
                  onChange={(iso) => setMecardBirthday(iso ? isoToMecard8(iso) : "")}
               />
            </SimpleGrid>
         </FormPanel>
      ) : null;

   const elWeb = (
      <FormPanel title="Web & note" compact={compact}>
         <SimpleGrid w="full" columns={{ base: 1, md: 2 }} gap={fieldGap}>
            <Field.Root w="full">
               <Field.Label textStyle="sm">Website</Field.Label>
               <Input w="full"
                  size="sm"
                  value={contactInfo.url}
                  onChange={(e) => onInputChange("url", e.target.value)}
                  placeholder="https://example.com"
                  type="url"
               />
            </Field.Root>
            <Field.Root w="full">
               <Field.Label textStyle="sm">Note</Field.Label>
               <Input w="full"
                  size="sm"
                  value={contactInfo.note}
                  onChange={(e) => onInputChange("note", e.target.value)}
                  placeholder="Short note for scanners"
               />
            </Field.Root>
         </SimpleGrid>
      </FormPanel>
   );

   const advancedSections = (
      <>
         {elWork}
         {elAddress}
         {elPersonal}
         {elMecard}
         {elWeb}
      </>
   );

   const advancedToggle = (
      <Button
         variant="ghost"
         size="sm"
         w="full"
         justifyContent="center"
         fontWeight="normal"
         color="fg.muted"
         onClick={() => setShowAdvancedFields((v) => !v)}
      >
         {showAdvancedFields
            ? "Hide work, address, website, and other fields"
            : "Add work, address, website, and more"}
      </Button>
   );

   const linearStack = (
      <VStack gap={sectionGap} align="stretch" w="full">
         {elFormat}
         {elName}
         {elContact}
         {advancedToggle}
         {showAdvancedFields && advancedSections}
      </VStack>
   );

   const bentoGrid = (
      <VStack gap={sectionGap} align="stretch" w="full">
         <SimpleGrid w="full" columns={{ base: 1, xl: 2 }} gap={4} alignItems="start">
            <VStack gap={sectionGap} align="stretch" w="full" minW={0}>
               {elFormat}
               {elName}
            </VStack>
            <VStack gap={sectionGap} align="stretch" w="full" minW={0}>
               {elContact}
            </VStack>
         </SimpleGrid>
         {advancedToggle}
         {showAdvancedFields && (
            <SimpleGrid w="full" columns={{ base: 1, xl: 2 }} gap={4} alignItems="start">
               <VStack gap={sectionGap} align="stretch" w="full" minW={0}>
                  {elWork}
               </VStack>
               <VStack gap={sectionGap} align="stretch" w="full" minW={0}>
                  {elAddress}
                  {elPersonal}
                  {elMecard}
                  {elWeb}
               </VStack>
            </SimpleGrid>
         )}
      </VStack>
   );

   return (
      <VStack gap={compact ? 3 : 4} align="stretch" w="full">
         {statusStrip}
         {bento ? bentoGrid : linearStack}
      </VStack>
   );
};

export default ContactForm;
