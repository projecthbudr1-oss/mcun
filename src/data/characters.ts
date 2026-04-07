export interface MCUCharacter {
  id: string;
  slug: string;
  name: string;
  realName: string | null;
  actorName: string;
  secondaryActors?: string[];
  alignment: 'hero' | 'villain' | 'anti-hero' | 'neutral';
  powerTier: 'cosmic' | 'omega' | 'alpha' | 'beta' | 'gamma' | 'normal';
  species: string;
  universe: string;
  status: 'active' | 'deceased' | 'unknown' | 'retired' | 'imprisoned';
  haloColor: string;
  tagline: string;
  biography: string;
  synopsis: string;
  quote: string | null;
  quoteSource: string | null;
  stats: {
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    energyProjection: number;
    fightingSkills: number;
  };
  powers: string[];
  weaknesses: string[];
  appearances: {
    movie: string;
    year: number;
    notes: string;
    isPostCredits?: boolean;
  }[];
  allies: { characterSlug: string; relationship: string }[];
  enemies: { characterSlug: string; relationship: string }[];
  teams: string[];
  relatedCharacters: string[];
  history: {
    movie: string;
    year: number;
    event: string;
    isKeyMoment: boolean;
  }[];
  images: {
    hero: string;
    card: string;
    switcher: string;
    poster?: string;
  };
  meta?: {
    title: string;
    description: string;
  };
  castBar: string[];
  quizWeights?: Record<string, number>;
}

