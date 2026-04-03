import { Box, Button, Field, Portal } from "@chakra-ui/react";
import { DatePicker, parseDate, type DateValue } from "@chakra-ui/react/date-picker";
import React from "react";
import { LuCalendar } from "react-icons/lu";

function toIsoDate(v: DateValue | undefined): string {
   if (!v) return "";
   return `${v.year}-${String(v.month).padStart(2, "0")}-${String(v.day).padStart(2, "0")}`;
}

export type VCardDatePickerProps = {
   label: string;
   value: string;
   onChange: (isoDate: string) => void;
   placeholder?: string;
   disabled?: boolean;
};

/**
 * Chakra DatePicker bound to vCard-friendly YYYY-MM-DD strings.
 */
const VCardDatePicker: React.FC<VCardDatePickerProps> = ({
   label,
   value,
   onChange,
   placeholder = "Pick a date",
   disabled,
}) => {
   const parsed = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? parseDate(value) : undefined;

   return (
      <Field.Root w="full" minW={0} disabled={disabled}>
         <Field.Label textStyle="sm">{label}</Field.Label>
         <DatePicker.Root
            w="full"
            maxW="full"
            display="block"
            size="sm"
            selectionMode="single"
            disabled={disabled}
            value={parsed ? [parsed] : []}
            onValueChange={(d) => {
               const v = d.value[0];
               onChange(v ? toIsoDate(v) : "");
            }}
         >
            <DatePicker.Control
               w="full"
               maxW="full"
               display="flex"
               gap={2}
               alignItems="center"
               minW={0}
            >
               <Box
                  flex="1"
                  minW={0}
                  w="full"
                  css={{
                     "& input": {
                        width: "100%",
                        minWidth: 0,
                     },
                  }}
               >
                  <DatePicker.Input
                     w="full"
                     maxW="full"
                     display="block"
                     placeholder={placeholder}
                  />
               </Box>
               <DatePicker.IndicatorGroup flexShrink={0}>
                  <DatePicker.Trigger asChild>
                     <Button variant="outline" size="sm" aria-label="Open calendar" px={2}>
                        <LuCalendar size={16} />
                     </Button>
                  </DatePicker.Trigger>
               </DatePicker.IndicatorGroup>
            </DatePicker.Control>
            <Portal>
               <DatePicker.Positioner>
                  <DatePicker.Content>
                     <DatePicker.View view="day">
                        <DatePicker.Header />
                        <DatePicker.DayTable />
                     </DatePicker.View>
                     <DatePicker.View view="month">
                        <DatePicker.Header />
                        <DatePicker.MonthTable />
                     </DatePicker.View>
                     <DatePicker.View view="year">
                        <DatePicker.Header />
                        <DatePicker.YearTable />
                     </DatePicker.View>
                  </DatePicker.Content>
               </DatePicker.Positioner>
            </Portal>
         </DatePicker.Root>
      </Field.Root>
   );
};

export default VCardDatePicker;
