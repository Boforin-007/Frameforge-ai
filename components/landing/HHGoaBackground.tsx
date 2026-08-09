import Image from "next/image";

/**
 * HH Goa 2026 — background.
 *
 * Staged from https://github.com/adityajadhav19/HH-Goa (components/Herobackground.tsx).
 * Keeps only the house (Sun rise.png) — the pink/yellow notice board (agenda.png)
 * has been removed. A forest scrim keeps text readable over the house.
 */
export default function HHGoaBackground() {
  return (
    <>
      <div className="fixed inset-0 z-0">
        <Image
          src="/Sun rise.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* scrim so text stays readable over the house */}
      <div className="pointer-events-none fixed inset-0 z-10 bg-hh-forest/45" />

      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-20 h-[480px]"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 0%, rgba(254,225,1,0.28) 0%, rgba(254,225,1,0.07) 45%, rgba(11,104,57,0) 75%)",
        }}
      />
    </>
  );
}
