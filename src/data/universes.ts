export interface MCUUniverse {
  id: string;
  slug: string;
  name: string;
  haloColor: string;
  description: string;
  characterCount: number;
  keyEvents: string[];
  relatedUniverses: string[];
  isPrimary: boolean;
}

export const universes: MCUUniverse[] = [
  {
    id: "earth-616",
    slug: "earth-616",
    name: "Earth-616 (Sacred Timeline)",
    haloColor: "#ED1D24",
    description: "The primary Marvel Cinematic Universe timeline, monitored and protected by the Time Variance Authority. This is the main reality where the Avengers, Guardians, and most MCU heroes operate. All major events from Phase 1 through Phase 6 occur in this universe.",
    characterCount: 150,
    keyEvents: ["Battle of New York", "The Snap", "Blip", "Multiverse Opens"],
    relatedUniverses: ["earth-838"],
    isPrimary: true
  },
  {
    id: "earth-838",
    slug: "earth-838",
    name: "Earth-838",
    haloColor: "#7C4DFF",
    description: "An alternate universe where the Illuminati (comprising Professor X, Captain Carter, Black Bolt, Captain Marvel, Mr. Fantastic, and Doctor Strange Supreme) serve as Earth's primary protectors. In this universe, Thanos was stopped before he could complete the Snap.",
    characterCount: 45,
    keyEvents: ["Illuminati's Victory Over Thanos", "Incursion Crisis"],
    relatedUniverses: ["earth-616"],
    isPrimary: false
  },
  {
    id: "tva-verse",
    slug: "tva-verse",
    name: "TVA / Void",
    haloColor: "#455A64",
    description: "The Time Variance Authority exists outside of normal time and space, monitoring all timelines in the multiverse. The Void is a place at the end of time where pruned timelines and their variants are sent to be consumed by Alioth.",
    characterCount: 20,
    keyEvents: ["Loki's Redemption", "He Who Remains' Defeat", "Multiverse Branching"],
    relatedUniverses: ["earth-616", "earth-838"],
    isPrimary: false
  },
  {
    id: "sony-verse",
    slug: "sony-verse",
    name: "Sony Spider-Verse",
    haloColor: "#E91E63",
    description: "The universe containing the Sony Spider-Man films with Tobey Maguire and Andrew Garfield. This universe has its own versions of Spider-Man with unique stories and rogues' galleries, separate from the MCU's Tom Holland Spider-Man.",
    characterCount: 30,
    keyEvents: ["Spider-Man 3 Team-Up", "No Way Home Convergence"],
    relatedUniverses: ["earth-616"],
    isPrimary: false
  },
  {
    id: "fox-verse",
    slug: "fox-verse",
    name: "Fox X-Men Universe",
    haloColor: "#FFC107",
    description: "The original X-Men film universe created by 20th Century Fox. This universe contains its own version of mutants including Wolverine, Professor X, Magneto, and Deadpool. Following the Disney-Fox merger, elements from this universe have begun crossing over into the MCU.",
    characterCount: 60,
    keyEvents: ["Days of Future Past", "Dark Phoenix", "Multiversal Convergence"],
    relatedUniverses: ["earth-616"],
    isPrimary: false
  }
];

export function getUniverseBySlug(slug: string): MCUUniverse | undefined {
  return universes.find(u => u.slug === slug);
}
