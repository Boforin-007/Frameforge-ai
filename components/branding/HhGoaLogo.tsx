import Image from "next/image"

/**
 * Official HH Goa 2026 wordmark (Devanagari, yellow fill + pink outline).
 * Source asset: /goa_hindi.svg → canonical location /branding/hh-goa-logo.svg.
 */
export function HhGoaLogo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/branding/hh-goa-logo.svg"
      alt="HH Goa 2026"
      width={181}
      height={180}
      className={className}
    />
  )
}
