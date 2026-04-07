export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    weights: Record<string, number>;
  }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "You discover a weapon of immense power. What do you do?",
    options: [
      { text: "Destroy it immediately — no one should have that power", weights: { "captain-america": 3, "thor": 1 } },
      { text: "Study it to understand how it works", weights: { "iron-man": 3, "doctor-strange": 2, "hulk": 2 } },
      { text: "Use it to enforce order and protect people", weights: { "thanos": 3, "black-panther": 2 } },
      { text: "Hide it and keep it as a last resort", weights: { "spider-man": 2, "black-widow": 3, "hawkeye": 1 } }
    ]
  },
  {
    id: "q2",
    question: "Your team is facing overwhelming odds. What's your strategy?",
    options: [
      { text: "Rally the team and never give up — fight to the last breath", weights: { "captain-america": 3, "thor": 2 } },
      { text: "Analyze the situation and find a clever solution", weights: { "iron-man": 3, "doctor-strange": 3, "hulk": 1 } },
      { text: "Take the fight to them — offense is the best defense", weights: { "thor": 3, "wolverine": 2, "hulk": 2 } },
      { text: "Create a distraction and use stealth", weights: { "black-widow": 3, "spider-man": 2, "loki": 2 } }
    ]
  },
  {
    id: "q3",
    question: "A close friend betrays you. How do you react?",
    options: [
      { text: "Forgive them — everyone deserves a second chance", weights: { "captain-america": 2, "thor": 3, "spider-man": 2 } },
      { text: "Cut them off — loyalty means everything", weights: { "black-panther": 2, "black-widow": 2, "thanos": 1 } },
      { text: "I probably deserved it or understand their reasons", weights: { "loki": 3, "scarlet-witch": 2, "hulk": 1 } },
      { text: "Make a joke about it — life's too short for grudges", weights: { "deadpool": 3, "iron-man": 2, "spider-man": 1 } }
    ]
  },
  {
    id: "q4",
    question: "What motivates you most?",
    options: [
      { text: "Protecting the people I love", weights: { "spider-man": 3, "captain-america": 2, "black-widow": 2 } },
      { text: "The pursuit of knowledge and understanding", weights: { "iron-man": 2, "doctor-strange": 3, "hulk": 3 } },
      { text: "Proving myself to the world", weights: { "thanos": 2, "loki": 2, "wolverine": 1 } },
      { text: "Having fun and enjoying the chaos", weights: { "deadpool": 3, "loki": 2, "thor": 1 } }
    ]
  },
  {
    id: "q5",
    question: "You're at a party. What are you doing?",
    options: [
      { text: "Standing in the corner, observing everyone", weights: { "black-widow": 3, "batman": 2, "hawkeye": 2 } },
      { text: "The center of attention, naturally", weights: { "iron-man": 3, "thor": 2, "deadpool": 2 } },
      { text: "Deep in conversation about something intellectual", weights: { "doctor-strange": 3, "hulk": 2, "black-panther": 2 } },
      { text: "Making everyone laugh with witty comebacks", weights: { "deadpool": 3, "spider-man": 3, "loki": 2 } }
    ]
  },
  {
    id: "q6",
    question: "Pick your ideal superpower:",
    options: [
      { text: "Super strength — to always protect others", weights: { "captain-america": 2, "thor": 2, "hulk": 3 } },
      { text: "Intelligence — to outsmart any problem", weights: { "iron-man": 3, "doctor-strange": 2, "black-panther": 2 } },
      { text: "Magic — to reshape reality itself", weights: { "doctor-strange": 3, "scarlet-witch": 3, "loki": 2 } },
      { text: "Agility — to move like nobody's watching", weights: { "spider-man": 3, "black-widow": 2, "wolverine": 1 } }
    ]
  },
  {
    id: "q7",
    question: "Your greatest flaw is...",
    options: [
      { text: "I care too much about others", weights: { "spider-man": 3, "captain-america": 2, "black-widow": 1 } },
      { text: "I'm too stubborn for my own good", weights: { "thor": 2, "wolverine": 2, "captain-america": 3 } },
      { text: "I can't let go of the past", weights: { "scarlet-witch": 3, "loki": 2, "hawkeye": 2 } },
      { text: "I don't take anything seriously enough", weights: { "deadpool": 3, "iron-man": 2, "spider-man": 1 } }
    ]
  },
  {
    id: "q8",
    question: "What type of leader are you?",
    options: [
      { text: "Lead by example — always on the front lines", weights: { "captain-america": 3, "thor": 2, "black-panther": 2 } },
      { text: "Strategic mastermind — coordinate from behind the scenes", weights: { "iron-man": 3, "black-panther": 3, "doctor-strange": 1 } },
      { text: "Reluctant leader — I do it because someone has to", weights: { "hulk": 2, "wolverine": 2, "hawkeye": 2 } },
      { text: "I work alone — too much responsibility", weights: { "loki": 3, "wolverine": 2, "deadpool": 1 } }
    ]
  },
  {
    id: "q9",
    question: "What's your ideal environment?",
    options: [
      { text: "A high-tech lab surrounded by inventions", weights: { "iron-man": 3, "hulk": 3, "black-panther": 2 } },
      { text: "The great outdoors — forests, mountains, adventure", weights: { "thor": 3, "captain-america": 1, "wolverine": 2 } },
      { text: "A mystical library of arcane knowledge", weights: { "doctor-strange": 3, "scarlet-witch": 2, "loki": 1 } },
      { text: "A bustling city — the more chaos, the better", weights: { "spider-man": 3, "deadpool": 3, "black-widow": 1 } }
    ]
  },
  {
    id: "q10",
    question: "How would you want to be remembered?",
    options: [
      { text: "As someone who always stood up for what's right", weights: { "captain-america": 3, "black-panther": 2, "black-widow": 2 } },
      { text: "As a genius who changed the world", weights: { "iron-man": 3, "doctor-strange": 2, "hulk": 2 } },
      { text: "As someone who made people smile", weights: { "spider-man": 2, "deadpool": 3, "loki": 2 } },
      { text: "As a legend — feared and respected", weights: { "thanos": 2, "thor": 2, "wolverine": 2 } }
    ]
  }
];

export function calculateQuizResult(answers: Record<number, number>): string {
  const scores: Record<string, number> = {};
  const possibleResults = ["spider-man", "iron-man", "captain-america", "thor", "black-panther", "doctor-strange", "loki", "scarlet-witch", "black-widow", "hulk", "deadpool", "wolverine"];
  
  possibleResults.forEach(c => { scores[c] = 0; });
  
  quizQuestions.forEach((q, qIndex) => {
    const answerIndex = answers[qIndex];
    if (answerIndex !== undefined && q.options[answerIndex]) {
      const weights = q.options[answerIndex].weights;
      Object.entries(weights).forEach(([character, weight]) => {
        if (scores[character] !== undefined) {
          scores[character] += weight;
        }
      });
    }
  });
  
  let maxScore = 0;
  let result = "spider-man";
  Object.entries(scores).forEach(([character, score]) => {
    if (score > maxScore) {
      maxScore = score;
      result = character;
    }
  });
  
  return result;
}
