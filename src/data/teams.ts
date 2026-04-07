export interface MPUTeam {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  haloColor: string;
  description: string;
  foundedIn: string;
  members: string[];
  keyMissions: { movie: string; year: number; event: string }[];
  images: { hero: string; card: string };
}

export const teams: MPUTeam[] = [
  {
    id: "avengers",
    slug: "avengers",
    name: "The Avengers",
    tagline: "Earth's Mightiest Heroes",
    haloColor: "#1565C0",
    description: "The Avengers are a team of extraordinary individuals, either with superpowers or other special characteristics. Founded by Nick Fury and initially funded by S.H.I.E.L.D., the team was assembled to fight threats that no single hero could handle alone. From the Battle of New York to the final confrontation with Thanos, the Avengers have been Earth's first and last line of defense against cosmic and terrestrial threats.",
    foundedIn: "The Avengers (2012)",
    members: ["iron-man", "captain-america", "thor", "hulk", "black-widow", "hawkeye", "spider-man", "doctor-strange", "black-panther", "scarlet-witch", "falcon", "nick-fury", "okoye", "wong", "peggy-carter", "maria-hill"],
    keyMissions: [
      { movie: "The Avengers", year: 2012, event: "Battle of New York — stopped Loki and the Chitauri invasion" },
      { movie: "Avengers: Age of Ultron", year: 2015, event: "Sokovia Incident — stopped Ultron from destroying humanity" },
      { movie: "Avengers: Infinity War", year: 2018, event: "Battle of Wakanda/Titan — failed to stop Thanos from collecting all Stones" },
      { movie: "Avengers: Endgame", year: 2019, event: "Final Battle — reversed the Snap and defeated Thanos" }
    ],
    images: { hero: "/images/teams/avengers.png", card: "/images/teams/avengers.png" }
  },
  {
    id: "guardians-of-the-galaxy",
    slug: "guardians-of-the-galaxy",
    name: "Guardians of the Galaxy",
    tagline: "A Bunch of A-Holes",
    haloColor: "#00BCD4",
    description: "The Guardians of the Galaxy are a ragtag group of intergalactic criminals and misfits who reluctantly became heroes. United by circumstance and held together by friendship, the Guardians have saved the galaxy multiple times from cosmic threats including Ronan the Accuser, Ego the Living Planet, and Thanos himself.",
    foundedIn: "Guardians of the Galaxy (2014)",
    members: ["star-lord", "gamora", "drax", "rocket", "groot", "nebula", "mantis"],
    keyMissions: [
      { movie: "Guardians of the Galaxy", year: 2014, event: "Stopped Ronan from destroying Xandar with the Power Stone" },
      { movie: "Guardians of the Galaxy Vol. 2", year: 2017, event: "Defeated Ego the Living Planet" },
      { movie: "Avengers: Infinity War", year: 2018, event: "Battle of Titan — fought Thanos alongside Iron Man and Spider-Man" }
    ],
    images: { hero: "/images/teams/guardians.png", card: "/images/teams/guardians.png" }
  },
  {
    id: "x-men",
    slug: "x-men",
    name: "X-Men",
    tagline: "Children of the Atom",
    haloColor: "#FFC107",
    description: "The X-Men are a team of mutants — individuals born with superhuman abilities — who fight for peace and equality in a world that fears and hates them. Led by Professor Charles Xavier, the X-Men have been at the forefront of the struggle for mutant rights and have defended both mutants and humans from threats that seek to destroy them both.",
    foundedIn: "X-Men (2000)",
    members: ["wolverine", "deadpool"],
    keyMissions: [
      { movie: "X-Men: Days of Future Past", year: 2014, event: "Prevented the dystopian Sentinel future" },
      { movie: "Logan", year: 2017, event: "Last stand protecting mutant children" },
      { movie: "Deadpool & Wolverine", year: 2024, event: "Wolverine and Deadpool save the Sacred Timeline" }
    ],
    images: { hero: "/images/teams/xmen.png", card: "/images/teams/xmen.png" }
  },
  {
    id: "thunderbolts",
    slug: "thunderbolts",
    name: "Thunderbolts",
    tagline: "Not quite heroes",
    haloColor: "#78909C",
    description: "The Thunderbolts are a team of reformed villains and anti-heroes assembled by the government for missions too dangerous or morally gray for the Avengers. Operating in the shadows, the Thunderbolts do the jobs that need to be done, regardless of the cost.",
    foundedIn: "Thunderbolts* (2025)",
    members: [],
    keyMissions: [
      { movie: "Thunderbolts*", year: 2025, event: "First mission as a team" }
    ],
    images: { hero: "/images/teams/thunderbolts.png", card: "/images/teams/thunderbolts.png" }
  }
];

export function getTeamBySlug(slug: string): MPUTeam | undefined {
  return teams.find(t => t.slug === slug);
}
