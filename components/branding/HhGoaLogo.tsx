import Image from "next/image"

/**
 * Official Hacker House Goa wordmark (Devanagari, yellow fill + pink outline).
 * Source asset: /goa_hindi.svg → canonical location /branding/goa-logo.svg.
 */
export function HhGoaLogo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/branding/goa-logo.svg"
      alt="Hacker House Goa"
      width={181}
      height={180}
      className={className}
    />
  )
}
