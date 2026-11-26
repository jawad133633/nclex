import type { QuestionDocument } from "./question-bank.model.js";

export const DEFAULT_QUESTIONS_SEED: readonly QuestionDocument[] = [
  {
    id: "seed-q1",
    subjectId: "free",
    subjectName: "Free Questions",
    title: "Acute Appendicitis Manifestations",
    stem: "A 19-year-old client presents to the emergency department with periumbilical pain that migrated to the right lower quadrant (McBurney's point). The nurse palpates the left lower quadrant, which elicits pain in the right lower quadrant. Which sign should the nurse document, and what is the priority action?",
    type: "Multiple Choice",
    options: [
      "Positive Rovsing sign; maintain NPO status and notify the healthcare provider immediately",
      "Positive Murphy sign; place a warm heating pad on the abdomen for comfort",
      "Positive Cullen sign; administer oral fluids to prevent dehydration",
      "Positive Kernig sign; prepare client for urgent lumbar puncture"
    ],
    correctIndex: 0,
    rationale: "Pain in the RLQ upon palpation of the LLQ is a positive Rovsing sign, indicative of peritoneal irritation from acute appendicitis. Maintaining NPO status is critical in anticipation of emergency appendectomy. Applying heat is contraindicated because it increases blood flow and perforation risk.",
    status: "Published",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "NCLEXLab Content Team"
  },
  {
    id: "seed-q2",
    subjectId: "adult-health",
    subjectName: "Adult Health",
    title: "Deep Vein Thrombosis & Pulmonary Embolism",
    stem: "A client 2 days postoperative following a total hip arthroplasty suddenly develops acute dyspnea, pleuritic chest pain, and restlessness. Vital signs: BP 92/58 mmHg, HR 122 bpm, RR 28/min, SpO2 86% on room air. Which immediate intervention should the nurse perform first?",
    type: "Priority Action",
    options: [
      "Elevate the head of the bed and initiate high-flow oxygen therapy",
      "Administer subcutaneous enoxaparin 40 mg as prescribed",
      "Obtain a stat 12-lead ECG and troponin level",
      "Place the client in Trendelenburg position to improve blood return"
    ],
    correctIndex: 0,
    rationale: "The client demonstrates classic clinical indicators of pulmonary embolism (PE), a life-threatening postoperative complication. According to Airway-Breathing-Circulation priority rules, the nurse must elevate the HOB to maximize lung expansion and immediately administer oxygen to correct refractory hypoxemia before diagnostic or anticoagulant steps.",
    status: "Published",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "NCLEXLab Content Team"
  },
  {
    id: "seed-q3",
    subjectId: "pharmacology",
    subjectName: "Pharmacology",
    title: "Digoxin Toxicity & Hypokalemia",
    stem: "A client with heart failure is receiving oral digoxin 0.25 mg daily and furosemide 40 mg daily. The client reports nausea, anorexia, and seeing yellow halos around light fixtures. Which laboratory finding most strongly predisposes the client to these symptoms?",
    type: "Multiple Choice",
    options: [
      "Serum potassium of 2.9 mEq/L",
      "Serum sodium of 138 mEq/L",
      "Serum calcium of 9.2 mg/dL",
      "Serum magnesium of 2.1 mEq/L"
    ],
    correctIndex: 0,
    rationale: "Hypokalemia (potassium < 3.5 mEq/L) potentiates digoxin binding to myocardial Na+/K+-ATPase, drastically increasing the risk of digoxin toxicity even at normal therapeutic levels. Yellow/green visual halos, anorexia, and nausea are classic early indicators of digoxin toxicity.",
    status: "Published",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "NCLEXLab Content Team"
  },
  {
    id: "seed-q4",
    subjectId: "child-health",
    subjectName: "Child Health",
    title: "Tetralogy of Fallot Hypercyanotic Spell",
    stem: "A 9-month-old infant with Tetralogy of Fallot becomes intensely cyanotic, tachypneic, and irritable while crying after a feeding. Which action should the nurse take first?",
    type: "Priority Action",
    options: [
      "Place the infant in the knee-chest position",
      "Administer oral acetaminophen 80 mg",
      "Place the infant supine and check capillary refill",
      "Prepare intravenous sodium bicarbonate infusion"
    ],
    correctIndex: 0,
    rationale: "During a hypercyanotic 'tet' spell, placing the infant in a knee-chest position increases systemic vascular resistance (SVR), which decreases the right-to-left shunting across the ventricular septal defect (VSD) and drives more unoxygenated blood into the pulmonary circulation for oxygenation.",
    status: "Published",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "NCLEXLab Content Team"
  },
  {
    id: "seed-q5",
    subjectId: "fundamentals",
    subjectName: "Fundamentals",
    title: "Airborne Infection Isolation Precautions",
    stem: "The nurse is preparing to enter the room of a client with suspected active pulmonary tuberculosis. Which personal protective equipment (PPE) must the nurse don before entry?",
    type: "Multiple Choice",
    options: [
      "Fit-tested NIOSH-certified N95 respirator mask",
      "Standard surgical face mask with eye visor",
      "Clean examination gloves and water-resistant gown only",
      "Surgical mask and sterile gloves"
    ],
    correctIndex: 0,
    rationale: "Mycobacterium tuberculosis is transmitted via droplet nuclei < 5 microns that remain suspended in the air. Healthcare personnel must wear a fit-tested N95 respirator (or PAPR) before entering an Airborne Infection Isolation Room (AIIR) with negative pressure ventilation.",
    status: "Published",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "NCLEXLab Content Team"
  },
  {
    id: "seed-q6",
    subjectId: "maternal-newborn",
    subjectName: "Maternal & Newborn Health",
    title: "Postpartum Hemorrhage & Uterine Atony",
    stem: "A client 1 hour postpartum following vaginal birth has saturated two peripads in 20 minutes. Upon assessment, the nurse notes the fundus is boggy and displaced above and to the right of the umbilicus. What is the priority nursing intervention?",
    type: "Priority Action",
    options: [
      "Assist the client to void or catheterize to empty the bladder, and massage the fundus",
      "Increase intravenous oxytocin infusion rate immediately",
      "Administer intramuscular methylergonovine 0.2 mg as prescribed",
      "Place the client in high Fowler position and apply abdominal binder"
    ],
    correctIndex: 0,
    rationale: "A boggy fundus displaced upward and to the right is the hallmark indicator of urinary bladder distension. A distended bladder prevents the myometrium from contracting effectively, leading to uterine atony and hemorrhage. Emptying the bladder followed by vigorous fundal massage is the priority.",
    status: "Published",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "NCLEXLab Content Team"
  },
  {
    id: "seed-q7",
    subjectId: "mental-health",
    subjectName: "Mental Health",
    title: "Lithium Carbonate Toxicity Signs",
    stem: "A client diagnosed with bipolar disorder is receiving lithium carbonate 600 mg twice daily. The client presents with coarse hand tremors, persistent vomiting, diarrhea, and ataxia. What should the nurse anticipate as the primary cause?",
    type: "Multiple Choice",
    options: [
      "Lithium toxicity requiring immediate serum level testing and hydration",
      "Normal expected transient adverse effects of initiating lithium therapy",
      "Extrapyramidal symptoms (EPS) requiring benztropine mesylate",
      "Serotonin syndrome requiring immediate cyproheptadine therapy"
    ],
    correctIndex: 0,
    rationale: "Coarse tremors, persistent GI upset (vomiting/diarrhea), ataxia, and confusion indicate acute or chronic lithium toxicity (typically serum levels > 1.5 mEq/L). Lithium has a narrow therapeutic window (0.6 - 1.2 mEq/L). The drug must be withheld and serum levels assessed immediately.",
    status: "Published",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "NCLEXLab Content Team"
  },
  {
    id: "seed-q8",
    subjectId: "management-of-care",
    subjectName: "Management of Care",
    title: "Delegation Principles to Unlicensed Assistive Personnel",
    stem: "The registered nurse (RN) is planning assignments on a medical-surgical unit. Which task is appropriate to delegate to unlicensed assistive personnel (UAP)?",
    type: "Multiple Choice",
    options: [
      "Measuring and recording hourly urine output from an indwelling catheter",
      "Teaching a client newly diagnosed with asthma how to use a metered-dose inhaler",
      "Evaluating pain relief 30 minutes after intravenous hydromorphone administration",
      "Performing the initial neurological assessment on a client following a stroke"
    ],
    correctIndex: 0,
    rationale: "The RN cannot delegate tasks involving clinical assessment, teaching, nursing judgment, or evaluation (EAT: Evaluate, Assess, Teach). Measuring and recording output from an established catheter is an objective, standardized task appropriate for delegation to competent UAP.",
    status: "Published",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "NCLEXLab Content Team"
  },
  {
    id: "seed-q9",
    subjectId: "adult-health",
    subjectName: "Adult Health",
    title: "Diabetic Ketoacidosis (DKA) Interventions",
    stem: "A 22-year-old with type 1 diabetes is admitted with diabetic ketoacidosis. The arterial blood gas reveals pH 7.15, HCO3 11 mEq/L, and blood glucose is 540 mg/dL. Which intravenous fluid should the nurse administer first?",
    type: "Multiple Choice",
    options: [
      "0.9% Normal Saline (0.9% NaCl) at a rapid infusion rate",
      "5% Dextrose in 0.45% Normal Saline (D5 1/2 NS)",
      "0.45% Normal Saline with 40 mEq Potassium Chloride",
      "10% Dextrose in Water (D10W)"
    ],
    correctIndex: 0,
    rationale: "The initial priority in DKA is profound fluid resuscitation to restore intravascular volume, tissue perfusion, and renal clearance using isotonic crystalloid (0.9% NaCl). Dextrose is only added once blood glucose reaches approximately 200-250 mg/dL to prevent cerebral edema.",
    status: "Published",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "NCLEXLab Content Team"
  },
  {
    id: "seed-q10",
    subjectId: "pharmacology",
    subjectName: "Pharmacology",
    title: "Heparin-Induced Thrombocytopenia (HIT)",
    stem: "A client receiving continuous intravenous unfractionated heparin has a platelet count that dropped from 280,000/mm3 to 110,000/mm3 over 4 days. What is the nurse's priority action?",
    type: "Priority Action",
    options: [
      "Discontinue heparin infusion immediately and notify the healthcare provider",
      "Administer oral aspirin 325 mg to prevent arterial thrombosis",
      "Slow the heparin rate by 50% and recheck platelets in 24 hours",
      "Prepare client for immediate transfusion of packed platelets"
    ],
    correctIndex: 0,
    rationale: "A > 50% reduction in baseline platelet count within 5-10 days of heparin exposure strongly indicates Heparin-Induced Thrombocytopenia (HIT), an immune-mediated disorder that paradoxically creates life-threatening arterial/venous thromboses. The heparin must be discontinued immediately and non-heparin anticoagulants (e.g., argatroban) initiated.",
    status: "Published",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "NCLEXLab Content Team"
  }
];
