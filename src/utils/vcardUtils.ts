export interface ContactInfo {
    firstName: string;
    lastName: string;
    middleName: string;
    prefix: string;
    suffix: string;
    organization: string;
    orgUnit: string;
    title: string;
    phone: string;
    phoneType: string;
    email: string;
    emailType: string;
    url: string;
    note: string;
    // Address fields
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    // Additional vCard 4.0 fields
    birthday?: string;
    gender?: string;
    anniversary?: string;
}

export interface MecardInfo extends ContactInfo {
    nickname: string;
    birthday: string;
}

// Generate vCard string from contact info based on version
export const generateVCard = (info: ContactInfo, version: string): string => {
    if (version === "mecard") {
        return generateMECARD(info as MecardInfo);
    }

    const lines = [
        "BEGIN:VCARD",
        `VERSION:${version}`,
    ];

    // Add name - different formats for different versions
    if (info.firstName || info.lastName || info.middleName || info.prefix || info.suffix) {
        const nameParts = [
            info.lastName || "",
            info.firstName || "",
            info.middleName || "",
            info.prefix || "",
            info.suffix || "",
        ];

        // vCard 4.0 uses comma separation, others use semicolon
        const separator = version === "4.0" ? "," : ";";
        lines.push(`N:${nameParts.join(separator)}`);

        const fullName = [info.prefix, info.firstName, info.middleName, info.lastName, info.suffix]
            .filter(Boolean)
            .join(" ");
        if (fullName) {
            lines.push(`FN:${fullName}`);
        }
    }

    // Add organization
    if (info.organization) {
        if (info.orgUnit) {
            lines.push(`ORG:${info.organization};${info.orgUnit}`);
        } else {
            lines.push(`ORG:${info.organization}`);
        }
    }

    // Add title
    if (info.title) {
        lines.push(`TITLE:${info.title}`);
    }

    // Add phone - different parameter formats
    if (info.phone) {
        if (version === "2.1") {
            lines.push(`TEL;${info.phoneType}:${info.phone}`);
        } else if (version === "3.0") {
            lines.push(`TEL;TYPE=${info.phoneType}:${info.phone}`);
        } else if (version === "4.0") {
            lines.push(`TEL;TYPE=${info.phoneType.toLowerCase()}:${info.phone}`);
        }
    }

    // Add email - different parameter formats
    if (info.email) {
        if (version === "2.1") {
            lines.push(`EMAIL;${info.emailType}:${info.email}`);
        } else if (version === "3.0") {
            lines.push(`EMAIL;TYPE=${info.emailType}:${info.email}`);
        } else if (version === "4.0") {
            // vCard 4.0 doesn't use email type parameters
            lines.push(`EMAIL:${info.email}`);
        }
    }

    // Add URL
    if (info.url) {
        if (version === "4.0") {
            lines.push(`URL:${info.url}`);
        } else {
            lines.push(`URL:${info.url}`);
        }
    }

    // Add address (ADR property) - supported in all versions
    if (info.streetAddress || info.city || info.state || info.postalCode || info.country) {
        const addressParts = [
            "", // PO Box
            "", // Extended address
            info.streetAddress || "", // Street address
            info.city || "", // Locality
            info.state || "", // Region
            info.postalCode || "", // Postal code
            info.country || "", // Country
        ];

        if (version === "4.0") {
            lines.push(`ADR:${addressParts.join(",")}`);
        } else {
            lines.push(`ADR:${addressParts.join(";")}`);
        }
    }

    // Add birthday (BDAY property) - supported in vCard 2.1, 3.0, 4.0
    if (info.birthday) {
        // Convert YYYY-MM-DD to YYYYMMDD format for vCard
        const bdayFormatted = info.birthday.replace(/-/g, "");
        lines.push(`BDAY:${bdayFormatted}`);
    }

    // Add gender (GENDER property) - only supported in vCard 4.0
    if (version === "4.0" && info.gender) {
        lines.push(`GENDER:${info.gender}`);
    }

    // Add anniversary (ANNIVERSARY property) - only supported in vCard 4.0
    if (version === "4.0" && info.anniversary) {
        // Convert YYYY-MM-DD to YYYYMMDD format for vCard
        const anniversaryFormatted = info.anniversary.replace(/-/g, "");
        lines.push(`ANNIVERSARY:${anniversaryFormatted}`);
    }

    // Add note
    if (info.note) {
        lines.push(`NOTE:${info.note}`);
    }

    // Add revision date (not in vCard 2.1)
    if (version !== "2.1") {
        const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        lines.push(`REV:${now}`);
    }

    lines.push("END:VCARD");
    return lines.join("\n");
};

