// standardsEngine.js - Common Core State Standards (CCSS) & Next Generation Science Standards (NGSS)

export const STANDARDS_CATALOG = {
  Math: {
    "Grade 1": [
      { code: "CCSS.MATH.CONTENT.1.OA.A.1", title: "Addition and subtraction within 20 to solve word problems", domain: "Operations & Algebraic Thinking" },
      { code: "CCSS.MATH.CONTENT.1.NBT.B.2", title: "Understand two-digit numbers as amounts of tens and ones", domain: "Number & Operations in Base Ten" }
    ],
    "Grade 3": [
      { code: "CCSS.MATH.CONTENT.3.NBT.A.2", title: "Fluently add and subtract within 1000 using place value & regrouping", domain: "Number & Operations in Base Ten", benchmark: "Mastery Target" },
      { code: "CCSS.MATH.CONTENT.3.OA.A.1", title: "Interpret products of whole numbers (Multiplication)", domain: "Operations & Algebraic Thinking", benchmark: "Emerging" },
      { code: "CCSS.MATH.CONTENT.3.NF.A.1", title: "Understand a fraction 1/b as the quantity formed by 1 part of whole", domain: "Number & Operations - Fractions", benchmark: "Target" }
    ],
    "Grade 7": [
      { code: "CCSS.MATH.CONTENT.7.RP.A.2", title: "Recognize and represent proportional relationships between quantities", domain: "Ratios & Proportional Relationships" },
      { code: "CCSS.MATH.CONTENT.7.EE.B.4", title: "Use variables to represent quantities in a real-world problem; solve linear equations", domain: "Expressions & Equations" }
    ]
  },
  Science: {
    "Grade 3": [
      { code: "NGSS.3-LS1-1", title: "Develop models to describe that organisms have unique and diverse life cycles", domain: "Life Sciences" },
      { code: "NGSS.3-ESS2-1", title: "Represent data in tables and graphical displays to describe typical weather conditions", domain: "Earth & Space Sciences" }
    ],
    "Grade 7": [
      { code: "NGSS.MS-LS1-2", title: "Develop and use a model to describe the function of a cell as a whole and ways parts of cells contribute to function", domain: "Life Science: Cellular Structure", benchmark: "Needs Review" },
      { code: "NGSS.MS-PS1-1", title: "Develop models to describe the atomic composition of simple molecules and extended structures", domain: "Physical Science" }
    ]
  },
  "Reading-Writing": {
    "Grade 1": [
      { code: "CCSS.ELA-LITERACY.RL.1.1", title: "Ask and answer questions about key details in a text", domain: "Reading: Literature" }
    ],
    "Grade 3": [
      { code: "CCSS.ELA-LITERACY.RI.3.2", title: "Determine the main idea of an informational text; recount key details and explain how they support the main idea", domain: "Reading: Informational Text", benchmark: "Needs Review" }
    ],
    "Grade 7": [
      { code: "CCSS.ELA-LITERACY.RL.7.1", title: "Cite several pieces of textual evidence to support analysis of what the text says explicitly as well as inferences", domain: "Reading: Literature" }
    ]
  },
  "Social Studies": {
    "Grade 3": [
      { code: "STATE.SS.3.G.1", title: "Understand how geographic tools (globes, maps) help locate places and describe human communities", domain: "Geography & Society" }
    ],
    "Grade 7": [
      { code: "STATE.SS.7.H.3", title: "Analyze early American governance, constitutional principles, and civic rights", domain: "Civics & History" }
    ]
  },
  Languages: {
    "Grade 3": [
      { code: "ACTFL.NM.1", title: "Novice Mid: Identify memorized words and phrases relating to family, numbers, and common school objects", domain: "Interpersonal & Interpretive" }
    ],
    "Grade 7": [
      { code: "ACTFL.NH.2", title: "Novice High: Ask and answer simple questions on familiar topics using connected sentences", domain: "Communication" }
    ]
  }
};

export function lookupStandard(subject, grade, topic) {
  const gradeKey = `Grade ${grade}`;
  const subjectStandards = STANDARDS_CATALOG[subject]?.[gradeKey] || STANDARDS_CATALOG[subject]?.["Grade 3"] || [];
  
  if (topic) {
    const topicLower = topic.toLowerCase();
    const matched = subjectStandards.find(s => 
      s.title.toLowerCase().includes(topicLower) || 
      s.domain.toLowerCase().includes(topicLower)
    );
    if (matched) return matched;
  }
  
  return subjectStandards[0] || {
    code: `CCSS.${subject.toUpperCase().slice(0, 4)}.${grade}.GEN`,
    title: `${subject} Grade ${grade} Core Foundations & Problem Solving`,
    domain: "Core Curriculum"
  };
}
