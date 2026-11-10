// aiTeacherAgent.js - Grade-calibrated AI tutor & parent diagnostic reasoning engine
import { lookupStandard } from "./standardsEngine.js";

export function generateExplanation({ grade, subject, prompt, childName, teacherInstruction = "", alternateMode = false }) {
  const g = parseInt(grade) || 3;
  const child = childName || "Student";
  const standard = lookupStandard(subject, g, prompt);
  
  // Topic detection logic
  let topic = "General Study Practice";
  let isFraction = false;
  let isAddition = false;
  let isCell = false;
  let isReading = false;

  if (prompt) {
    if (prompt.match(/fraction|denominator|numerator|compare fraction/i)) {
      topic = "Comparing Fractions with Different Denominators";
      isFraction = true;
    } else if (prompt.match(/add|plus|regroup|\d+\s*\+\s*\d+/i)) {
      topic = "Two-digit addition with regrouping";
      isAddition = true;
    } else if (prompt.match(/cell|organelle|biology|plant/i)) {
      topic = "Cell Structure & Organelle Functions";
      isCell = true;
    } else if (prompt.match(/read|main idea|honeybee|passage/i)) {
      topic = "Main Idea & Supporting Details";
      isReading = true;
    } else {
      topic = `${subject} Grade ${g} Concept Exploration`;
    }
  } else {
    isAddition = subject === "Math";
    isCell = subject === "Science";
  }

  let learningObjective = "";
  let keyConcepts = [];
  let toneSummary = "";
  let hints = [];
  let visualExamples = [];
  let steps = [];
  let miniQuiz = null;
  let finalAnswers = [];
  let tip = "";
  let readAloud = "";
  let parentStrengths = "";
  let parentStruggles = "";
  let homeTip = "";
  let status = "complete";
  let gamification = {
    starsEarned: 5,
    pointsEarned: 50,
    badge: { name: "Homework Hero", icon: "⭐", desc: "Completed step-by-step learning breakdown!" }
  };

  if (isFraction || (subject === "Math" && prompt?.toLowerCase().includes("fraction"))) {
    learningObjective = "Learn how to compare fractions with different denominators by finding a common denominator.";
    keyConcepts = [
      "Common Denominators",
      "Equivalent Fractions",
      "Visual Fraction Bars",
      "Cross-Multiplication Check"
    ];
    toneSummary = `Hey ${child}! When fractions have different bottom numbers (denominators), the pieces are different sizes. Let's make them equal so we can compare them easily!`;
    hints = [
      "Hint 1: Look at the denominators (the bottom numbers). If they are different, we can't compare numerators yet!",
      "Hint 2: Find a common multiple that both denominators divide into evenly (like 4 and 2 ➜ 4).",
      "Hint 3: Multiply the top and bottom of 1/2 by 2 to get 2/4. Now compare 2/4 with 3/4!"
    ];
    visualExamples = [
      {
        title: "Visual Fraction Strips",
        diagram: "1/2 ➜ [████████░░░░░░░░]  (2 quarters)\n3/4 ➜ [████████████░░░░]  (3 quarters)\nClearly, 3/4 covers more space than 1/2!"
      },
      {
        title: "Equivalent Fraction Multiplier",
        diagram: "1/2 × (2/2) = 2/4\nNow both denominators are 4: 2/4 < 3/4"
      }
    ];
    steps = [
      {
        stepNumber: 1,
        title: "Inspect the Denominators",
        explanation: "Check the bottom numbers of both fractions. For example, in 1/2 and 3/4, the denominators are 2 and 4. Because 2 and 4 are different, the slices aren't the same size!",
        visualTip: "Denominators: [2] vs [4] ➜ Different sized slices!"
      },
      {
        stepNumber: 2,
        title: "Find a Common Denominator",
        explanation: "Find the least common multiple of 2 and 4. Since 4 is already a multiple of 2 (2 × 2 = 4), 4 is our common denominator!",
        visualTip: "Common Denominator = 4"
      },
      {
        stepNumber: 3,
        title: "Convert to Equivalent Fractions",
        explanation: "Multiply the top and bottom of 1/2 by 2: (1 × 2) / (2 × 2) = 2/4. Now both fractions are in fourths: 2/4 and 3/4.",
        visualTip: "1/2 becomes 2/4"
      },
      {
        stepNumber: 4,
        title: "Compare the Numerators",
        explanation: "Now compare the top numbers! 2 fourths is less than 3 fourths (2 < 3). So 1/2 is less than 3/4!",
        visualTip: "2/4 < 3/4  ➜  1/2 < 3/4"
      }
    ];
    miniQuiz = {
      question: "Quick Check: Which fraction is larger: 2/5 or 3/5?",
      options: [
        "3/5 is larger because the denominators are already the same and 3 > 2",
        "2/5 is larger because 2 comes first",
        "They are equal in size",
        "Cannot compare without a calculator"
      ],
      correctIndex: 0,
      explanation: "Spot on! When denominators match (both are fifths), just compare the numerators: 3 pieces is larger than 2 pieces!"
    };
    finalAnswers = [
      {
        question: "Compare 1/2 and 3/4",
        answer: "1/2 < 3/4 (3/4 is greater)",
        checkExplanation: "Converted 1/2 to 2/4. Since 2/4 < 3/4, 3/4 is larger by 1/4."
      },
      {
        question: "Compare 2/3 and 3/5",
        answer: "2/3 > 3/5 (2/3 is greater)",
        checkExplanation: "Common denominator is 15: 2/3 = 10/15, and 3/5 = 9/15. 10/15 > 9/15."
      }
    ];
    tip = `⭐ Fraction Explorer Badge Unlocked! You've learned how to make any two fractions speak the same language!`;
    readAloud = `Hello ${child}! When comparing fractions with different bottom numbers, first make their denominators the same. One-half is the same as two-fourths. Since three-fourths is bigger than two-fourths, three-fourths is the winner!`;
    parentStrengths = `${child} grasped visual fraction strip models quickly and understood common denominators.`;
    parentStruggles = `Remind them to multiply BOTH top and bottom when creating equivalent fractions.`;
    homeTip = `Use pizza or chocolate bar slices at dinner to visualize fourths vs halves!`;
    gamification = {
      starsEarned: 5,
      pointsEarned: 50,
      badge: { name: "Fraction Explorer", icon: "⭐", desc: "Mastered comparing unlike denominators!" }
    };

  } else if (subject === "Math") {
    learningObjective = "Master multi-digit base-ten addition with place-value column alignment and regrouping.";
    keyConcepts = [
      "Place Value (Tens & Ones)",
      "Regrouping (Carrying 10 ones as 1 ten)",
      "Vertical Column Alignment",
      "Self-Checking Addition"
    ];
    toneSummary = `Welcome back ${child}! Let's work on two-digit addition with regrouping! We'll line up the columns, add the ones, and carry the ten to the roof!`;
    hints = [
      "Hint 1: Always add the ones column (right side) before the tens column!",
      "Hint 2: If the ones add up to 10 or more, keep the ones digit and carry the 1 ten up to the tens place.",
      "Hint 3: Don't forget to add that carried 1 when you sum the tens!"
    ];
    visualExamples = [
      {
        title: "Place Value Blocks",
        diagram: "Tens [10][10] | Ones [1][1][1][1][1][1][1][1] (28)\n+ Tens [10]     | Ones [1][1][1][1][1][1][1][1][1] (19)\n8 + 9 = 17 ➜ Trade 10 ones for [10]! Total = 47"
      }
    ];
    steps = [
      {
        stepNumber: 1,
        title: "Line up the Ones and Tens",
        explanation: "Write your numbers vertically: 28 on top and 19 underneath. Make sure your ones digits (8 and 9) line up straight, and your tens digits (2 and 1) line up straight.",
        visualTip: "Tens: [2] [1] | Ones: [8] [9]"
      },
      {
        stepNumber: 2,
        title: "Add the Ones Column First",
        explanation: "Add 8 + 9 = 17. 17 is greater than 9, which means we have 1 ten and 7 ones! Write the 7 in the ones place below the line, and carry the 1 up to the tens column roof.",
        visualTip: "8 + 9 = 17 ➜ Write 7, carry 1 ten"
      },
      {
        stepNumber: 3,
        title: "Add All the Tens (Include the carried 1!)",
        explanation: "Now add your tens column: 1 (carried) + 2 + 1 = 4 tens. Write 4 in the tens column. Put them together: 4 tens and 7 ones = 47!",
        visualTip: "1 + 2 + 1 = 4  ➜  Total = 47"
      }
    ];
    miniQuiz = {
      question: "Quick Check: When you add 7 + 8 in the ones column, you get 15. What do you do?",
      options: [
        "Write down the 5 and carry the 1 ten to the tens place",
        "Write down 15 in the single ones box",
        "Throw away the 1 ten and only keep 5",
        "Subtract 8 from 7 instead"
      ],
      correctIndex: 0,
      explanation: "Awesome job! You keep the 5 ones and carry the 1 ten up to the tens column roof!"
    };
    finalAnswers = [
      { question: "1. 28 + 19", answer: "47", checkExplanation: "8 + 9 = 17, carry 1; 1 + 2 + 1 = 4 tens ➜ 47." },
      { question: "2. 45 + 37", answer: "82", checkExplanation: "5 + 7 = 12, carry 1; 1 + 4 + 3 = 8 tens ➜ 82." },
      { question: "3. 36 + 25", answer: "61", checkExplanation: "6 + 5 = 11, carry 1; 1 + 3 + 2 = 6 tens ➜ 61." }
    ];
    tip = `⭐ Math Champion Badge Unlocked! You mastered carrying over the tens column like a pro!`;
    readAloud = `Hello ${child}! In multi-digit addition, always add your ones column first. If the sum is ten or greater, carry the ten to the roof of the tens column. Then add your tens! You got this!`;
    parentStrengths = `${child} showed strong numerical confidence and vertical column organization.`;
    parentStruggles = teacherInstruction.includes("hint") 
      ? `Requested hint-guided progression; monitored carrying across the tens threshold.` 
      : `Occasionally misses adding the carried 1 on the top row if rushing.`;
    homeTip = `Practice 'Make Ten' games in the car (e.g., 'If I have 8, how many more to make 10?').`;
    gamification = {
      starsEarned: 5,
      pointsEarned: 50,
      badge: { name: "Math Champion", icon: "⭐", desc: "Mastered two-digit regrouping!" }
    };

  } else if (subject === "Science") {
    learningObjective = "Identify cellular organelle functions and contrast plant and animal cell structures.";
    keyConcepts = [
      "Cell Wall vs Cell Membrane",
      "Chloroplasts (Photosynthesis / Glucose)",
      "Mitochondria (Cellular Respiration / ATP)",
      "Nucleus (Genetic Command Center)"
    ];
    toneSummary = `Greetings explorer ${child}! We are investigating biological systems and how each specialized component keeps the organism thriving.`;
    hints = [
      "Hint 1: Plant cells need extra strength to stand upright without bones — look for the rigid Cell Wall!",
      "Hint 2: Chloroplasts make food from sunlight, while Mitochondria burn that food to make energy.",
      "Hint 3: Animal cells have Mitochondria, but NEVER have Chloroplasts."
    ];
    visualExamples = [
      {
        title: "City Analogy for Cell Organelles",
        diagram: "• Nucleus = City Hall (Blueprints & Law)\n• Mitochondria = Power Generator (ATP Electricity)\n• Chloroplast = Solar Food Farm (Sugar Kitchen)\n• Cell Wall = Fortress Brick Wall (Rigid Support)"
      }
    ];
    steps = [
      {
        stepNumber: 1,
        title: "Distinguish Plant from Animal Cell Boundaries",
        explanation: "Plant cells have a rigid outer layer called the Cell Wall made of cellulose, plus a Cell Membrane inside. Animal cells ONLY have a flexible Cell Membrane.",
        visualTip: "Plant: Outer Wall + Membrane | Animal: Membrane only"
      },
      {
        stepNumber: 2,
        title: "The Energy Generators: Chloroplasts vs Mitochondria",
        explanation: "Mitochondria are the powerhouses that break down glucose into ATP energy for BOTH plants and animals. Chloroplasts exist ONLY in green plant cells to capture sunlight and make glucose through photosynthesis.",
        visualTip: "Chloroplast = Solar Kitchen | Mitochondria = Power Generator"
      },
      {
        stepNumber: 3,
        title: "The Cell Command Center",
        explanation: "The Nucleus houses DNA blueprints, directing cellular protein synthesis via Ribosomes.",
        visualTip: "Nucleus = Central Library / Control Tower"
      }
    ];
    miniQuiz = {
      question: "Quick Check: Which organelle is present in green plant cells to harvest sunlight, but absent in animal cells?",
      options: [
        "Chloroplast",
        "Mitochondria",
        "Cell Membrane",
        "Nucleus"
      ],
      correctIndex: 0,
      explanation: "Super! Chloroplasts contain green chlorophyll pigments that harvest sunlight for photosynthesis!"
    };
    finalAnswers = [
      { question: "1. Which organelle performs photosynthesis?", answer: "Chloroplast", checkExplanation: "Contains chlorophyll pigment to harvest light photons." },
      { question: "2. What structure provides rigid structural support to plant cells?", answer: "Cell Wall", checkExplanation: "Made of strong cellulose fibers." },
      { question: "3. Where is cellular respiration carried out?", answer: "Mitochondria", checkExplanation: "Produces ATP energy molecules." }
    ];
    tip = `🔬 Curious Scientist Badge Unlocked! Notice how structure always determines function in natural science.`;
    readAloud = `Hello ${child}! In science, every cell has special organelles. Chloroplasts capture sunlight in plants, while mitochondria provide the power in both plants and animals.`;
    parentStrengths = `${child} identified cellular boundaries and nucleus roles with zero hesitation.`;
    parentStruggles = `Distinguishing between energy storage (glucose in plants) and energy release (ATP in mitochondria).`;
    homeTip = `Examine a green plant leaf in the sunlight and discuss why house plants lean toward the window!`;
    status = "needs_review";
    gamification = {
      starsEarned: 5,
      pointsEarned: 50,
      badge: { name: "Curious Scientist", icon: "🔬", desc: "Mastered cellular organelle biology!" }
    };

  } else {
    // Reading / ELA / Social Studies / Languages
    learningObjective = "Determine the central idea of a text and explain how key details support that idea.";
    keyConcepts = [
      "Umbrella Idea (Main Point)",
      "Supporting Evidence & Facts",
      "Text Structure",
      "Summarizing in Your Own Words"
    ];
    toneSummary = `Hello ${child}! Let's dive into ${topic} and discover the key ideas together! We'll search for clues like a reading detective!`;
    hints = [
      "Hint 1: Think of the main idea like an umbrella that covers all the other sentences.",
      "Hint 2: Ask yourself: 'What is the one big message the author wants me to remember?'",
      "Hint 3: Supporting details give proof or examples for the main idea."
    ];
    visualExamples = [
      {
        title: "Umbrella Model",
        diagram: "      ☂️ MAIN IDEA: Honeybees depend on specialized teamwork\n     /    |    \\\nDetail 1  Detail 2  Detail 3\n(Queen)  (Foragers) (Nurses)"
      }
    ];
    steps = [
      {
        stepNumber: 1,
        title: "Look for the Umbrella Idea",
        explanation: "Ask: 'What is the ONE big point the author wants me to know?' Details like the waggle dance and queen bee support the big point.",
        visualTip: "Big Umbrella = Main Idea | Raindrops = Supporting Details"
      },
      {
        stepNumber: 2,
        title: "Collect Supporting Evidence",
        explanation: "Identify 2 or 3 specific facts from the text that explain or prove the main idea.",
        visualTip: "Fact 1 + Fact 2 ➜ Strong Support"
      }
    ];
    miniQuiz = {
      question: "Quick Check: What is the difference between a main idea and a supporting detail?",
      options: [
        "The main idea is the big overarching point; details give facts that explain it",
        "The main idea is always the shortest word in the paragraph",
        "Details are imaginary and not found in the text",
        "They are the exact same thing"
      ],
      correctIndex: 0,
      explanation: "Exactly right! The main idea is the big takeaway, while details are the building blocks that support it."
    };
    finalAnswers = [
      { question: "1. What is the main idea of the passage?", answer: "Honeybees work together in specialized roles to keep the hive alive.", checkExplanation: "Every worker bee has a specific chore that supports colony survival." }
    ];
    tip = `📚 Reading Detective Badge Unlocked! Asking questions while you read makes you a super-learner!`;
    readAloud = `Hello ${child}! You are doing great. Remember to look for clues in the text that support your big umbrella idea!`;
    parentStrengths = `High reading comprehension and curious engagement with new vocabulary.`;
    parentStruggles = `Extracting the broad overarching conclusion rather than isolated trivia.`;
    homeTip = `Ask what the main moral or takeaway was after reading any short article or book chapter.`;
    gamification = {
      starsEarned: 5,
      pointsEarned: 50,
      badge: { name: "Reading Detective", icon: "📚", desc: "Mastered finding the main idea & evidence!" }
    };
  }

  // Generate topic-specific practice questions with multiple-choice options
  let practiceQuestions = [];
  if (subject === "Math") {
    practiceQuestions = [
      {
        id: 1,
        problem: isFraction ? "Which fraction is larger: 1/3 or 1/4?" : "34 + 28 = ?",
        hint: isFraction ? "Smaller denominator means bigger slice sizes!" : "Add 4 + 8 first in the ones column (12). Write 2, carry 1 ten to 3 + 2!",
        correctAnswer: isFraction ? "1/3" : "62",
        options: isFraction ? ["1/3", "1/4", "They are equal", "Cannot tell"] : ["52", "62", "64", "58"]
      },
      {
        id: 2,
        problem: isFraction ? "What is the common denominator of 1/2 and 1/3?" : "56 + 19 = ?",
        hint: isFraction ? "Multiply 2 × 3!" : "Add 6 + 9 in the ones column (15). Then add 1 + 5 + 1 tens!",
        correctAnswer: isFraction ? "6" : "75",
        options: isFraction ? ["5", "6", "8", "12"] : ["65", "74", "75", "85"]
      }
    ];
  } else if (subject === "Science") {
    practiceQuestions = [
      {
        id: 1,
        problem: "Which organelle is the 'powerhouse' that produces ATP energy?",
        hint: "Both plant and animal cells use this organelle for cellular respiration!",
        correctAnswer: "Mitochondria",
        options: ["Chloroplast", "Mitochondria", "Ribosome", "Vacuole"]
      },
      {
        id: 2,
        problem: "What structure provides rigid shape to plant cells, but is NOT in animal cells?",
        hint: "It is a tough outer layer made of cellulose fibers.",
        correctAnswer: "Cell Wall",
        options: ["Cell Wall", "Cell Membrane", "Cytoplasm", "Nucleus"]
      }
    ];
  } else {
    practiceQuestions = [
      {
        id: 1,
        problem: `What is the central focus or main idea in ${topic}?`,
        hint: "Look for the key takeaway that all the details support.",
        correctAnswer: "The core concept demonstrated by evidence",
        options: [
          "The core concept demonstrated by evidence",
          "An isolated minor detail in paragraph 1",
          "The font style chosen by the author",
          "A random unrelated fact"
        ]
      }
    ];
  }

  // Assemble full diagnostic output matching Requirement #3 & #4
  return {
    topic,
    subject,
    grade: g,
    learningObjective,
    keyConcepts,
    status,
    standard,
    childExplanation: {
      assignmentSummary: toneSummary,
      hints,
      visualExamples,
      steps,
      miniQuiz,
      finalAnswers,
      encouragingTip: tip,
      readAloudScript: readAloud,
      gamification
    },
    parentSummary: {
      conceptTested: `${standard.title} (${standard.domain})`,
      childStrengths: parentStrengths,
      strugglePoints: parentStruggles,
      atHomeHelpTips: homeTip,
      standardAlignmentNotes: `Aligned to ${standard.code}. Calibrated for Grade ${g}.`
    },
    practiceQuestions
  };
}