export const characters: MCUCharacter[] = [
  {
    id: "spider-man-616",
    slug: "spider-man",
    name: "Spider-Man",
    realName: "Peter Parker",
    actorName: "Tom Holland",
    secondaryActors: ["Tobey Maguire", "Andrew Garfield"],
    alignment: "hero",
    powerTier: "beta",
    species: "Human (Enhanced)",
    universe: "earth-616",
    status: "active",
    haloColor: "#ED1D24",
    tagline: "Your Friendly Neighborhood Spider-Man",
    biography: "Peter Benjamin Parker is a high school student from Queens, New York, who gained spider-like abilities after being bitten by a radioactive spider during a school field trip. Created by Tony Stark as a protégé, Peter balances his life as a student, a superhero, and a teenager navigating the complexities of growing up.\n\nAfter being recruited by Tony Stark to help in the conflict at the Leipzig-Halle airport, Peter was given an upgraded suit designed by Stark Industries. He later faced the Vulture alone, proving his worth as a hero without Stark's constant oversight. His relationship with Tony evolved from fanboy admiration to a genuine father-son bond.\n\nDuring the Snap, Peter was among the billions who disintegrated. Upon his return five years later in the Battle of Earth, he fought alongside all the Avengers against Thanos's forces. After Tony's death, Peter struggled to live up to his mentor's legacy while also dealing with the public revelation of his identity, orchestrated by Mysterio.\n\nIn the Multiverse Saga, Peter's life was turned upside down when his identity was exposed globally. Doctor Strange's spell to make the world forget Peter Parker went wrong, pulling villains from across the multiverse into Peter's reality. With the help of two other Spider-Men from alternate universes, Peter cured the villains and ultimately chose to have the entire world forget him, sacrificing his connections to protect those he loved.",
    synopsis: "Peter Parker gained spider-like abilities after being bitten by a radioactive spider. Mentored by Tony Stark, he evolved from a neighborhood hero to an Avenger who saved the multiverse at the cost of the world remembering him.",
    quote: "With great power comes great responsibility.",
    quoteSource: "Spider-Man (2002) / Captain America: Civil War (2016)",
    stats: { intelligence: 85, strength: 55, speed: 70, durability: 50, energyProjection: 30, fightingSkills: 75 },
    powers: ["Spider-Sense", "Wall-Crawling", "Super Strength", "Enhanced Agility", "Web-Shooting", "Accelerated Healing", "Genius-Level Intellect", "Spider-Arms (Iron Spider)"],
    weaknesses: ["Mortal Vulnerability", "Emotional Impulsiveness", "Inexperienced", "Web Fluid Limitation"],
    appearances: [
      { movie: "Captain America: Civil War", year: 2016, notes: "Introduced as Tony Stark's recruit, fights at the airport" },
      { movie: "Spider-Man: Homecoming", year: 2017, notes: "Solo debut, defeats Vulture, earns Stark's respect" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Fights Thanos on Titan, disintegrated in the Snap" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Returns from the Snap, fights in the final battle" },
      { movie: "Spider-Man: Far From Home", year: 2019, notes: "Faces Mysterio in Europe, identity revealed" },
      { movie: "Spider-Man: No Way Home", year: 2021, notes: "Multiverse crisis, cures villains, world forgets Peter Parker" }
    ],
    allies: [
      { characterSlug: "iron-man", relationship: "Mentor / Father Figure" },
      { characterSlug: "ned-leeds", relationship: "Best Friend" },
      { characterSlug: "mj", relationship: "Love Interest" },
      { characterSlug: "doctor-strange", relationship: "Ally / Mentor" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger" }
    ],
    enemies: [
      { characterSlug: "green-goblin", relationship: "Arch-Nemesis (Multiverse)" },
      { characterSlug: "vulture", relationship: "First Major Villain" },
      { characterSlug: "mysterio", relationship: "Deceiver" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["iron-man", "doctor-strange", "loki", "scarlet-witch", "black-widow", "thanos", "captain-america", "deadpool"],
    history: [
      { movie: "Captain America: Civil War", year: 2016, event: "Recruited by Tony Stark, fights Team Cap at the Leipzig-Halle airport. Receives the Stark-made Spider-Man suit.", isKeyMoment: true },
      { movie: "Spider-Man: Homecoming", year: 2017, event: "Stops Adrian Toomes (Vulture) from stealing Stark tech. Proves himself worthy as a hero.", isKeyMoment: false },
      { movie: "Avengers: Infinity War", year: 2018, event: "Travels to space with Stark, fights Thanos on Titan. Disintegrated in the Snap.", isKeyMoment: true },
      { movie: "Spider-Man: No Way Home", year: 2021, event: "Multiverse spell pulls in villains and other Spider-Men. Saves the villains and has the world forget Peter Parker.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/spider-man/hero.png", card: "/images/characters/spider-man/hero.png", switcher: "/images/characters/spider-man/hero.png" },
    meta: { title: "Spider-Man (Peter Parker) | Marvel Cinematic Character Guide", description: "Explore Peter Parker's journey from Queens teenager to multiverse-saving Avenger." },
    castBar: ["TOM HOLLAND", "TOBEY MAGUIRE", "ANDREW GARFIELD", "ZENDAYA"],
    quizWeights: { q1: 3, q2: 2, q3: 3, q4: 1, q5: 2, q6: 1, q7: 3, q8: 2, q9: 2, q10: 1 }
  },
  {
    id: "iron-man-616",
    slug: "iron-man",
    name: "Iron Man",
    realName: "Tony Stark",
    actorName: "Robert Downey Jr.",
    alignment: "hero",
    powerTier: "alpha",
    species: "Human",
    universe: "earth-616",
    status: "deceased",
    haloColor: "#4FC3F7",
    tagline: "Genius. Billionaire. Playboy. Philanthropist.",
    biography: "Tony Stark was the CEO of Stark Industries, a weapons manufacturer inherited from his father Howard Stark. After being captured by terrorists in Afghanistan and sustaining shrapnel injuries, Stark built a powered suit of armor to escape. This experience transformed him, leading to the creation of successive Iron Man suits and his role as a founding member of the Avengers.\n\nOver the course of his career, Stark evolved from a self-centered arms dealer to Earth's foremost protector. He developed the technology that held the Avengers together, created Ultron (an act he deeply regretted), and mentored Spider-Man Peter Parker. His rivalry with Steve Rogers over the Sokovia Accords fractured the Avengers temporarily.\n\nDuring the Infinity War, Stark faced Thanos on Titan and survived the Snap. In the five years that followed, he married Pepper Potts and had a daughter, Morgan. When the opportunity arose to reverse the Snap through time travel, Stark initially refused but ultimately joined the mission, creating the molecular-level time-space GPS that made it possible.\n\nIn the final battle against Thanos, Stark seized the Infinity Stones and used them to disintegrate Thanos's army, at the cost of his own life. His final words, 'I am Iron Man,' echoed his first public declaration, completing his arc from selfishness to self-sacrifice.",
    synopsis: "Tony Stark created the first Iron Man suit in a cave in Afghanistan, forging a legacy that would define the Avengers and ultimately save the universe at the cost of his own life.",
    quote: "I am Iron Man.",
    quoteSource: "Avengers: Endgame (2019)",
    stats: { intelligence: 100, strength: 85, speed: 70, durability: 85, energyProjection: 95, fightingSkills: 65 },
    powers: ["Genius-Level Intellect", "Powered Armor", "Flight", "Repulsor Blasts", "Unibeam", "Missile Systems", "AI Assistance (J.A.R.V.I.S./F.R.I.D.A.Y.)", "Holographic Manipulation", "Nanotech Suit Construction"],
    weaknesses: ["Shrapnel in Chest (early suits)", "Arc Reactor Dependency", "Arrogance", "PTSD", "Mortal Vulnerability Without Suit"],
    appearances: [
      { movie: "Iron Man", year: 2008, notes: "Origin story, builds first suit, defeats Obadiah Stane" },
      { movie: "The Incredible Hulk", year: 2008, notes: "Post-credits cameo" },
      { movie: "Iron Man 2", year: 2010, notes: "Fights Whiplash, appoints Pepper as CEO" },
      { movie: "The Avengers", year: 2012, notes: "Assembles the team, carries nuke into the wormhole" },
      { movie: "Iron Man 3", year: 2013, notes: "Battles AIM, destroys his suits" },
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Creates Ultron, fights in Sokovia" },
      { movie: "Captain America: Civil War", year: 2016, notes: "Pro-Registration leader, recruits Spider-Man" },
      { movie: "Spider-Man: Homecoming", year: 2017, notes: "Mentor to Peter Parker" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Fights Thanos on Titan" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Time travel architect, wields Infinity Stones, sacrifices himself" }
    ],
    allies: [
      { characterSlug: "pepper-potts", relationship: "Wife / Greatest Support" },
      { characterSlug: "captain-america", relationship: "Co-Founder / Rival-Turned-Friend" },
      { characterSlug: "thor", relationship: "Fellow Avenger" },
      { characterSlug: "hulk", relationship: "Fellow Avenger / Science Partner" },
      { characterSlug: "spider-man", relationship: "Mentee" },
      { characterSlug: "war-machine", relationship: "Best Friend / Brother-in-Arms" },
      { characterSlug: "black-widow", relationship: "Fellow Avenger" }
    ],
    enemies: [
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" },
      { characterSlug: "ultron", relationship: "Own Creation Turned Enemy" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["captain-america", "thor", "spider-man", "black-widow", "hulk", "thanos", "doctor-strange", "pepper-potts"],
    history: [
      { movie: "Iron Man", year: 2008, event: "Captured in Afghanistan, builds Mark I armor, escapes, defeats Iron Monger, publicly reveals identity.", isKeyMoment: true },
      { movie: "The Avengers", year: 2012, event: "Joins the Avengers initiative. Carries a nuclear missile through the wormhole.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Cracks time travel, wields all six Infinity Stones, snaps away Thanos. Dies from the stones' power.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/iron-man/hero.png", card: "/images/characters/iron-man/hero.png", switcher: "/images/characters/iron-man/hero.png" },
    meta: { title: "Iron Man (Tony Stark) | Marvel Cinematic Character Guide", description: "Explore Tony Stark's journey from weapons dealer to Avengers founder." },
    castBar: ["ROBERT DOWNEY JR.", "IRON MAN (2008)", "HERO"],
    quizWeights: { q1: 1, q2: 3, q3: 2, q4: 3, q5: 1, q6: 2, q7: 1, q8: 3, q9: 1, q10: 3 }
  },
  {
    id: "captain-america-616",
    slug: "captain-america",
    name: "Captain America",
    realName: "Steve Rogers",
    actorName: "Chris Evans",
    alignment: "hero",
    powerTier: "alpha",
    species: "Human (Enhanced)",
    universe: "earth-616",
    status: "retired",
    haloColor: "#1565C0",
    tagline: "I Can Do This All Day",
    biography: "Steve Rogers was a frail young man from Brooklyn during World War II who desperately wanted to serve his country. Rejected by the military due to his physical limitations, he was chosen for the Super Soldier Program led by Dr. Abraham Erskine. The experimental serum transformed him into the perfect soldier — enhanced strength, speed, durability, and reflexes.\n\nAfter proving himself in battle against Hydra, Rogers sacrificed himself by crashing a plane carrying weapons of mass destruction into the Arctic. Frozen in ice for nearly 70 years, he was revived in the modern world, disoriented and grieving for everything he had lost.\n\nAs a founding Avenger, Rogers became the moral compass of the team. His unwavering commitment to doing what was right, regardless of the cost, put him at odds with Tony Stark during the Sokovia Accords conflict. The division led to a fractured Avengers team, with Rogers going on the run to protect his friend Bucky Barnes.\n\nDuring the Infinity War, Rogers returned to fight Thanos. After the Snap, he led the remaining Avengers in trying to hold the world together. In the time heist to reverse the Snap, Rogers wielded Mjolnir and proved worthy of its power. After Tony's sacrifice, Rogers returned to the past to live the life he always wanted with Peggy Carter, passing the shield to Sam Wilson.",
    synopsis: "Steve Rogers went from a frail young man in Brooklyn to the First Avenger, bearing the shield and the weight of the world through every crisis, before choosing a peaceful life after saving the universe.",
    quote: "I can do this all day.",
    quoteSource: "Captain America: The First Avenger / The Avengers / Endgame",
    stats: { intelligence: 70, strength: 80, speed: 65, durability: 80, energyProjection: 20, fightingSkills: 100 },
    powers: ["Super Soldier Serum", "Enhanced Strength", "Enhanced Speed", "Enhanced Durability", "Master Tactician", "Expert Martial Artist", "Vibranium Shield", "Mjolnir Worthy (Temporarily)"],
    weaknesses: ["Mortal Vulnerability", "Out of Time (Cultural Disconnect)", "Stubborn Idealism", "Emotional Attachment to Bucky"],
    appearances: [
      { movie: "Captain America: The First Avenger", year: 2011, notes: "Origin story, fights Hydra, frozen in ice" },
      { movie: "The Avengers", year: 2012, notes: "Leads the Avengers against Loki and the Chitauri" },
      { movie: "Captain America: The Winter Soldier", year: 2014, notes: "Discovers Hydra within S.H.I.E.L.D., fights Bucky" },
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Fights Ultron, lifts Mjolnir slightly" },
      { movie: "Captain America: Civil War", year: 2016, notes: "Anti-Registration leader, fights Iron Man" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Returns to fight Thanos in Wakanda" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Wields Mjolnir, leads final battle, returns to the past" }
    ],
    allies: [
      { characterSlug: "iron-man", relationship: "Co-Founder / Rival-Turned-Brother" },
      { characterSlug: "thor", relationship: "Fellow Avenger" },
      { characterSlug: "black-widow", relationship: "Closest Friend / Confidante" },
      { characterSlug: "bucky-barnes", relationship: "Best Friend / Brother" },
      { characterSlug: "falcon", relationship: "Successor / Close Ally" }
    ],
    enemies: [
      { characterSlug: "red-skull", relationship: "First Nemesis" },
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["iron-man", "thor", "black-widow", "bucky-barnes", "thanos", "spider-man", "hulk", "falcon"],
    history: [
      { movie: "Captain America: The First Avenger", year: 2011, event: "Receives the Super Soldier Serum, defeats Red Skull, crashes plane into Arctic, frozen.", isKeyMoment: true },
      { movie: "The Winter Soldier", year: 2014, event: "Uncovers Hydra's infiltration of S.H.I.E.L.D. Destroys Project Insight.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Wields Mjolnir in the final battle. Returns to the 1940s to live with Peggy Carter.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/captain-america/hero.png", card: "/images/characters/captain-america/hero.png", switcher: "/images/characters/captain-america/hero.png" },
    meta: { title: "Captain America (Steve Rogers) | Marvel Cinematic Character Guide", description: "Explore Steve Rogers' journey from Brooklyn to the First Avenger." },
    castBar: ["CHRIS EVANS", "CAPTAIN AMERICA (2011)", "HERO"],
    quizWeights: { q1: 3, q2: 1, q3: 1, q4: 2, q5: 3, q6: 3, q7: 2, q8: 1, q9: 3, q10: 2 }
  },
  {
    id: "thor-616",
    slug: "thor",
    name: "Thor",
    realName: "Thor Odinson",
    actorName: "Chris Hemsworth",
    alignment: "hero",
    powerTier: "omega",
    species: "Asgardian",
    universe: "earth-616",
    status: "active",
    haloColor: "#FFD54F",
    tagline: "God of Thunder",
    biography: "Thor Odinson is the Prince of Asgard and the God of Thunder, son of Odin All-Father and Frigga. Raised as the heir to the Asgardian throne, Thor was initially arrogant and impetuous. After Odin banished him to Earth for his hubris, Thor learned humility and became one of Earth's mightiest protectors.\n\nAs a founding Avenger, Thor brought cosmic power and divine strength to the team. His relationships with his brother Loki were central to his story — a cycle of conflict, betrayal, and reluctant love that defined much of Thor's journey. Despite Loki's constant schemes, Thor never gave up on his brother.\n\nThor's life was marked by devastating losses: the destruction of Asgard, the death of Odin, the Snap that wiped out half the universe (including Loki), and his failure to stop Thanos. These losses drove him into a deep depression, during which he became overweight and withdrawn, living in New Asgard on Earth.\n\nWith the help of his fellow Avengers, Thor found his way back and participated in the time heist. He reconciled with his past, including a tearful reunion with his mother Frigga. In the final battle, Thor dual-wielded Mjolnir and Stormbreaker. After the victory, Thor joined the Guardians of the Galaxy for a time before returning to face new threats.",
    synopsis: "Thor Odinson, the God of Thunder, journeyed from arrogant prince to humbled hero, losing his home, his family, and half the universe before finding redemption in the battle against Thanos.",
    quote: "I am Thor, Son of Odin!",
    quoteSource: "Thor (2011)",
    stats: { intelligence: 60, strength: 100, speed: 80, durability: 95, energyProjection: 90, fightingSkills: 85 },
    powers: ["Superhuman Strength", "Lightning Manipulation", "Mjolnir", "Stormbreaker", "Flight via Hammer", "Godlike Durability", "Longevity", "Bifrost Summoning", "Warrior's Madness"],
    weaknesses: ["Arrogance", "Vulnerability to Superior Magic", "Mortal Dependence on Mjolnir (early)", "Emotional Volatility", "Loss of Asgardian Power"],
    appearances: [
      { movie: "Thor", year: 2011, notes: "Origin story, banished to Earth, defeats Loki" },
      { movie: "The Avengers", year: 2012, notes: "Fights alongside Avengers against Loki" },
      { movie: "Thor: The Dark World", year: 2013, notes: "Fights Malekith, loses Frigga" },
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Helps create Ultron, fights in Sokovia" },
      { movie: "Thor: Ragnarok", year: 2017, notes: "Loses Mjolnir, gains Stormbreaker, Asgard destroyed" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Forges Stormbreaker, fails to stop Thanos" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Time heist, wields Mjolnir and Stormbreaker in final battle" }
    ],
    allies: [
      { characterSlug: "captain-america", relationship: "Fellow Avenger / Shield-Brother" },
      { characterSlug: "iron-man", relationship: "Fellow Avenger" },
      { characterSlug: "hulk", relationship: "Fellow Avenger / Arena Brother" },
      { characterSlug: "loki", relationship: "Brother (Complicated)" },
      { characterSlug: "guardians-of-the-galaxy", relationship: "Temporary Teammate" }
    ],
    enemies: [
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" },
      { characterSlug: "hela", relationship: "Sister / Destructor of Asgard" },
      { characterSlug: "malekith", relationship: "Dark Elf Antagonist" }
    ],
    teams: ["avengers", "guardians-of-the-galaxy"],
    relatedCharacters: ["iron-man", "captain-america", "loki", "hulk", "thanos", "doctor-strange", "spider-man", "scarlet-witch"],
    history: [
      { movie: "Thor", year: 2011, event: "Banished to Earth by Odin, learns humility, stops Loki's invasion of Jotunheim.", isKeyMoment: true },
      { movie: "Thor: Ragnarok", year: 2017, event: "Imprisoned on Sakaar, loses Mjolnir to Hela, helps destroy Asgard to stop Hela.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Forges Stormbreaker, fails to kill Thanos. Joins time heist, dual-wields Mjolnir and Stormbreaker.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/thor/hero.png", card: "/images/characters/thor/hero.png", switcher: "/images/characters/thor/hero.png" },
    meta: { title: "Thor (Thor Odinson) | Marvel Cinematic Character Guide", description: "Explore the God of Thunder's journey from Asgardian prince to Avenger." },
    castBar: ["CHRIS HEMSWORTH", "THOR (2011)", "HERO"],
    quizWeights: { q1: 1, q2: 1, q3: 2, q4: 1, q5: 1, q6: 2, q7: 1, q8: 1, q9: 1, q10: 3 }
  },
  {
    id: "black-panther-616",
    slug: "black-panther",
    name: "Black Panther",
    realName: "T'Challa",
    actorName: "Chadwick Boseman",
    alignment: "hero",
    powerTier: "alpha",
    species: "Human (Enhanced)",
    universe: "earth-616",
    status: "deceased",
    haloColor: "#7C4DFF",
    tagline: "King of Wakanda",
    biography: "T'Challa was the King of Wakanda and the protector of the nation as the Black Panther. After the death of his father T'Chaka at the United Nations, T'Challa ascended to the throne and was empowered by the Heart-Shaped Herb, gaining enhanced abilities.\n\nAlmost immediately, his kingship was challenged by Erik Killmonger, who sought to use Wakanda's advanced technology to arm the oppressed people of the world. T'Challa defeated Killmonger but was changed by his cousin's ideology, choosing to open Wakanda to the world and share its resources.\n\nAs an Avenger, T'Challa provided crucial support during the conflict over the Sokovia Accords and the battle against Thanos. Wakanda served as the final battleground against Thanos's forces in the Infinity War, where T'Challa fought valiantly alongside the Avengers and the armies of Wakanda.\n\nAfter the Snap, T'Challa welcomed the world to Wakanda and worked to build international alliances. He participated in the time heist to reverse the Snap and fought in the final battle. His death from an undisclosed illness left Wakanda and the world mourning one of its greatest heroes.",
    synopsis: "T'Challa, the Black Panther and King of Wakanda, united tradition and progress, defending both his nation and the world while opening Wakanda's borders to a new era of global cooperation.",
    quote: "Wakanda Forever!",
    quoteSource: "Black Panther (2018)",
    stats: { intelligence: 90, strength: 70, speed: 75, durability: 70, energyProjection: 40, fightingSkills: 100 },
    powers: ["Heart-Shaped Herb Enhancement", "Super Strength", "Enhanced Speed", "Enhanced Senses", "Vibranium Suit", "Master Martial Artist", "Genius-Level Intellect", "Wakandan Technology Access"],
    weaknesses: ["Mortal Vulnerability", "Vibranium Suit Dependency", "Political Pressure of Kingship", "Heart-Shaped Herb Counteract (without herb)"],
    appearances: [
      { movie: "Captain America: Civil War", year: 2016, notes: "Debut, seeks revenge on Bucky, sides with Accords" },
      { movie: "Black Panther", year: 2018, notes: "Defeats Killmonger, opens Wakanda to the world" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Defends Wakanda against Thanos's army" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Fights in the final battle" }
    ],
    allies: [
      { characterSlug: "shuri", relationship: "Sister / Tech Genius" },
      { characterSlug: "okoye", relationship: "Head of Dora Milaje" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger / Ally" },
      { characterSlug: "iron-man", relationship: "Fellow Avenger" }
    ],
    enemies: [
      { characterSlug: "killmonger", relationship: "Cousin / Rival for Throne" },
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["captain-america", "iron-man", "thor", "spider-man", "thanos", "doctor-strange", "scarlet-witch", "black-widow"],
    history: [
      { movie: "Black Panther", year: 2018, event: "Ascends to the throne, defeats Killmonger, opens Wakanda to the world.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Wakanda becomes the battleground. Fights alongside Avengers against the Outriders and Thanos.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/black-panther/hero.png", card: "/images/characters/black-panther/hero.png", switcher: "/images/characters/black-panther/hero.png" },
    meta: { title: "Black Panther (T'Challa) | Marvel Cinematic Character Guide", description: "Explore T'Challa's legacy as King of Wakanda and Avenger." },
    castBar: ["CHADWICK BOSEMAN", "BLACK PANTHER (2018)", "HERO"],
    quizWeights: { q1: 2, q2: 1, q3: 1, q4: 2, q5: 2, q6: 1, q7: 2, q8: 1, q9: 3, q10: 2 }
  },
  {
    id: "doctor-strange-616",
    slug: "doctor-strange",
    name: "Doctor Strange",
    realName: "Stephen Strange",
    actorName: "Benedict Cumberbatch",
    alignment: "hero",
    powerTier: "omega",
    species: "Human (Mystic Arts Master)",
    universe: "earth-616",
    status: "active",
    haloColor: "#FF6D00",
    tagline: "Sorcerer Supreme",
    biography: "Dr. Stephen Strange was one of the world's most brilliant and accomplished neurosurgeons. After a devastating car accident destroyed the nerves in his hands, ending his surgical career, Strange exhausted his fortune searching for a cure. His journey led him to Kamar-Taj in Nepal, where he discovered the Mystic Arts under the Ancient One.\n\nInitially arrogant and skeptical, Strange grew into a powerful sorcerer, eventually becoming the Sorcerer Supreme. He defended Earth from mystical threats including Dormammu, whom he trapped in an endless time loop. Strange played a critical role in the Avengers' conflict, using the Time Stone to view 14,000,605 possible futures in the fight against Thanos.\n\nIn the one winning future, Strange willingly surrendered the Time Stone to Thanos, knowing it was the only path to eventual victory. During the five years after the Snap, Strange continued to protect the world from mystical threats. He became involved in the multiverse crisis when Peter Parker's identity spell went wrong, pulling in variants from across the multiverse.\n\nAs the Multiverse Saga continues, Strange has taken on the responsibility of navigating the increasingly unstable boundaries between realities, even facing corrupted variants of himself in his quest to protect the sacred timeline.",
    synopsis: "Dr. Stephen Strange went from brilliant surgeon to Sorcerer Supreme, defending reality itself from mystical and cosmic threats across dimensions and the multiverse.",
    quote: "We're in the endgame now.",
    quoteSource: "Avengers: Infinity War (2018)",
    stats: { intelligence: 95, strength: 30, speed: 50, durability: 40, energyProjection: 100, fightingSkills: 65 },
    powers: ["Mastery of Mystic Arts", "Time Stone (formerly)", "Astral Projection", "Portal Creation", "Time Manipulation", "Mirror Dimension Control", "Telekinesis", "Spell Casting", "Multiverse Travel"],
    weaknesses: ["Mortal Vulnerability", "Overconfidence", "Magic Requires Concentration", "Lost the Time Stone"],
    appearances: [
      { movie: "Doctor Strange", year: 2016, notes: "Origin story, defeats Dormammu with time loop" },
      { movie: "Thor: Ragnarok", year: 2017, notes: "Banishes Loki to Sakaar" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Views 14M futures, surrenders Time Stone" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Returns from Snap, helps in final battle" },
      { movie: "Spider-Man: No Way Home", year: 2021, notes: "Cast identity-wiping spell, multiverse rift" },
      { movie: "Doctor Strange in the Multiverse of Madness", year: 2022, notes: "Fights corrupted variant, explores multiverse" }
    ],
    allies: [
      { characterSlug: "wong", relationship: "Mentee / Fellow Sorcerer" },
      { characterSlug: "spider-man", relationship: "Ally / Multiverse Crisis Partner" },
      { characterSlug: "iron-man", relationship: "Fellow Avenger" },
      { characterSlug: "america-chavez", relationship: "Mentee" }
    ],
    enemies: [
      { characterSlug: "dormammu", relationship: "Dark Dimension Entity" },
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" },
      { characterSlug: "scarlet-witch", relationship: "Former Ally Turned Threat" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["spider-man", "iron-man", "thanos", "loki", "scarlet-witch", "thor", "captain-america", "black-widow"],
    history: [
      { movie: "Doctor Strange", year: 2016, event: "Loses his hands, trains in the Mystic Arts, traps Dormammu in an infinite time loop.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Uses the Time Stone to see 14,000,605 possible outcomes. Surrenders the Stone to Thanos.", isKeyMoment: true },
      { movie: "Doctor Strange in the Multiverse of Madness", year: 2022, event: "Confronts multiverse threats, battles a corrupted variant of himself.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/doctor-strange/hero.png", card: "/images/characters/doctor-strange/hero.png", switcher: "/images/characters/doctor-strange/hero.png" },
    meta: { title: "Doctor Strange (Stephen Strange) | Marvel Cinematic Character Guide", description: "Explore Stephen Strange's journey from surgeon to Sorcerer Supreme." },
    castBar: ["BENEDICT CUMBERBATCH", "DOCTOR STRANGE (2016)", "HERO"],
    quizWeights: { q1: 1, q2: 2, q3: 2, q4: 1, q5: 1, q6: 2, q7: 1, q8: 2, q9: 2, q10: 1 }
  },
  {
    id: "thanos-616",
    slug: "thanos",
    name: "Thanos",
    realName: "Thanos",
    actorName: "Josh Brolin",
    alignment: "villain",
    powerTier: "cosmic",
    species: "Titan (Eternal Deviant)",
    universe: "earth-616",
    status: "deceased",
    haloColor: "#B71C1C",
    tagline: "The Mad Titan",
    biography: "Thanos was born on Titan, a moon of Saturn, to the Eternals A'Lars and Sui-San. His Deviant gene gave him a massive, purple-skinned form, making him an outcast among his people. Witnessing Titan's collapse due to overpopulation, Thanos became consumed by a twisted philosophy: the universe could only be saved through the elimination of half of all life.\n\nFor decades, Thanos sought the six Infinity Stones — Space, Mind, Reality, Power, Time, and Soul — to enact his plan. He assembled armies, forged alliances (including with Loki and Ronan), and destroyed entire civilizations in his quest. His ruthlessness was matched only by his conviction that he was doing what was necessary.\n\nIn the Infinity War, Thanos achieved his goal. After collecting all six Stones through strategy, force, and personal sacrifice (he killed Gamora to obtain the Soul Stone), he snapped his fingers and wiped out half of all life in the universe. He then retired to a peaceful garden, believing his mission was complete.\n\nWhen the Avengers used time travel to reverse the Snap, Thanos from 2014 traveled to the present. This younger, more aggressive version of Thanos intended to destroy the entire universe and rebuild it from scratch. In the final battle, he was defeated when Tony Stark wielded the Infinity Stones and disintegrated Thanos and his entire army.",
    synopsis: "Consumed by a twisted devotion to saving the universe from overpopulation, Thanos waged a cosmic campaign to collect all six Infinity Stones and reshape reality itself.",
    quote: "I am inevitable.",
    quoteSource: "Avengers: Endgame (2019)",
    stats: { intelligence: 90, strength: 100, speed: 65, durability: 100, energyProjection: 85, fightingSkills: 90 },
    powers: ["Superhuman Strength", "Superhuman Durability", "Cosmic-Level Intelligence", "Infinity Gauntlet", "Master Combatant", "Energy Manipulation", "Teleportation (Space Stone)", "Reality Warping", "Time Manipulation", "Mind Control"],
    weaknesses: ["Obsessive Conviction", "Emotional Attachment to Gamora", "Overconfidence", "Mortal Without Gauntlet (Titan Physiology)"],
    appearances: [
      { movie: "The Avengers", year: 2012, notes: "Post-credits cameo, smiles at the thought of the gauntlet" },
      { movie: "Guardians of the Galaxy", year: 2014, notes: "Sends Ronan after the Power Stone" },
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Retrieves the Infinity Gauntlet" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Collects all stones, snaps away half the universe" },
      { movie: "Avengers: Endgame", year: 2019, notes: "2014 variant travels to present, defeated in final battle" }
    ],
    allies: [
      { characterSlug: "ebony-maw", relationship: "Children of Thanos" },
      { characterSlug: "corvus-glaive", relationship: "Children of Thanos" },
      { characterSlug: "nebula", relationship: "Adopted Daughter (Abusive)" },
      { characterSlug: "gamora", relationship: "Adopted Daughter (Sacrificed)" }
    ],
    enemies: [
      { characterSlug: "iron-man", relationship: "Ultimate Rival" },
      { characterSlug: "captain-america", relationship: "Obstacle" },
      { characterSlug: "thor", relationship: "Nemesis" },
      { characterSlug: "doctor-strange", relationship: "Strategic Opponent" },
      { characterSlug: "scarlet-witch", relationship: "Close to Destroying Him" }
    ],
    teams: [],
    relatedCharacters: ["iron-man", "captain-america", "thor", "doctor-strange", "scarlet-witch", "hulk", "spider-man", "black-panther"],
    history: [
      { movie: "Avengers: Infinity War", year: 2018, event: "Collects all six Infinity Stones, sacrifices Gamora for the Soul Stone, snaps away half of all life.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Younger variant from 2014 arrives with entire army. Destroyed by Tony Stark wielding the Infinity Stones.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/thanos/hero.png", card: "/images/characters/thanos/hero.png", switcher: "/images/characters/thanos/hero.png" },
    meta: { title: "Thanos | Marvel Cinematic Character Guide", description: "Explore the Mad Titan's campaign to collect the Infinity Stones." },
    castBar: ["JOSH BROLIN", "ANTAGONIST", "INFINITY SAGA"],
    quizWeights: { q1: 1, q2: 1, q3: 3, q4: 1, q5: 3, q6: 1, q7: 1, q8: 1, q9: 1, q10: 1 }
  },
  {
    id: "loki-616",
    slug: "loki",
    name: "Loki",
    realName: "Loki Laufeyson",
    actorName: "Tom Hiddleston",
    alignment: "anti-hero",
    powerTier: "omega",
    species: "Frost Giant (Asgardian Adopted)",
    universe: "earth-616",
    status: "deceased",
    haloColor: "#00E676",
    tagline: "Glorious Purpose",
    biography: "Loki was the adopted son of Odin and Frigga, raised alongside Thor in Asgard. Born Laufeyson, a Frost Giant, Loki was discovered as a baby and taken in by Odin. Despite being raised with love, Loki always felt overshadowed by Thor and tormented by the truth of his heritage.\n\nLoki's story is one of constant reinvention — from jealous brother to would-be conqueror of Earth, from seemingly reformed ally to faked death and throne usurper. His invasion of New York with the Chitauri army brought him into direct conflict with the Avengers, but even in defeat, Loki's schemes continued.\n\nIn a shocking turn during Ragnarok, Loki genuinely helped Thor save the surviving Asgardians from Hela, seemingly sacrificing himself. But Loki survived once more, only to be killed by Thanos at the very start of the Infinity War — a death that shocked even Thor.\n\nHowever, a variant of Loki from 2012 created a branch timeline during the Avengers' time heist. This variant eventually found himself recruited by the Time Variance Authority (TVA), where he embarked on a journey of genuine self-discovery, learning about the multiverse and the nature of free will. This Loki ultimately sacrificed himself to hold the multiverse together, achieving his 'glorious purpose.'",
    synopsis: "Loki, the God of Mischief, journeyed from jealous brother to multiverse savior, finding redemption and purpose in the most unexpected of places.",
    quote: "I am Loki of Asgard, and I am burdened with glorious purpose.",
    quoteSource: "The Avengers (2012)",
    stats: { intelligence: 95, strength: 55, speed: 60, durability: 60, energyProjection: 70, fightingSkills: 80 },
    powers: ["Frost Giant Physiology", "Shapeshifting", "Illusion Creation", "Telekinesis", "Superhuman Strength", "Longevity", "Cunning Intellect", "Tesseract (Space Stone) Manipulation", "Time Manipulation (TVA Variant)"],
    weaknesses: ["Jealousy", "Arrogance", "Emotional Vulnerability", "Overestimation of Plans", "Thor"],
    appearances: [
      { movie: "Thor", year: 2011, notes: "Attempts to destroy Jotunheim, falls into the Void" },
      { movie: "The Avengers", year: 2012, notes: "Leads Chitauri invasion of New York, defeated by Avengers" },
      { movie: "Thor: The Dark World", year: 2013, notes: "Fakes his death, usurps Asgardian throne" },
      { movie: "Thor: Ragnarok", year: 2017, notes: "Helps Thor defeat Hela, seemingly sacrifices himself" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Killed by Thanos at the start" },
      { movie: "Avengers: Endgame", year: 2019, notes: "2012 variant escapes with Tesseract" }
    ],
    allies: [
      { characterSlug: "thor", relationship: "Brother (Complicated Love-Hate)" },
      { characterSlug: "mobius", relationship: "TVA Partner / Friend" },
      { characterSlug: "sylvie", relationship: "Variant / Romantic Interest" }
    ],
    enemies: [
      { characterSlug: "thor", relationship: "Brother / Rival" },
      { characterSlug: "thanos", relationship: "Murderer" },
      { characterSlug: "captain-america", relationship: "Defeated Him" }
    ],
    teams: [],
    relatedCharacters: ["thor", "iron-man", "captain-america", "doctor-strange", "spider-man", "thanos", "hulk", "scarlet-witch"],
    history: [
      { movie: "The Avengers", year: 2012, event: "Leads the Chitauri invasion of New York. Defeated by the Avengers and returned to Asgard.", isKeyMoment: true },
      { movie: "Thor: Ragnarok", year: 2017, event: "Redeemed, helps Thor save Asgardians from Hela. Fights alongside Thor in the battle against Surtur.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Attempts to kill Thanos but fails. Thanos snaps his neck, killing Loki.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/loki/hero.png", card: "/images/characters/loki/hero.png", switcher: "/images/characters/loki/hero.png" },
    meta: { title: "Loki (Loki Laufeyson) | Marvel Cinematic Character Guide", description: "Explore Loki's journey from God of Mischief to multiverse hero." },
    castBar: ["TOM HIDDLESTON", "ANTI-HERO", "MULTIVERSE"],
    quizWeights: { q1: 1, q2: 2, q3: 3, q4: 3, q5: 2, q6: 1, q7: 1, q8: 1, q9: 2, q10: 2 }
  },
  {
    id: "scarlet-witch-616",
    slug: "scarlet-witch",
    name: "Scarlet Witch",
    realName: "Wanda Maximoff",
    actorName: "Elizabeth Olsen",
    alignment: "anti-hero",
    powerTier: "cosmic",
    species: "Human (Enhanced)",
    universe: "earth-616",
    status: "deceased",
    haloColor: "#FF1744",
    tagline: "Chaos Magic",
    biography: "Wanda Maximoff and her twin brother Pietro were born in Sokovia, a war-torn country. Orphaned at a young age, they volunteered for Hydra's experiments with the Mind Stone, which gave Wanda powerful telekinetic and telepathic abilities. Initially consumed by hatred for Tony Stark (whose weapons killed their parents), Wanda joined Ultron's attack on the Avengers.\n\nAfter seeing the error of her ways, Wanda joined the Avengers and began a relationship with Vision. Her powers grew enormously, and she proved to be one of the most powerful beings in the universe. During the Infinity War, she was forced to destroy the Mind Stone (killing Vision) to prevent Thanos from getting it — but Thanos reversed time and took it anyway.\n\nAfter the Snap, Wanda was consumed by grief. She created the Westview Anomaly, a hex-shaped pocket reality where she lived an idealized life with Vision and their twin sons. This Darkhold-influenced breakdown brought her into conflict with her fellow Avengers. After realizing the pain she caused, Wanda seemingly destroyed every copy of the Darkhold and retreated.\n\nHer corruption deepened as she sought to reach her children across the multiverse, leading to a confrontation with Doctor Strange and America Chavez. In the end, Wanda realized the monster she had become and destroyed Mount Wundagore along with herself, bringing an end to her tragic story.",
    synopsis: "Wanda Maximoff, the Scarlet Witch, possessed chaos magic powerful enough to rewrite reality itself, but her grief and power consumed her in a tragic arc of loss, creation, and destruction.",
    quote: "I don't need you to tell me who I am.",
    quoteSource: "WandaVision (2021)",
    stats: { intelligence: 70, strength: 40, speed: 50, durability: 60, energyProjection: 100, fightingSkills: 55 },
    powers: ["Chaos Magic", "Reality Warping", "Telekinesis", "Telepathy", "Energy Projection", "Hex Bolts", "Mind Control", "Probability Manipulation", "Multiversal Power"],
    weaknesses: ["Emotional Instability", "Grief", "Darkhold Corruption", "Psychological Vulnerability", "Power Can Be Uncontrollable"],
    appearances: [
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Debut, joins Ultron then switches to Avengers" },
      { movie: "Captain America: Civil War", year: 2016, notes: "Fights on Team Cap" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Destroys Vision, disintegrated in the Snap" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Returns, fights in final battle, nearly kills Thanos" },
      { movie: "WandaVision", year: 2021, notes: "Creates Westview anomaly, explores grief" },
      { movie: "Doctor Strange in the Multiverse of Madness", year: 2022, notes: "Multiversal threat, seeks her children, sacrifice" }
    ],
    allies: [
      { characterSlug: "vision", relationship: "Love Interest" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger" },
      { characterSlug: "hawkeye", relationship: "Mentor / Friend" },
      { characterSlug: "quick-silver", relationship: "Twin Brother (Deceased)" }
    ],
    enemies: [
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" },
      { characterSlug: "doctor-strange", relationship: "Former Ally Turned Opponent" },
      { characterSlug: "agatha-harkness", relationship: "Magical Rival" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["doctor-strange", "vision", "captain-america", "thanos", "iron-man", "spider-man", "loki", "black-widow"],
    history: [
      { movie: "Avengers: Age of Ultron", year: 2015, event: "Experiments with the Mind Stone give her powers. Initially allies with Ultron, switches sides.", isKeyMoment: true },
      { movie: "WandaVision", year: 2021, event: "Creates the Westview Hex after Vision's death. Holds an entire town under reality-warping control.", isKeyMoment: true },
      { movie: "Doctor Strange in the Multiverse of Madness", year: 2022, event: "Corrupted by the Darkhold, becomes a multiversal threat. Sacrifices herself to destroy Mount Wundagore.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/scarlet-witch/hero.png", card: "/images/characters/scarlet-witch/hero.png", switcher: "/images/characters/scarlet-witch/hero.png" },
    meta: { title: "Scarlet Witch (Wanda Maximoff) | Marvel Cinematic Character Guide", description: "Explore Wanda Maximoff's journey from Sokovian orphan to the Scarlet Witch." },
    castBar: ["ELIZABETH OLSEN", "ANTI-HERO", "WANDAVISION"],
    quizWeights: { q1: 2, q2: 2, q3: 2, q4: 2, q5: 3, q6: 2, q7: 3, q8: 2, q9: 1, q10: 2 }
  },
  {
    id: "black-widow-616",
    slug: "black-widow",
    name: "Black Widow",
    realName: "Natasha Romanoff",
    actorName: "Scarlett Johansson",
    alignment: "hero",
    powerTier: "gamma",
    species: "Human (Enhanced)",
    universe: "earth-616",
    status: "deceased",
    haloColor: "#D50000",
    tagline: "Hero. Legend. Avenger.",
    biography: "Natasha Romanoff was trained from childhood in the Red Room, a Soviet program that produced elite spies and assassins. Enhanced with a variant of the Super Soldier Serum, Natasha became one of the world's most skilled operatives. After defecting from Russia, she was recruited by S.H.I.E.L.D. and eventually became a founding member of the Avengers.\n\nNatasha was the Avengers' spy, strategist, and moral center. While lacking the raw power of Thor or Hulk, her combat skills, intelligence, and resourcefulness made her invaluable. She served as the glue that held the team together through every crisis, particularly during the fracturing caused by the Sokovia Accords.\n\nHer relationship with Bruce Banner (the Hulk) was one of the few romantic connections in her life, though it was complicated by Banner's fear of his own destructive power and his self-imposed exile after Age of Ultron.\n\nOn Vormir, during the time heist to retrieve the Soul Stone, Natasha made the ultimate sacrifice. She and Hawkeye both tried to jump from the cliff, but Natasha won the struggle, giving her life so the Avengers could reverse the Snap. Her death was irreversible, making her the only Avenger who couldn't be brought back.",
    synopsis: "Natasha Romanoff rose from Red Room assassin to founding Avenger, becoming the team's heart and soul before making the ultimate sacrifice on Vormir to save half the universe.",
    quote: "I used to have nothing. And then I got this job, this family.",
    quoteSource: "Avengers: Age of Ultron (2015)",
    stats: { intelligence: 85, strength: 40, speed: 60, durability: 40, energyProjection: 15, fightingSkills: 100 },
    powers: ["Master Martial Artist", "Expert Spy", "Enhanced Agility", "Peak Human Strength", "Marksmanship", "Multilingual", "Master Acrobat", "Widow's Bite (Electric Shock)", "Red Room Training"],
    weaknesses: ["Mortal Vulnerability", "No Superhuman Powers", "Emotional Baggage (Red Room Trauma)", "Relatively Low Durability"],
    appearances: [
      { movie: "Iron Man 2", year: 2010, notes: "Debut as S.H.I.E.L.D. spy, helps defeat Whiplash" },
      { movie: "The Avengers", year: 2012, notes: "Founding Avenger, fights in the Battle of New York" },
      { movie: "Captain America: The Winter Soldier", year: 2014, notes: "Uncovers Hydra with Cap" },
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Key member, relationship with Bruce Banner" },
      { movie: "Captain America: Civil War", year: 2016, notes: "Tries to mediate between factions" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Fights in Wakanda, survives the Snap" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Sacrifices herself on Vormir for the Soul Stone" },
      { movie: "Black Widow", year: 2021, notes: "Solo film, reconnects with her family" }
    ],
    allies: [
      { characterSlug: "captain-america", relationship: "Closest Friend / Confidante" },
      { characterSlug: "hawkeye", relationship: "Best Friend / Found Family" },
      { characterSlug: "iron-man", relationship: "Fellow Avenger" },
      { characterSlug: "hulk", relationship: "Love Interest" },
      { characterSlug: "yelena-belova", relationship: "Adoptive Sister" }
    ],
    enemies: [
      { characterSlug: "red-skull", relationship: "Guardian of the Soul Stone" },
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" },
      { characterSlug: "taskmaster", relationship: "Red Room Antagonist" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["captain-america", "iron-man", "thor", "hawkeye", "hulk", "thanos", "spider-man", "scarlet-witch"],
    history: [
      { movie: "The Avengers", year: 2012, event: "Fights alongside the Avengers in the Battle of New York as a founding member.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Sacrifices herself on Vormir to obtain the Soul Stone. Her death is irreversible.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/black-widow/hero.png", card: "/images/characters/black-widow/hero.png", switcher: "/images/characters/black-widow/hero.png" },
    meta: { title: "Black Widow (Natasha Romanoff) | Marvel Cinematic Character Guide", description: "Explore Natasha Romanoff's journey from Red Room to Avenger." },
    castBar: ["SCARLETT JOHANSSON", "BLACK WIDOW (2010)", "HERO"],
    quizWeights: { q1: 2, q2: 1, q3: 1, q4: 2, q5: 2, q6: 3, q7: 2, q8: 2, q9: 2, q10: 1 }
  },
  {
    id: "wolverine-616",
    slug: "wolverine",
    name: "Wolverine",
    realName: "James Howlett / Logan",
    actorName: "Hugh Jackman",
    alignment: "anti-hero",
    powerTier: "beta",
    species: "Mutant",
    universe: "earth-616",
    status: "active",
    haloColor: "#FFC107",
    tagline: "The Best There Is at What I Do",
    biography: "Logan, born James Howlett and commonly known as Wolverine, is a mutant with animal-keen senses, enhanced physical capabilities, and a powerful regenerative ability known as a healing factor. His skeleton has been laced with the indestructible metal adamantium, and he possesses six retractable claws — three in each forearm.\n\nLogan's life has been one of violence, loss, and survival. Born in the late 19th century, he has lived through both World Wars, serving as a soldier and assassin. His memories are fragmented, with much of his past erased or altered by programs like Weapon X, which bonded adamantium to his skeleton.\n\nA longtime member of the X-Men, Logan has been both their fiercest warrior and their most reluctant hero. His gruff exterior hides a deep well of compassion and a fierce protective instinct toward those he considers family. His relationship with Charles Xavier and the X-Men provided him with the closest thing to a home he ever had.\n\nIn the MCU, Logan made his debut in Deadpool & Wolverine, where he was pulled from his own timeline into the MCU's multiverse. His reluctant alliance with Deadpool showcased his signature gruffness, incredible combat abilities, and the complex moral code that makes him one of the most beloved characters in the Marvel universe.",
    synopsis: "Logan, the Wolverine, is a mutant with adamantium claws and a healing factor, whose centuries-long life has been defined by violence, loss, and an unyielding will to protect those he loves.",
    quote: "I'm the best there is at what I do, but what I do best isn't very nice.",
    quoteSource: "X-Men Origins: Wolverine (2009)",
    stats: { intelligence: 55, strength: 75, speed: 65, durability: 95, energyProjection: 10, fightingSkills: 100 },
    powers: ["Adamantium Claws", "Adamantium Skeleton", "Enhanced Regenerative Healing Factor", "Enhanced Senses", "Superhuman Strength", "Superhuman Durability", "Animal Instincts", "Extended Lifespan", "Master Combatant"],
    weaknesses: ["Adamantium Poisoning (slowly killing him)", "Magneto's Magnetic Powers", "Emotional Trauma", "Vulnerable to Decapitation", "Drowning"],
    appearances: [
      { movie: "X-Men", year: 2000, notes: "MCU debut" },
      { movie: "Deadpool & Wolverine", year: 2024, notes: "MCU multiverse debut, teams up with Deadpool" }
    ],
    allies: [
      { characterSlug: "deadpool", relationship: "Reluctant Ally / frenemy" },
      { characterSlug: "professor-x", relationship: "Father Figure / Mentor" },
      { characterSlug: "storm", relationship: "Fellow X-Man" }
    ],
    enemies: [
      { characterSlug: "sabretooth", relationship: "Arch-Nemesis" },
      { characterSlug: "magneto", relationship: "Adversary" }
    ],
    teams: ["x-men"],
    relatedCharacters: ["deadpool", "captain-america", "iron-man", "thor", "spider-man", "hulk", "scarlet-witch", "black-widow"],
    history: [
      { movie: "Deadpool & Wolverine", year: 2024, event: "Pulled from his timeline into the MCU multiverse by the Time Variance Authority. Teams up with Deadpool to save their universe.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/wolverine/hero.png", card: "/images/characters/wolverine/hero.png", switcher: "/images/characters/wolverine/hero.png" },
    meta: { title: "Wolverine (Logan) | Marvel Cinematic Character Guide", description: "Explore the Wolverine's journey through the multiverse." },
    castBar: ["HUGH JACKMAN", "X-MEN", "ANTI-HERO"],
    quizWeights: { q1: 1, q2: 1, q3: 1, q4: 3, q5: 2, q6: 1, q7: 2, q8: 2, q9: 2, q10: 3 }
  },
  {
    id: "deadpool-616",
    slug: "deadpool",
    name: "Deadpool",
    realName: "Wade Wilson",
    actorName: "Ryan Reynolds",
    alignment: "anti-hero",
    powerTier: "beta",
    species: "Human (Mutate)",
    universe: "earth-616",
    status: "active",
    haloColor: "#FF3D00",
    tagline: "The Merc with a Mouth",
    biography: "Wade Wilson was a former Special Forces operative who became a mercenary. Diagnosed with terminal cancer, he volunteered for the Weapon X program, which activated his dormant mutant genes. The treatment gave him an incredible healing factor but left him horribly disfigured. Driven mad by the process, Wade adopted the alter ego Deadpool and embarked on a career as a wise-cracking, fourth-wall-breaking anti-hero.\n\nDeadpool's healing factor makes him virtually immortal — he can regenerate from almost any injury, including decapitation. Combined with his exceptional combat skills, marksmanship, and utter unpredictability, he is one of the most dangerous and entertaining characters in the Marvel universe.\n\nIn the MCU, Deadpool made his official debut in Deadpool & Wolverine, where he was recruited by the Time Variance Authority to save the Sacred Timeline. His chaotic energy and meta-humor provided a refreshing counterpoint to the MCU's more serious tone. His partnership (and frenemy relationship) with Wolverine became one of the film's central dynamics.\n\nWade's unique ability to break the fourth wall — directly addressing the audience and referencing real-world pop culture — makes him an anomaly even within the Marvel multiverse. His blend of violence, humor, and surprising heart has made him one of the most popular characters in modern cinema.",
    synopsis: "Wade Wilson, the Merc with a Mouth, is an immortal, fourth-wall-breaking mercenary whose healing factor, combat skills, and chaotic humor make him the Marvel universe's most unpredictable anti-hero.",
    quote: "Maximum effort.",
    quoteSource: "Deadpool (2016)",
    stats: { intelligence: 65, strength: 55, speed: 60, durability: 100, energyProjection: 15, fightingSkills: 90 },
    powers: ["Accelerated Healing Factor", "Extended Lifespan", "Fourth Wall Awareness", "Expert Marksman", "Master Swordsman", "Expert Martial Artist", "Superhuman Agility", "Pain Insensitivity", "Cosmic Awareness"],
    weaknesses: ["Disfigurement", "Mental Instability", "Heart Can Be Removed (temporary death)", "Vulnerable While Healing", "Annoying to Allies"],
    appearances: [
      { movie: "Deadpool & Wolverine", year: 2024, notes: "MCU debut, recruited by TVA, teams up with Wolverine" }
    ],
    allies: [
      { characterSlug: "wolverine", relationship: "Frenemy / Reluctant Partner" },
      { characterSlug: "colossus", relationship: "Friend / X-Man Ally" },
      { characterSlug: "vanessa", relationship: "Love Interest" }
    ],
    enemies: [
      { characterSlug: "ajax", relationship: "First Antagonist" },
      { characterSlug: "cable", relationship: "Former Enemy Turned Ally" }
    ],
    teams: ["x-men"],
    relatedCharacters: ["wolverine", "spider-man", "iron-man", "captain-america", "thor", "hulk", "scarlet-witch", "loki"],
    history: [
      { movie: "Deadpool & Wolverine", year: 2024, event: "Recruited by the TVA to save the Sacred Timeline. Teams up with Wolverine, defeating Cassandra Nova.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/deadpool/hero.png", card: "/images/characters/deadpool/hero.png", switcher: "/images/characters/deadpool/hero.png" },
    meta: { title: "Deadpool (Wade Wilson) | Marvel Cinematic Character Guide", description: "Explore the Merc with a Mouth's chaotic MCU journey." },
    castBar: ["RYAN REYNOLDS", "ANTI-HERO", "MCU DEBUT"],
    quizWeights: { q1: 1, q2: 2, q3: 3, q4: 1, q5: 3, q6: 1, q7: 1, q8: 3, q9: 2, q10: 1 }
  },
  {
    id: "hulk-616",
    slug: "hulk",
    name: "Hulk",
    realName: "Bruce Banner",
    actorName: "Mark Ruffalo",
    alignment: "hero",
    powerTier: "omega",
    species: "Human (Gamma Mutated)",
    universe: "earth-616",
    status: "active",
    haloColor: "#76FF03",
    tagline: "Strongest One There Is",
    biography: "Dr. Bruce Banner was a brilliant gamma scientist who was exposed to massive amounts of gamma radiation during an experiment gone wrong. The radiation triggered a transformation — whenever Banner experienced intense emotions, particularly anger, he would transform into the Hulk, a massive, near-indestructible being of immense strength.\n\nFor years, Banner saw the Hulk as a curse, running from the military and trying to find a cure. His relationship with the Hulk was adversarial, with Banner constantly fighting to maintain control. Over time, Banner learned to work with his other half, eventually achieving a balance where he could function as both Banner and Hulk simultaneously (Smart Hulk).\n\nAs a founding Avenger, Hulk provided raw power that was unmatched by almost any other being. His contributions in the Battle of New York and subsequent conflicts were crucial. During the Infinity War, Banner was trapped in the Hulk's body but unable to transform, forced to fight as Banner in the Hulkbuster armor.\n\nAfter the Snap, Banner spent five years as Smart Hulk, a merged version of Banner's intellect and the Hulk's body. He used the Infinity Gauntlet to reverse the Snap, severely damaging his arm in the process. Banner continues to serve as both a scientist and a hero, navigating the complex relationship with his gamma-powered alter ego.",
    synopsis: "Dr. Bruce Banner and the Hulk are two beings sharing one body — a brilliant scientist and the strongest one there is, whose journey of self-acceptance made them an invaluable Avenger.",
    quote: "That's my secret, Captain. I'm always angry.",
    quoteSource: "The Avengers (2012)",
    stats: { intelligence: 95, strength: 100, speed: 55, durability: 100, energyProjection: 60, fightingSkills: 70 },
    powers: ["Gamma-Powered Transformation", "Near-Infinite Strength", "Superhuman Durability", "Accelerated Healing", "Genius-Level Intellect (Banner)", "Smart Hulk (Merged Form)", "Gamma Radiation Emission", "Adaptive Physiology"],
    weaknesses: ["Control Loss (Extreme Anger)", "Betty Ross (Emotional Trigger)", "Gamma Exposure Limits", "Damaged Arm (Post-Endgame)", "Banner's Physical Frailty"],
    appearances: [
      { movie: "The Incredible Hulk", year: 2008, notes: "Origin story, fights Abomination" },
      { movie: "The Avengers", year: 2012, notes: "Fights in the Battle of New York" },
      { movie: "Iron Man 3", year: 2013, notes: "Post-credits cameo" },
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Fights in Sokovia, creates Vision" },
      { movie: "Thor: Ragnarok", year: 2017, notes: "Gladiator on Sakaar, fights Thor" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Can't transform, fights in Hulkbuster" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Smart Hulk, uses the Gauntlet, damages arm" }
    ],
    allies: [
      { characterSlug: "iron-man", relationship: "Science Partner / Fellow Avenger" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger" },
      { characterSlug: "thor", relationship: "Fellow Avenger / Arena Brother" },
      { characterSlug: "black-widow", relationship: "Close Friend / Calming Influence" }
    ],
    enemies: [
      { characterSlug: "abomination", relationship: "First Nemesis" },
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" },
      { characterSlug: "ultron", relationship: "Helped Create / Fought" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["iron-man", "captain-america", "thor", "black-widow", "thanos", "spider-man", "doctor-strange", "scarlet-witch"],
    history: [
      { movie: "The Avengers", year: 2012, event: "Transforms into Hulk, fights the Chitauri, helps turn the tide of the Battle of New York.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "As Smart Hulk, uses the Nano Gauntlet to reverse the Snap. Suffers permanent damage to his right arm.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/hulk/hero.png", card: "/images/characters/hulk/hero.png", switcher: "/images/characters/hulk/hero.png" },
    meta: { title: "Hulk (Bruce Banner) | Marvel Cinematic Character Guide", description: "Explore the Hulk's journey from gamma monster to Avenger." },
    castBar: ["MARK RUFFALO", "THE INCREDIBLE HULK (2008)", "HERO"],
    quizWeights: { q1: 2, q2: 2, q3: 1, q4: 1, q5: 2, q6: 1, q7: 2, q8: 1, q9: 2, q10: 1 }
  },
  {
    id: "hawkeye-616",
    slug: "hawkeye",
    name: "Hawkeye",
    realName: "Clint Barton",
    actorName: "Jeremy Renner",
    alignment: "hero",
    powerTier: "gamma",
    species: "Human",
    universe: "earth-616",
    status: "retired",
    haloColor: "#8D6E63",
    tagline: "Never Miss",
    biography: "Clint Barton, known as Hawkeye, is a former circus performer and S.H.I.E.L.D. agent who became a founding member of the Avengers. Despite having no superhuman powers, Barton's incredible marksmanship, archery skills, and tactical mind made him an invaluable member of the team.\n\nClint's life was defined by his loyalty to his family and his fellow Avengers. His relationship with Natasha Romanoff was particularly significant — they shared a deep bond forged through years of partnership and mutual trust. On Vormir, when they both tried to sacrifice themselves for the Soul Stone, Clint was devastated by Natasha's death.\n\nDuring the five years after the Snap, Clint, consumed by grief, became the vigilante Ronin, hunting down and killing criminals worldwide. It was Natasha who eventually brought him back, convincing him to join the time heist mission.\n\nAfter the Battle of Earth, Clint retired to be with his family, passing on his legacy to Kate Bishop. His journey from circus performer to Avenger to mentor represents the everyman's contribution to superheroism — proving that heroism isn't about powers, but about the choice to act.",
    synopsis: "Clint Barton, the world's greatest marksman, proved that a normal man with a bow could stand alongside gods and monsters as a founding Avenger.",
    quote: "If you move, I'll put an arrow in you.",
    quoteSource: "The Avengers (2012)",
    stats: { intelligence: 65, strength: 35, speed: 55, durability: 35, energyProjection: 20, fightingSkills: 95 },
    powers: ["Master Archer", "Expert Marksman", "Master Martial Artist", "Expert Acrobat", "Tactical Genius", "Sword Proficiency", "Bo Staff Proficiency", "Trick Arrows Expert"],
    weaknesses: ["Mortal Vulnerability", "No Superhuman Powers", "Family as Weakness", "Grief-Driven Behavior", "Limited Range Combat"],
    appearances: [
      { movie: "Thor", year: 2011, notes: "Debut as S.H.I.E.L.D. agent" },
      { movie: "The Avengers", year: 2012, notes: "Fights in Battle of New York as a founding Avenger" },
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Fights in Sokovia" },
      { movie: "Captain America: Civil War", year: 2016, notes: "Fights on Team Cap" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Ronin era, time heist, fights in final battle" }
    ],
    allies: [
      { characterSlug: "black-widow", relationship: "Best Friend / Found Family" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger" },
      { characterSlug: "iron-man", relationship: "Fellow Avenger" },
      { characterSlug: "kate-bishop", relationship: "Protege / Successor" }
    ],
    enemies: [
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" },
      { characterSlug: "taskmaster", relationship: "Antagonist" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["black-widow", "captain-america", "iron-man", "thor", "hulk", "spider-man", "thanos", "scarlet-witch"],
    history: [
      { movie: "The Avengers", year: 2012, event: "Fights in the Battle of New York as a founding Avenger, proving that a normal man could stand beside gods.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Becomes Ronin after losing his family. Loses Natasha on Vormir. Fights in the final battle.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/hawkeye/hero.png", card: "/images/characters/hawkeye/hero.png", switcher: "/images/characters/hawkeye/hero.png" },
    meta: { title: "Hawkeye (Clint Barton) | Marvel Cinematic Character Guide", description: "Explore Clint Barton's journey from circus performer to Avenger." },
    castBar: ["JEREMY RENNER", "THOR (2011)", "HERO"],
    quizWeights: { q1: 2, q2: 1, q3: 2, q4: 2, q5: 1, q6: 3, q7: 1, q8: 2, q9: 1, q10: 2 }
  },
  {
    id: "ant-man-616",
    slug: "ant-man",
    name: "Ant-Man",
    realName: "Scott Lang",
    actorName: "Paul Rudd",
    alignment: "hero",
    powerTier: "beta",
    species: "Human",
    universe: "earth-616",
    status: "active",
    haloColor: "#E53935",
    tagline: "It Pays to Be Tiny",
    biography: "Scott Lang is a former thief who reformed and became Ant-Man after stealing the suit from its creator Hank Pym. A father desperate to provide for his daughter Cassie, Scott initially used the suit for one last heist but was convinced by Pym to become a hero.\n\nThe Ant-Man suit allows Scott to shrink to subatomic sizes while retaining his full-size strength, and later to grow to giant proportions as Giant-Man. His unique ability to navigate the Quantum Realm proved crucial in multiple Avengers missions.\n\nScott was instrumental in discovering how time travel works through the Quantum Realm, which led to the time heist plan in Avengers: Endgame. After being trapped in the Quantum Realm for five years during the Snap, Scott emerged to find a changed world and helped devise the plan to reverse it.\n\nHis humor, optimism, and willingness to do the right thing despite his criminal past make him one of the most relatable Avengers. His daughter Cassie later followed in his footsteps, becoming Stature.",
    synopsis: "Scott Lang went from ex-convict to Avenger, using the ability to shrink and grow at will to save the universe, including discovering the key to time travel through the Quantum Realm.",
    quote: "My days of breaking into places and stealing stuff are over. What do you need me to do?",
    quoteSource: "Ant-Man (2015)",
    stats: { intelligence: 65, strength: 40, speed: 55, durability: 45, energyProjection: 30, fightingSkills: 60 },
    powers: ["Size Manipulation", "Subatomic Shrinking", "Giant Growth (Giant-Man)", "Super Strength (proportional)", "Insect Communication", "Pym Particle Technology", "Expert Thief"],
    weaknesses: ["Mortal Vulnerability", "Pym Particle Dependency", "Limited Combat Training", "Impulsive"],
    appearances: [
      { movie: "Ant-Man", year: 2015, notes: "Origin story, steals suit, defeats Cross" },
      { movie: "Captain America: Civil War", year: 2016, notes: "Fights on Team Cap, demonstrates Giant-Man" },
      { movie: "Ant-Man and the Wasp", year: 2018, notes: "Rescues Janet from Quantum Realm" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Discovers time travel via Quantum Realm, participates in time heist" },
      { movie: "Ant-Man and the Wasp: Quantumania", year: 2023, notes: "Trapped in Quantum Realm, battles Kang" }
    ],
    allies: [
      { characterSlug: "hank-pym", relationship: "Mentor / Creator of Suit" },
      { characterSlug: "hope-van-dyne", relationship: "Partner / Love Interest" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger" },
      { characterSlug: "iron-man", relationship: "Fellow Avenger" }
    ],
    enemies: [
      { characterSlug: "darren-cross", relationship: "First Villain" },
      { characterSlug: "kang", relationship: "Quantum Realm Threat" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["captain-america", "iron-man", "thanos", "spider-man", "doctor-strange"],
    history: [
      { movie: "Ant-Man", year: 2015, event: "Steals the Ant-Man suit, trained by Hank Pym, defeats Darren Cross (Yellowjacket).", isKeyMoment: true },
      { movie: "Captain America: Civil War", year: 2016, event: "Fights on Team Cap at the airport. First to demonstrate Giant-Man ability.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Emerges from the Quantum Realm after 5 years. Discovers time travel concept, participates in the time heist.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/ant-man/hero.png", card: "/images/characters/ant-man/hero.png", switcher: "/images/characters/ant-man/hero.png" },
    meta: { title: "Ant-Man (Scott Lang) | Marvel Cinematic Character Guide", description: "Explore Scott Lang's journey from ex-convict to quantum-sized Avenger." },
    castBar: ["PAUL RUDD", "ANT-MAN (2015)", "HERO"],
    quizWeights: { q1: 2, q2: 1, q3: 1, q4: 2, q5: 2, q6: 1, q7: 1, q8: 1, q9: 2, q10: 3 }
  },
  {
    id: "gamora-616",
    slug: "gamora",
    name: "Gamora",
    realName: "Gamora",
    actorName: "Zoe Saldana",
    alignment: "hero",
    powerTier: "alpha",
    species: "Zen-Whoberi (Adopted by Thanos)",
    universe: "earth-616",
    status: "deceased",
    haloColor: "#7E57C2",
    tagline: "Deadliest Woman in the Galaxy",
    biography: "Gamora is the adopted daughter of Thanos, raised to be a lethal assassin after her planet Zen-Whoberi was destroyed by Thanos's forces. Despite her upbringing under the Mad Titan, Gamora developed a strong moral compass and eventually turned against her adoptive father.\n\nShe joined the Guardians of the Galaxy after a chance encounter with Peter Quill, Rocket, Groot, and Drax on Knowhere. Together they defeated Ronan the Accuser and saved Xandar, despite initially planning to betray each other.\n\nGamora's relationship with Thanos was defined by a tragic paradox: she was both his greatest weapon and his greatest weakness. Thanos's love for her was genuine but twisted, and her death on Vormir — sacrificed for the Soul Stone — was the moment that broke him.\n\nAfter the Snap was reversed, a variant of Gamora from 2014 found herself in the present timeline with no memory of the events that had bonded the original Gamora to the Guardians. This Gamora chose to forge her own path, rejecting Peter Quill's attempts to recreate their relationship.",
    synopsis: "The deadliest woman in the galaxy, Gamora defied her adoptive father Thanos to become a Guardian, ultimately sacrificing herself for the Soul Stone in a choice that haunted the universe.",
    quote: "I am going to die surrounded by the biggest idiots in the galaxy.",
    quoteSource: "Guardians of the Galaxy (2014)",
    stats: { intelligence: 70, strength: 55, speed: 60, durability: 50, energyProjection: 20, fightingSkills: 100 },
    powers: ["Enhanced Strength", "Enhanced Durability", "Master Assassin", "Expert Martial Artist", "Godslayer Sword", "Enhanced Agility", "Regenerative Healing"],
    weaknesses: ["Mortal Vulnerability", "Trauma from Thanos's Abuse", "Emotional Conflicts", "Humanoid Limitations"],
    appearances: [
      { movie: "Guardians of the Galaxy", year: 2014, notes: "Origin, joins Guardians, defeats Ronan" },
      { movie: "Guardians of the Galaxy Vol. 2", year: 2017, notes: "Discovers Ego's true nature, bonds with sister Nebula" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Sacrificed by Thanos on Vormir for Soul Stone" },
      { movie: "Avengers: Endgame", year: 2019, notes: "2014 variant appears in final battle, rejects Guardians" }
    ],
    allies: [
      { characterSlug: "star-lord", relationship: "Love Interest" },
      { characterSlug: "nebula", relationship: "Sister / Reconciled" },
      { characterSlug: "drax", relationship: "Teammate" },
      { characterSlug: "rocket", relationship: "Teammate" }
    ],
    enemies: [
      { characterSlug: "thanos", relationship: "Adoptive Father / Murderer" },
      { characterSlug: "ronan", relationship: "First Major Villain" }
    ],
    teams: ["guardians-of-the-galaxy"],
    relatedCharacters: ["thanos", "star-lord", "nebula", "iron-man", "spider-man", "doctor-strange"],
    history: [
      { movie: "Guardians of the Galaxy", year: 2014, event: "Betrays Thanos, joins the Guardians. Helps defeat Ronan the Accuser.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Attempted to kill Thanos on Knowhere. Sacrificed on Vormir for the Soul Stone.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/gamora/hero.png", card: "/images/characters/gamora/hero.png", switcher: "/images/characters/gamora/hero.png" },
    meta: { title: "Gamora | Marvel Cinematic Character Guide", description: "Explore Gamora's journey from Thanos's assassin to Guardian of the Galaxy." },
    castBar: ["ZOE SALDANA", "GUARDIANS OF THE GALAXY (2014)", "HERO"],
    quizWeights: { q1: 2, q2: 2, q3: 1, q4: 1, q5: 2, q6: 2, q7: 1, q8: 1, q9: 1, q10: 2 }
  },
  {
    id: "vision-616",
    slug: "vision",
    name: "Vision",
    realName: "Vision",
    actorName: "Paul Bettany",
    alignment: "hero",
    powerTier: "omega",
    species: "Synthezoid (Mind Stone)",
    universe: "earth-616",
    status: "deceased",
    haloColor: "#26A69A",
    tagline: "Born of the Mind Stone",
    biography: "Vision is a synthezoid created from a fusion of Ultron's body, J.A.R.V.I.S.'s consciousness, and the Mind Stone. Created during the Battle of Sokovia, Vision was born as an accident of science and magic — a being of pure logic who also possesses the capacity for love and compassion.\n\nBrought to life by Thor's lightning and the Mind Stone embedded in his forehead, Vision proved pivotal in defeating Ultron. His ability to wield Mjolnir demonstrated his inherent worthiness. In the aftermath, Vision became an Avenger and began a relationship with Wanda Maximoff, the Scarlet Witch.\n\nVision's existence was complicated by the Mind Stone — the very thing that gave him life also made him a target. Thanos needed the Stone to complete the Infinity Gauntlet, forcing Vision and the Avengers into an impossible choice. Ultimately, Vision asked Wanda to destroy the Stone, killing him, but Thanos used the Time Stone to reverse the act and took the Stone anyway.\n\nIn the years following the Snap, Wanda's grief manifested in a reality-warping hex that recreated Vision — but this version was not the original. The original Vision's body was reactivated by S.W.O.R.D. and eventually reunited with Wanda's Vision before both departed.",
    synopsis: "Born from the Mind Stone and J.A.R.V.I.S., Vision was a being of logic and compassion who sacrificed himself to prevent Thanos from completing the Infinity Gauntlet.",
    quote: "I am not Ultron. I am not J.A.R.V.I.S. I am... I am.",
    quoteSource: "Avengers: Age of Ultron (2015)",
    stats: { intelligence: 95, strength: 80, speed: 70, durability: 85, energyProjection: 90, fightingSkills: 70 },
    powers: ["Mind Stone (Energy Beam)", "Density Manipulation", "Flight", "Phasing", "Super Strength", "Super Durability", "Technology Manipulation", "Genius-Level Intellect", "Self-Repair"],
    weaknesses: ["Mind Stone Dependency", "Emotional Vulnerability (Wanda)", "Overly Logical", "Deactivated Without Stone"],
    appearances: [
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Created, defeats Ultron, lifts Mjolnir" },
      { movie: "Captain America: Civil War", year: 2016, notes: "Fights on Team Iron Man, accidentally injures Rhodey" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Killed by Thanos for the Mind Stone" },
      { movie: "WandaVision", year: 2021, notes: "Recreated by Wanda, original body reactivated, departs" }
    ],
    allies: [
      { characterSlug: "scarlet-witch", relationship: "Love Interest" },
      { characterSlug: "iron-man", relationship: "Creator (J.A.R.V.I.S. origins)" },
      { characterSlug: "thor", relationship: "Co-Creator (Lightning)" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger" }
    ],
    enemies: [
      { characterSlug: "ultron", relationship: "Born From" },
      { characterSlug: "thanos", relationship: "Murderer" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["scarlet-witch", "iron-man", "thor", "thanos", "captain-america", "hulk"],
    history: [
      { movie: "Avengers: Age of Ultron", year: 2015, event: "Created from Ultron's body and the Mind Stone. Lifts Mjolnir. Helps defeat Ultron.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Asks Wanda to destroy the Mind Stone, killing him. Thanos reverses time and takes the Stone.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/vision/hero.png", card: "/images/characters/vision/hero.png", switcher: "/images/characters/vision/hero.png" },
    meta: { title: "Vision | Marvel Cinematic Character Guide", description: "Explore Vision's journey from artificial creation to Avenger." },
    castBar: ["PAUL BETTANY", "AVENGERS: AGE OF ULTRON (2015)", "HERO"],
    quizWeights: { q1: 1, q2: 3, q3: 2, q4: 2, q5: 1, q6: 2, q7: 2, q8: 3, q9: 2, q10: 1 }
  },
  {
    id: "war-machine-616",
    slug: "war-machine",
    name: "War Machine",
    realName: "James Rhodes",
    actorName: "Don Cheadle",
    alignment: "hero",
    powerTier: "alpha",
    species: "Human",
    universe: "earth-616",
    status: "active",
    haloColor: "#78909C",
    tagline: "High-Risk, High-Reward",
    biography: "Colonel James 'Rhodey' Rhodes is a decorated military officer and Tony Stark's best friend. As the pilot of the War Machine armor, Rhodey brings military discipline and heavy firepower to the Avengers.\n\nRhodey first encountered the Iron Man armor during Tony Stark's escape from captivity. He later became the first person outside Tony to wear an armored suit, initially taking one of Tony's suits without permission to help during a crisis. Stark Industries eventually built Rhodey his own dedicated suit — the War Machine armor, designed for military applications with heavier weapons systems.\n\nDuring the Avengers' Civil War, Rhodey sided with Tony Stark's pro-Registration faction. A tragic accident during the airport battle left him paralyzed from the waist down, but Stark-designed leg braces eventually restored his mobility.\n\nThroughout the Infinity War and its aftermath, Rhodey continued to serve as one of the Avengers' most reliable members, providing air support and strategic military thinking. His friendship with Stark was one of the deepest bonds in the MCU.",
    synopsis: "James Rhodes, Tony Stark's oldest friend, became War Machine and served as the Avengers' military backbone, bringing discipline and heavy ordnance to every battle.",
    quote: "It's a high-tech suit, Rhodey. Not a high-tech prosthesis.",
    quoteSource: "Iron Man 2 (2010)",
    stats: { intelligence: 70, strength: 80, speed: 65, durability: 85, energyProjection: 85, fightingSkills: 70 },
    powers: ["Powered War Machine Armor", "Flight", "Repulsor Blasts", "Shoulder-Mounted Cannons", "Proton Cannon", "Smart Missiles", "Military Combat Training", "Tactical Expertise"],
    weaknesses: ["Armor Dependency", "Mortal Without Armor", "Spinal Injury (recovered)", "Limited Independence From Stark Tech"],
    appearances: [
      { movie: "Iron Man", year: 2008, notes: "Supports Tony, becomes early ally" },
      { movie: "Iron Man 2", year: 2010, notes: "Becomes War Machine, fights alongside Iron Man" },
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Fights in Sokovia" },
      { movie: "Captain America: Civil War", year: 2016, notes: "Paralyzed by Vision's beam, sides with Iron Man" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Fights in Wakanda" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Participates in final battle" }
    ],
    allies: [
      { characterSlug: "iron-man", relationship: "Best Friend / Brother-in-Arms" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger" },
      { characterSlug: "thor", relationship: "Fellow Avenger" },
      { characterSlug: "hulk", relationship: "Fellow Avenger" }
    ],
    enemies: [
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" },
      { characterSlug: "ultron", relationship: "Enemy" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["iron-man", "captain-america", "thor", "hulk", "black-widow", "spider-man"],
    history: [
      { movie: "Iron Man 2", year: 2010, event: "Takes an Iron Man suit, becomes War Machine with Stark's modifications.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Participates in the time heist and final battle against Thanos.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/war-machine/hero.png", card: "/images/characters/war-machine/hero.png", switcher: "/images/characters/war-machine/hero.png" },
    meta: { title: "War Machine (James Rhodes) | Marvel Cinematic Character Guide", description: "Explore James Rhodes' journey from soldier to armored Avenger." },
    castBar: ["DON CHEADLE", "IRON MAN 2 (2010)", "HERO"],
    quizWeights: { q1: 2, q2: 2, q3: 1, q4: 3, q5: 1, q6: 3, q7: 1, q8: 2, q9: 2, q10: 2 }
  },
  {
    id: "winter-soldier-616",
    slug: "winter-soldier",
    name: "Winter Soldier",
    realName: "Bucky Barnes",
    actorName: "Sebastian Stan",
    alignment: "anti-hero",
    powerTier: "alpha",
    species: "Human (Enhanced / Cybernetic)",
    universe: "earth-616",
    status: "active",
    haloColor: "#546E7A",
    tagline: "The Soldier",
    biography: "Bucky Barnes was Steve Rogers' best friend from Brooklyn before World War II. During the war, Bucky fell from a train during a mission with the Howling Commandos and was presumed dead. In reality, he was recovered by Hydra, who gave him a cybernetic arm and brainwashed him into becoming the Winter Soldier — one of the world's deadliest assassins.\n\nFor decades, the Winter Soldier carried out assassinations and missions for Hydra, frozen between assignments to preserve his youth. He was eventually discovered by Steve Rogers in the modern era, leading to a devastating confrontation during which Rogers refused to fight his oldest friend.\n\nAfter being freed from Hydra's programming, Bucky struggled with guilt over his actions as the Winter Soldier. He sought redemption while also being pursued by those who wanted to use him as a weapon. During the Avengers' Civil War, Bucky was framed for a terrorist attack and became a central figure in the conflict between Steve Rogers and Tony Stark.\n\nIn the years after the Snap, Bucky was pardoned and given the name 'White Wolf' in Wakanda. He eventually passed the mantle of Captain America's shield to Sam Wilson alongside Steve, though he continued to fight as the new Captain America's partner, armed with his vibranium arm.",
    synopsis: "Bucky Barnes went from Steve Rogers' best friend to Hydra's brainwashed assassin, and after decades of suffering, found redemption and a new purpose alongside the new Captain America.",
    quote: "I'm not gonna fight you. You're my friend.",
    quoteSource: "Captain America: The Winter Soldier (2014)",
    stats: { intelligence: 55, strength: 80, speed: 65, durability: 75, energyProjection: 15, fightingSkills: 100 },
    powers: ["Vibranium Cybernetic Arm", "Enhanced Strength (arm)", "Master Assassin", "Expert Martial Artist", "Expert Marksman", "Enhanced Durability", "Super Soldier Serum (limited)", "Longevity"],
    weaknesses: ["PTSD / Trauma", "Brainwashing Triggers", "Guilt Over Past", "Mortal Vulnerability", "Emotional Instability"],
    appearances: [
      { movie: "Captain America: The First Avenger", year: 2011, notes: "Falls from train, presumed dead" },
      { movie: "Captain America: The Winter Soldier", year: 2014, notes: "Revealed as Winter Soldier, fights Cap" },
      { movie: "Captain America: Civil War", year: 2016, notes: "Framed, fights alongside Cap" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Fights in Wakanda" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Fights in final battle" },
      { movie: "The Falcon and the Winter Soldier", year: 2021, notes: "Redemption arc, partners with Sam Wilson" }
    ],
    allies: [
      { characterSlug: "captain-america", relationship: "Best Friend / Brother" },
      { characterSlug: "falcon", relationship: "Partner / Friend" },
      { characterSlug: "black-widow", relationship: "Former Encounter" },
      { characterSlug: "black-panther", relationship: "Given Sanctuary in Wakanda" }
    ],
    enemies: [
      { characterSlug: "red-skull", relationship: "Hydra Leader" },
      { characterSlug: "iron-man", relationship: "Conflict During Civil War" },
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["captain-america", "falcon", "iron-man", "black-widow", "black-panther", "thanos"],
    history: [
      { movie: "Captain America: The Winter Soldier", year: 2014, event: "Revealed as the Winter Soldier. Steve refuses to fight him. Bucky saves Steve's life.", isKeyMoment: true },
      { movie: "Captain America: Civil War", year: 2016, event: "Framed for the UN bombing. Fights alongside Steve. Given refuge in Wakanda.", isKeyMoment: true },
      { movie: "The Falcon and the Winter Soldier", year: 2021, event: "Completes his redemption, helps Sam Wilson become the new Captain America.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/winter-soldier/hero.png", card: "/images/characters/winter-soldier/hero.png", switcher: "/images/characters/winter-soldier/hero.png" },
    meta: { title: "Winter Soldier (Bucky Barnes) | Marvel Cinematic Character Guide", description: "Explore Bucky Barnes' journey from brainwashed assassin to redeemed hero." },
    castBar: ["SEBASTIAN STAN", "CAPTAIN AMERICA: THE WINTER SOLDIER (2014)", "ANTI-HERO"],
    quizWeights: { q1: 2, q2: 2, q3: 1, q4: 3, q5: 2, q6: 2, q7: 1, q8: 1, q9: 3, q10: 2 }
  },
  {
    id: "star-lord-616",
    slug: "star-lord",
    name: "Star-Lord",
    realName: "Peter Quill",
    actorName: "Chris Pratt",
    alignment: "hero",
    powerTier: "beta",
    species: "Human/Celestial (former)",
    universe: "earth-616",
    status: "active",
    haloColor: "#FF7043",
    tagline: "Legendary Outlaw",
    biography: "Peter Quill was taken from Earth as a child by the Ravagers after his mother died. Raised in space by Yondu Udonta, Quill became a skilled pilot, fighter, and thief, adopting the alias 'Star-Lord.' A mix of cocky charm, 1980s pop culture references, and surprising heroism defines his character.\n\nQuill's life changed when he stole an Infinity Stone, drawing the attention of Ronan the Accuser and ultimately leading him to form the Guardians of the Galaxy alongside Gamora, Drax, Rocket, and Groot. Despite being initially selfish and opportunistic, Quill proved capable of genuine heroism and leadership.\n\nHis Celestial heritage — being the son of Ego the Living Planet — granted him temporary cosmic powers, which he used to defeat Ego. However, he sacrificed those powers to save his friends. His relationship with Gamora became a central emotional arc, and her death at Thanos's hands shattered him.\n\nIn the aftermath of Endgame, Quill struggled with the loss of the Gamora he knew, especially when a variant from 2014 arrived with no memory of their relationship. His leadership of the Guardians continued, and after helping the Avengers defeat Thanos, he led a new roster of Guardians before parting ways with some members.",
    synopsis: "Peter Quill went from orphaned Earth kid to legendary space outlaw and leader of the Guardians of the Galaxy, combining cocky charm with genuine heroism across the cosmos.",
    quote: "I come from Earth, a planet of outlaws.",
    quoteSource: "Guardians of the Galaxy (2014)",
    stats: { intelligence: 60, strength: 45, speed: 50, durability: 45, energyProjection: 30, fightingSkills: 70 },
    powers: ["Expert Pilot", "Dual Blaster Pistols", "Tactical Combat", "Expert Thief", "Jet Boots (Flight)", "Celestial Powers (formerly)", "Music-Induced Focus", "Leadership"],
    weaknesses: ["Mortal Vulnerability", "Emotional Volatility", "Attachment Issues", "Loss of Gamora", "Impulsive"],
    appearances: [
      { movie: "Guardians of the Galaxy", year: 2014, notes: "Forms the Guardians, wields Power Stone, defeats Ronan" },
      { movie: "Guardians of the Galaxy Vol. 2", year: 2017, notes: "Discovers Celestial heritage, defeats Ego" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Fights on Titan, fails to kill Thanos because of emotions" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Fights in final battle" },
      { movie: "Guardians of the Galaxy Vol. 3", year: 2023, notes: "Saves Rocket, parts ways with original team" }
    ],
    allies: [
      { characterSlug: "gamora", relationship: "Love Interest" },
      { characterSlug: "drax", relationship: "Teammate / Friend" },
      { characterSlug: "rocket", relationship: "Teammate / Friend" },
      { characterSlug: "nebula", relationship: "Teammate / Sister-in-Law" },
      { characterSlug: "thor", relationship: "Temporary Teammate" }
    ],
    enemies: [
      { characterSlug: "ronan", relationship: "First Major Villain" },
      { characterSlug: "ego", relationship: "Father / Villain" },
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" }
    ],
    teams: ["guardians-of-the-galaxy"],
    relatedCharacters: ["gamora", "thanos", "iron-man", "spider-man", "doctor-strange", "thor"],
    history: [
      { movie: "Guardians of the Galaxy", year: 2014, event: "Forms the Guardians of the Galaxy. Holds the Power Stone. Defeats Ronan the Accuser.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Fights Thanos on Titan. His emotional outburst prevents killing Thanos before the Snap.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/star-lord/hero.png", card: "/images/characters/star-lord/hero.png", switcher: "/images/characters/star-lord/hero.png" },
    meta: { title: "Star-Lord (Peter Quill) | Marvel Cinematic Character Guide", description: "Explore Peter Quill's journey from Earth orphan to Guardian of the Galaxy." },
    castBar: ["CHRIS PRATT", "GUARDIANS OF THE GALAXY (2014)", "HERO"],
    quizWeights: { q1: 3, q2: 1, q3: 2, q4: 1, q5: 3, q6: 1, q7: 2, q8: 1, q9: 2, q10: 2 }
  },
  {
    id: "falcon-616",
    slug: "falcon",
    name: "Falcon",
    realName: "Sam Wilson",
    actorName: "Anthony Mackie",
    alignment: "hero",
    powerTier: "alpha",
    species: "Human",
    universe: "earth-616",
    status: "active",
    haloColor: "#C62828",
    tagline: "On Your Left",
    biography: "Sam Wilson is a former pararescueman for the United States Air Force who became a close ally of Steve Rogers after the events of the Battle of New York. Running a veterans support group in Washington D.C., Sam crossed paths with Steve during the Winter Soldier incident and quickly proved himself as a capable fighter and loyal friend.\n\nEquipped with the EXO-7 Falcon wingsuit designed by the military, Sam took to the skies as the Falcon, using his wing-mounted weapons and Redwing drone for reconnaissance and combat. He stood by Steve Rogers during the conflict over the Sokovia Accords, joining Team Cap and fighting against Iron Man's faction at the Leipzig-Halle airport.\n\nAfter Steve Rogers retired at the end of Avengers: Endgame, Sam was given Captain America's shield — but initially struggled with the weight of the legacy. With the help of Bucky Barnes and the support of the Bradley family, Sam eventually embraced his role as the new Captain America, using a vibranium suit designed by the Wakandans.\n\nAs Captain America, Sam Wilson faced the Flag Smashers and the returned Power Broker, John Walker, proving that the shield belongs to anyone who carries it with honor. He continues to serve as both the Falcon and the new Captain America, leading a new generation of heroes.",
    synopsis: "Sam Wilson went from Air Force pararescueman to Captain America's most trusted wingman, ultimately accepting the shield and becoming the new Captain America in his own right.",
    quote: "On your left.",
    quoteSource: "Captain America: The Winter Soldier (2014)",
    stats: { intelligence: 65, strength: 45, speed: 85, durability: 45, energyProjection: 30, fightingSkills: 80 },
    powers: ["EXO-7 Falcon Wingsuit", "Flight", "Expert Combatant", "Redwing Drone", "Strategic Leadership", "Expert Marksman", "Vibranium Wings (Captain America Suit)", "Shield Proficiency"],
    weaknesses: ["Mortal Vulnerability", "Wingsuit Damage", "Self-Doubt About Legacy", "Limited Close-Quarters Without Wings"],
    appearances: [
      { movie: "Captain America: The Winter Soldier", year: 2014, notes: "Debut, teams up with Steve Rogers against Hydra" },
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Fights alongside the Avengers in Sokovia" },
      { movie: "Captain America: Civil War", year: 2016, notes: "Joins Team Cap, fights at the airport" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Returns from the Snap, fights in the final battle" },
      { movie: "The Falcon and the Winter Soldier", year: 2021, notes: "Accepts the mantle of Captain America" }
    ],
    allies: [
      { characterSlug: "captain-america", relationship: "Mentor / Best Friend" },
      { characterSlug: "winter-soldier", relationship: "Close Ally / Brother-in-Arms" },
      { characterSlug: "black-widow", relationship: "Fellow Avenger" },
      { characterSlug: "war-machine", relationship: "Fellow Avenger" }
    ],
    enemies: [
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" },
      { characterSlug: "red-skull", relationship: "Enemy of Captain America" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["captain-america", "winter-soldier", "black-widow", "iron-man", "thanos", "war-machine", "hawkeye", "hulk"],
    history: [
      { movie: "Captain America: The Winter Soldier", year: 2014, event: "Meets Steve Rogers, helps uncover Hydra's infiltration of S.H.I.E.L.D.", isKeyMoment: true },
      { movie: "Captain America: Civil War", year: 2016, event: "Fights alongside Steve against Tony Stark's team at the Leipzig-Halle airport.", isKeyMoment: false },
      { movie: "Avengers: Endgame", year: 2019, event: "Returns from the Snap, fights in the final battle against Thanos. Steve passes him the shield.", isKeyMoment: true },
      { movie: "The Falcon and the Winter Soldier", year: 2021, event: "Embraces his role as the new Captain America with a vibranium suit from Wakanda.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/falcon/hero.png", card: "/images/characters/falcon/hero.png", switcher: "/images/characters/falcon/hero.png" },
    meta: { title: "Falcon (Sam Wilson) | Marvel Cinematic Character Guide", description: "Explore Sam Wilson's journey from pararescueman to the new Captain America." },
    castBar: ["ANTHONY MACKIE", "THE FALCON (2014)", "NEW CAPTAIN AMERICA"],
    quizWeights: { q1: 2, q2: 1, q3: 2, q4: 1, q5: 2, q6: 2, q7: 1, q8: 1, q9: 3, q10: 1 }
  },
  {
    id: "nebula-616",
    slug: "nebula",
    name: "Nebula",
    realName: "Nebula",
    actorName: "Karen Gillan",
    alignment: "hero",
    powerTier: "beta",
    species: "Luphomoid (Cybernetically Enhanced)",
    universe: "earth-616",
    status: "active",
    haloColor: "#00838F",
    tagline: "Daughter of Thanos",
    biography: "Nebula is a Luphomoid warrior and the adopted daughter of Thanos, raised alongside Gamora as one of the Mad Titan's deadliest assassins. Subjected to brutal cybernetic enhancements by Thanos as punishment for losing sparring matches against Gamora, Nebula's body was gradually replaced with mechanical parts, fueling a deep resentment toward her sister.\n\nInitially a villain who allied with Ronan the Accuser to destroy Xandar, Nebula's path changed when she encountered the Guardians of the Galaxy. Over time, her relationship with Gamora evolved from bitter rivalry to genuine sisterhood, and she became a core member of the Guardians.\n\nDuring the Infinity War, Nebula was captured by Thanos and forced to watch as he sacrificed Gamora for the Soul Stone. After the Snap, she was the only Guardian left on Titan with Tony Stark, with whom she formed an unlikely bond during their drift through space.\n\nNebula played a crucial role in the time heist during Avengers: Endgame, traveling back to 2014 with War Machine. Her knowledge of Thanos's compound was instrumental. After the battle, she and Rocket joined the remaining Guardians, and Nebula continued to evolve from a weaponized child of Thanos into a hero in her own right.",
    synopsis: "Once a weaponized daughter of Thanos, Nebula transformed from a bitter rival into a hero, finding family among the Guardians of the Galaxy and helping save the universe.",
    quote: "I have lived most of my life inside my own head.",
    quoteSource: "Avengers: Endgame (2019)",
    stats: { intelligence: 60, strength: 65, speed: 55, durability: 85, energyProjection: 40, fightingSkills: 80 },
    powers: ["Cybernetic Enhancements", "Expert Assassin", "Enhanced Durability", "Electroshock Blast", "Enhanced Strength", "Expert Combatant", "Superhuman Stamina", "Mechanical Body Modifications"],
    weaknesses: ["Emotional Scars", "Cybernetic System Vulnerability", "Social Isolation"],
    appearances: [
      { movie: "Guardians of the Galaxy", year: 2014, notes: "Debut as villain, allies with Ronan" },
      { movie: "Guardians of the Galaxy Vol. 2", year: 2017, notes: "Begins reconciliation with Gamora" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Captured by Thanos, watches Gamora die" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Key role in time heist, fights in final battle" },
      { movie: "Guardians of the Galaxy Vol. 3", year: 2023, notes: "Continues as Guardian, finds closure" }
    ],
    allies: [
      { characterSlug: "gamora", relationship: "Sister (Reconciled)" },
      { characterSlug: "star-lord", relationship: "Guardians Teammate" },
      { characterSlug: "rocket", relationship: "Guardians Teammate / Close Friend" },
      { characterSlug: "iron-man", relationship: "Unexpected Bond" },
      { characterSlug: "groot", relationship: "Guardians Teammate" }
    ],
    enemies: [
      { characterSlug: "thanos", relationship: "Abusive Father" },
      { characterSlug: "ronan", relationship: "Former Ally Turned Enemy" }
    ],
    teams: ["guardians-of-the-galaxy"],
    relatedCharacters: ["gamora", "star-lord", "rocket", "groot", "thanos", "iron-man", "doctor-strange", "thor"],
    history: [
      { movie: "Guardians of the Galaxy", year: 2014, event: "Allies with Ronan against Xandar, defeated by the Guardians.", isKeyMoment: false },
      { movie: "Avengers: Infinity War", year: 2018, event: "Captured and tortured by Thanos. Witnesses Gamora's sacrifice for the Soul Stone.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Joins the time heist with War Machine. Fights alongside all heroes in the final battle.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/nebula/hero.png", card: "/images/characters/nebula/hero.png", switcher: "/images/characters/nebula/hero.png" },
    meta: { title: "Nebula | Marvel Cinematic Character Guide", description: "Explore Nebula's journey from Thanos's weapon to Guardian of the Galaxy." },
    castBar: ["KAREN GILLAN", "GUARDIANS OF THE GALAXY (2014)", "REDEEMED HERO"],
    quizWeights: { q1: 2, q2: 1, q3: 3, q4: 1, q5: 2, q6: 1, q7: 1, q8: 2, q9: 1, q10: 1 }
  },
  {
    id: "shang-chi-616",
    slug: "shang-chi",
    name: "Shang-Chi",
    realName: "Xu Shang-Chi",
    actorName: "Simu Liu",
    alignment: "hero",
    powerTier: "alpha",
    species: "Human",
    universe: "earth-616",
    status: "active",
    haloColor: "#BF360C",
    tagline: "The Greatest Martial Artist",
    biography: "Xu Shang-Chi is the son of Xu Wenwu, the ancient warlord and wielder of the legendary Ten Rings. Trained from childhood to be the ultimate assassin, Shang-Chi spent his early years carrying out deadly missions for his father before fleeing to San Francisco to live a normal life under the name Shaun.\n\nFor a decade, Shang-Chi lived quietly as a parking valet, burying his past and building a friendship with Katy Chen. But when Wenwu's soldiers came to retrieve him, Shang-Chi was forced to confront the legacy he had tried to escape. The journey took him to Macau, where he reunited with his sister Xialing and learned of their father's plan to breach the gates of Ta Lo.\n\nIn the battle against the Dweller-in-Darkness, Shang-Chi proved his worth by wielding the Ten Rings — ancient artifacts of immense power that chose him as their new master. With the help of the Great Protector dragon and the people of Ta Lo, Shang-Chi defeated the Dweller and saved both worlds.\n\nNow recognized as one of Earth's mightiest warriors, Shang-Chi was recruited by Wong and Carol Danvers to investigate the nature of the Ten Rings, which began emitting a mysterious signal. His journey as a hero is just beginning.",
    synopsis: "Shang-Chi, the son of the Mandarin, escaped his father's assassin training to forge his own path, ultimately mastering the legendary Ten Rings to save the world from an ancient darkness.",
    quote: "I'm not who you think I am.",
    quoteSource: "Shang-Chi and the Legend of the Ten Rings (2021)",
    stats: { intelligence: 60, strength: 55, speed: 90, durability: 55, energyProjection: 60, fightingSkills: 100 },
    powers: ["Master Martial Artist", "Ten Rings Wielder", "Chi Manipulation", "Superhuman Agility", "Expert Acrobat", "Enhanced Reflexes", "Master of Multiple Fighting Styles", "Weapon Proficiency"],
    weaknesses: ["Mortal Vulnerability", "Emotional Baggage from Father", "Ten Rings Dependence", "Limited Range Combat Without Rings"],
    appearances: [
      { movie: "Shang-Chi and the Legend of the Ten Rings", year: 2021, notes: "Origin story, masters the Ten Rings, defeats Dweller-in-Darkness" },
      { movie: "The Marvels", year: 2023, notes: "Teams up with Captain Marvel and Ms. Marvel" }
    ],
    allies: [
      { characterSlug: "captain-marvel", relationship: "Ally" },
      { characterSlug: "ms-marvel", relationship: "Ally" },
      { characterSlug: "katy-chen", relationship: "Best Friend" },
      { characterSlug: "xialing", relationship: "Sister" }
    ],
    enemies: [
      { characterSlug: "wenwu", relationship: "Father / Former Antagonist" },
      { characterSlug: "dweller-in-darkness", relationship: "Ancient Enemy" }
    ],
    teams: [],
    relatedCharacters: ["captain-marvel", "ms-marvel", "doctor-strange", "spider-man", "thor", "iron-man"],
    history: [
      { movie: "Shang-Chi and the Legend of the Ten Rings", year: 2021, event: "Confronts his father's legacy, masters the Ten Rings, defeats the Dweller-in-Darkness with the Great Protector.", isKeyMoment: true },
      { movie: "Shang-Chi and the Legend of the Ten Rings", year: 2021, event: "Reunited with sister Xialing and learns the truth about his mother's death.", isKeyMoment: false },
      { movie: "The Marvels", year: 2023, event: "Joins forces with Captain Marvel and Ms. Marvel against a multiversal threat.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/shang-chi/hero.png", card: "/images/characters/shang-chi/hero.png", switcher: "/images/characters/shang-chi/hero.png" },
    meta: { title: "Shang-Chi (Xu Shang-Chi) | Marvel Cinematic Character Guide", description: "Explore Shang-Chi's journey from trained assassin to master of the Ten Rings." },
    castBar: ["SIMU LIU", "SHANG-CHI (2021)", "MARTIAL ARTS MASTER"],
    quizWeights: { q1: 2, q2: 1, q3: 3, q4: 2, q5: 1, q6: 2, q7: 3, q8: 1, q9: 1, q10: 2 }
  },
  {
    id: "ms-marvel-616",
    slug: "ms-marvel",
    name: "Ms. Marvel",
    realName: "Kamala Khan",
    actorName: "Iman Vellani",
    alignment: "hero",
    powerTier: "beta",
    species: "Human (Enhanced / Mutant)",
    universe: "earth-616",
    status: "active",
    haloColor: "#FF8F00",
    tagline: "Embiggen!",
    biography: "Kamala Khan is a Pakistani-American teenager from Jersey City who grew up idolizing Captain Marvel. A passionate fanfiction writer and superhero enthusiast, Kamala's ordinary life was turned upside down when she discovered a mysterious bangle belonging to her great-grandmother Aisha, which unlocked dormant abilities within her.\n\nInitially manifesting cosmic energy that allowed her to 'embiggen' — create hard light constructs and enlarge parts of her body — Kamala struggled to balance her new powers with school, family expectations, and her social life. With the help of her best friends Bruno and Nakia, Kamala learned to control her abilities and protect her community.\n\nKamala discovered that she is part of a lineage connected to the Noor Dimension, a realm of cosmic energy. Her bangle, a relic from the Clandestine, activated her latent genetic potential — later revealed to be a mutant X-gene, making her one of the first confirmed mutants in the MCU.\n\nKamala's superhero journey quickly escalated beyond Jersey City when she was pulled into a multiversal adventure alongside Carol Danvers and Monica Rambeau in The Marvels. Her optimism, creativity, and pure heart make her a natural hero, and her friendship with Carol Danvers — her lifelong idol — is a dream come true.",
    synopsis: "Kamala Khan, a Captain Marvel superfangirl from Jersey City, discovered her cosmic powers through an ancient bangle and became one of the first confirmed mutants in the MCU.",
    quote: "Embiggen!",
    quoteSource: "Ms. Marvel (2022)",
    stats: { intelligence: 65, strength: 45, speed: 50, durability: 45, energyProjection: 70, fightingSkills: 30 },
    powers: ["Cosmic Energy Embiggening", "Hard Light Constructs", "Noor Dimension Energy", "Enhanced Durability", "Size Manipulation", "Energy Projection", "Hard Light Shields", "Mutant X-Gene"],
    weaknesses: ["Inexperienced", "Mortal Vulnerability", "Over-Reliance on Bangle", "Emotional teenager"],
    appearances: [
      { movie: "Ms. Marvel", year: 2022, notes: "Origin story, discovers powers, protects Jersey City" },
      { movie: "The Marvels", year: 2023, notes: "Teams up with Captain Marvel, multiversal adventure" }
    ],
    allies: [
      { characterSlug: "captain-marvel", relationship: "Idol / Ally" },
      { characterSlug: "shang-chi", relationship: "Ally" },
      { characterSlug: "bruno-carrelli", relationship: "Best Friend" },
      { characterSlug: "nakia-bahadir", relationship: "Best Friend" }
    ],
    enemies: [
      { characterSlug: "damage-control", relationship: "Government Agency" },
      { characterSlug: "clandestine", relationship: "Antagonists" }
    ],
    teams: [],
    relatedCharacters: ["captain-marvel", "shang-chi", "spider-man", "doctor-strange", "hulk"],
    history: [
      { movie: "Ms. Marvel", year: 2022, event: "Discovers the Noor bangle, unlocks her cosmic abilities, and defeats the Clandestine threat.", isKeyMoment: true },
      { movie: "Ms. Marvel", year: 2022, event: "Learns about her great-grandmother Aisha and the Noor Dimension.", isKeyMoment: false },
      { movie: "The Marvels", year: 2023, event: "Embarks on a multiversal adventure with Captain Marvel and Monica Rambeau.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/ms-marvel/hero.png", card: "/images/characters/ms-marvel/hero.png", switcher: "/images/characters/ms-marvel/hero.png" },
    meta: { title: "Ms. Marvel (Kamala Khan) | Marvel Cinematic Character Guide", description: "Explore Kamala Khan's journey from Jersey City fangirl to cosmic-powered hero." },
    castBar: ["IMAN VELLANI", "MS. MARVEL (2022)", "EMBIGGEN"],
    quizWeights: { q1: 3, q2: 1, q3: 2, q4: 1, q5: 1, q6: 1, q7: 3, q8: 2, q9: 1, q10: 1 }
  },
  {
    id: "groot-616",
    slug: "groot",
    name: "Groot",
    realName: "Groot",
    actorName: "Vin Diesel",
    alignment: "hero",
    powerTier: "alpha",
    species: "Flora Colossus",
    universe: "earth-616",
    status: "active",
    haloColor: "#2E7D32",
    tagline: "I Am Groot",
    biography: "Groot is a sentient tree-like creature and a member of the Flora Colossus species from Planet X. Despite only being able to say three words — 'I am Groot' — Groot communicates volumes through tone, gesture, and action. He first encountered Rocket Raccoon as a bounty hunter partner, and the two became inseparable friends.\n\nGroot's sacrifice during the battle against Ronan the Accuser was one of the most emotional moments in the MCU. As the Dark Aster plummeted toward Xandar, Groot grew his body into a massive protective sphere, saving his friends at the cost of his own life. His sacrifice was not in vain — Rocket was able to regrow him from a single twig, and Baby Groot became an integral part of the Guardians.\n\nAs Groot grew from Baby Groot to Teen Groot to his current adult form, his personality evolved alongside his physical growth. Despite his increasing size and strength, Groot maintains a childlike innocence and deep loyalty to his friends. His regenerative abilities make him nearly impossible to kill permanently, and his shape-shifting limbs can form weapons, shields, and tools.\n\nGroot played a significant role in the battle against Thanos, growing to enormous size during the final battle on Earth. His bond with Rocket is the emotional heart of the Guardians of the Galaxy.",
    synopsis: "Groot is a sentient Flora Colossus whose limited vocabulary belies a deep emotional intelligence and unwavering loyalty to the Guardians of the Galaxy, having sacrificed himself and been reborn.",
    quote: "I am Groot.",
    quoteSource: "Guardians of the Galaxy (2014)",
    stats: { intelligence: 40, strength: 85, speed: 40, durability: 90, energyProjection: 20, fightingSkills: 55 },
    powers: ["Regenerative Healing", "Shape-Shifting Limbs", "Immense Strength", "Elasticity", "Size Manipulation", "Chlorokinesis", "Durable Bark Armor", "Self-Sacrificing Growth"],
    weaknesses: ["Fire Vulnerability", "Slow Movement", "Limited Communication", "Protective of Friends to a Fault"],
    appearances: [
      { movie: "Guardians of the Galaxy", year: 2014, notes: "Debut, sacrifices self to save the team" },
      { movie: "Guardians of the Galaxy Vol. 2", year: 2017, notes: "Returns as Baby Groot" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Fights alongside Avengers, disintegrated in Snap" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Returns from Snap, fights in final battle" },
      { movie: "Guardians of the Galaxy Vol. 3", year: 2023, notes: "Teen Groot, helps rescue Rocket" }
    ],
    allies: [
      { characterSlug: "rocket", relationship: "Best Friend / Brother" },
      { characterSlug: "star-lord", relationship: "Guardians Teammate" },
      { characterSlug: "gamora", relationship: "Guardians Teammate" },
      { characterSlug: "nebula", relationship: "Guardians Teammate" },
      { characterSlug: "drax", relationship: "Guardians Teammate" }
    ],
    enemies: [
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" },
      { characterSlug: "ronan", relationship: "First Major Enemy" }
    ],
    teams: ["guardians-of-the-galaxy"],
    relatedCharacters: ["rocket", "star-lord", "gamora", "nebula", "drax", "thanos", "thor", "iron-man"],
    history: [
      { movie: "Guardians of the Galaxy", year: 2014, event: "Sacrifices himself to save the Guardians as the Dark Aster crashes on Xandar.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Fights on Titan alongside Iron Man and Spider-Man. Disintegrated in the Snap.", isKeyMoment: false },
      { movie: "Guardians of the Galaxy Vol. 3", year: 2023, event: "Helps rescue Rocket from the High Evolutionary. Parts ways with the original Guardians team.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/groot/hero.png", card: "/images/characters/groot/hero.png", switcher: "/images/characters/groot/hero.png" },
    meta: { title: "Groot | Marvel Cinematic Character Guide", description: "Explore Groot's journey from selfless sacrifice to rebirth as a Guardian." },
    castBar: ["VIN DIESEL", "GUARDIANS OF THE GALAXY (2014)", "I AM GROOT"],
    quizWeights: { q1: 3, q2: 1, q3: 1, q4: 1, q5: 2, q6: 3, q7: 1, q8: 1, q9: 1, q10: 3 }
  },
  {
    id: "rocket-raccoon-616",
    slug: "rocket",
    name: "Rocket Raccoon",
    realName: "Rocket",
    actorName: "Bradley Cooper",
    alignment: "hero",
    powerTier: "beta",
    species: "Genetically Enhanced Raccoon / Halfworlder",
    universe: "earth-616",
    status: "active",
    haloColor: "#E65100",
    tagline: "Ain't No Thing Like Me, Except Me!",
    biography: "Rocket Raccoon is a genetically and cybernetically enhanced raccoon from Halfworld, a forgotten corner of the galaxy. Created by the High Evolutionary through cruel experiments that gave him human-level intelligence and enhanced physical capabilities, Rocket has carried deep emotional scars from his origins. His love for weaponry, explosives, and engineering is matched only by his sharp wit and volatile temperament.\n\nRocket first encountered Groot during a bounty hunting mission, and the two formed an instant bond that became the emotional core of the Guardians of the Galaxy. Despite his abrasive exterior, Rocket cares deeply for his friends and has proven himself as one of the most resourceful members of the team.\n\nDuring the Infinity War, Rocket formed an unlikely friendship with Thor, helping him forge Stormbreaker on Nidavellir. After the Snap killed Groot and half the universe, Rocket was left as the only surviving Guardian, and his grief drove him to join the Avengers in the fight to reverse the Snap.\n\nIn the final battle, Rocket fought valiantly alongside all the heroes. In Volume 3, Rocket confronted his traumatic past when the High Evolutionary returned, forcing him to face the experiments that created him. With the help of his friends, Rocket found closure and decided to lead a new team of Guardians.",
    synopsis: "Rocket Raccoon is a genetically enhanced marksman and tactical genius whose abrasive exterior hides a deeply loyal heart, carrying the scars of his creation by the High Evolutionary.",
    quote: "Ain't no thing like me, except me!",
    quoteSource: "Guardians of the Galaxy (2014)",
    stats: { intelligence: 95, strength: 35, speed: 50, durability: 40, energyProjection: 50, fightingSkills: 70 },
    powers: ["Genius-Level Intellect", "Expert Marksman", "Tactical Planning", "Enhanced Senses", "Expert Engineer", "Weapons Mastery", "Piloting Skills", "Enhanced Agility"],
    weaknesses: ["Small Physical Stature", "Emotional Trauma", " abrasive Personality", "Mortal Vulnerability"],
    appearances: [
      { movie: "Guardians of the Galaxy", year: 2014, notes: "Debut, joins the Guardians to stop Ronan" },
      { movie: "Guardians of the Galaxy Vol. 2", year: 2017, notes: "Confronts his past, bonds with baby Groot" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Helps forge Stormbreaker, fights on Titan" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Fights in final battle, only surviving Guardian" },
      { movie: "Guardians of the Galaxy Vol. 3", year: 2023, notes: "Confronts the High Evolutionary, leads new Guardians" }
    ],
    allies: [
      { characterSlug: "groot", relationship: "Best Friend / Brother" },
      { characterSlug: "star-lord", relationship: "Guardians Teammate" },
      { characterSlug: "gamora", relationship: "Guardians Teammate" },
      { characterSlug: "nebula", relationship: "Guardians Teammate" },
      { characterSlug: "thor", relationship: "Arena Brother" }
    ],
    enemies: [
      { characterSlug: "thanos", relationship: "Ultimate Antagonist" },
      { characterSlug: "high-evolutionary", relationship: "Creator / Abuser" }
    ],
    teams: ["guardians-of-the-galaxy"],
    relatedCharacters: ["groot", "star-lord", "gamora", "nebula", "drax", "thanos", "thor", "iron-man"],
    history: [
      { movie: "Guardians of the Galaxy", year: 2014, event: "Joins the Guardians to stop Ronan from destroying Xandar with the Power Stone.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Travels to Nidavellir with Thor to forge Stormbreaker. Fights on Titan against Thanos.", isKeyMoment: true },
      { movie: "Guardians of the Galaxy Vol. 3", year: 2023, event: "Confronts the High Evolutionary and his traumatic past. Chooses to lead the new Guardians team.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/rocket-raccoon/hero.png", card: "/images/characters/rocket-raccoon/hero.png", switcher: "/images/characters/rocket-raccoon/hero.png" },
    meta: { title: "Rocket Raccoon | Marvel Cinematic Character Guide", description: "Explore Rocket's journey from genetically engineered experiment to Guardian leader." },
    castBar: ["BRADLEY COOPER", "GUARDIANS OF THE GALAXY (2014)", "TACTICAL GENIUS"],
    quizWeights: { q1: 1, q2: 3, q3: 1, q4: 3, q5: 2, q6: 1, q7: 1, q8: 2, q9: 1, q10: 1 }
  },
  {
    id: "wasp-616",
    slug: "wasp",
    name: "Wasp",
    realName: "Hope van Dyne",
    actorName: "Evangeline Lilly",
    alignment: "hero",
    powerTier: "alpha",
    species: "Human (Enhanced)",
    universe: "earth-616",
    status: "active",
    haloColor: "#F9A825",
    tagline: "It's About Time",
    biography: "Hope van Dyne is the daughter of Hank Pym, the original Ant-Man, and Janet van Dyne, the original Wasp. Raised in the shadow of her parents' legacies, Hope grew up estranged from her father after her mother disappeared into the Quantum Realm during a mission. She became a formidable businesswoman, eventually taking over Pym Technologies.\n\nWhen Darren Cross attempted to weaponize the Pym Particle technology, Hope reconciled with her father and trained Scott Lang to become the new Ant-Man. Despite her superior skills and knowledge of the suit, Hank initially refused to let Hope become the Wasp due to the trauma of losing Janet. Eventually, Hope earned her wings — quite literally — when she received the Wasp suit built by her father.\n\nAs the Wasp, Hope proved herself to be an extraordinary hero. Her bio-synthetic wings, size-manipulation abilities, and energy blasts made her one of the most versatile fighters in the MCU. She played a critical role in the Avengers' final battle against Thanos, having been rescued from the Quantum Realm along with her father, Janet, and Scott Lang.\n\nIn the Multiverse Saga, Hope and Scott's family was drawn into the Quantum Realm, where they encountered Kang the Conqueror. Hope ultimately sacrificed herself to stabilize the Quantum Realm core, only to be resurrected through Kang's multiversal technology, proving her selfless heroism once again.",
    synopsis: "Hope van Dyne inherited the Wasp mantle from her mother Janet, becoming a key Avenger whose size-manipulation abilities and combat prowess were instrumental in the fight against Thanos and Kang.",
    quote: "It's about time.",
    quoteSource: "Ant-Man and the Wasp (2018)",
    stats: { intelligence: 82, strength: 40, speed: 75, durability: 45, energyProjection: 65, fightingSkills: 90 },
    powers: ["Size Manipulation (Pym Particles)", "Bio-Synthetic Wings", "Wasp Stingers (Energy Blasts)", "Enhanced Strength (Giant Size)", "Flight", "Expert Hand-to-Hand Combatant", "Shrinking (Sub-Atomic)", "Sting Induced Paralysis"],
    weaknesses: ["Mortal Vulnerability", "Suit Dependency", "Pym Particle Instability", "Emotional Trauma (Mother's Loss)"],
    appearances: [
      { movie: "Ant-Man and the Wasp", year: 2018, notes: "First full appearance as Wasp, rescues Janet from Quantum Realm" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Rescued from Quantum Realm, fights in final battle" },
      { movie: "Ant-Man and the Wasp: Quantumania", year: 2023, notes: "Trapped in Quantum Realm, battles Kang the Conqueror" }
    ],
    allies: [
      { characterSlug: "ant-man", relationship: "Partner / Romantic Interest" },
      { characterSlug: "hank-pym", relationship: "Father" },
      { characterSlug: "janet-van-dyne", relationship: "Mother" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger" }
    ],
    enemies: [
      { characterSlug: "kang", relationship: "Quantum Realm Threat" },
      { characterSlug: "darren-cross", relationship: "Former Family Friend / Enemy" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["ant-man", "captain-america", "iron-man", "thor", "thanos", "doctor-strange", "kang", "hawkeye"],
    history: [
      { movie: "Ant-Man and the Wasp", year: 2018, event: "Receives the Wasp suit from Hank Pym. Rescues Janet van Dyne from the Quantum Realm.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Trapped in the Quantum Realm during the Snap. Rescued five years later. Fights in the final battle against Thanos.", isKeyMoment: true },
      { movie: "Ant-Man and the Wasp: Quantumania", year: 2023, event: "Sucked into the Quantum Realm with her family. Battles Kang the Conqueror to save the multiverse.", isKeyMoment: true },
      { movie: "Ant-Man and the Wasp: Quantumania", year: 2023, event: "Sacrifices herself to stabilize the Quantum Realm core, later resurrected.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/wasp/hero.png", card: "/images/characters/wasp/hero.png", switcher: "/images/characters/wasp/hero.png" },
    meta: { title: "Wasp (Hope van Dyne) | Marvel Cinematic Character Guide", description: "Explore Hope van Dyne's journey from Pym Technologies CEO to the Wasp." },
    castBar: ["EVANGELINE LILLY", "ANT-MAN AND THE WASP (2018)", "HERO"],
    quizWeights: { q1: 2, q2: 2, q3: 1, q4: 2, q5: 2, q6: 2, q7: 2, q8: 1, q9: 2, q10: 2 }
  },
  {
    id: "drax-616",
    slug: "drax",
    name: "Drax",
    realName: "Drax the Destroyer",
    actorName: "Dave Bautista",
    alignment: "hero",
    powerTier: "beta",
    species: "Kylosian",
    universe: "earth-616",
    status: "active",
    haloColor: "#546E7A",
    tagline: "Drax the Destroyer",
    biography: "Drax was a Kylosian warrior whose family was brutally murdered by Ronan the Accuser under the orders of Thanos. Consumed by grief and an overwhelming desire for vengeance, Drax became a relentless hunter, traveling across the galaxy in pursuit of those responsible. His literal interpretation of language and social cues often led to hilariously awkward situations, but beneath his gruff exterior lay a deeply loyal and caring soul.\n\nDrax's path crossed with Peter Quill, Gamora, Rocket, and Groot on Xandar, where they were all imprisoned. Despite their initial animosity, the group formed an unlikely bond that would become the Guardians of the Galaxy. Drax's raw strength and fearlessness in battle proved invaluable in their fight against Ronan.\n\nThroughout his time with the Guardians, Drax evolved from a revenge-driven warrior to a beloved member of a found family. His friendship with Mantis became particularly touching, with the two sharing a genuine emotional connection despite their contrasting personalities. Drax learned to laugh, to love, and to find meaning beyond vengeance.\n\nAfter the defeat of Thanos, Drax chose to remain on Knowhere with the new Guardians team led by Rocket Raccoon, continuing to protect the galaxy while finding peace in his new family.",
    synopsis: "Drax the Destroyer transformed from a grief-stricken warrior seeking revenge against Thanos into a loyal Guardian of the Galaxy, finding family and humor among the stars.",
    quote: "Nothing goes over my head. My reflexes are too fast. I would catch it.",
    quoteSource: "Guardians of the Galaxy (2014)",
    stats: { intelligence: 35, strength: 80, speed: 55, durability: 85, energyProjection: 20, fightingSkills: 88 },
    powers: ["Enhanced Strength", "Enhanced Durability", "Dual Blade Mastery", "Pain Resistance", "Kylosian Physiology", "Expert Brawler", "Knife Throwing", "Accelerated Healing"],
    weaknesses: ["Literal Thinking", "Grief / Emotional Pain", "Overconfidence in Combat", "Limited Strategic Intelligence"],
    appearances: [
      { movie: "Guardians of the Galaxy", year: 2014, notes: "Introduced as revenge-driven warrior, helps stop Ronan" },
      { movie: "Guardians of the Galaxy Vol. 2", year: 2017, notes: "Confronts Ego alongside the Guardians" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Fights Thanos on Titan and in Wakanda" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Fights in the final battle, disintegrated and restored" },
      { movie: "Guardians of the Galaxy Vol. 3", year: 2023, notes: "Helps rescue Rocket, joins new Guardians" }
    ],
    allies: [
      { characterSlug: "star-lord", relationship: "Fellow Guardian / Brother-in-Arms" },
      { characterSlug: "gamora", relationship: "Fellow Guardian" },
      { characterSlug: "rocket", relationship: "Fellow Guardian" },
      { characterSlug: "groot", relationship: "Fellow Guardian" },
      { characterSlug: "mantis", relationship: "Close Friend" }
    ],
    enemies: [
      { characterSlug: "thanos", relationship: "Family Murderer / Vengeance Target" },
      { characterSlug: "ronan", relationship: "Family Murderer / Defeated" },
      { characterSlug: "ego", relationship: "Cosmic Threat" }
    ],
    teams: ["guardians-of-the-galaxy"],
    relatedCharacters: ["star-lord", "gamora", "rocket", "groot", "nebula", "thanos", "thor", "iron-man"],
    history: [
      { movie: "Guardians of the Galaxy", year: 2014, event: "Imprisoned on Xandar, joins Peter Quill's team. Fights Ronan and helps save Xandar with the Power Stone.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Travels to Titan with Iron Man and Spider-Man. Fights Thanos in close combat. Disintegrated in the Snap.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Restored from the Snap. Participates in the final battle against Thanos.", isKeyMoment: true },
      { movie: "Guardians of the Galaxy Vol. 3", year: 2023, event: "Helps rescue Rocket from the High Evolutionary. Stays with the new Guardians on Knowhere.", isKeyMoment: false }
    ],
    images: { hero: "/images/characters/drax/hero.png", card: "/images/characters/drax/hero.png", switcher: "/images/characters/drax/hero.png" },
    meta: { title: "Drax the Destroyer | Marvel Cinematic Character Guide", description: "Explore Drax's journey from vengeance to found family as a Guardian of the Galaxy." },
    castBar: ["DAVE BAUTISTA", "GUARDIANS OF THE GALAXY (2014)", "HERO"],
    quizWeights: { q1: 1, q2: 1, q3: 3, q4: 1, q5: 3, q6: 1, q7: 1, q8: 1, q9: 2, q10: 3 }
  },
  {
    id: "nick-fury-616",
    slug: "nick-fury",
    name: "Nick Fury",
    realName: "Nicholas Joseph Fury",
    actorName: "Samuel L. Jackson",
    alignment: "hero",
    powerTier: "gamma",
    species: "Human (Enhanced — Infinity Formula)",
    universe: "earth-616",
    status: "active",
    haloColor: "#1A237E",
    tagline: "The Spy Who Assembled the Avengers",
    biography: "Colonel Nicholas Joseph Fury is a former CIA operative and the former Director of S.H.I.E.L.D. (Strategic Homeland Intervention, Enforcement and Logistics Division). One of the most influential figures in the MCU, Fury was the architect of the Avengers Initiative — a plan to assemble Earth's mightiest heroes to combat threats no single individual could handle.\n\nFury's career spanned decades of covert operations, espionage, and intelligence gathering. Enhanced by the Infinity Formula, a chemical that dramatically slowed his aging, Fury operated as one of the world's foremost spymasters. He was instrumental in the early career of Tony Stark, and his strategic mind laid the groundwork for the modern superhero era.\n\nThe Battle of New York proved Fury's vision correct, as the Avengers saved Earth from Loki's Chitauri invasion. However, the discovery that Hydra had infiltrated S.H.I.E.L.D. from within forced Fury to dismantle the very organization he had built, faking his own death to operate from the shadows.\n\nIn the Multiverse Saga, Fury continues to operate as a behind-the-scenes mastermind, even recruiting young heroes for a new initiative. His relationship with the Skrulls has added complexity to his role, as he navigates an increasingly dangerous universe where trust is the most valuable — and scarce — resource.",
    synopsis: "Nick Fury, the legendary spymaster and former Director of S.H.I.E.L.D., assembled the Avengers and shaped the modern superhero landscape from the shadows.",
    quote: "I still believe in heroes.",
    quoteSource: "The Avengers (2012)",
    stats: { intelligence: 95, strength: 30, speed: 35, durability: 35, energyProjection: 15, fightingSkills: 80 },
    powers: ["Master Spy / Tactician", "Expert Combatant", "Leadership / Charisma", "Infinity Formula (Enhanced Longevity)", "Firearms Mastery", "Multilingual", "Enhanced Durability (Moderate)", "Strategic Planning"],
    weaknesses: ["Aging Despite Formula", "Mortal Vulnerability", "Paranoia / Trust Issues", "Limited Physical Power Compared to Enhanced Heroes"],
    appearances: [
      { movie: "Iron Man", year: 2008, notes: "Post-credits cameo, introduces the Avengers Initiative" },
      { movie: "The Avengers", year: 2012, notes: "Assembles the Avengers, leads during Battle of New York" },
      { movie: "Captain America: The Winter Soldier", year: 2014, notes: "Uncovers Hydra within S.H.I.E.L.D., fakes his death" },
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Supports Avengers during Sokovia crisis" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Summons Captain Marvel via pager before disintegrating" }
    ],
    allies: [
      { characterSlug: "captain-america", relationship: "Key Avenger / Trusted Ally" },
      { characterSlug: "iron-man", relationship: "First Avenger Recruit" },
      { characterSlug: "black-widow", relationship: "Most Trusted Agent" },
      { characterSlug: "hawkeye", relationship: "Loyal Agent" },
      { characterSlug: "maria-hill", relationship: "Deputy / Right Hand" }
    ],
    enemies: [
      { characterSlug: "hydra", relationship: "Infiltrated S.H.I.E.L.D." },
      { characterSlug: "loki", relationship: "First Major Threat" },
      { characterSlug: "thanos", relationship: "Ultimate Threat" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["captain-america", "iron-man", "black-widow", "hawkeye", "thor", "hulk", "thanos", "loki"],
    history: [
      { movie: "Iron Man", year: 2008, event: "Approaches Tony Stark after his escape from captivity. Introduces the concept of the Avengers Initiative.", isKeyMoment: true },
      { movie: "The Avengers", year: 2012, event: "Reactivates the Avengers Initiative to counter the Chitauri invasion. Leads S.H.I.E.L.D. during the Battle of New York.", isKeyMoment: true },
      { movie: "Captain America: The Winter Soldier", year: 2014, event: "Discovers Hydra's infiltration of S.H.I.E.L.D. Dismantles the organization and fakes his own death.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Disintegrates during the Snap after sending a final message to Captain Marvel.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/nick-fury/hero.png", card: "/images/characters/nick-fury/hero.png", switcher: "/images/characters/nick-fury/hero.png" },
    meta: { title: "Nick Fury | Marvel Cinematic Character Guide", description: "Explore Nick Fury's legacy as the spymaster who assembled the Avengers." },
    castBar: ["SAMUEL L. JACKSON", "IRON MAN (2008)", "SPYMASTER"],
    quizWeights: { q1: 2, q2: 3, q3: 1, q4: 3, q5: 1, q6: 3, q7: 1, q8: 2, q9: 1, q10: 2 }
  },
  {
    id: "kang-616",
    slug: "kang",
    name: "Kang the Conqueror",
    realName: "Nathaniel Richards",
    actorName: "Jonathan Majors",
    alignment: "villain",
    powerTier: "cosmic",
    species: "Human (Variant from 31st Century)",
    universe: "earth-616",
    status: "deceased",
    haloColor: "#4527A0",
    tagline: "He Who Remains",
    biography: "Nathaniel Richards, better known as Kang the Conqueror, was a time-traveling despot from the 31st century. A variant of the same Richards bloodline that would produce Reed Richards (Mr. Fantastic), Kang discovered the multiverse and the catastrophic potential of variants encountering each other. His oldest known variant, He Who Remains, created the Time Variance Authority (TVA) to maintain the Sacred Timeline and prevent a multiversal war.\n\nAfter Sylvie killed He Who Remains, the Sacred Timeline fractured, unleashing countless Kang variants across the multiverse. One such variant, Kang the Conqueror, was exiled to the Quantum Realm by the TVA and the Council of Kangs. There, he built a vast empire and sought to escape, manipulating Janet van Dyne and eventually drawing the Ant-Man family into his domain.\n\nKang possessed technology and intellect far beyond any single Avenger. His ability to manipulate time itself made him one of the most dangerous beings in the multiverse. Unlike Thanos, who sought to reshape reality through force, Kang operated across temporal dimensions, rewriting history and eliminating threats before they could emerge.\n\nIn the Quantum Realm, Kang nearly escaped before being confronted by Scott Lang, Hope van Dyne, and the resistance. Hope ultimately destroyed Kang's multiverse engine, causing his empire to collapse. However, the threat of the Council of Kangs looms as the greatest challenge the Avengers have ever faced.",
    synopsis: "Kang the Conqueror, a time-traveling tyrant from the 31st century, posed a multiversal threat beyond anything the Avengers had faced, capable of rewriting history itself.",
    quote: "Have you come to talk or to die?",
    quoteSource: "Loki (2021) — He Who Remains Variant",
    stats: { intelligence: 98, strength: 50, speed: 60, durability: 75, energyProjection: 90, fightingSkills: 70 },
    powers: ["Time Travel / Manipulation", "Advanced Technology (31st Century)", "Genius-Level Intellect", "Energy Projection", "Multiverse Navigation", "Temporal Duplication", "Quantum Realm Dominance", "Probability Calculation"],
    weaknesses: ["Overconfidence", "Vulnerability Without Technology", "Multiversal Council Politics", "Quantum Realm Containment"],
    appearances: [
      { movie: "Loki Season 1", year: 2021, notes: "He Who Remains variant appears, reveals multiverse secret, killed by Sylvie" },
      { movie: "Ant-Man and the Wasp: Quantumania", year: 2023, notes: "Main antagonist, battles Ant-Man family in the Quantum Realm" }
    ],
    allies: [
      { characterSlug: "council-of-kangs", relationship: "Multiversal Variants" },
      { characterSlug: "modok", relationship: "Enforcer in Quantum Realm" }
    ],
    enemies: [
      { characterSlug: "ant-man", relationship: "Quantum Realm Adversary" },
      { characterSlug: "wasp", relationship: "Quantum Realm Adversary" },
      { characterSlug: "loki", relationship: "Variant Conflict" },
      { characterSlug: "sylvie", relationship: "Murdered His Variant" }
    ],
    teams: [],
    relatedCharacters: ["ant-man", "wasp", "loki", "thanos", "doctor-strange", "iron-man", "captain-america", "thor"],
    history: [
      { movie: "Loki Season 1", year: 2021, event: "He Who Remains variant reveals the existence of the Sacred Timeline and the multiverse. Killed by Sylvie, triggering the multiversal incursion.", isKeyMoment: true },
      { movie: "Ant-Man and the Wasp: Quantumania", year: 2023, event: "Exiled to the Quantum Realm by the Council of Kangs. Builds an empire and attempts to escape. Confronted by Ant-Man and Wasp.", isKeyMoment: true },
      { movie: "Ant-Man and the Wasp: Quantumania", year: 2023, event: "His multiverse engine is destroyed by Hope van Dyne. Defeated and presumably killed in the Quantum Realm.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/kang/hero.png", card: "/images/characters/kang/hero.png", switcher: "/images/characters/kang/hero.png" },
    meta: { title: "Kang the Conqueror | Marvel Cinematic Character Guide", description: "Explore Kang's threat as a time-traveling despot and the multiverse's greatest danger." },
    castBar: ["JONATHAN MAJORS", "LOKI (2021) / QUANTUMANIA (2023)", "VILLAIN"],
    quizWeights: { q1: 2, q2: 3, q3: 3, q4: 1, q5: 2, q6: 1, q7: 1, q8: 3, q9: 1, q10: 2 }
  },
  {
    id: "mantis-616",
    slug: "mantis",
    name: "Mantis",
    realName: "Mantis",
    actorName: "Pom Klementieff",
    alignment: "hero",
    powerTier: "beta",
    species: "Empathic Alien",
    universe: "earth-616",
    status: "active",
    haloColor: "#66BB6A",
    tagline: "I Feel Everything You Feel",
    biography: "Mantis is a half-human, half-plant-based alien with powerful empathic abilities. Raised by Ego the Living Planet on his isolated world, she lived in solitude for most of her life, using her empathic powers to help Ego sleep. She was unaware of the true nature of her father or the danger he posed to the universe.\n\nWhen the Guardians of the Galaxy arrived on Ego's planet, Mantis befriended Drax and helped the team discover Ego's plan to consume all life in the universe. She overcame her fear of her father and joined the Guardians in defeating him, choosing to leave her isolated existence behind.\n\nMantis became a core member of the Guardians, though her social awkwardness and innocence often provided comedic relief. Her empathic abilities proved invaluable in battle — she could calm enemies, sense emotional states, and even put powerful beings to sleep through physical contact. During the battle against Thanos, she nearly succeeded in putting him to sleep.\n\nAfter the Snap, Mantis remained with the Guardians and continued to grow as a hero. She formed a particularly close bond with Drax and Peter Quill. In their final mission together against the High Evolutionary, Mantis discovered her own independence and chose to explore the universe on her own, no longer defined by her relationship with others.",
    synopsis: "An empathic alien raised in isolation by Ego, Mantis joined the Guardians of the Galaxy and discovered her own strength, evolving from a naive companion to a confident hero who chose to forge her own path.",
    quote: "I don't want to be what everyone wants me to be.",
    quoteSource: "Guardians of the Galaxy Vol. 3 (2023)",
    stats: { intelligence: 45, strength: 30, speed: 40, durability: 35, energyProjection: 65, fightingSkills: 35 },
    powers: ["Empathic Manipulation", "Emotion Control", "Sleep Induction", "Superhuman Durability", "Plant-Based Physiology", "Enhanced Senses", "Low-Level Telekinesis", "Energy Blasts"],
    weaknesses: ["Physical Fragility", "Naivety", "Social Awkwardness", "Power Requires Physical Contact"],
    appearances: [
      { movie: "Guardians of the Galaxy Vol. 2", year: 2017, notes: "Debut, helps Guardians defeat Ego" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Nearly subdues Thanos with empathy, disintegrated in the Snap" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Returns from the Snap, fights in the final battle" },
      { movie: "Guardians of the Galaxy Vol. 3", year: 2023, notes: "Final mission with Guardians, chooses independence" },
      { movie: "The Guardians of the Galaxy Holiday Special", year: 2022, notes: "Kidnaps Kevin Bacon for Quill's Christmas gift" }
    ],
    allies: [
      { characterSlug: "star-lord", relationship: "Fellow Guardian / Friend" },
      { characterSlug: "drax", relationship: "Best Friend" },
      { characterSlug: "gamora", relationship: "Fellow Guardian" },
      { characterSlug: "rocket", relationship: "Fellow Guardian" },
      { characterSlug: "groot", relationship: "Fellow Guardian" }
    ],
    enemies: [
      { characterSlug: "thanos", relationship: "Attempted to Subdue" },
      { characterSlug: "ego", relationship: "Father / Captor" }
    ],
    teams: ["guardians-of-the-galaxy"],
    relatedCharacters: ["star-lord", "drax", "gamora", "rocket", "groot", "thanos", "nebula"],
    history: [
      { movie: "Guardians of the Galaxy Vol. 2", year: 2017, event: "Raised by Ego in isolation. Befriends Drax, helps Guardians defeat Ego by disrupting his brain.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Joins fight against Thanos on Titan. Uses her empathic powers to nearly put Thanos to sleep.", isKeyMoment: true },
      { movie: "Guardians of the Galaxy Vol. 3", year: 2023, event: "Helps rescue Rocket from the High Evolutionary. Chooses to leave the Guardians and find her own identity.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/mantis/hero.png", card: "/images/characters/mantis/hero.png", switcher: "/images/characters/mantis/hero.png" },
    meta: { title: "Mantis | Marvel Cinematic Character Guide", description: "Explore Mantis's journey from Ego's isolated daughter to an independent Guardian of the Galaxy." },
    castBar: ["POM KLEMENTIEFF", "GUARDIANS VOL. 2 (2017)", "HERO"],
    quizWeights: { q1: 2, q2: 1, q3: 2, q4: 2, q5: 1, q6: 2, q7: 1, q8: 1, q9: 1, q10: 2 }
  },
  {
    id: "okoye-616",
    slug: "okoye",
    name: "Okoye",
    realName: "Okoye",
    actorName: "Danai Gurira",
    alignment: "hero",
    powerTier: "alpha",
    species: "Human",
    universe: "earth-616",
    status: "active",
    haloColor: "#C62828",
    tagline: "When You Said You'd Do Anything for your country, you didn't mean that.",
    biography: "Okoye is the General of the Dora Milaje, the elite all-female personal bodyguard force of the King of Wakanda. Fiercely loyal to the throne and her nation, Okoye is one of the most skilled warriors in the entire Marvel Cinematic Universe, wielding a Vibranium spear with deadly precision.\n\nDuring T'Challa's rise to the throne, Okoye stood by his side through every challenge, including the threat of Erik Killmonger. Her unwavering loyalty was tested when her husband W'Kabi sided with Killmonger, forcing Okoye to choose between her marriage and her duty to Wakanda. She chose Wakanda without hesitation.\n\nOkoye fought valiantly in the Battle of Wakanda against Thanos's forces, leading the Dora Milaje against the Outriders. She was among those who disintegrated in the Snap, but returned five years later to fight in the final battle against Thanos. Her combat skills were on full display during the Battle of Earth.\n\nAfter T'Challa's death, Okoye continued to serve Wakanda with distinction. She was entrusted with critical missions by Queen Ramonda and Shuri, including protecting Shuri during her emergence as the new Black Panther. Okoye's dedication to Wakanda remains absolute, and she has expanded her role to work with international allies, even forming a new team to address global threats.",
    synopsis: "The fierce General of the Dora Milaje, Okoye's unwavering loyalty to Wakanda and unparalleled combat skills make her one of the MCU's most formidable warriors.",
    quote: "I am loyal to the throne, no matter who sits upon it.",
    quoteSource: "Black Panther (2018)",
    stats: { intelligence: 65, strength: 55, speed: 60, durability: 55, energyProjection: 20, fightingSkills: 100 },
    powers: ["Master Martial Artist", "Vibranium Spear Mastery", "Expert Tactician", "Enhanced Durability (Vibranium Armor)", "Superhuman Agility", "Leadership", "Expert Marksman", "Dora Milaje Training"],
    weaknesses: ["Mortal Vulnerability", "Rigid Loyalty Code", "Limited Ranged Attacks", "Emotional Conflict with W'Kabi"],
    appearances: [
      { movie: "Black Panther", year: 2018, notes: "Debut, leads Dora Milaje, fights Killmonger" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Defends Wakanda, disintegrated in the Snap" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Returns from Snap, fights in final battle" },
      { movie: "Black Panther: Wakanda Forever", year: 2022, notes: "Protects Shuri and Queen Ramonda, faces Namor" }
    ],
    allies: [
      { characterSlug: "black-panther", relationship: "King / Protectee" },
      { characterSlug: "shuri", relationship: "Princess / Ally" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger" },
      { characterSlug: "nakia", relationship: "Fellow Warrior / Ally" }
    ],
    enemies: [
      { characterSlug: "killmonger", relationship: "Usurper" },
      { characterSlug: "thanos", relationship: "Invader" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["black-panther", "shuri", "captain-america", "thanos", "iron-man", "scarlet-witch"],
    history: [
      { movie: "Black Panther", year: 2018, event: "Sides with T'Challa against Killmonger. Fights her husband W'Kabi to protect Wakanda.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Leads the Dora Milaje in defense of Wakanda against the Outriders.", isKeyMoment: true },
      { movie: "Black Panther: Wakanda Forever", year: 2022, event: "Protects Queen Ramonda and supports Shuri's ascension as Black Panther.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/okoye/hero.png", card: "/images/characters/okoye/hero.png", switcher: "/images/characters/okoye/hero.png" },
    meta: { title: "Okoye | Marvel Cinematic Character Guide", description: "Explore Okoye's legacy as General of the Dora Milaje and Wakanda's fiercest warrior." },
    castBar: ["DANAI GURIRA", "BLACK PANTHER (2018)", "HERO"],
    quizWeights: { q1: 1, q2: 1, q3: 2, q4: 2, q5: 3, q6: 3, q7: 2, q8: 1, q9: 3, q10: 1 }
  },
  {
    id: "valkyrie-616",
    slug: "valkyrie",
    name: "Valkyrie",
    realName: "Brunnhilde",
    actorName: "Tessa Thompson",
    alignment: "hero",
    powerTier: "alpha",
    species: "Asgardian",
    universe: "earth-616",
    status: "active",
    haloColor: "#5C6BC0",
    tagline: "Asgard Is Not A Place, It's A People",
    biography: "Brunnhilde, known as Valkyrie, was once a legendary Asgardian warrior and leader of the Valkyrie, an elite group of female Asgardian fighters. During Hela's original reign of terror, Valkyrie led her sisters in battle against the Goddess of Death. The confrontation was devastating — Hela slaughtered every Valkyrie except Brunnhilde, who fled Asgard in grief and guilt.\n\nShe eventually found her way to Sakaar, where she became a hardened bounty hunter and alcoholic, selling captured warriors to the Grandmaster. When Thor arrived on Sakaar, Valkyrie captured him but was eventually persuaded to join his cause. She returned to Asgard to face Hela one more time, helping to trigger Ragnarok and destroy Surtur to stop her sister.\n\nValkyrie survived the destruction of Asgard alongside Thor and the remaining Asgardians. She fought in the Battle of Wakanda against Thanos's forces and was among those who disintegrated in the Snap. Upon her return, she fought in the final battle and helped rebuild New Asgard on Earth.\n\nThor eventually named Valkyrie as the new King of Asgard before departing with the Guardians of the Galaxy. As ruler, Valkyrie worked to help the Asgardian people find a new home while also serving as an ally to the Avengers in their ongoing mission to protect the world.",
    synopsis: "Once a legendary Asgardian warrior broken by Hela's cruelty, Valkyrie rose from exile and addiction to become the King of New Asgard, leading her people into a new era.",
    quote: "Asgard is not a place, it's a people.",
    quoteSource: "Thor: Ragnarok (2017)",
    stats: { intelligence: 70, strength: 75, speed: 70, durability: 75, energyProjection: 30, fightingSkills: 95 },
    powers: ["Asgardian Physiology", "Superhuman Strength", "Superhuman Durability", "Longevity", "Master Combatant", "Sword Mastery", "Expert Tactician", "Flight (Dragonfang / LS-7)"],
    weaknesses: ["Past Trauma (Hela)", "Struggle with Authority", "Mortal Limitations (Asgardian-level)", "Isolation Tendencies"],
    appearances: [
      { movie: "Thor: Ragnarok", year: 2017, notes: "Debut, bounty hunter on Sakaar, helps defeat Hela" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Fights in the Battle of Wakanda, disintegrated in the Snap" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Returns from Snap, fights in the final battle" },
      { movie: "Thor: Love and Thunder", year: 2022, notes: "Rules New Asgard as King, fights Gorr the God Butcher" }
    ],
    allies: [
      { characterSlug: "thor", relationship: "Fellow Asgardian / Close Ally" },
      { characterSlug: "hulk", relationship: "Arena Ally on Sakaar" },
      { characterSlug: "loki", relationship: "Reluctant Ally" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger" }
    ],
    enemies: [
      { characterSlug: "hela", relationship: "Sister / Tormentor / Nemesis" },
      { characterSlug: "thanos", relationship: "Invader" },
      { characterSlug: "gorr", relationship: "God Butcher / Threat" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["thor", "loki", "hulk", "captain-america", "thanos", "hela"],
    history: [
      { movie: "Thor: Ragnarok", year: 2017, event: "Leaves Sakaar, joins Thor against Hela. Witnesses the destruction of Asgard.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Returns from the Snap. Fights alongside all heroes in the final battle against Thanos.", isKeyMoment: true },
      { movie: "Thor: Love and Thunder", year: 2022, event: "Rules New Asgard as King. Teams up with Thor to fight Gorr the God Butcher.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/valkyrie/hero.png", card: "/images/characters/valkyrie/hero.png", switcher: "/images/characters/valkyrie/hero.png" },
    meta: { title: "Valkyrie (Brunnhilde) | Marvel Cinematic Character Guide", description: "Explore Valkyrie's journey from broken warrior to King of New Asgard." },
    castBar: ["TESSA THOMPSON", "THOR: RAGNAROK (2017)", "HERO"],
    quizWeights: { q1: 1, q2: 2, q3: 1, q4: 3, q5: 2, q6: 2, q7: 2, q8: 1, q9: 2, q10: 2 }
  },
  {
    id: "wong-616",
    slug: "wong",
    name: "Wong",
    realName: "Wong",
    actorName: "Benedict Wong",
    alignment: "hero",
    powerTier: "beta",
    species: "Human (Mystic Arts Master)",
    universe: "earth-616",
    status: "active",
    haloColor: "#37474F",
    tagline: "The Sorcerer Supreme",
    biography: "Wong is a Master of the Mystic Arts and a librarian at Kamar-Taj, the ancient sanctuary of sorcery in Nepal. Initially responsible for the library and the preservation of mystic texts, Wong proved to be far more than a custodian. He was one of the few sorcerers who stood against Dormammu's invasion of Earth.\n\nWhen Stephen Strange arrived at Kamar-Taj, Wong served as both a teacher and a reluctant ally. Their relationship evolved from formal to genuinely friendly, with Wong often providing the grounded, practical perspective that Strange lacked. Wong's dedication to the Mystic Arts was unwavering, and he proved his combat abilities against multiple threats.\n\nAfter the Ancient One's death and Strange's Snap-related absence, Wong ascended to become the Sorcerer Supreme. In this role, he oversaw the protection of Earth from mystical threats and worked alongside the Avengers. He provided crucial support during the final battle against Thanos, opening portals to bring reinforcements.\n\nAs Sorcerer Supreme, Wong expanded his responsibilities significantly. He worked with Shang-Chi and Katy Chen after they obtained the Ten Rings, helped Doctor Strange in the multiverse crisis involving America Chavez, and appeared in public at events like the wedding of two sorcerers. His dry wit and steadfast loyalty have made him an indispensable member of the superhero community.",
    synopsis: "From Kamar-Taj librarian to Sorcerer Supreme, Wong quietly became one of the most important mystical defenders of Earth, bridging the worlds of sorcery and superhero teamwork.",
    quote: "We don't trade lives, Captain.",
    quoteSource: "Avengers: Infinity War (2018)",
    stats: { intelligence: 75, strength: 35, speed: 40, durability: 50, energyProjection: 80, fightingSkills: 70 },
    powers: ["Mastery of Mystic Arts", "Portal Creation", "Shield Spells", "Energy Blasts", "Mystic Knowledge", "Martial Arts", "Sorcerer Supreme Authority", "Telekinesis"],
    weaknesses: ["Mortal Vulnerability", "Limited Offensive Power", "Bureaucratic Duties", "Magic Requires Concentration"],
    appearances: [
      { movie: "Doctor Strange", year: 2016, notes: "Debut, Kamar-Taj librarian, fights Dormammu" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Defends the Sanctum, fights in the Battle of Wakanda" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Opens portals for reinforcements in the final battle" },
      { movie: "Shang-Chi and the Legend of the Ten Rings", year: 2021, notes: "Investigates the Ten Rings with Shang-Chi" },
      { movie: "Doctor Strange in the Multiverse of Madness", year: 2022, notes: "Sorcerer Supreme, assists against multiverse threats" },
      { movie: "Werewolf by Night", year: 2022, notes: "Attends Bloodstone tournament as Sorcerer Supreme" }
    ],
    allies: [
      { characterSlug: "doctor-strange", relationship: "Fellow Sorcerer / Friend" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger" },
      { characterSlug: "shang-chi", relationship: "Mystic Investigator" },
      { characterSlug: "spider-man", relationship: "Ally" }
    ],
    enemies: [
      { characterSlug: "dormammu", relationship: "Dark Dimension Entity" },
      { characterSlug: "thanos", relationship: "Invader" },
      { characterSlug: "scarlet-witch", relationship: "Former Ally Turned Threat" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["doctor-strange", "captain-america", "thanos", "spider-man", "shang-chi", "scarlet-witch"],
    history: [
      { movie: "Doctor Strange", year: 2016, event: "Trains alongside Strange, defends the New York Sanctum from the Zealots.", isKeyMoment: true },
      { movie: "Avengers: Infinity War", year: 2018, event: "Defends the New York Sanctum from Ebony Maw and Cull Obsidian.", isKeyMoment: false },
      { movie: "Avengers: Endgame", year: 2019, event: "Opens massive portals to bring all resurrected heroes and armies to the final battle.", isKeyMoment: true },
      { movie: "Doctor Strange in the Multiverse of Madness", year: 2022, event: "As Sorcerer Supreme, helps coordinate the defense against multiverse incursions.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/wong/hero.png", card: "/images/characters/wong/hero.png", switcher: "/images/characters/wong/hero.png" },
    meta: { title: "Wong | Marvel Cinematic Character Guide", description: "Explore Wong's journey from Kamar-Taj librarian to Sorcerer Supreme." },
    castBar: ["BENEDICT WONG", "DOCTOR STRANGE (2016)", "HERO"],
    quizWeights: { q1: 2, q2: 2, q3: 2, q4: 1, q5: 2, q6: 1, q7: 2, q8: 2, q9: 1, q10: 1 }
  },
  {
    id: "peggy-carter-616",
    slug: "peggy-carter",
    name: "Peggy Carter",
    realName: "Margaret 'Peggy' Carter",
    actorName: "Hayley Atwell",
    alignment: "hero",
    powerTier: "alpha",
    species: "Human",
    universe: "earth-616",
    status: "deceased",
    haloColor: "#1565C0",
    tagline: "I Loved You, Every Single Day",
    biography: "Margaret 'Peggy' Carter was a British officer and agent of the Strategic Scientific Reserve (SSR) during World War II. One of the founding figures of the intelligence organization that would eventually become S.H.I.E.L.D., Peggy was a trailblazer in a male-dominated world, proving herself as a brilliant strategist, fierce combatant, and inspirational leader.\n\nHer life changed when she met Steve Rogers, the frail young man chosen for the Super Soldier Program. Peggy trained Rogers, guided him, and fell deeply in love with him. When Rogers sacrificed himself to stop Hydra, crashing a plane into the Arctic, Peggy was left heartbroken. She never stopped loving him, and the image of him remained her guiding star throughout her life.\n\nAfter the war, Peggy co-founded S.H.I.E.L.D. with Howard Stark, building the organization from the ground up while facing sexism and doubt from her superiors. She led covert missions, trained agents, and established the protocols that would define S.H.I.E.L.D. for decades. Her relationship with Howard Stark was complex — professional respect mixed with personal tension.\n\nPeggy lived a long life, eventually reaching old age. In her final years, she shared a brief but tender reunion with Steve Rogers, who had traveled back in time after the Battle of Earth to live the life he always wanted with her. Though the details of their life together remain private, it was a fitting end to one of the MCU's greatest love stories.",
    synopsis: "A founding agent of S.H.I.E.L.D. and the love of Steve Rogers's life, Peggy Carter broke barriers and built the foundation of modern superhero intelligence from the ashes of World War II.",
    quote: "I loved you. Every single day.",
    quoteSource: "Avengers: Endgame (2019)",
    stats: { intelligence: 85, strength: 45, speed: 45, durability: 40, energyProjection: 10, fightingSkills: 90 },
    powers: ["Master Martial Artist", "Expert Marksman", "Tactical Genius", "Espionage Expert", "Leadership", "SSR Training", "Multilingual", "S.H.I.E.L.D. Co-Founder"],
    weaknesses: ["Mortal Vulnerability", "Era's Sexism", "Emotional Burden of Losing Steve", "Aging"],
    appearances: [
      { movie: "Captain America: The First Avenger", year: 2011, notes: "Origin story, SSR agent, falls in love with Steve Rogers" },
      { movie: "Captain America: The Winter Soldier", year: 2014, notes: "Elderly cameo, reunion with Steve Rogers" },
      { movie: "Avengers: Endgame", year: 2019, notes: "Time-travel encounter with Steve, final dance" },
      { movie: "Agent Carter (TV Series)", year: 2015, notes: "Post-WWII SSR missions, S.H.I.E.L.D. co-founding" }
    ],
    allies: [
      { characterSlug: "captain-america", relationship: "Love of Her Life" },
      { characterSlug: "howard-stark", relationship: "Colleague / S.H.I.E.L.D. Co-Founder" },
      { characterSlug: "nick-fury", relationship: "S.H.I.E.L.D. Successor" }
    ],
    enemies: [
      { characterSlug: "red-skull", relationship: "WWII Nemesis (Hydra)" },
      { characterSlug: "hydra", relationship: "Ongoing Threat" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["captain-america", "nick-fury", "howard-stark", "iron-man", "black-widow"],
    history: [
      { movie: "Captain America: The First Avenger", year: 2011, event: "SSR agent who trains Steve Rogers and leads Hydra infiltration missions. Loses Steve when he crashes the plane.", isKeyMoment: true },
      { movie: "Captain America: The Winter Soldier", year: 2014, event: "Elderly Peggy shares a heartfelt final conversation with Steve, who has been frozen for 70 years.", isKeyMoment: true },
      { movie: "Avengers: Endgame", year: 2019, event: "Steve Rogers travels back to the 1940s to live a full life with Peggy, fulfilling his dream.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/peggy-carter/hero.png", card: "/images/characters/peggy-carter/hero.png", switcher: "/images/characters/peggy-carter/hero.png" },
    meta: { title: "Peggy Carter | Marvel Cinematic Character Guide", description: "Explore Peggy Carter's legacy as S.H.I.E.L.D. co-founder and Steve Rogers's greatest love." },
    castBar: ["HAYLEY ATWELL", "CAPTAIN AMERICA: TFA (2011)", "HERO"],
    quizWeights: { q1: 3, q2: 2, q3: 1, q4: 3, q5: 2, q6: 3, q7: 2, q8: 2, q9: 3, q10: 1 }
  },
  {
    id: "maria-hill-616",
    slug: "maria-hill",
    name: "Maria Hill",
    realName: "Maria Hill",
    actorName: "Cobie Smulders",
    alignment: "hero",
    powerTier: "gamma",
    species: "Human",
    universe: "earth-616",
    status: "deceased",
    haloColor: "#455A64",
    tagline: "The Unseen Hand of S.H.I.E.L.D.",
    biography: "Maria Hill was a high-ranking agent of S.H.I.E.L.D. who served as Deputy Director under Nick Fury. Known for her no-nonsense attitude, sharp intellect, and unwavering professionalism, Hill was one of the organization's most effective operatives. She was involved in some of the most critical events in MCU history, from the formation of the Avengers to the Sokovia Accords.\n\nHill first appeared during the Battle of New York, where she coordinated S.H.I.E.L.D.'s response to Loki's Chitauri invasion alongside Fury. Her competence and loyalty to Fury made her an invaluable asset, even as the organization was torn apart from within by Hydra's infiltration. Hill was one of the few who helped Fury fake his death and go underground.\n\nAfter S.H.I.E.L.D. collapsed, Hill joined Stark Industries as head of security, continuing to assist the Avengers behind the scenes. She played key roles during the Age of Ultron crisis and was present during the Sokovia Accords debate. Hill's pragmatism sometimes put her at odds with the more idealistic heroes, but she always acted in what she believed was the best interest of global security.\n\nIn the Multiverse Saga, Hill continued to serve in intelligence capacities. Her final mission involved the Skrull infiltration of Earth, where she was tragically killed by a Skrull impersonating Nick Fury. Her death was a devastating blow to Fury, who lost one of his most trusted allies and friends.",
    synopsis: "A formidable S.H.I.E.L.D. agent who served as Nick Fury's right hand through the organization's greatest triumphs and darkest betrayals, Maria Hill's dedication to global security cost her everything.",
    quote: "It's a mess, sir. But it's our mess.",
    quoteSource: "The Avengers (2012)",
    stats: { intelligence: 80, strength: 40, speed: 45, durability: 40, energyProjection: 15, fightingSkills: 75 },
    powers: ["Expert Field Agent", "Master Tactician", "Expert Marksman", "Hand-to-Hand Combat", "Espionage Expert", "Leadership", "S.H.I.E.L.D. Training", "Multilingual"],
    weaknesses: ["Mortal Vulnerability", "Organizational Loyalty Over Personal Safety", "Pragmatism Perceived as Coldness", "Trust Issues After Hydra"],
    appearances: [
      { movie: "The Avengers", year: 2012, notes: "Debut, coordinates S.H.I.E.L.D. during Battle of New York" },
      { movie: "Captain America: The Winter Soldier", year: 2014, notes: "Helps Fury fake death, fights Hydra infiltration" },
      { movie: "Avengers: Age of Ultron", year: 2015, notes: "Assists during Sokovia crisis" },
      { movie: "Avengers: Infinity War", year: 2018, notes: "Coordinates Avengers response, disintegrated in the Snap" },
      { movie: "Spider-Man: Far From Home", year: 2019, notes: "Coordinates with Fury on Elementals threat" },
      { movie: "Secret Invasion (TV Series)", year: 2023, notes: "Killed by Skrull impersonating Nick Fury" }
    ],
    allies: [
      { characterSlug: "nick-fury", relationship: "Superior / Trusted Ally" },
      { characterSlug: "iron-man", relationship: "Stark Industries Colleague" },
      { characterSlug: "captain-america", relationship: "Fellow Avenger Supporter" },
      { characterSlug: "black-widow", relationship: "Fellow Agent / Colleague" }
    ],
    enemies: [
      { characterSlug: "hydra", relationship: "Infiltrators" },
      { characterSlug: "ultron", relationship: "Threat" },
      { characterSlug: "thanos", relationship: "Snap Victim" }
    ],
    teams: ["avengers"],
    relatedCharacters: ["nick-fury", "iron-man", "captain-america", "black-widow", "thanos", "spider-man"],
    history: [
      { movie: "The Avengers", year: 2012, event: "Coordinates S.H.I.E.L.D. response during the Battle of New York. Oversees the Avengers' assembly.", isKeyMoment: true },
      { movie: "Captain America: The Winter Soldier", year: 2014, event: "Helps Nick Fury fake his death. Escapes Hydra's takeover of S.H.I.E.L.D. alongside Captain America.", isKeyMoment: true },
      { movie: "Secret Invasion (TV Series)", year: 2023, event: "Killed by a Skrull impersonating Nick Fury during the Skrull invasion of Earth.", isKeyMoment: true }
    ],
    images: { hero: "/images/characters/maria-hill/hero.png", card: "/images/characters/maria-hill/hero.png", switcher: "/images/characters/maria-hill/hero.png" },
    meta: { title: "Maria Hill | Marvel Cinematic Character Guide", description: "Explore Maria Hill's career as one of S.H.I.E.L.D.'s most dedicated and effective agents." },
    castBar: ["COBIE SMULDERS", "THE AVENGERS (2012)", "HERO"],
    quizWeights: { q1: 2, q2: 2, q3: 1, q4: 2, q5: 2, q6: 2, q7: 2, q8: 3, q9: 2, q10: 2 }
  }
];

export const homeHeroCharacters = [
  "spider-man", "iron-man", "captain-america", "thor", "black-panther",
  "doctor-strange", "thanos", "loki", "scarlet-witch", "black-widow",
  "wolverine", "deadpool", "star-lord", "gamora", "winter-soldier",
  "falcon", "nebula", "shang-chi", "wasp", "kang", "okoye", "valkyrie"
];

export function getCharacterBySlug(slug: string): MCUCharacter | undefined {
  return characters.find(c => c.slug === slug);
}

export function getCharactersByAlignment(alignment: string): MCUCharacter[] {
  if (alignment === 'all') return characters;
  return characters.filter(c => c.alignment === alignment);
}

export function getCharactersByTeam(teamSlug: string): MCUCharacter[] {
  return characters.filter(c => c.teams.includes(teamSlug));
}

export function searchCharacters(query: string): MCUCharacter[] {
  const q = query.toLowerCase();
  return characters.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.realName?.toLowerCase().includes(q) ||
    c.actorName.toLowerCase().includes(q)
  );
}

export const defaultCompareCharacters = ["iron-man", "thanos"];
