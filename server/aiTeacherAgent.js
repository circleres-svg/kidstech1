// aiTeacherAgent.js - Grade-calibrated AI tutor & parent diagnostic reasoning engine
import { lookupStandard } from "./standardsEngine.js";

export function generateExplanation({ grade, subject, prompt, childName, teacherInstruction = "", alternateMode = false }) {
  const g = parseInt(grade) || 3;
  const child = childName || "Student";
  const standard = lookupStandard(subject, g, prompt);
  
  // Topic detection logic
  let topic = "General Study Practice";
  if (prompt) {
    if (prompt.match(/add|plus|regroup|\d+\s*\+\s*\d+/i)) topic = "Two-digit addition with regrouping";
    else if (prompt.match(/cell|organelle|biology|plant/i)) topic = "Cell Structure & Organelles";
    else if (prompt.match(/fraction|denominator|numerator/i)) topic = "Understanding Unit Fractions";
    else if (prompt.match(/read|main idea|honeybee|passage/i)) topic = "Main Idea & Key Details";
    else if (prompt.match(/space|planet|orbit|solar/i)) topic = "Planetary Orbits & Solar System";
    else topic = `${subject} Grade ${g} Concept Exploration`;
  }

  // Calibration tone and vocabulary by grade band
  let toneSummary = "";
  let steps = [];
  let finalAnswers = [];
  let tip = "";
  let readAloud = "";
  let parentStrengths = "";
  let parentStruggles = "";
  let homeTip = "";
  let status = "complete";

  if (subject === "Math") {
    if (alternateMode) {
      toneSummary = `Hey ${child}! Let's try looking at this problem using an open number line instead of vertical stacking!`;
      steps = [
        {
          stepNumber: 1,
          title: "Jump by Tens on the Number Line",
          explanation: `Start at 28. To add 19, let's break 19 into 10 + 9. Take one big bunny hop of +10: from 28 you land on 38!`,
          visualTip: "28 ──(+10)──► 38"
        },
        {
          stepNumber: 2,
          title: "Jump by Friendly Ones",
          explanation: `Now we need to add 9. Let's hop +2 to reach friendly 40, and then the remaining +7 lands us right on 47!`,
          visualTip: "38 ──(+2)──► 40 ──(+7)──► 47"
        }
      ];
      finalAnswers = [
        { question: "Total", answer: "47", checkExplanation: "28 + 10 = 38, plus 9 equals 47." }
      ];
      tip = `🌟 Awesome flexibility, ${child}! Number line jumps let your brain see the addition happening like a map!`;
      readAloud = `Hello ${child}! Here is a different way: start at twenty-eight, jump ten forward to thirty-eight, and then jump nine to land right on forty-seven.`;
    } else {
      toneSummary = `Welcome back ${child}! Let's work on adding two-digit numbers with regrouping together!`;
      steps = [
        {
          stepNumber: 1,
          title: "Stack into Place-Value Columns",
          explanation: `Line up your numbers carefully: place the ones directly over the ones, and the tens directly over the tens.`,
          visualTip: "Tens | Ones"
        },
        {
          stepNumber: 2,
          title: "Add the Ones and Check for Regrouping",
          explanation: `Add your ones column first. If the sum is 10 or more, write the ones digit down and trade the 10 for a carried ten!`,
          visualTip: "Trade 10 ones for 1 ten block!"
        },
        {
          stepNumber: 3,
          title: "Sum all the Tens",
          explanation: `Add the original tens digits plus the carried ten on top to get your final sum.`,
          visualTip: "Carried Ten + Top Tens + Bottom Tens"
        }
      ];
      finalAnswers = [
        { question: "Problem #1", answer: "47", checkExplanation: "Regrouped 1 ten from ones sum of 17." },
        { question: "Problem #2", answer: "82", checkExplanation: "Regrouped 1 ten from ones sum of 12." }
      ];
      tip = `🌟 You did wonderful work keeping your place-value columns neat and orderly!`;
      readAloud = `Great job ${child}! When you add your ones column and get a two digit number, carry the extra ten to the tens column roof. Then add the tens!`;
    }

    parentStrengths = `${child} showed strong numerical confidence and vertical column organization.`;
    parentStruggles = teacherInstruction.includes("hint") 
      ? `Requested hint-guided progression; monitored carrying across the tens threshold.` 
      : `Occasionally misses adding the carried 1 on the top row if rushing.`;
    homeTip = `Practice 'Make Ten' games in the car (e.g., 'If I have 8, how many more to make 10?').`;

  } else if (subject === "Science") {
    toneSummary = `Greetings explorer ${child}! We are investigating biological systems and how each specialized component keeps the organism thriving.`;
    steps = [
      {
        stepNumber: 1,
        title: "Identify the Primary Organelle or System",
        explanation: `Look at the diagram labels: identify membranes, energy transformers, and the genetic control center.`,
        visualTip: "Key Labels: Wall, Membrane, Chloroplast, Mitochondria"
      },
      {
        stepNumber: 2,
        title: "Trace the Energy Conversion Pathways",
        explanation: `Remember: Chloroplasts create chemical glucose using sunlight photons, while Mitochondria burn glucose to produce cellular ATP.`,
        visualTip: "Sunlight ➜ Chloroplast (Sugar) ➜ Mitochondria (Energy)"
      }
    ];
    finalAnswers = [
      { question: "1. Photosynthesis Site", answer: "Chloroplast", checkExplanation: "Contains chlorophyll thylakoids." },
      { question: "2. Energy Release", answer: "Mitochondria", checkExplanation: "Cellular respiration produces ATP." }
    ];
    tip = `🔬 Super investigative reasoning! Notice how structure always determines function in natural science.`;
    readAloud = `Hello ${child}! In science, every cell has special organelles. Chloroplasts capture sunlight in plants, while mitochondria provide the power in both plants and animals.`;
    parentStrengths = `${child} identified cellular boundaries and nucleus roles with zero hesitation.`;
    parentStruggles = `Distinguishing between energy storage (glucose in plants) and energy release (ATP in mitochondria).`;
    homeTip = `Examine a green plant leaf in the sunlight and discuss why house plants lean toward the window!`;
    status = "needs_review";

  } else {
    // General / Reading / Social Studies / Languages
    toneSummary = `Hello ${child}! Let's dive into ${topic} and discover the key ideas together!`;
    steps = [
      {
        stepNumber: 1,
        title: "Identify the Central Theme or Core Rule",
        explanation: `Read through the prompt carefully and look for recurring words or question keywords.`,
        visualTip: "Core Idea Finder"
      },
      {
        stepNumber: 2,
        title: "Break it down into simple evidence",
        explanation: `Find two supporting facts or clues that prove your answer is correct.`,
        visualTip: "Evidence 1 + Evidence 2 ➜ Strong Answer!"
      }
    ];
    finalAnswers = [
      { question: "Key Finding", answer: "Target Concept Demonstrated", checkExplanation: "Confirmed through text evidence." }
    ];
    tip = `📚 You have great focus, ${child}! Asking questions while you read makes you a super-learner.`;
    readAloud = `Hello ${child}! You are doing great. Remember to look for clues in the text that support your big idea!`;
    parentStrengths = `High reading comprehension and curious engagement with new vocabulary.`;
    parentStruggles = `Extracting the broad overarching conclusion rather than isolated trivia.`;
    homeTip = `Ask what the main moral or takeaway was after reading any short article or book chapter.`;
  }

  // Generate topic-specific practice questions with multiple-choice options
  let practiceQuestions = [];
  if (subject === "Math") {
    practiceQuestions = [
      {
        id: 1,
        problem: "34 + 28 = ?",
        hint: "Add 4 + 8 first in the ones column (12). Write 2, carry 1 ten to 3 + 2!",
        correctAnswer: "62",
        options: ["52", "62", "64", "58"]
      },
      {
        id: 2,
        problem: "56 + 19 = ?",
        hint: "Add 6 + 9 in the ones column (15). Then add 1 + 5 + 1 tens!",
        correctAnswer: "75",
        options: ["65", "74", "75", "85"]
      },
      {
        id: 3,
        problem: "47 + 36 = ?",
        hint: "7 + 6 = 13. Remember to add that carried 1 to 4 + 3 tens!",
        correctAnswer: "83",
        options: ["73", "81", "83", "93"]
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
      },
      {
        id: 3,
        problem: "Where is the genetic blueprint (DNA) housed inside eukaryotic cells?",
        hint: "Think of this as the main control center or central library.",
        correctAnswer: "Nucleus",
        options: ["Nucleus", "Ribosome", "Lysosome", "Chloroplast"]
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
      },
      {
        id: 2,
        problem: "How do supporting details strengthen the main idea?",
        hint: "Details act like legs on a table holding up the tabletop.",
        correctAnswer: "They provide concrete evidence and examples",
        options: [
          "They provide concrete evidence and examples",
          "They contradict the central theme",
          "They are only included to make pages longer",
          "They change the subject completely"
        ]
      }
    ];
  }

  // Assemble full diagnostic output
  return {
    topic,
    status,
    standard,
    childExplanation: {
      assignmentSummary: toneSummary,
      steps,
      finalAnswers,
      encouragingTip: tip,
      readAloudScript: readAloud
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