// Generate MECARD format (simpler, more compact)
// MECARD only supports: N, TEL, EMAIL, ORG, URL, NOTE, ADR, BDAY, NICKNAME
export const generateMECARD = (info: MecardInfo): string => {
    const parts = [];

    // Name (required) - MECARD uses comma separation (last,first)
    const nameParts = [info.lastName, info.firstName].filter(Boolean);
    if (nameParts.length > 0) {
        parts.push(`N:${nameParts.join(",")}`);
    }

    // Phone - MECARD doesn't support phone types
    if (info.phone) {
        parts.push(`TEL:${info.phone}`);
    }

    // Email - MECARD doesn't support email types
    if (info.email) {
        parts.push(`EMAIL:${info.email}`);
    }

    // Organization - MECARD doesn't support department/org unit
    if (info.organization) {
        parts.push(`ORG:${info.organization}`);
    }

    // URL
    if (info.url) {
        parts.push(`URL:${info.url}`);
    }

    // Note
    if (info.note) {
        parts.push(`NOTE:${info.note}`);
    }

    // Nickname (MECARD specific)
    if (info.nickname) {
        parts.push(`NICKNAME:${info.nickname}`);
    }

    // Birthday (MECARD specific) - format: YYYYMMDD
    if (info.birthday) {
        // Convert YYYY-MM-DD to YYYYMMDD format for MECARD
        const bdayFormatted = info.birthday.replace(/-/g, "");
        parts.push(`BDAY:${bdayFormatted}`);
    }

    // Address (MECARD supports ADR) - simplified format
    if (info.streetAddress || info.city || info.state || info.postalCode || info.country) {
        const addressParts = [
            info.streetAddress || "",
            info.city || "",
            info.state || "",
            info.postalCode || "",
            info.country || "",
        ].filter(Boolean);

        if (addressParts.length > 0) {
            parts.push(`ADR:${addressParts.join(",")}`);
        }
    }

    return `MECARD:${parts.join(";")};;`;
};

// Validation function for vCard fields based on version
export const validateVCardFields = (info: ContactInfo, version: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Basic required fields for all vCard versions
    if (!info.firstName && !info.lastName) {
        errors.push("At least First Name or Last Name is required");
    }

    // vCard 4.0 specific validations
    if (version === "4.0") {
        // Birthday format validation (YYYY-MM-DD)
        if (info.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(info.birthday)) {
            errors.push("Birthday must be in YYYY-MM-DD format");
        }

        // Anniversary format validation (YYYY-MM-DD)
        if (info.anniversary && !/^\d{4}-\d{2}-\d{2}$/.test(info.anniversary)) {
            errors.push("Anniversary must be in YYYY-MM-DD format");
        }

        // Gender validation
        if (info.gender && !["M", "F", "O", "N", "U"].includes(info.gender)) {
            errors.push("Gender must be one of: M, F, O, N, U");
        }
    }

    // Email format validation
    if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
        errors.push("Email must be in valid format");
    }

    // URL format validation
    if (info.url && !/^https?:\/\/.+/.test(info.url)) {
        errors.push("URL must start with http:// or https://");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Generate QR code data based on type
export const generateQRData = (
    qrType: "vcard" | "text" | "url" | "email" | "sms",
    contactInfo: ContactInfo,
    vcardVersion: string,
    simpleText: string,
    simpleUrl: string,
    simpleEmail: string,
    simpleSms: string
): string => {
    switch (qrType) {
        case "vcard":
            return generateVCard(contactInfo, vcardVersion);
        case "text":
            return simpleText;
        case "url":
            return simpleUrl.startsWith("http") ? simpleUrl : `https://${simpleUrl}`;
        case "email":
            return `mailto:${simpleEmail}`;
        case "sms":
            return `sms:${simpleSms}`;
        default:
            return generateVCard(contactInfo, vcardVersion);
    }
};
