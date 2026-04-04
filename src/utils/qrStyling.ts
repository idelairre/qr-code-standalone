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

export type QrPreviewLayout = "default" | "compact" | "wrapped" | "studio";

/** Render width/height (px) used by the live preview for each layout (matches `QRCodePreview`). */
export function getQrPreviewRenderSizePx(
   qrSize: keyof typeof QR_SIZE_PX,
   layout: QrPreviewLayout,
): number {
   const studio = layout === "studio";
   const wrapped = layout === "wrapped";
   const compact = layout === "compact";
   const map = studio
      ? { sm: 168, md: 208, lg: 248, xl: 288, "2xl": 328 }
      : wrapped
        ? { sm: 160, md: 200, lg: 240, xl: 280, "2xl": 320 }
        : compact
          ? { sm: 140, md: 180, lg: 220, xl: 260, "2xl": 300 }
          : { sm: 260, md: 320, lg: 380, xl: 440, "2xl": 500 };
   return map[qrSize];
}

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

/** Default inset (SVG px) around the logo inside the cleared center; library shrinks the image by 2× this value. */
export const DEFAULT_LOGO_IMAGE_MARGIN = 3;

/** Upper bound for logo inset (SVG px) for a given QR canvas size. */
export function maxLogoImageMarginForCanvas(sizePx: number): number {
   return Math.max(0, Math.floor(sizePx * 0.35) - 2);
}

/** Clamp logo inset so it stays sensible for the canvas size (qr-code-styling uses SVG pixel units). */
export function clampLogoImageMargin(margin: number, sizePx: number): number {
   const m = Number.isFinite(margin) ? Math.round(margin) : 0;
   const max = maxLogoImageMarginForCanvas(sizePx);
   return Math.max(0, Math.min(m, max));
}

export function buildQrCodeStylingOptions(params: {
   data: string;
   sizePx: number;
   foreground: string;
   background: string;
   errorLevel: "L" | "M" | "Q" | "H";
   dotsType: DotType;
   image?: string;
   /** Inset around the logo in the cleared area; larger = smaller drawn logo, more background margin. */
   logoImageMargin?: number;
}): Options {
   const {
      data,
      sizePx,
      foreground,
      background,
      errorLevel,
      dotsType,
      image,
      logoImageMargin = DEFAULT_LOGO_IMAGE_MARGIN,
   } = params;
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
         margin: clampLogoImageMargin(logoImageMargin, sizePx),
         crossOrigin: "anonymous",
      };
   }

   return base;
}

export { QRCodeStyling };
export type { DotType };
