import type { DotType, Options } from "qr-code-styling";
import QRCodeStyling from "qr-code-styling";
import React from "react";

/** Pixel sizes aligned with Chakra UI QR recipe (`@chakra-ui/react` qr-code theme). */
export const QR_SIZE_PX: Record<"sm" | "md" | "lg" | "xl" | "2xl", number> = {
   sm: 80,
   md: 120,
   lg: 160,
   xl: 200,
   "2xl": 240,
};

export function svgStringToDataUrl(svg: string): string {
   return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function iconToDataUrlSync(
   renderToStaticMarkup: (node: React.ReactElement) => string,
   icon: React.ComponentType<{ size?: number }> | React.ReactElement,
): string | undefined {
   const el = typeof icon === "function" ? React.createElement(icon, { size: 96 }) : icon;
   const markup = renderToStaticMarkup(el);
   if (!markup.includes("<svg")) return undefined;
   return svgStringToDataUrl(markup);
}

/**
 * Resolves logo image URL for qr-code-styling. SVG uploads are synchronous; icon picker
 * uses a dynamic import of `react-dom/server.browser` so it is code-split.
 */
export async function resolveLogoImageUrl(
   showLogo: boolean,
   logoSvgContent: string,
   selectedIconComponent: React.ComponentType<{ size?: number }> | React.ReactElement | null,
): Promise<string | undefined> {
   if (!showLogo) return undefined;
   if (logoSvgContent.trim()) return svgStringToDataUrl(logoSvgContent);
   if (!selectedIconComponent) return undefined;
   const { renderToStaticMarkup } = await import("react-dom/server.browser");
   return iconToDataUrlSync(renderToStaticMarkup, selectedIconComponent);
}

export function buildQrCodeStylingOptions(params: {
   data: string;
   sizePx: number;
   foreground: string;
   background: string;
   errorLevel: "L" | "M" | "Q" | "H";
   dotsType: DotType;
   image?: string;
}): Options {
   const { data, sizePx, foreground, background, errorLevel, dotsType, image } = params;
   const margin = Math.max(6, Math.floor(sizePx * 0.04));

   const base: Options = {
      type: "svg",
      width: sizePx,
      height: sizePx,
      data,
      margin,
      qrOptions: {
         errorCorrectionLevel: errorLevel,
      },
      dotsOptions: {
         type: dotsType,
         color: foreground,
      },
      cornersSquareOptions: {
         color: foreground,
      },
      cornersDotOptions: {
         color: foreground,
      },
      backgroundOptions: {
         color: background,
      },
   };

   if (image) {
      base.image = image;
      base.imageOptions = {
         hideBackgroundDots: true,
         imageSize: 0.38,
         margin: 3,
         crossOrigin: "anonymous",
      };
   }

   return base;
}

export { QRCodeStyling };
export type { DotType };
