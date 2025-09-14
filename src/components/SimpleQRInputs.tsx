import React from "react";
import { Stack, Field, Input } from "@chakra-ui/react";

interface SimpleQRInputsProps {
    qrType: "vcard" | "text" | "url" | "email" | "sms";
    simpleText: string;
    setSimpleText: (value: string) => void;
    simpleUrl: string;
    setSimpleUrl: (value: string) => void;
    simpleEmail: string;
    setSimpleEmail: (value: string) => void;
    simpleSms: string;
    setSimpleSms: (value: string) => void;
}

const SimpleQRInputs: React.FC<SimpleQRInputsProps> = ({
    qrType,
    simpleText,
    setSimpleText,
    simpleUrl,
    setSimpleUrl,
    simpleEmail,
    setSimpleEmail,
    simpleSms,
    setSimpleSms,
}) => {
    if (qrType === "text") {
        return (
            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Text Content</Field.Label>
                    <Input
                        value={simpleText}
                        onChange={(e) => setSimpleText(e.target.value)}
                        placeholder="Enter text to encode"
                    />
                </Field.Root>
            </Stack>
        );
    }

    if (qrType === "url") {
        return (
            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Website URL</Field.Label>
                    <Input
                        value={simpleUrl}
                        onChange={(e) => setSimpleUrl(e.target.value)}
                        placeholder="https://example.com"
                        type="url"
                    />
                </Field.Root>
            </Stack>
        );
    }

    if (qrType === "email") {
        return (
            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Email Address</Field.Label>
                    <Input
                        value={simpleEmail}
                        onChange={(e) => setSimpleEmail(e.target.value)}
                        placeholder="user@example.com"
                        type="email"
                    />
                </Field.Root>
            </Stack>
        );
    }

    if (qrType === "sms") {
        return (
            <Stack gap="4" css={{ '--field-label-width': 'sizes.24' }}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Phone Number</Field.Label>
                    <Input
                        value={simpleSms}
                        onChange={(e) => setSimpleSms(e.target.value)}
                        placeholder="+1234567890"
                        type="tel"
                    />
                </Field.Root>
            </Stack>
        );
    }

    return null;
};

export default SimpleQRInputs;
