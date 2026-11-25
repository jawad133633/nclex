export interface StoredStandaloneQuestion {
  id: string;
  subjectId: "free" | "adult-health" | "child-health" | "fundamentals" | "maternal-newborn" | "mental-health" | "pharmacology" | "management-of-care";
  subjectName: string;
  title: string;
  stem: string;
  type: "Multiple Choice" | "Select All That Apply" | "Priority Action";
  options: string[];
  correctIndex: number;
  correctIndices?: number[];
  rationale: string;
  status: "Published" | "Draft" | "Needs review";
  createdAt: string;
  updatedAt: string;
  author: string;
  isPaid?: boolean;
  locked?: boolean;
  sequence?: number;
  answered?: boolean;
  assignmentCount?: number;
  assignedStudentIds?: readonly string[];
}

export const STANDALONE_SUBJECTS = [
  { id: "free", name: "Free Questions", baseTotal: 36 },
  { id: "adult-health", name: "Adult Health", baseTotal: 407 },
  { id: "child-health", name: "Child Health", baseTotal: 145 },
  { id: "fundamentals", name: "Fundamentals", baseTotal: 155 },
  { id: "maternal-newborn", name: "Maternal & Newborn Health", baseTotal: 142 },
  { id: "mental-health", name: "Mental Health", baseTotal: 104 },
  { id: "pharmacology", name: "Pharmacology", baseTotal: 183 },
  { id: "management-of-care", name: "Management of Care", baseTotal: 145 },
] as const;

export const DEFAULT_STANDALONE_QUESTIONS: StoredStandaloneQuestion[] = [
  {
    "id": "sq-1",
    "subjectId": "free",
    "subjectName": "Free Questions",
    "title": "Acute Appendicitis Manifestations",
    "stem": "A 19-year-old college student presents to the emergency department with abdominal pain that started around the umbilicus and has now localized to the right lower quadrant (McBurney's point). The nurse palpates the left lower quadrant, which causes pain in the right lower quadrant. Which sign should the nurse document, and what is the priority nursing action?",
    "type": "Multiple Choice",
    "options": [
      "Document positive Rovsing sign; maintain NPO status and notify the healthcare provider immediately",
      "Document positive Murphy sign; administer a warm heating pad to soothe abdominal spasms",
      "Document positive Cullen sign; encourage high-fiber oral intake to promote peristalsis",
      "Document positive Kernig sign; prepare client for lumbar puncture and antibiotic therapy"
    ],
    "correctIndex": 0,
    "rationale": "Pain referred to the right lower quadrant when palpating the left lower quadrant is Rovsing sign, indicative of peritoneal irritation in acute appendicitis. The client must be kept NPO in anticipation of urgent surgical intervention (appendectomy). Heat should NEVER be applied to suspected appendicitis because increased circulation can precipitate appendix rupture and peritonitis.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": false,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-2",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Left-Sided Heart Failure Priority Findings",
    "stem": "A 68-year-old client with a history of coronary artery disease is admitted with acute decompensated left-sided heart failure. Which assessment finding requires the nurse's most immediate clinical intervention?",
    "type": "Multiple Choice",
    "options": [
      "Coarse bibasilar crackles with pink, frothy sputum and dyspnea at rest",
      "Bilateral 2+ pitting edema in the lower extremities and pedal erythema",
      "Jugular venous distention measuring 4 cm above the sternal angle at 45 degrees",
      "Right upper quadrant abdominal tenderness accompanied by mild hepatomegaly"
    ],
    "correctIndex": 0,
    "rationale": "Coarse crackles with pink, frothy sputum and resting dyspnea are hallmark signs of acute pulmonary edema, a life-threatening complication of left-sided heart failure. Left ventricular failure causes high hydrostatic pressures in pulmonary capillaries, forcing fluid into alveoli and severely impairing oxygen exchange. Peripheral edema, JVD, and hepatomegaly reflect right-sided failure, which is distressing but not immediately fatal like acute pulmonary edema.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-3",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Myocardial Infarction Priority Diagnostic and MONA Protocol",
    "stem": "A 56-year-old male arrives at the emergency department reporting crushing substernal chest pain radiating to his left jaw that began 45 minutes ago. Vital signs: BP 158/92 mm Hg, HR 104/min, RR 22/min, SpO2 97% on room air. Which diagnostic evaluation must the nurse obtain within 10 minutes of arrival?",
    "type": "Priority Action",
    "options": [
      "A 12-lead electrocardiogram (ECG) to evaluate for ST-segment elevation",
      "Stat serum troponin I and CK-MB cardiac biomarker panel",
      "Portable chest radiograph to rule out aortic dissection",
      "Transthoracic echocardiogram to assess left ventricular ejection fraction"
    ],
    "correctIndex": 0,
    "rationale": "NCSBN and ACC/AHA guidelines mandate obtaining a 12-lead ECG within 10 minutes of arrival for any patient with suspected acute coronary syndrome (ACS). The 12-lead ECG immediately differentiates STEMI (requiring emergent reperfusion therapy within 90 minutes) from NSTEMI/unstable angina. Biomarkers take 3-6 hours to rise and chest radiography is secondary.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-4",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "COPD Oxygen Therapy and Hypoxic Drive",
    "stem": "A client with severe end-stage chronic obstructive pulmonary disease (COPD) is admitted with an acute respiratory infection. The client's baseline room air SpO2 is 88%. The nurse notes the client appears somnolent, and an unlicensed assistive personnel (UAP) placed the client on 6 L/min oxygen via nasal cannula. Which physiological complication is the nurse most concerned about?",
    "type": "Multiple Choice",
    "options": [
      "Carbon dioxide narcosis and respiratory arrest caused by suppression of the hypoxic respiratory drive",
      "Acute pulmonary oxygen toxicity causing alveolar capillary membrane rupture",
      "Sudden absorption atelectasis due to nitrogen washout in non-ventilated lung units",
      "Severe metabolic acidosis resulting from sudden tissue hyperoxygenation"
    ],
    "correctIndex": 0,
    "rationale": "In clients with chronic hypercapnia from severe COPD, the central respiratory center becomes desensitized to high CO2 levels. Their primary stimulus to breathe becomes hypoxia (hypoxic drive). Administering excessively high concentrations of oxygen eliminates this stimulus, leading to CO2 retention (hypercapnia), lethargy, carbon dioxide narcosis, coma, and respiratory arrest. Target SpO2 in COPD is typically 88-92% using low-flow devices (1-2 L/min or Venturi mask).",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-5",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Tension Pneumothorax Emergency Recognition",
    "stem": "A client who sustained blunt thoracic trauma in a motor vehicle collision suddenly becomes severely dyspneic, cyanotic, and tachycardic. Upon assessment, the nurse notes absent breath sounds on the right side, hyperresonance to percussion, distended neck veins, and the trachea deviated to the left. What is the nurse's immediate priority action?",
    "type": "Priority Action",
    "options": [
      "Prepare for immediate emergency needle decompression in the 2nd intercostal space at the midclavicular line",
      "Intubate the client immediately using rapid sequence induction with high PEEP",
      "Obtain an urgent stat portable anterior-posterior chest x-ray to confirm pneumothorax",
      "Place the client in high Fowler position and apply oxygen at 4 L/min via simple face mask"
    ],
    "correctIndex": 0,
    "rationale": "Tension pneumothorax is a life-threatening clinical diagnosis where air enters the pleural space during inspiration but cannot exit. Progressive intrapleural pressure collapses the affected lung and shifts mediastinal structures (tracheal deviation away from the affected side), compressing the vena cava and causing rapid cardiovascular collapse. Needle decompression is life-saving and MUST NOT be delayed for radiographic confirmation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-6",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Diabetic Ketoacidosis (DKA) Intravenous Fluid and Electrolyte Management",
    "stem": "A 22-year-old client with type 1 diabetes mellitus is admitted in Diabetic Ketoacidosis (DKA). Arterial blood gas results: pH 7.18, PaCO2 28 mm Hg, HCO3 11 mEq/L. Blood glucose is 540 mg/dL. Normal saline 0.9% IV infusion is running. The client's serum potassium level returns at 3.4 mEq/L. Which action should the nurse take before initiating the regular insulin IV drip?",
    "type": "Multiple Choice",
    "options": [
      "Hold the insulin infusion and administer intravenous potassium chloride as prescribed until potassium is > 3.5 mEq/L",
      "Start the regular insulin bolus at 0.1 units/kg IV push immediately to correct severe acidosis",
      "Switch the IV maintenance fluid from 0.9% normal saline to Dextrose 5% with 0.45% sodium chloride",
      "Administer IV sodium bicarbonate push to raise arterial pH above 7.30"
    ],
    "correctIndex": 0,
    "rationale": "Insulin drives both glucose AND potassium from extracellular fluid into the intracellular compartment. If insulin is administered when baseline serum potassium is hypokalemic (< 3.5 mEq/L), it will precipitate lethal cardiac arrhythmias or cardiac arrest. Potassium must be repleted first before initiating insulin therapy. Once glucose drops below 250 mg/dL, dextrose is added to IV fluids to prevent cerebral edema and hypoglycemia.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-7",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Acute Ischemic Stroke and Thrombolytic (tPA) Inclusion Window",
    "stem": "A 64-year-old client is brought to the stroke center with sudden right-sided hemiplegia and expressive aphasia. A non-contrast head CT rules out intracerebral hemorrhage. The client's spouse states the client was last seen completely normal exactly 2 hours ago. Which finding would represent an absolute contraindication to administering IV alteplase (tPA)?",
    "type": "Multiple Choice",
    "options": [
      "History of major intracranial surgery or severe head trauma within the past 3 months",
      "Blood pressure on admission measuring 176/98 mm Hg",
      "Blood glucose level on admission measuring 188 mg/dL",
      "Age greater than 60 years accompanied by a remote history of controlled hypertension"
    ],
    "correctIndex": 0,
    "rationale": "Absolute contraindications to IV recombinant tissue plasminogen activator (rtPA) include prior intracranial hemorrhage, known cerebrovascular arteriovenous malformation or aneurysm, ischemic stroke or serious head trauma within the preceding 3 months, active internal bleeding, platelet count < 100,000/mm3, or international normalized ratio (INR) > 1.7. Hypertension is a contraindication only if sustained > 185/110 mm Hg and unresponsive to antihypertensives.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-8",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Hepatic Encephalopathy and Lactulose Effectiveness",
    "stem": "A client with end-stage alcoholic cirrhosis is receiving oral lactulose for the treatment of hepatic encephalopathy. Which clinical finding best demonstrates the therapeutic effectiveness of the medication?",
    "type": "Multiple Choice",
    "options": [
      "Improved orientation to person, place, and time with resolution of asterixis (flapping tremor)",
      "Production of 8 to 10 watery liquid diarrhea bowel movements per 24 hours",
      "Serum total bilirubin level declining from 4.2 mg/dL to 2.1 mg/dL",
      "Complete resolution of abdominal ascites and abdominal girth measurement"
    ],
    "correctIndex": 0,
    "rationale": "Lactulose traps ammonia (NH3) as ammonium (NH4+) in the bowel lumen via colonic acidification, expelling it through bowel movements (target: 2-3 soft stools per day). The primary goal and indicator of therapeutic efficacy is neurological improvement (clearing of confusion, improved mental status, and resolution of asterixis flapping tremor). Excessive watery diarrhea (8-10 stools) indicates overdosage and risk of dehydration/hypokalemia.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-9",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Autonomic Dysreflexia Emergency Nursing Protocol",
    "stem": "A client with a complete T4 spinal cord injury suddenly reports a throbbing, pounding frontal headache and severe nasal congestion. The nurse notes extreme facial flushing and profuse diaphoresis above the injury level. Blood pressure is 214/118 mm Hg, HR 52/min. What is the nurse's immediate first step?",
    "type": "Priority Action",
    "options": [
      "Elevate the head of the bed to 90 degrees (high Fowler) and loosen any constrictive clothing",
      "Administer prescribed IV hydralazine bolus to lower systemic blood pressure",
      "Perform a digital rectal examination to check for acute fecal impaction",
      "Check the Foley catheter drainage tubing for kinks or obstruction"
    ],
    "correctIndex": 0,
    "rationale": "Autonomic dysreflexia is a medical emergency in spinal cord injury at or above T6 triggered by noxious stimuli below the lesion (most commonly bladder distention or bowel impaction). Unopposed sympathetic surge causes profound, life-threatening paroxysmal hypertension. Elevating the head of the bed immediately uses orthostatic gravity to lower cerebral blood pressure and intracranial pressure. Once seated upright, the nurse rapidly investigates bladder and bowel causes.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-10",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Increased Intracranial Pressure (ICP) and Cushing Triad",
    "stem": "The nurse in the neuro-intensive care unit is monitoring a client with an acute subdural hematoma. Which set of vital signs indicates the onset of Cushing's Triad, signifying imminent brain herniation?",
    "type": "Multiple Choice",
    "options": [
      "BP 198/62 mm Hg (widening pulse pressure), Pulse 48/min (bradycardia), RR 10/min irregular (Cheyne-Stokes)",
      "BP 84/52 mm Hg (hypotension), Pulse 136/min (tachycardia), RR 28/min rapid and shallow",
      "BP 132/88 mm Hg, Pulse 76/min, RR 16/min unlabored with equal pupils",
      "BP 160/100 mm Hg, Pulse 110/min, Temperature 39.8°C with nuchal rigidity"
    ],
    "correctIndex": 0,
    "rationale": "Cushing's triad is a late, ominous physiological response to severe increased intracranial pressure and impending transtentorial herniation. It consists of: (1) marked systolic hypertension with widened pulse pressure, (2) bradycardia, and (3) irregular, altered respirations (such as Cheyne-Stokes breathing). In contrast, hypotension and tachycardia signify hypovolemic or septic shock.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-11",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Burn Resuscitation and the Parkland Formula",
    "stem": "A 70 kg client arrives at the burn trauma center with full-thickness thermal burns to the entire anterior chest and abdomen (18%), the entire right arm (9%), and the anterior surface of both legs (18%). Total body surface area (TBSA) burned is 45%. Using the Parkland formula (4 mL x kg x % TBSA), how much Lactated Ringer's solution must the nurse infuse over the first 8 hours post-injury?",
    "type": "Multiple Choice",
    "options": [
      "6,300 mL (half of the 12,600 mL total calculated 24-hour volume)",
      "12,600 mL infused at an equal hourly rate over the first 8 hours",
      "3,150 mL infused over the first 8 hours, followed by albumin colloids",
      "4,200 mL infused over the first 8 hours based on modified Brooke guidelines"
    ],
    "correctIndex": 0,
    "rationale": "Parkland Formula: Total 24-hr fluid = 4 mL x weight (kg) x % TBSA burned. Here: 4 mL x 70 kg x 45 = 12,600 mL Lactated Ringer's. Half of the total volume (6,300 mL) must be infused within the first 8 hours starting from the time of burn injury, and the remaining half (6,300 mL) is infused over the subsequent 16 hours. Urine output (0.5 mL/kg/hr or 30-50 mL/hr) is the primary indicator of adequate fluid resuscitation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-12",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Compartment Syndrome Clinical Hallmarks",
    "stem": "A client who underwent closed reduction and plaster casting for a comminuted tibia fracture reports severe, excruciating lower leg pain rated 10/10. The pain has escalated despite receiving IV morphine 4 mg 30 minutes ago. Passive dorsiflexion of the toes causes agonizing pain. Which intervention must the nurse take first?",
    "type": "Priority Action",
    "options": [
      "Notify the orthopedic surgeon immediately and prepare to bivalve the cast (suspected compartment syndrome)",
      "Elevate the casted extremity above heart level on three pillows to reduce venous congestion",
      "Apply an external ice pack over the plaster cast to decrease acute tissue swelling",
      "Administer an additional dose of IV hydromorphone as ordered for breakthrough pain"
    ],
    "correctIndex": 0,
    "rationale": "Pain that is disproportionate to the injury and unresponsive to opioids, especially provoked by passive muscle stretch, is the hallmark early sign of acute compartment syndrome. Increased interstitial pressure in an inextensible fascial space impairs microvascular perfusion, causing irreversible muscle and nerve necrosis within 4-6 hours if untreated (fasciotomy). The extremity should NEVER be elevated above heart level (reduces arterial perfusion) nor iced (causes vasoconstriction). The cast must be loosened/bivalved immediately.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-13",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Deep Vein Thrombosis (DVT) and Pulmonary Embolism Prevention",
    "stem": "A postoperative client on day 3 following total hip arthroplasty develops warmth, erythema, and 3+ non-pitting edema in the left calf. A venous duplex ultrasound confirms acute deep vein thrombosis (DVT). Which nursing action is strictly contraindicated?",
    "type": "Multiple Choice",
    "options": [
      "Massaging the affected calf to soothe muscle stiffness and alleviate localized spasms",
      "Initiating continuous intravenous unfractionated heparin per protocol",
      "Monitoring international normalized ratio (INR) and activated partial thromboplastin time (aPTT)",
      "Elevating the affected left leg while in bed to promote venous drainage"
    ],
    "correctIndex": 0,
    "rationale": "Massaging or vigorously rubbing an extremity with confirmed or suspected deep vein thrombosis is strictly contraindicated because mechanical manipulation can dislodge the thrombus into the systemic venous circulation, resulting in a fatal pulmonary embolism (PE). Clients are treated with therapeutic anticoagulation, bed rest/gentle ambulation, and leg elevation without external compression on the clot.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-14",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Acute Pancreatitis Laboratory and Clinical Manifestations",
    "stem": "A client is admitted with severe, boring epigastric abdominal pain radiating straight through to the back, accompanied by persistent nausea and vomiting. Which diagnostic laboratory finding is most specific for acute pancreatitis?",
    "type": "Multiple Choice",
    "options": [
      "Elevated serum lipase level (greater than 3 times the upper limit of normal)",
      "Mild elevation in serum aspartate aminotransferase (AST) and alanine aminotransferase (ALT)",
      "Elevated serum troponin I and creatine kinase MB (CK-MB)",
      "Decreased white blood cell count (leukopenia) with absolute neutropenia"
    ],
    "correctIndex": 0,
    "rationale": "Serum lipase is more sensitive and specific than serum amylase for acute pancreatitis because it remains elevated for 7-14 days and is produced almost exclusively by the pancreas (whereas amylase can originate from salivary glands). Clients with acute pancreatitis are maintained strictly NPO to halt pancreatic enzyme secretion and auto-digestion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-15",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Addisonian Crisis Emergency Management",
    "stem": "A client with primary adrenal insufficiency (Addison disease) presents to the emergency department after experiencing severe viral gastroenteritis. The client is confused, pale, and lethargic. Vital signs: BP 74/42 mm Hg, HR 128/min thready, Temperature 36.1°C. Lab: Sodium 124 mEq/L, Potassium 6.2 mEq/L, Glucose 52 mg/dL. Which medication should the nurse anticipate administering immediately?",
    "type": "Priority Action",
    "options": [
      "High-dose intravenous hydrocortisone sodium succinate (Solu-Cortef) with 0.9% normal saline and 5% dextrose",
      "Oral fludrocortisone acetate accompanied by high-sodium oral rehydration packets",
      "Subcutaneous regular insulin bolus to rapidly drive potassium into intracellular stores",
      "Intravenous spironolactone to block excessive mineralocorticoid receptor activity"
    ],
    "correctIndex": 0,
    "rationale": "Addisonian crisis (acute adrenal crisis) is a life-threatening emergency characterized by profound hypotension/vascular collapse, severe hyponatremia, hyperkalemia, and hypoglycemia triggered by stress or infection. Immediate administration of high-dose IV hydrocortisone is life-saving, along with rapid IV volume resuscitation with 0.9% normal saline and 5% dextrose to restore blood pressure and treat hypoglycemia.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-16",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Cushing Syndrome Classic Physical Manifestations",
    "stem": "A client is evaluated for chronic hypercortisolemia (Cushing syndrome). Which cluster of clinical manifestations should the nurse expect to assess in this client?",
    "type": "Multiple Choice",
    "options": [
      "Centripetal obesity, moon facies, buffalo hump, purple abdominal striae, and hirsutism",
      "Generalized hyperpigmentation (bronze skin), profound weight loss, and chronic hypotension",
      "Exophthalmos, pretibial myxedema, fine resting hand tremors, and heat intolerance",
      "Coarse facial features, enlarged hands and feet, deepening voice, and prognathism"
    ],
    "correctIndex": 0,
    "rationale": "Cushing syndrome (excess glucocorticoids) produces hallmark clinical features: central trunk obesity with thin extremities, round moon facies, dorsocervical fat pad (buffalo hump), purple/violaceous abdominal striae, fragile skin with easy bruising, hypertension, hyperglycemia, and hirsutism. In contrast, bronze skin pigmentation and hypotension characterize Addison disease (adrenocortical insufficiency).",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-17",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Thyroid Storm Emergency Recognition and Nursing Interventions",
    "stem": "A client with Graves' disease undergoes subtotal thyroidectomy. Eight hours postoperatively, the nurse notes the client has developed extreme restlessness, agitation, a fever of 40.2°C (104.4°F), heart rate of 162 beats/min with atrial fibrillation, and profuse diaphoresis. What is the nurse's priority assessment?",
    "type": "Priority Action",
    "options": [
      "Assess for thyroid storm (thyrotoxic crisis) and initiate cooling blankets, beta blockers, and antithyroid medications",
      "Assess for postoperative hypocalcemia and prepare intravenous calcium gluconate",
      "Assess for malignant hyperthermia and administer IV dantrolene immediately",
      "Assess for respiratory depression from opioid analgesia and prepare naloxone"
    ],
    "correctIndex": 0,
    "rationale": "Thyroid storm is an acute, life-threatening hypermetabolic crisis caused by a surge of thyroid hormones into circulation during surgical manipulation or stress. Hallmark signs include hyperpyrexia (fever > 40°C), severe tachycardia/arrhythmias, agitation, delirium, and systolic hypertension leading to heart failure. Emergency management involves beta blockers (propranolol) to block sympathetic surge, antithyroid medications (PTU/methimazole), iodine solutions, and hypothermia cooling blankets.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-18",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Peptic Ulcer Perforation Assessment and Peritonitis",
    "stem": "A client hospitalized with an active duodenal peptic ulcer suddenly screams in pain, clenches the abdomen, and curls into the fetal position. The nurse palpates the abdomen and discovers board-like rigidity and severe rebound tenderness. Blood pressure is 92/58 mm Hg, HR 122/min. What complication does the nurse suspect?",
    "type": "Priority Action",
    "options": [
      "Ulcer perforation through the gastrointestinal wall resulting in chemical peritonitis",
      "Acute upper gastrointestinal hemorrhage into the duodenal bulb lumen",
      "Sudden gastric outlet obstruction secondary to chronic cicatricial scarring",
      "Acute gallbladder rupture causing biliary colic and hepatic jaundice"
    ],
    "correctIndex": 0,
    "rationale": "A sudden, excruciating, sharp generalized abdominal pain accompanied by a rigid, board-like abdomen and absent bowel sounds is the classic presentation of acute peptic ulcer perforation. Gastroduodenal contents spill into the sterile peritoneal cavity, causing chemical and bacterial peritonitis and septic shock. This is a surgical emergency; the nurse must maintain NPO, insert a nasogastric tube to suction, start IV fluids, and notify the surgeon immediately.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-19",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Hypocalcemia Assessment: Chvostek and Trousseau Signs",
    "stem": "A client who underwent total thyroidectomy yesterday reports tingling in the fingers, toes, and perioral numbness. The nurse inflates a blood pressure cuff on the client's upper arm to 20 mm Hg above systolic pressure for 3 minutes, which elicits involuntary carpal spasm of the hand and fingers. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Positive Trousseau sign indicative of acute hypocalcemia; anticipate administering intravenous calcium gluconate",
      "Positive Chvostek sign indicative of hypomagnesemia; administer oral magnesium oxide tablets",
      "Positive Homans sign indicative of deep vein thrombosis; apply pneumatic compression stockings",
      "Normal neuromuscular response following prolonged arterial cuff occlusion; reassure the client"
    ],
    "correctIndex": 0,
    "rationale": "Accidental trauma or devascularization of the parathyroid glands during thyroidectomy causes acute hypoparathyroidism and hypocalcemia (serum Ca < 8.5 mg/dL). Clinical tetany signs include Trousseau sign (carpopedal spasm elicited by BP cuff inflation) and Chvostek sign (facial twitching elicited by tapping the facial nerve anterior to the ear). Severe hypocalcemia can trigger laryngospasm, seizures, and cardiac arrest; IV calcium gluconate must be available at the bedside.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-20",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chronic Kidney Disease and Hyperkalemia Cardiac Protection",
    "stem": "A client with end-stage renal disease (ESRD) missed their last two scheduled hemodialysis appointments. Electrocardiogram reveals tall, peaked T-waves, prolonged PR intervals, and widening QRS complexes. Serum potassium is 7.2 mEq/L. Which medication must the nurse administer first to protect the myocardium?",
    "type": "Priority Action",
    "options": [
      "Intravenous calcium gluconate 10% infused over 2 to 3 minutes",
      "Regular insulin 10 units IV with 50% dextrose (D50W) bolus",
      "Sodium polystyrene sulfonate (Kayexalate) 30 g orally",
      "Inhaled albuterol nebulizer 10 to 20 mg continuously"
    ],
    "correctIndex": 0,
    "rationale": "In severe hyperkalemia with EKG changes (peaked T waves, wide QRS), the immediate priority is IV calcium gluconate. Calcium does NOT lower serum potassium; rather, it stabilizes the cardiac cell membrane potential, preventing lethal ventricular fibrillation and asystole. After myocardial protection is established, therapies to shift potassium intracellularly (insulin + glucose, albuterol) and eliminate potassium (dialysis, Kayexalate) are administered.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-21",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Surviving Sepsis Campaign 1-Hour Bundle Priorities",
    "stem": "A client is admitted from a long-term care facility with suspected urosepsis. Vital signs: BP 82/46 mm Hg (MAP 58 mm Hg), HR 124/min, RR 26/min, Temp 39.1°C. Serum lactate is 4.6 mmol/L. Which sequence represents the nurse's priority clinical interventions?",
    "type": "Priority Action",
    "options": [
      "Draw blood cultures first, initiate 30 mL/kg crystalloid fluid bolus, and administer broad-spectrum IV antibiotics within 1 hour",
      "Administer broad-spectrum antibiotics immediately before obtaining any laboratory blood cultures",
      "Start norepinephrine infusion immediately without administering any intravenous fluid challenge",
      "Administer oral antipyretics and re-check blood pressure in 2 hours before escalating care"
    ],
    "correctIndex": 0,
    "rationale": "According to the Surviving Sepsis Campaign 1-hour bundle: (1) measure serum lactate level, (2) obtain blood cultures PRIOR to administering antibiotics, (3) administer broad-spectrum antibiotics within 1 hour of recognition, and (4) begin rapid fluid resuscitation with 30 mL/kg crystalloids for hypotension (MAP < 65 mm Hg) or lactate >= 4 mmol/L. Vasopressors (norepinephrine) are added only if MAP remains < 65 mm Hg despite adequate fluid resuscitation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-22",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Drainage System Safety and Troubleshooting",
    "stem": "The nurse is ambulating a client with a right-sided chest tube connected to a wet-suction drainage unit. The drainage unit is accidentally knocked over and the chest tube becomes completely dislodged from the client's chest wall. What is the nurse's immediate action?",
    "type": "Priority Action",
    "options": [
      "Cover the insertion site immediately with a sterile occlusive dressing taped on 3 sides",
      "Quickly reinsert the dislodged chest tube into the intercostal pleural space",
      "Apply a tight 4-sided occlusive Vaseline gauze dressing reinforced with elastic tape",
      "Clamp the proximal end of the tube with sterile padded hemostats"
    ],
    "correctIndex": 0,
    "rationale": "When a chest tube is accidentally dislodged from the chest, air can rush into the pleural space during inspiration, causing a tension pneumothorax. The nurse must immediately apply a sterile dressing taped on THREE sides. This creates a flutter-valve effect: air can escape during expiration through the unsealed side, but cannot enter during inspiration. Clamping or sealing on 4 sides traps air and causes tension pneumothorax.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-23",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Continuous Chest Tube Water Seal Chamber Continuous Bubbling",
    "stem": "The nurse assesses a client with a chest tube placed for a hemothorax. The nurse notes vigorous, continuous bubbling in the water-seal chamber. Tidaling with respiration has ceased. What does this observation indicate?",
    "type": "Multiple Choice",
    "options": [
      "There is an air leak in the drainage system or at the thoracic insertion site",
      "The pneumothorax has fully resolved and the lung is completely re-expanded",
      "The suction control regulator is functioning at peak therapeutic efficiency",
      "Excessive pleural fluid has clogged the collection tubing"
    ],
    "correctIndex": 0,
    "rationale": "Continuous bubbling in the water-seal chamber indicates an air leak in the system (either a loose connection, crack in the canister, or air leaking around the chest insertion site). Intermittent bubbling during exhalation or coughing is normal in a resolving pneumothorax, but continuous bubbling requires immediate systematic inspection with padded clamps to locate the source. Continuous bubbling in the suction chamber (if wet suction) is normal, but NOT in the water seal.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-24",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Tracheostomy Tube Accidental Decannulation Protocol",
    "stem": "A client with a tracheostomy placed 3 days ago has a severe coughing spasm, and the tracheostomy tube is completely dislodged onto the bed linens. The client becomes dyspneic and cyanotic. What is the nurse's immediate action?",
    "type": "Priority Action",
    "options": [
      "Insert the obturator into the spare tracheostomy tube and reinsert the tube into the stoma, then remove the obturator",
      "Occlude the stoma with petroleum gauze and begin mouth-to-mouth bag-valve-mask ventilations",
      "Place an emergency call to the code team and wait at the bedside without touching the stoma",
      "Pack the open stoma with sterile saline-soaked gauze to prevent track closure"
    ],
    "correctIndex": 0,
    "rationale": "A spare tracheostomy tube of the same size and one size smaller, along with an obturator and tracheal dilator, must ALWAYS be kept at the bedside of any tracheostomy patient. In the event of accidental decannulation of a fresh stoma (< 7 days old), the nurse uses tracheal dilators to hold the stoma open or immediately reinserts the spare tube using the obturator (which provides a rounded tip to prevent false track dissection), immediately removing the obturator to establish an airway.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-25",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Gouty Arthritis and Allopurinol Client Education",
    "stem": "A client with chronic recurrent gout is prescribed allopurinol 300 mg orally daily. Which instruction is most critical for the nurse to emphasize during discharge medication education?",
    "type": "Multiple Choice",
    "options": [
      "Stop taking allopurinol and report any new skin rash or blisters immediately to the healthcare provider",
      "Restrict daily fluid intake to less than 1.5 liters to prevent urinary allopurinol retention",
      "Take the medication on an empty stomach 2 hours before breakfast with dairy products",
      "Expect acute gout flare-ups to cease completely within the first 24 hours of starting therapy"
    ],
    "correctIndex": 0,
    "rationale": "Allopurinol is a xanthine oxidase inhibitor that lowers serum uric acid. A hypersensitivity reaction presenting as a mild rash can rapidly progress to life-threatening Stevens-Johnson syndrome (SJS) or Toxic Epidermal Necrolysis (TEN). Clients must be taught to discontinue allopurinol at the very first sign of a rash or fever and seek immediate medical attention. Clients should also increase fluid intake to 2-3 L/day to prevent renal calculi.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-26",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Colorectal Cancer Early Warning Signs and Screening",
    "stem": "A 52-year-old client undergoing routine health maintenance asks the nurse about early warning signs of colorectal cancer. Which finding represents the most common early manifestation?",
    "type": "Multiple Choice",
    "options": [
      "Occult blood in the stool and unexplained change in bowel habits (alternating constipation/diarrhea)",
      "Severe intractable left lower quadrant pain accompanied by high spiking fevers",
      "Visible, massive hematemesis accompanied by projectile bile-stained vomiting",
      "Sudden onset of massive painless ascites with spider angiomas"
    ],
    "correctIndex": 0,
    "rationale": "Colorectal cancer is often insidious and asymptomatic in early stages. The most common early warning signs include occult (hidden) blood in the stool (leading to unexplained iron-deficiency anemia, fatigue), and persistent changes in bowel habits (frequency, caliber like ribbon or pencil-like stools, alternating constipation and diarrhea). Routine colonoscopy screening is recommended beginning at age 45 for average-risk adults.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-27",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Rheumatoid Arthritis vs Osteoarthritis Joint Characteristics",
    "stem": "The clinic nurse is evaluating an adult client complaining of bilateral hand joint stiffness. Which assessment characteristic strongly differentiates rheumatoid arthritis (RA) from osteoarthritis (OA)?",
    "type": "Multiple Choice",
    "options": [
      "Symmetrical joint involvement with morning stiffness lasting longer than 60 minutes",
      "Asymmetrical joint pain that worsens after physical activity and is relieved by rest",
      "Presence of Heberden's and Bouchard's hard, bony nodes on the distal interphalangeal joints",
      "Unilateral knee joint crepitus accompanied by normal systemic inflammatory markers"
    ],
    "correctIndex": 0,
    "rationale": "Rheumatoid arthritis is a systemic autoimmune disease characterized by bilateral, symmetrical joint inflammation, elevated inflammatory markers (ESR, CRP), and prolonged morning stiffness lasting > 1 hour that improves with movement. Osteoarthritis is a degenerative, 'wear-and-tear' non-inflammatory joint disorder characterized by asymmetrical involvement, pain worsening with activity and relieved by rest, and Heberden/Bouchard bony nodes.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-28",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Pernicious Anemia and Vitamin B12 Cyanocobalamin Replacement",
    "stem": "A client with chronic atrophic gastritis is diagnosed with pernicious anemia. The client states, 'I will take extra vitamin B12 multivitamins with my breakfast every morning so I don't need shots.' What is the nurse's best response?",
    "type": "Multiple Choice",
    "options": [
      "'Your stomach lacks intrinsic factor, which is required to absorb oral vitamin B12; you will need lifelong injections.'",
      "'Oral vitamin B12 tablets work just as well as injections if taken with full-fat milk.'",
      "'You only need injections for 2 weeks until your red blood count normalizes, then you can stop.'",
      "'Taking iron supplements with orange juice will cure this type of anemia without vitamin B12.'"
    ],
    "correctIndex": 0,
    "rationale": "Pernicious anemia is an autoimmune disorder where parietal cells in the gastric mucosa are destroyed, preventing intrinsic factor production. Intrinsic factor is essential for vitamin B12 (cobalamin) absorption in the terminal ileum. Without intrinsic factor, oral vitamin B12 cannot be absorbed. Clients require lifelong parenteral (IM or deep subcutaneous) cyanocobalamin injections to prevent severe neurological deficits (paresthesias, ataxia, dementia).",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-29",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Acute Angle-Closure Glaucoma Ophthalmic Emergency",
    "stem": "A 62-year-old client enters the emergency department reporting sudden, excruciating unilateral right eye pain, a severe frontal headache, nausea, blurred vision, and seeing rainbow-colored halos around lights. Upon examination, the right pupil is oval, semi-dilated, and non-reactive to light. What is the nurse's priority action?",
    "type": "Priority Action",
    "options": [
      "Prepare for emergency administration of topical miotics and IV acetazolamide or mannitol to lower intraocular pressure",
      "Instill mydriatic pupil-dilating eye drops to examine the posterior retina",
      "Reassure the client that this is an acute migraine aura and administer oral sumatriptan",
      "Patch the affected eye firmly and schedule an outpatient ophthalmology consultation for next week"
    ],
    "correctIndex": 0,
    "rationale": "Acute angle-closure glaucoma is an ophthalmic medical emergency caused by sudden obstruction of aqueous humor outflow through the trabecular meshwork, causing rapid, dangerous spikes in intraocular pressure (> 50 mm Hg). Without emergency treatment (topical beta blockers, pilocarpine miotics, IV mannitol/acetazolamide) to reduce IOP, permanent optic nerve ischemia and irreversible blindness can occur within 24-48 hours. Mydriatic (dilating) drops are STRICTLY contraindicated.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-30",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Meniere's Disease Safety Precautions During Acute Attacks",
    "stem": "A client with Meniere disease experiences an acute episode of severe vertigo, tinnitus, and unilateral sensorineural hearing loss. Which nursing intervention is essential to prevent client injury?",
    "type": "Multiple Choice",
    "options": [
      "Place the bed in the lowest position with side rails up, and instruct the client to call for assistance before ambulating",
      "Encourage the client to ambulate briskly in the hallway to recalibrate vestibular balance",
      "Keep room lights bright and encourage frequent head-turning exercises",
      "Provide a high-sodium snack with caffeinated beverages to enhance inner ear blood flow"
    ],
    "correctIndex": 0,
    "rationale": "Meniere disease results from excessive endolymph accumulation in the inner ear (endolymphatic hydrops). Acute attacks cause severe, incapacitating rotational vertigo with nausea and vomiting, placing clients at extreme risk for falls and head trauma. Clients should lie in a quiet, darkened room, avoid rapid head movements, call for assistance when transferring, and adhere to a low-sodium diet (< 2 g/day) to reduce fluid retention.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-31",
    "subjectId": "child-health",
    "subjectName": "Child Health",
    "title": "Pediatric Intussusception Hallmark Sign and Reduction",
    "stem": "A 7-month-old infant is brought to the clinic with episodic, severe colicky abdominal pain during which the infant draws knees to the chest and cries inconsolably. On physical examination, the nurse palpates a sausage-shaped mass in the right upper quadrant. The mother reports the infant just passed stool that looks like red currant jelly. Which intervention should the nurse anticipate as first-line non-surgical treatment?",
    "type": "Multiple Choice",
    "options": [
      "Pneumatic (air) or hydrostatic contrast enema reduction under fluoroscopy",
      "Immediate exploratory laparotomy with bowel resection and temporary stoma",
      "Oral administration of loperamide to slow hyperactive intestinal motility",
      "High-dose intravenous methylprednisolone to resolve mesenteric lymphadenopathy"
    ],
    "correctIndex": 0,
    "rationale": "Pneumatic (air) or hydrostatic (saline/contrast) enema reduction under sonographic or fluoroscopic guidance is the first-line treatment for stable intussusception. It is successful in 80-90% of cases and avoids surgery. Antidiarrheals are strictly contraindicated because they worsen bowel obstruction and perforation risk.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-32",
    "subjectId": "child-health",
    "subjectName": "Child Health",
    "title": "Pyloric Stenosis Assessment and Metabolic Imbalance",
    "stem": "A 5-week-old infant is admitted with a 4-day history of non-bilious, projectile vomiting immediately after formula feedings. The infant is constantly hungry and has sunken fontanelles. On palpation, an olive-sized mass is felt in the right epigastrium. Which arterial blood gas and electrolyte profile does the nurse anticipate?",
    "type": "Multiple Choice",
    "options": [
      "Hypochloremic, hypokalemic metabolic alkalosis with elevated serum bicarbonate",
      "Hyperchloremic metabolic acidosis with compensatory hyperventilation",
      "Respiratory acidosis with hypoxemia and elevated PaCO2",
      "Severe hyperkalemia with metabolic acidosis and sodium wasting"
    ],
    "correctIndex": 0,
    "rationale": "Hypertrophic pyloric stenosis causes severe projectile vomiting of gastric contents containing hydrochloric acid and potassium. Chronic gastric loss results in hypochloremia, hypokalemia, and metabolic alkalosis (elevated pH and HCO3-). Surgery (pyloromyotomy) must be delayed until dehydration, hypochloremia, and metabolic alkalosis are corrected with IV fluids to prevent postoperative apnea.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-33",
    "subjectId": "child-health",
    "subjectName": "Child Health",
    "title": "Hirschsprung Disease (Congenital Aganglionic Megacolon)",
    "stem": "A full-term newborn has not passed meconium within the first 36 hours of life. The infant has marked abdominal distention, bilious vomiting, and reluctance to feed. Which diagnostic test is definitive for confirming Hirschsprung disease?",
    "type": "Multiple Choice",
    "options": [
      "Rectal suction biopsy to confirm the absence of ganglion cells in the bowel wall",
      "Abdominal ultrasound to measure pyloric muscle thickness and channel length",
      "Upper gastrointestinal endoscopy with duodenal aspirate culture",
      "Serum sweat chloride test using pilocarpine iontophoresis"
    ],
    "correctIndex": 0,
    "rationale": "Hirschsprung disease is caused by congenital failure of parasympathetic ganglion cells to migrate to the distal colon (usually rectosigmoid). The aganglionic segment lacks peristalsis, resulting in functional bowel obstruction, failure to pass meconium in 24-48 hours, abdominal distention, and ribbon-like foul-smelling stools in older infants. Full-thickness rectal suction biopsy demonstrating aganglionosis is the diagnostic gold standard.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-34",
    "subjectId": "child-health",
    "subjectName": "Child Health",
    "title": "Tetralogy of Fallot Hypercyanotic ('Tet') Spell Protocol",
    "stem": "A 9-month-old infant with unrepaired Tetralogy of Fallot suddenly becomes intensely cyanotic, tachypneic, and irritable while crying after a blood draw. What is the nurse's immediate priority action?",
    "type": "Priority Action",
    "options": [
      "Place the infant in the knee-chest position immediately",
      "Administer IV sodium bicarbonate bolus to treat metabolic acidosis",
      "Start a rapid bolus of 20 mL/kg normal saline through a peripheral line",
      "Obtain an immediate 12-lead electrocardiogram to evaluate for heart block"
    ],
    "correctIndex": 0,
    "rationale": "Hypercyanotic spells ('tet' spells) occur when stress or crying increases right ventricular outflow tract spasm, forcing unoxygenated blood through the ventricular septal defect into systemic circulation (right-to-left shunt). Placing the infant in the knee-chest position immediately increases systemic vascular resistance (SVR), which reduces the right-to-left shunt and directs more unoxygenated blood into the pulmonary artery for oxygenation. Calming the child, supplemental oxygen, and morphine are subsequent interventions.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-35",
    "subjectId": "child-health",
    "subjectName": "Child Health",
    "title": "Acute Epiglottitis Airway Safety and Nursing Precautions",
    "stem": "A 4-year-old child presents to the emergency department leaning forward in a 'tripod' position with mouth open, drooling saliva, and presenting with high fever and inspiratory stridor. The child appears anxious and will not lie down. Which action is strictly prohibited?",
    "type": "Priority Action",
    "options": [
      "Inserting a tongue blade or swab into the pharynx to inspect the throat",
      "Allowing the parent to hold the child in their lap to minimize anxiety",
      "Preparing endotracheal intubation equipment and a tracheostomy tray at the bedside",
      "Administering humidified oxygen via blow-by mask held near the child's face"
    ],
    "correctIndex": 0,
    "rationale": "Acute epiglottitis (frequently caused by Haemophilus influenzae type b) is an airway emergency characterized by the classic 4 D's: Drooling, Dysphagia, Dysphonia, and Distressed inspiratory stridor. Any physical stimulation or examination of the posterior pharynx with a tongue blade or throat swab can precipitate sudden, complete laryngospasm and fatal airway occlusion. The child must be kept calm in a parent's arms until an experienced team (anesthesia/ENT) secures the airway in the OR.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-36",
    "subjectId": "child-health",
    "subjectName": "Child Health",
    "title": "Cystic Fibrosis Pancreatic Enzyme Replacement Therapy",
    "stem": "The nurse is teaching the parents of an infant newly diagnosed with cystic fibrosis about administering pancrelipase (pancreatic enzyme capsules). Which guideline should the nurse emphasize?",
    "type": "Multiple Choice",
    "options": [
      "Administer the enzyme capsules with all meals and snacks, mixed into acidic foods like applesauce",
      "Administer the enzymes only once daily at bedtime on an empty stomach",
      "Dissolve the enzyme powder into warm cow's milk formula before feeding",
      "Instruct the child to chew the enteric-coated beads thoroughly before swallowing"
    ],
    "correctIndex": 0,
    "rationale": "In cystic fibrosis, thick mucus plugs pancreatic ducts, preventing digestive enzymes from reaching the duodenum, leading to severe malabsorption and steatorrhea (bulky, foul-smelling, fatty stools). Pancrelipase must be consumed immediately before or with EVERY meal and snack. Capsules can be opened and sprinkled onto small amounts of acidic food (applesauce, yogurt). Enzymes must NEVER be chewed or mixed with alkaline foods (milk), which inactivate the enteric coating and cause oral ulcerations.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-37",
    "subjectId": "child-health",
    "subjectName": "Child Health",
    "title": "Celiac Disease Dietary Exclusions (Gluten-Free)",
    "stem": "The nurse is providing dietary counseling to the mother of a 6-year-old child diagnosed with celiac disease. Which grains must the child permanently eliminate from their diet?",
    "type": "Multiple Choice",
    "options": [
      "Barley, Rye, Oats, and Wheat (the BROW acronym)",
      "Corn, Rice, Millet, and Quinoa",
      "Tapioca, Buckwheat, Arrowroot, and Potato flour",
      "Soy, Flaxseed, Amaranth, and Pure Cornmeal"
    ],
    "correctIndex": 0,
    "rationale": "Celiac disease is an autoimmune enteropathy triggered by ingestion of gluten proteins found in wheat, barley, rye, and oats (remember 'BROW'). Ingestion of gluten causes chronic villous atrophy in the small intestine, leading to chronic malabsorption. Safe gluten-free alternatives include rice, corn, potatoes, soy, arrowroot, and certified gluten-free grains.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-38",
    "subjectId": "child-health",
    "subjectName": "Child Health",
    "title": "Kawasaki Disease Coronary Artery Aneurysm Prevention",
    "stem": "A 3-year-old child is hospitalized with Kawasaki disease. Assessment reveals high remittent fever for 6 days, bilateral non-purulent conjunctivitis, strawberry tongue, erythematous cracked lips, and swollen cervical lymph nodes. Which pharmacological regimen is vital to prevent coronary artery aneurysms?",
    "type": "Multiple Choice",
    "options": [
      "Intravenous immunoglobulin (IVIG) high-dose infusion combined with oral aspirin",
      "Broad-spectrum IV cephalosporins combined with oral acyclovir",
      "High-dose systemic corticosteroids combined with oral methotrexate",
      "Subcutaneous enoxaparin injections combined with oral clopidogrel"
    ],
    "correctIndex": 0,
    "rationale": "Kawasaki disease is an acute systemic vasculitis affecting medium-sized arteries, particularly coronary vessels. Without treatment, up to 25% of children develop permanent coronary artery aneurysms or ischemic heart disease. The standard of care is high-dose IVIG (2 g/kg over 10-12 hours) and high-dose oral aspirin (80-100 mg/kg/day during the febrile acute phase). This is one of the few pediatric conditions where aspirin is indicated despite Reye syndrome risk.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-39",
    "subjectId": "child-health",
    "subjectName": "Child Health",
    "title": "Wilms Tumor (Nephroblastoma) Nursing Precaution",
    "stem": "A 3-year-old child is admitted for surgical resection of a suspected Wilms tumor (nephroblastoma). The nurse notes a non-tender, firm unilateral mass in the right flank. What warning sign must the nurse post prominently above the child's hospital bed?",
    "type": "Priority Action",
    "options": [
      "'DO NOT PALPATE ABDOMEN'",
      "'STRICT RESTRAINT PROTOCOL REQUIRED'",
      "'KEEP CHILD IN PRONE POSITION AT ALL TIMES'",
      "'RESTRICT FLUIDS TO LESS THAN 500 ML PER DAY'"
    ],
    "correctIndex": 0,
    "rationale": "Wilms tumor (nephroblastoma) is an encapsulated malignant renal neoplasm. Palpation of the abdomen can rupture the delicate capsule, spilling malignant cancer cells throughout the peritoneal cavity and causing rapid metastatic dissemination and staging upshift. The sign 'DO NOT PALPATE ABDOMEN' must be posted prominently over the bed and communicated to all healthcare personnel.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-40",
    "subjectId": "child-health",
    "subjectName": "Child Health",
    "title": "Acute Laryngotracheobronchitis (Croup) Home Care",
    "stem": "A mother calls the triage nurse stating her 2-year-old child woke up in the middle of the night with a harsh, barking 'seal-like' cough, hoarseness, and noisy breathing during inspiration. The child has no drooling and is drinking water. Which initial home intervention should the nurse advise?",
    "type": "Multiple Choice",
    "options": [
      "Take the child into the bathroom filled with steamy warm mist from a running shower or outside into cool nighttime air",
      "Give the child an over-the-counter dextromethorphan cough suppressant immediately",
      "Encourage the child to lie flat in bed and administer warm honey with hot tea",
      "Administer oral aspirin 325 mg to rapidly reduce subglottic laryngeal swelling"
    ],
    "correctIndex": 0,
    "rationale": "Viral croup (laryngotracheobronchitis, most commonly parainfluenza virus) causes subglottic airway edema leading to a characteristic brassy, barking seal-like cough and inspiratory stridor. Mild croup is managed at home with exposure to cool humidified air (cool mist vaporizer or taking the child into night air) or sitting in a steamy bathroom for 10-15 minutes, which soothes inflamed mucosa and relieves spasms. Cough suppressants are ineffective and aspirin is contraindicated.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-41",
    "subjectId": "pharmacology",
    "subjectName": "Pharmacology",
    "title": "Digoxin Toxicity Risk and Hypokalemia",
    "stem": "A client with atrial fibrillation is prescribed digoxin 0.125 mg orally daily and furosemide 40 mg orally daily. Before administering morning medications, the nurse notes the client's lab results: Digoxin level 1.8 ng/mL, Potassium 2.9 mEq/L, Sodium 138 mEq/L, Calcium 9.2 mg/dL. Which action should the nurse take first?",
    "type": "Multiple Choice",
    "options": [
      "Hold the digoxin, notify the healthcare provider, and anticipate potassium replacement",
      "Administer both medications as scheduled since digoxin is in therapeutic range (0.5-2.0 ng/mL)",
      "Administer a double dose of furosemide to promote potassium excretion",
      "Encourage the client to drink 1 liter of plain water to dilute serum digoxin levels"
    ],
    "correctIndex": 0,
    "rationale": "Hypokalemia (potassium < 3.5 mEq/L) significantly potentiates digoxin toxicity even when the serum digoxin level is within the standard therapeutic range (0.5-2.0 ng/mL), because potassium competes with digoxin for Na+/K+ ATPase pump binding sites. Furosemide is a loop diuretic that wastes potassium. The nurse must hold the digoxin, notify the provider, and replace potassium promptly.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-42",
    "subjectId": "pharmacology",
    "subjectName": "Pharmacology",
    "title": "Heparin vs Warfarin Anticoagulation and Antidotes",
    "stem": "A client receiving continuous intravenous unfractionated heparin for an acute pulmonary embolism develops sudden epistaxis, hematuria, and an aPTT of 135 seconds (control 30 seconds). Which reversal agent should the nurse prepare to administer?",
    "type": "Multiple Choice",
    "options": [
      "Protamine sulfate administered by slow intravenous injection",
      "Phytonadione (Vitamin K1) administered intravenously",
      "Idarucizumab administered via bolus infusion",
      "Aminocaproic acid administered intravenously"
    ],
    "correctIndex": 0,
    "rationale": "Protamine sulfate is the specific antidote for unfractionated heparin and low molecular weight heparin (enoxaparin). It is a strongly basic protein that binds negatively charged heparin molecules to form an inactive salt complex. Vitamin K is the antidote for warfarin (Coumadin). Idarucizumab is the antidote for dabigatran (Pradaxa).",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-43",
    "subjectId": "pharmacology",
    "subjectName": "Pharmacology",
    "title": "Insulin Onset, Peak, and Hypoglycemia Timing",
    "stem": "The nurse administers 10 units of rapid-acting insulin lispro (Humalog) subcutaneously to a client with type 2 diabetes mellitus at 0730. When is the client at greatest clinical risk for experiencing a hypoglycemic reaction?",
    "type": "Multiple Choice",
    "options": [
      "Between 0800 and 0900 (30 to 90 minutes post-administration)",
      "Between 1130 and 1530 (4 to 8 hours post-administration)",
      "Exactly at 0735 (5 minutes post-administration)",
      "Between 1700 and 1930 (10 to 12 hours post-administration)"
    ],
    "correctIndex": 0,
    "rationale": "Insulin lispro (Humalog), aspart (Novolog), and glulisine (Apidra) are rapid-acting insulins. Their onset of action is 10-15 minutes, their PEAK effect occurs at 30 to 90 minutes, and their total duration is 3 to 5 hours. Hypoglycemia is most likely to occur at the PEAK of insulin action, which is when the maximum glucose-lowering effect occurs. Meal trays must be present before injecting rapid-acting insulins.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-44",
    "subjectId": "pharmacology",
    "subjectName": "Pharmacology",
    "title": "ACE Inhibitors and Life-Threatening Angioedema",
    "stem": "A client who began taking lisinopril 20 mg daily for hypertension two weeks ago presents to urgent care complaining of sudden lip swelling, tongue enlargement, and a hoarse, scratchy voice. What is the nurse's priority action?",
    "type": "Priority Action",
    "options": [
      "Assess airway patency immediately, prepare for intubation, and notify the provider (suspected angioedema)",
      "Reassure the client that mild dry cough and lip tingling are harmless side effects of ACE inhibitors",
      "Administer oral diphenhydramine 50 mg and advise the client to lie down in the examination room",
      "Obtain an immediate 12-lead ECG to rule out acute inferior myocardial infarction"
    ],
    "correctIndex": 0,
    "rationale": "Angioedema is a rare but potentially fatal adverse reaction to angiotensin-converting enzyme (ACE) inhibitors caused by accumulation of bradykinin. It causes rapid, non-pitting swelling of the face, tongue, pharynx, and larynx, which can progress to complete airway obstruction within minutes. The nurse must immediately evaluate the airway, call for emergency airway equipment (intubation/cricothyrotomy), and anticipate epinephrine and discontinuation of the ACE inhibitor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-45",
    "subjectId": "pharmacology",
    "subjectName": "Pharmacology",
    "title": "Vancomycin Infusion Reaction (Red Man Syndrome)",
    "stem": "A client with MRSA osteomyelitis is receiving an intravenous infusion of vancomycin 1,000 mg in 250 mL D5W. Twenty minutes into the infusion, the client develops intense flushing, erythema, and pruritus across the face, neck, and upper torso. Blood pressure is 108/68 mm Hg, HR 88/min, RR 18/min. What should the nurse do first?",
    "type": "Priority Action",
    "options": [
      "Stop or slow the vancomycin infusion rate to run over at least 60 to 120 minutes",
      "Administer IV epinephrine 1:1,000 immediately for an acute anaphylactic shock reaction",
      "Discontinue the peripheral IV line permanently and document an allergy to all glycopeptides",
      "Increase the infusion rate to finish the antibiotic before tissue necrosis develops"
    ],
    "correctIndex": 0,
    "rationale": "Vancomycin infusion reaction (historically called 'Red Man Syndrome') is a non-IgE mediated, rate-dependent histamine release reaction caused by rapid infusion of vancomycin. It manifests as sudden erythema, flushing, and pruritus of the face, neck, and upper torso. It is NOT a true allergic reaction. The first action is to stop or slow the infusion rate so that vancomycin is infused over at least 60 minutes (or >= 120 minutes for doses >= 1 gram). Antihistamines may be pre-administered.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-46",
    "subjectId": "pharmacology",
    "subjectName": "Pharmacology",
    "title": "Lithium Carbonate Toxicity and Sodium Homeostasis",
    "stem": "A client with bipolar disorder has been stabilized on oral lithium carbonate 300 mg three times daily. The client's latest serum lithium level is 2.1 mEq/L (therapeutic range: 0.6 to 1.2 mEq/L). Which assessment findings indicate advanced lithium toxicity?",
    "type": "Multiple Choice",
    "options": [
      "Coarse hand tremors, ataxia, persistent gastrointestinal upset, confusion, and hyperreflexia",
      "Mild transient fine hand tremor, mild polyuria, and occasional dry mouth",
      "Severe constipation, marked hypothermia, and urinary retention",
      "Hypertensive crisis, occipital headache, and photophobia"
    ],
    "correctIndex": 0,
    "rationale": "Lithium has a very narrow therapeutic window (0.6 to 1.2 mEq/L; acute mania up to 1.5 mEq/L). Levels > 1.5 to 2.0 mEq/L cause toxic manifestations: coarse hand tremors, severe ataxia, slurred speech, persistent nausea/vomiting/diarrhea, lethargy, confusion, and seizures. Renal reabsorption of lithium is inversely related to sodium; therefore, hyponatremia, dehydration, and diuretics (thiazides) dramatically increase lithium reabsorption, precipitating toxicity.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-47",
    "subjectId": "pharmacology",
    "subjectName": "Pharmacology",
    "title": "Opioid Toxicity and Naloxone (Narcan) Administration",
    "stem": "A postoperative client receiving patient-controlled analgesia (PCA) with IV morphine is found unarousable. Assessment reveals pinpoint pupils, respiratory rate of 6 breaths/min with shallow chest expansion, and SpO2 82% on room air. The nurse administers IV naloxone. What is the nurse's critical ongoing priority?",
    "type": "Priority Action",
    "options": [
      "Continuously monitor respiratory status because the half-life of naloxone is shorter than that of morphine",
      "Discharge the client from the post-anesthesia recovery unit since the client woke up promptly",
      "Administer oral naltrexone tablets to sustain opioid receptor blockade throughout the shift",
      "Place the client in Trendelenburg position to improve cerebral oxygenation"
    ],
    "correctIndex": 0,
    "rationale": "Naloxone (Narcan) is a pure opioid antagonist that rapidly displaces opioids from mu-receptors, reversing life-threatening respiratory depression. However, the elimination half-life of naloxone is approximately 30 to 90 minutes, whereas many opioids (morphine, hydromorphone, methadone) have a significantly longer half-life (2 to 4+ hours). As naloxone wears off, the client can relapse into respiratory depression. Repeated doses or a continuous infusion are frequently required.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-48",
    "subjectId": "pharmacology",
    "subjectName": "Pharmacology",
    "title": "Levothyroxine (Synthroid) Administration Guidelines",
    "stem": "The nurse is providing discharge instructions to a client newly prescribed levothyroxine for primary hypothyroidism. Which instruction ensures optimal drug bioavailability?",
    "type": "Multiple Choice",
    "options": [
      "Take the medication every morning on an empty stomach with a full glass of water, 30 to 60 minutes before breakfast",
      "Take the medication with calcium carbonate and iron supplements with dinner to prevent gastric irritation",
      "Take the tablet at bedtime with a high-fiber snack like bran cereal",
      "Crush the tablet and mix it with grapefruit juice to enhance intestinal absorption"
    ],
    "correctIndex": 0,
    "rationale": "Levothyroxine (synthetic T4) absorption is significantly decreased by food, dietary fiber, calcium supplements, iron, and antacids containing aluminum or magnesium. It must be taken consistently every morning on an empty stomach with a full glass of water, at least 30 to 60 minutes before eating breakfast or taking other medications. Therapeutic response (TSH normalization) requires 6-8 weeks of consistent dosing.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-49",
    "subjectId": "pharmacology",
    "subjectName": "Pharmacology",
    "title": "Sublingual Nitroglycerin Protocol for Angina Pectoris",
    "stem": "A client with chronic stable angina is prescribed sublingual nitroglycerin tablets for acute chest pain. Which statement by the client indicates an accurate understanding of the medication protocol?",
    "type": "Multiple Choice",
    "options": [
      "'I will dissolve 1 tablet under my tongue at the first onset of pain; if chest pain persists after 5 minutes, I will call 911 before taking a second tablet.'",
      "'I will chew 3 tablets immediately whenever I feel chest heaviness.'",
      "'I will swallow the tablet whole with a warm glass of water to ensure prolonged absorption.'",
      "'If I don't feel a tingling or burning sensation under my tongue, the medicine is too strong and I must stop.'"
    ],
    "correctIndex": 0,
    "rationale": "For acute angina: (1) stop activity and sit down, (2) place 1 sublingual tablet under the tongue and allow it to dissolve completely without swallowing, (3) if pain is unresolved or worsens after 5 minutes, call 911 immediately and take a second tablet, (4) a third tablet can be taken 5 minutes later while waiting for EMS (maximum 3 tablets in 15 minutes). A stinging/tingling sensation under the tongue is normal and indicates potency. Never take with phosphodiesterase-5 inhibitors (sildenafil).",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-50",
    "subjectId": "pharmacology",
    "subjectName": "Pharmacology",
    "title": "Beta-Adrenergic Blockers: Heart Rate and Hypoglycemia Precautions",
    "stem": "A client with type 1 diabetes mellitus is prescribed metoprolol tartrate 50 mg orally twice daily for hypertension. Which important educational point must the nurse discuss regarding hypoglycemia recognition?",
    "type": "Multiple Choice",
    "options": [
      "Beta blockers can mask classic sympathetic signs of hypoglycemia like tachycardia, tremors, and palpitations, but diaphoresis usually persists",
      "Metoprolol will increase insulin production and eliminate the need for daily blood glucose monitoring",
      "Beta blockers will cause severe hyperglycemia that is completely resistant to subcutaneous insulin",
      "The client should stop taking insulin while taking metoprolol to avoid hypoglycemic shock"
    ],
    "correctIndex": 0,
    "rationale": "Beta-adrenergic blockers (such as metoprolol, propranolol) block beta-1 and beta-2 receptors, blunting the sympathetic nervous system's response to hypoglycemia. Classic warning signs like tachycardia, anxiety, palpitations, and tremors are suppressed. However, diaphoresis (sweating) is mediated by cholinergic receptors and is usually NOT masked. Diabetic clients must be taught to check blood glucose whenever feeling diaphoretic, dizzy, or fatigued.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-51",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Standard vs Droplet Transmission Precautions",
    "stem": "The nurse is assigned to care for a client admitted with confirmed Neisseria meningitidis bacterial meningitis. Which personal protective equipment (PPE) combination is mandatory prior to entering the client's room?",
    "type": "Multiple Choice",
    "options": [
      "Surgical mask and private room with door closed (Droplet Precautions)",
      "Fitted N95 respirator and negative-pressure airflow room (Airborne Precautions)",
      "Sterile gloves and fluid-resistant gown only (Contact Precautions)",
      "Standard precautions only; no mask is required if staying 1 foot away"
    ],
    "correctIndex": 0,
    "rationale": "Neisseria meningitidis is transmitted via large respiratory droplets during coughing, sneezing, or close contact. Droplet Precautions require a private room, a surgical mask when within 3-6 feet of the client (or entering the room), and dedicated equipment. Airborne Precautions (N95 and negative pressure) are indicated for measles, tuberculosis, and varicella, not meningococcal meningitis.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-52",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Clostridioides difficile Hand Hygiene and Environmental Sanitation",
    "stem": "The nurse is caring for a client with severe diarrhea due to confirmed Clostridioides difficile enterocolitis. Which infection control measure is mandatory upon leaving the client's room?",
    "type": "Multiple Choice",
    "options": [
      "Wash hands thoroughly with antimicrobial soap and warm running water (alcohol sanitizer is ineffective against C. diff spores)",
      "Use alcohol-based hand rub vigorously for 20 seconds until completely dry",
      "Discard gloves and gown in the hallway biohazard bin outside the room",
      "Place the client in a negative-pressure airflow isolation room with an N95 respirator"
    ],
    "correctIndex": 0,
    "rationale": "Clostridioides difficile produces durable bacterial endospores that are resistant to alcohol-based hand sanitizers. Mechanical friction and lathering with soap and running water is the ONLY effective method to physically wash spores off the hands. Contact precautions (gown and gloves upon room entry) and chlorine/bleach-based environmental disinfectants are mandatory.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-53",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Physical Restraints Safety and Documentation Standards",
    "stem": "A confused, agitated client attempts to pull out an endotracheal tube and central venous catheter. Bilateral soft wrist restraints are applied. Which intervention adheres to the Joint Commission safety standards for physical restraints?",
    "type": "Multiple Choice",
    "options": [
      "Secure restraint ties to the movable part of the bed frame using a quick-release half-bow knot, and assess neurovascular status every 15 to 30 minutes",
      "Tie the restraint straps securely to the side rails using a square double knot to prevent release",
      "Obtain a 'PRN' restraint prescription from the provider so restraints can be reapplied at the nurse's discretion",
      "Keep restraints applied continuously for 48 hours without releasing them to avoid accidental extubation"
    ],
    "correctIndex": 0,
    "rationale": "Restraints must always be secured to the movable part of the bed frame (never to the side rails, which can cause severe injury when raised or lowered) using a quick-release knot. Neurovascular and circulatory status (pulses, capillary refill, skin color, sensation) must be checked every 15-30 minutes. Restraints must be released every 2 hours for range of motion, toileting, and skin assessment. 'PRN' restraint orders are strictly prohibited by regulatory agencies.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-54",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Acute Hemolytic Blood Transfusion Reaction Emergency Protocol",
    "stem": "Fifteen minutes after initiating a unit of packed red blood cells (PRBCs), the client reports sudden chills, fever, dyspnea, and excruciating bilateral flank (low back) pain. Vital signs: BP 86/48 mm Hg, HR 126/min. What is the nurse's immediate priority action?",
    "type": "Priority Action",
    "options": [
      "Stop the blood transfusion immediately, disconnect the blood tubing from the IV catheter hub, and infuse 0.9% normal saline through new IV tubing",
      "Slow the transfusion rate to 20 mL/hr and administer prescribed IV diphenhydramine",
      "Flush the blood tubing forcefully with 50 mL of Dextrose 5% in water (D5W)",
      "Recheck the blood unit identification tags with the client's armband before taking further action"
    ],
    "correctIndex": 0,
    "rationale": "Chills, fever, hypotension, and acute lower back/flank pain indicate an acute hemolytic transfusion reaction (ABO incompatibility leading to intravascular red cell lysis). The transfusion must be STOPPED IMMEDIATELY. The entire blood tubing must be disconnected from the IV catheter hub to prevent residual blood from entering the client, and new IV tubing with 0.9% normal saline must be connected to maintain IV access and treat hypotension.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-55",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Nasogastric (NG) Tube Initial Placement Verification",
    "stem": "The nurse inserts a small-bore nasogastric (NG) feeding tube for an adult client requiring enteral nutrition. Before initiating the first feeding, how must the nurse definitively confirm correct tube placement?",
    "type": "Priority Action",
    "options": [
      "Obtain an abdominal x-ray radiograph to confirm the tube tip terminates in the stomach",
      "Auscultate a whoosh of air over the epigastrium while injecting 30 mL of air through the tube",
      "Check the pH of gastric aspirate using universal litmus paper and confirm pH is between 6.5 and 7.5",
      "Place the external end of the NG tube into a cup of water and observe for absence of bubbling"
    ],
    "correctIndex": 0,
    "rationale": "Radiographic confirmation (X-ray) is the ONLY definitive gold-standard method to verify correct nasogastric feeding tube placement before the initial feeding or medication administration. Auscultation of injected air ('whoosh test') is notoriously unreliable and can sound identical even when the tube is misplaced in the bronchus or pleural space, leading to fatal pulmonary aspiration.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-56",
    "subjectId": "maternal-newborn",
    "subjectName": "Maternal & Newborn Health",
    "title": "Severe Preeclampsia and Magnesium Sulfate Toxicity",
    "stem": "A 34-week primigravida with severe preeclampsia is receiving continuous intravenous magnesium sulfate at 2 g/hr. Upon hourly assessment, the nurse notes: BP 142/90 mm Hg, deep tendon reflexes (patellar) 0 (absent), respiratory rate 9 breaths/min, urine output 18 mL over the past hour. What is the nurse's immediate action?",
    "type": "Priority Action",
    "options": [
      "Stop the magnesium sulfate infusion immediately and prepare to administer intravenous calcium gluconate",
      "Increase the IV maintenance fluid rate to 200 mL/hr to promote magnesium renal excretion",
      "Administer oral labetalol 200 mg to lower systemic blood pressure below 140/90 mm Hg",
      "Document the findings as expected therapeutic sedation from magnesium sulfate therapy"
    ],
    "correctIndex": 0,
    "rationale": "Loss of deep tendon reflexes (areflexia) and respiratory depression (< 12 breaths/min) combined with oliguria (< 30 mL/hr) are cardinal signs of life-threatening magnesium sulfate toxicity. Magnesium is excreted exclusively by the kidneys; oliguria causes rapid toxic accumulation leading to cardiac arrest. The infusion must be STOPPED IMMEDIATELY and the specific antidote, calcium gluconate (1 gram of 10% solution IV push over 3 minutes), must be administered.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-57",
    "subjectId": "maternal-newborn",
    "subjectName": "Maternal & Newborn Health",
    "title": "Postpartum Hemorrhage and Boggy Uterus First Intervention",
    "stem": "One hour after an uncomplicated vaginal delivery of an 8 lb 12 oz infant, the nurse evaluates the postpartum client and discovers the perineal pad is completely saturated with bright red blood and large clots. On palpation, the uterine fundus is soft, boggy, and displaced to the right above the umbilicus. What is the nurse's immediate action?",
    "type": "Priority Action",
    "options": [
      "Perform firm continuous fundal massage while simultaneously assisting the client to empty her bladder",
      "Prepare the client for immediate emergency exploratory laparotomy",
      "Administer intramuscular methylergonovine without checking baseline blood pressure",
      "Pack the vaginal vault tightly with sterile gauze sponges"
    ],
    "correctIndex": 0,
    "rationale": "Uterine atony is the leading cause of early postpartum hemorrhage (PPH). The initial immediate action for a soft, boggy uterus is vigorous fundal massage to stimulate myometrial contractions and compress open placental bed blood vessels. A distended bladder displaces the uterus up and to the right, preventing effective contraction; therefore, the bladder must be emptied (via catheterization if unable to void) immediately following massage.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-58",
    "subjectId": "maternal-newborn",
    "subjectName": "Maternal & Newborn Health",
    "title": "Placenta Previa vs Abruptio Placentae Differential Diagnosis",
    "stem": "A 32-week gestation client presents to labor and delivery with acute vaginal bleeding. The client states, 'I woke up in a puddle of blood, but I have no pain or contractions.' Physical exam reveals a soft, relaxed, non-tender uterus. Which obstetric condition is most consistent with these findings, and what action is contraindicated?",
    "type": "Multiple Choice",
    "options": [
      "Placenta previa; digital vaginal examinations are strictly contraindicated",
      "Abruptio placentae; administration of intravenous tocolytic therapy is contraindicated",
      "Uterine rupture; external electronic fetal monitoring is contraindicated",
      "Normal bloody show; internal spiral electrode placement is indicated"
    ],
    "correctIndex": 0,
    "rationale": "Painless, bright red vaginal bleeding in the second or third trimester with a soft, non-tender uterus is the classic clinical presentation of placenta previa (placenta implanted over or near internal cervical os). Digital vaginal examinations are strictly contraindicated because fingers can tear the low-lying placenta, causing massive catastrophic hemorrhage. Abruptio placentae presents with dark red painful bleeding, uterine tenderness, and board-like rigidity.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-59",
    "subjectId": "maternal-newborn",
    "subjectName": "Maternal & Newborn Health",
    "title": "Fetal Heart Rate Late Decelerations (VEAL CHOP Protocol)",
    "stem": "A laboring client at 39 weeks gestation on IV oxytocin (Pitocin) exhibits repetitive late decelerations on the electronic fetal monitor (decelerations begin after contraction peak and return to baseline after contraction ends). What is the nurse's immediate first step?",
    "type": "Priority Action",
    "options": [
      "Discontinue the IV oxytocin (Pitocin) infusion immediately",
      "Turn the client to her left lateral side, increase IV fluids, and apply high-flow oxygen at 10 L/min via non-rebreather",
      "Perform immediate sterile vaginal exam to assess for umbilical cord prolapse",
      "Prepare for emergency vacuum-assisted delivery at the bedside"
    ],
    "correctIndex": 0,
    "rationale": "Late decelerations indicate uteroplacental insufficiency (compromised fetal oxygenation during contractions). The very FIRST action is to turn off IV oxytocin (Pitocin) to stop uterine contractions and allow placental perfusion. Concurrently, the nurse turns the mother to the left lateral position (relieves vena cava compression), administers an IV fluid bolus, and applies oxygen at 8-10 L/min via non-rebreather mask (intrauterine resuscitation).",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-60",
    "subjectId": "maternal-newborn",
    "subjectName": "Maternal & Newborn Health",
    "title": "Newborn Hypoglycemia Assessment and Nursing Interventions",
    "stem": "A 2-hour-old full-term infant born to a gestational diabetic mother is assessed in the transition nursery. The infant is jittery, irritable, hypothermic (36.2°C), and has a weak high-pitched cry. A point-of-care heel stick reveals blood glucose of 28 mg/dL. What is the nurse's immediate action?",
    "type": "Priority Action",
    "options": [
      "Feed the infant formula or breast milk immediately and re-check blood glucose in 30 to 60 minutes",
      "Place the infant under a radiant warmer and recheck glucose in 4 hours",
      "Administer 50% dextrose (D50W) bolus via peripheral intravenous line",
      "Administer intramuscular glucagon and maintain strict NPO status"
    ],
    "correctIndex": 0,
    "rationale": "In newborns, blood glucose < 40-45 mg/dL defines neonatal hypoglycemia. Infants of diabetic mothers have pancreatic beta-cell hyperplasia and hyperinsulinemia. In symptomatic or asymptomatic hypoglycemia, immediate oral feeding (breast milk or formula) is first-line treatment to provide enterally absorbed carbohydrates. IV 10% dextrose (D10W, never D50W in neonates) is reserved for persistent severe hypoglycemia refractory to feedings or when the infant cannot feed.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-61",
    "subjectId": "mental-health",
    "subjectName": "Mental Health",
    "title": "Schizophrenia Auditory Command Hallucinations Assessment",
    "stem": "A client with paranoid schizophrenia pacing the hallway suddenly stops, covers their ears, and shouts, 'Stop talking to me!' Which communication response by the nurse is the priority?",
    "type": "Priority Action",
    "options": [
      "'I know the voices seem real to you, but what are they telling you to do?' (Assessing command hallucinations)",
      "'Nobody is talking to you; you are alone in the hallway with me.'",
      "'Why are you shouting at people who aren't even here?'",
      "'Go back to your room immediately until the voices go away.'"
    ],
    "correctIndex": 0,
    "rationale": "When a client experiences auditory hallucinations, the nurse's critical priority is to determine whether they are command hallucinations instructing the client to harm themselves or others ('What are the voices telling you to do?'). The nurse validates the client's perception without agreeing that the voices exist ('I know they seem real to you, but I do not hear anything'), provides safety, and initiates protective precautions if command hallucinations are present.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-62",
    "subjectId": "mental-health",
    "subjectName": "Mental Health",
    "title": "Major Depressive Disorder and Suicide Risk Inquiries",
    "stem": "A 24-year-old client admitted with major depressive disorder suddenly appears unusually cheerful, energized, and begins giving away prized personal possessions to other clients on the unit. What is the nurse's priority action?",
    "type": "Priority Action",
    "options": [
      "Directly ask the client: 'Are you having thoughts of killing yourself, and do you have a plan?'",
      "Praise the client for their newfound generosity and positive mood improvement",
      "Document that the client's antidepressant medication has successfully achieved therapeutic efficacy",
      "Encourage the client to join group art therapy to express their cheerful mood"
    ],
    "correctIndex": 0,
    "rationale": "A sudden, unexpected shift from deep depression to calm cheerfulness and giving away possessions is a classic warning sign of impending suicide. The client may have finalized a suicide plan and feels relief that their suffering will soon end. Antidepressants also restore energy before elevating mood, giving clients the physical energy to carry out suicide. The nurse must ask direct, unequivocal questions about suicidal ideation and intent ('Are you thinking of killing yourself? Do you have a plan?').",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-63",
    "subjectId": "mental-health",
    "subjectName": "Mental Health",
    "title": "Bipolar I Disorder Acute Mania Nutritional Care",
    "stem": "A client in the manic phase of bipolar I disorder is pacing the inpatient psychiatric unit, talking constantly at rapid volume, and refuses to sit down for scheduled meals. Which dietary intervention is most appropriate?",
    "type": "Multiple Choice",
    "options": [
      "Provide high-calorie, high-protein finger foods (sandwiches, cheese sticks, fruit slices, nutritional shakes) that can be eaten while pacing",
      "Insist that the client sit at the communal dining table until all meal contents are finished",
      "Initiate total parenteral nutrition (TPN) to maintain caloric intake without struggle",
      "Withhold food until the client demonstrates calm behavior and follows mealtime rules"
    ],
    "correctIndex": 0,
    "rationale": "Clients experiencing acute mania have severe psychomotor agitation, distractibility, and hyperactive energy expenditure, making them unable or unwilling to sit down for meals. They are at high risk for severe dehydration, weight loss, and physical exhaustion. The nurse should provide frequent, nutrient-dense, high-calorie finger foods and portable drinks that the client can eat on the go without sitting down.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-64",
    "subjectId": "mental-health",
    "subjectName": "Mental Health",
    "title": "Alcohol Withdrawal and Delirium Tremens Prevention (CIWA Protocol)",
    "stem": "A client admitted 48 hours ago for trauma has a history of chronic alcohol abuse. The client develops coarse tremors, diaphoresis, tachycardia (HR 120/min), BP 168/102 mm Hg, visual hallucinations of bugs crawling on the wall, and extreme agitation. What medication class is indicated immediately?",
    "type": "Priority Action",
    "options": [
      "Benzodiazepines (such as IV lorazepam or chlordiazepoxide) per CIWA-Ar protocol",
      "Typical antipsychotics (haloperidol) administered as an intramuscular bolus",
      "Selective serotonin reuptake inhibitors (sertraline) administered orally",
      "Disulfiram (Antabuse) administered orally to deter alcohol craving"
    ],
    "correctIndex": 0,
    "rationale": "Delirium tremens (DTs) is a medical emergency that occurs 48 to 72 hours after alcohol cessation. It is characterized by severe autonomic hyperactivity (hypertension, tachycardia), visual or tactile hallucinations, tremors, and generalized tonic-clonic seizures. Benzodiazepines (lorazepam, diazepam, chlordiazepoxide) are the gold standard for alcohol withdrawal; they enhance GABA transmission to prevent seizures, calm psychomotor agitation, and normalize vital signs.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-65",
    "subjectId": "mental-health",
    "subjectName": "Mental Health",
    "title": "Neuroleptic Malignant Syndrome (NMS) Emergency Recognition",
    "stem": "A client receiving high-potency typical antipsychotic therapy (haloperidol) develops sudden high fever of 40.1°C (104.2°F), severe generalized 'lead-pipe' muscle rigidity, altered level of consciousness, labile blood pressure, and diaphoresis. Lab reveals elevated serum creatine kinase (CK 18,000 U/L). What is the nurse's immediate priority?",
    "type": "Priority Action",
    "options": [
      "Stop haloperidol immediately, notify the provider, and initiate supportive care and cooling (suspected Neuroleptic Malignant Syndrome)",
      "Administer oral benztropine (Cogentin) for acute extrapyramidal dystonia",
      "Administer an additional dose of haloperidol to control worsening agitation",
      "Recheck vital signs in 4 hours and document extrapyramidal side effects"
    ],
    "correctIndex": 0,
    "rationale": "Neuroleptic Malignant Syndrome (NMS) is a life-threatening idiosyncratic reaction to dopamine receptor antagonists (antipsychotics). Cardinal features include hyperthermia (fever > 38-40°C), severe 'lead-pipe' rigidity, autonomic instability (tachycardia, diaphoresis, labile BP), and rhabdomyolysis (elevated creatine kinase). Immediate treatment includes discontinuing the offending antipsychotic, emergency hydration, cooling, and administering dopamine agonists (bromocriptine) or muscle relaxants (dantrolene).",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-66",
    "subjectId": "management-of-care",
    "subjectName": "Management of Care",
    "title": "Prioritization Framework: Airway, Breathing, and Post-Surgical Complications",
    "stem": "The medical-surgical nurse receives report on four clients at the change of shift. Which client should the nurse assess first?",
    "type": "Priority Action",
    "options": [
      "A client who underwent subtotal thyroidectomy 4 hours ago and is developing high-pitched inspiratory stridor",
      "A client with diabetes mellitus whose morning fingerstick blood glucose is 210 mg/dL",
      "A client who underwent knee arthroplasty yesterday requesting pain medication for surgical site discomfort rated 6/10",
      "A client with chronic heart failure who gained 1 lb overnight and has trace ankle edema"
    ],
    "correctIndex": 0,
    "rationale": "Inspiratory stridor following thyroidectomy indicates acute laryngeal edema, compression of the trachea from an expanding neck hematoma, or bilateral recurrent laryngeal nerve damage. This is an acute airway emergency that can progress to complete suffocation within minutes. The nurse must assess the client first, summon the surgeon, and prepare for emergency tracheostomy or suture removal at the bedside.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-67",
    "subjectId": "management-of-care",
    "subjectName": "Management of Care",
    "title": "Scope of Practice: Delegation to Licensed Practical/Vocational Nurse (LPN/LVN)",
    "stem": "Which task is most appropriate for the registered nurse (RN) to delegate to an experienced licensed practical nurse (LPN/LVN)?",
    "type": "Multiple Choice",
    "options": [
      "Administering subcutaneous insulin glargine to a stable client with established diabetes",
      "Performing the initial admission assessment and formulating the nursing care plan",
      "Providing discharge education to a client newly prescribed warfarin therapy",
      "Administering intravenous push bolus of furosemide 40 mg to an unstable client"
    ],
    "correctIndex": 0,
    "rationale": "LPN/LVN scope of practice includes caring for stable clients with predictable outcomes, administering routine oral and subcutaneous medications, performing sterile dressing changes, inserting Foley catheters, and monitoring ongoing findings. The registered nurse (RN) CANNOT delegate initial assessment, clinical judgment, nursing diagnosis, care planning, evaluation, client discharge teaching, or complex intravenous push medications.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-68",
    "subjectId": "management-of-care",
    "subjectName": "Management of Care",
    "title": "Scope of Practice: Delegation to Unlicensed Assistive Personnel (UAP/CNA)",
    "stem": "The registered nurse is delegating care tasks on a busy medical floor. Which assignment is safe and appropriate to delegate to an unlicensed assistive personnel (UAP)?",
    "type": "Multiple Choice",
    "options": [
      "Assisting an alert, stable client who is 2 days post-cholecystectomy to ambulate in the hallway",
      "Assessing the skin under a client's cervical collar for pressure ulcer formation",
      "Teaching a client with asthma how to use a metered-dose inhaler with a spacer",
      "Evaluating a client's response to oral hydromorphone administered 1 hour ago"
    ],
    "correctIndex": 0,
    "rationale": "Unlicensed Assistive Personnel (UAP) can perform standard tasks on stable clients that do not require nursing judgment or assessment (e.g., ADLs, bathing, feeding stable clients, ambulation, vital signs, measuring input and output, repositioning). Tasks involving assessment (evaluating skin under collar), teaching (inhaler use), evaluation (pain response), or medication administration can NEVER be delegated to UAPs.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-69",
    "subjectId": "management-of-care",
    "subjectName": "Management of Care",
    "title": "Disaster Triage: START Protocol Color Tagging",
    "stem": "The triage nurse at a mass casualty industrial explosion assesses a victim with a partial amputation of the lower leg who is bleeding heavily, tachypneic at 36 breaths/min, and has a capillary refill time of 4 seconds. Which triage tag color should the nurse apply?",
    "type": "Priority Action",
    "options": [
      "Red tag (Immediate: life-threatening injury with high probability of survival once treated)",
      "Yellow tag (Delayed: serious injury that can wait 1 to 2 hours without imminent loss of life)",
      "Green tag (Minimal: 'walking wounded' with minor abrasions and sprains)",
      "Black tag (Expectant: deceased or injuries so catastrophic that survival is impossible)"
    ],
    "correctIndex": 0,
    "rationale": "Under the Simple Triage and Rapid Treatment (START) disaster triage protocol: Red Tag (Immediate) is assigned to victims with life-threatening airway, breathing, or circulation compromise who have a high likelihood of survival with immediate intervention (respiratory rate > 30, capillary refill > 2 seconds, inability to follow simple commands). Yellow is delayed, Green is walking wounded, and Black is expectant/deceased.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-70",
    "subjectId": "management-of-care",
    "subjectName": "Management of Care",
    "title": "Informed Consent: Surgeon vs Nurse Responsibilities",
    "stem": "The nurse brings a surgical consent form to a client scheduled for a laparoscopic cholecystectomy. The client asks, 'The doctor told me what will happen, but what are the risks if my gallbladder tears during surgery?' What is the nurse's best action?",
    "type": "Multiple Choice",
    "options": [
      "Withhold client signature and notify the operating surgeon to return and answer the client's questions",
      "Explain the potential surgical risks and complications in detail to the client",
      "Instruct the client to sign the form now and ask the surgeon in the operating room",
      "Cross out the risk section on the consent form and have the client sign"
    ],
    "correctIndex": 0,
    "rationale": "The healthcare provider/surgeon who performs the procedure is legally responsible for explaining the diagnosis, purpose, nature, risks, benefits, and alternatives of the procedure (Informed Consent). The nurse's role is strictly limited to witnessing the client's voluntary signature, verifying client competence, and confirming that consent was given. If the client has questions about surgical risks, the nurse must contact the surgeon to provide clarification before signing.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-71",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #71",
    "stem": "[Item #71] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-72",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #72",
    "stem": "[Item #72] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-73",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #73",
    "stem": "[Item #73] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-74",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #74",
    "stem": "[Item #74] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-75",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #75",
    "stem": "[Item #75] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-76",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #76",
    "stem": "[Item #76] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-77",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #77",
    "stem": "[Item #77] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-78",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #78",
    "stem": "[Item #78] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-79",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #79",
    "stem": "[Item #79] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-80",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #80",
    "stem": "[Item #80] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-81",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #81",
    "stem": "[Item #81] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-82",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #82",
    "stem": "[Item #82] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-83",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #83",
    "stem": "[Item #83] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-84",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #84",
    "stem": "[Item #84] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-85",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #85",
    "stem": "[Item #85] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-86",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #86",
    "stem": "[Item #86] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-87",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #87",
    "stem": "[Item #87] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-88",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #88",
    "stem": "[Item #88] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-89",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #89",
    "stem": "[Item #89] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-90",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #90",
    "stem": "[Item #90] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-91",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #91",
    "stem": "[Item #91] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-92",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #92",
    "stem": "[Item #92] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-93",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #93",
    "stem": "[Item #93] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-94",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #94",
    "stem": "[Item #94] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-95",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #95",
    "stem": "[Item #95] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-96",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #96",
    "stem": "[Item #96] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-97",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #97",
    "stem": "[Item #97] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-98",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #98",
    "stem": "[Item #98] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-99",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #99",
    "stem": "[Item #99] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-100",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #100",
    "stem": "[Item #100] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-101",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #101",
    "stem": "[Item #101] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-102",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #102",
    "stem": "[Item #102] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-103",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #103",
    "stem": "[Item #103] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-104",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #104",
    "stem": "[Item #104] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-105",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #105",
    "stem": "[Item #105] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-106",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #106",
    "stem": "[Item #106] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-107",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #107",
    "stem": "[Item #107] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-108",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #108",
    "stem": "[Item #108] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-109",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #109",
    "stem": "[Item #109] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-110",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #110",
    "stem": "[Item #110] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-111",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #111",
    "stem": "[Item #111] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-112",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #112",
    "stem": "[Item #112] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-113",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #113",
    "stem": "[Item #113] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-114",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #114",
    "stem": "[Item #114] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-115",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #115",
    "stem": "[Item #115] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-116",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #116",
    "stem": "[Item #116] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-117",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #117",
    "stem": "[Item #117] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-118",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #118",
    "stem": "[Item #118] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-119",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #119",
    "stem": "[Item #119] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-120",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #120",
    "stem": "[Item #120] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-121",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #121",
    "stem": "[Item #121] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-122",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #122",
    "stem": "[Item #122] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-123",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #123",
    "stem": "[Item #123] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-124",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #124",
    "stem": "[Item #124] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-125",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #125",
    "stem": "[Item #125] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-126",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #126",
    "stem": "[Item #126] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-127",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #127",
    "stem": "[Item #127] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-128",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #128",
    "stem": "[Item #128] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-129",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #129",
    "stem": "[Item #129] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-130",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #130",
    "stem": "[Item #130] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-131",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #131",
    "stem": "[Item #131] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-132",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #132",
    "stem": "[Item #132] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-133",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #133",
    "stem": "[Item #133] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-134",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #134",
    "stem": "[Item #134] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-135",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #135",
    "stem": "[Item #135] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-136",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #136",
    "stem": "[Item #136] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-137",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #137",
    "stem": "[Item #137] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-138",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #138",
    "stem": "[Item #138] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-139",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #139",
    "stem": "[Item #139] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-140",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #140",
    "stem": "[Item #140] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-141",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #141",
    "stem": "[Item #141] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-142",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #142",
    "stem": "[Item #142] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-143",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #143",
    "stem": "[Item #143] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-144",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #144",
    "stem": "[Item #144] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-145",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #145",
    "stem": "[Item #145] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-146",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Atrial Fibrillation Cardioversion & Anticoagulation #146",
    "stem": "[Item #146] In a clinical evaluation: A client with chronic atrial fibrillation is scheduled for elective synchronized cardioversion. Which intervention must be confirmed before proceeding?",
    "type": "Multiple Choice",
    "options": [
      "Transesophageal echocardiogram (TEE) to rule out left atrial mural thrombus",
      "Discontinue all anticoagulants 7 days in advance",
      "Administer high-dose atropine IV push",
      "Ensure defibrillator is set to asynchronous defibrillation mode"
    ],
    "correctIndex": 0,
    "rationale": "Elective cardioversion of atrial fibrillation (> 48h) carries high risk of dislodging atrial thrombi into systemic circulation, causing stroke. A TEE or 3-4 weeks of therapeutic anticoagulation is mandatory before cardioversion.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-147",
    "subjectId": "adult-health",
    "subjectName": "Adult Health",
    "title": "Chest Tube Subcutaneous Emphysema Inspection #147",
    "stem": "[Item #147] In a clinical evaluation: The nurse palpates crackling, rice-krispie sensations under the skin around a client's chest tube insertion site. How should the nurse document and manage this finding?",
    "type": "Multiple Choice",
    "options": [
      "Document subcutaneous emphysema; mark the boundary with a surgical marker and monitor closely",
      "Immediately pull the chest tube out 2 inches",
      "Clamp the chest tube firmly with hemostats",
      "Irrigate the chest tube with 50 mL sterile saline"
    ],
    "correctIndex": 0,
    "rationale": "Subcutaneous emphysema occurs when air leaks into dermal tissue. Marking the margins allows monitoring for expansion. Rapid expansion toward the neck warrants immediate physician notification.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-148",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Blood Transfusion Rate and Timing Limit #148",
    "stem": "[Item #148] In a clinical evaluation: A unit of packed red blood cells (PRBCs) is retrieved from the blood bank at 1000. By what time must the transfusion be completed?",
    "type": "Multiple Choice",
    "options": [
      "No later than 1400 (maximum 4 hours from release)",
      "Within 1 hour of infusion start",
      "Within 6 hours of blood bank release",
      "Within 8 hours if infused through a central line"
    ],
    "correctIndex": 0,
    "rationale": "Blood products must be initiated within 30 minutes of leaving blood bank refrigeration and completed within 4 hours to minimize bacterial proliferation.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-149",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "PICC Line Central Line Dressing Change Technique #149",
    "stem": "[Item #149] In a clinical evaluation: The nurse prepares to perform a sterile dressing change on a client's peripherally inserted central catheter (PICC). Which technique is required?",
    "type": "Multiple Choice",
    "options": [
      "Cleanse site with chlorhexidine back-and-forth friction for 30 seconds and allow to air dry completely",
      "Wipe with alcohol in circular motions from outside inward toward the insertion hole",
      "Apply antibiotic ointment directly over the puncture site before applying gauze",
      "Blow gently on the chlorhexidine to accelerate drying before placing transparent dressing"
    ],
    "correctIndex": 0,
    "rationale": "Chlorhexidine with back-and-forth friction penetrates skin layers. It must air dry completely (at least 2 minutes) to achieve full antimicrobial efficacy. Never fan or blow.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  },
  {
    "id": "sq-150",
    "subjectId": "fundamentals",
    "subjectName": "Fundamentals",
    "title": "Foley Catheter CAUTI Prevention Protocol #150",
    "stem": "[Item #150] In a clinical evaluation: Which nursing action reduces the risk of catheter-associated urinary tract infections (CAUTI)?",
    "type": "Multiple Choice",
    "options": [
      "Maintain the drainage bag below the level of the bladder at all times without touching the floor",
      "Routinely disconnect the catheter from tubing to irrigate with normal saline daily",
      "Empty the drainage bag only once every 24 hours to minimize contamination",
      "Hang the drainage collection bag onto the movable side rail"
    ],
    "correctIndex": 0,
    "rationale": "Keeping the collection bag below the bladder prevents retrograde urine reflux. Catheter tubing should never hang on side rails or touch the floor.",
    "status": "Published",
    "createdAt": "2026-11-20",
    "updatedAt": "Today",
    "author": "Dr. Emily Wilson, DNP",
    "isPaid": true,
    "locked": false,
    "answered": false
  }
];

const STORAGE_KEY = "nclex_standalone_questions_v1";
export const STANDALONE_UPDATED_EVENT = "standalone-questions-updated";
const BROADCAST_CHANNEL_NAME = "nclex_standalone_sync_channel";

function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      return new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    } catch {}
  }
  return null;
}

function notifySubscribers(questions: StoredStandaloneQuestion[]) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(STANDALONE_UPDATED_EVENT, { detail: questions }));
  } catch {}

  const channel = getBroadcastChannel();
  if (channel) {
    try {
      channel.postMessage({ type: "SYNC_QUESTIONS", questions });
      channel.close();
    } catch {}
  }
}

export function subscribeToStandaloneQuestions(callback: (questions: StoredStandaloneQuestion[]) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<StoredStandaloneQuestion[]>;
    if (customEvent.detail && Array.isArray(customEvent.detail)) {
      callback(customEvent.detail);
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (Array.isArray(parsed)) {
          callback(parsed);
        }
      } catch {}
    }
  };

  let channel: BroadcastChannel | null = null;
  try {
    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data && event.data.type === "SYNC_QUESTIONS" && Array.isArray(event.data.questions)) {
          callback(event.data.questions);
        }
      };
    }
  } catch {}

  window.addEventListener(STANDALONE_UPDATED_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(STANDALONE_UPDATED_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
    if (channel) {
      try {
        channel.close();
      } catch {}
    }
  };
}

export function getStoredStandaloneQuestions(): StoredStandaloneQuestion[] {
  if (typeof window === "undefined") {
    return DEFAULT_STANDALONE_QUESTIONS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STANDALONE_QUESTIONS));
      return DEFAULT_STANDALONE_QUESTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 5) {
      // If store has fewer than 150 questions, merge to guarantee full 150 items
      if (parsed.length < 50) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STANDALONE_QUESTIONS));
        return DEFAULT_STANDALONE_QUESTIONS;
      }
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STANDALONE_QUESTIONS));
    return DEFAULT_STANDALONE_QUESTIONS;
  } catch (err) {
    console.error("Failed to read standalone questions from localStorage:", err);
    return DEFAULT_STANDALONE_QUESTIONS;
  }
}

export function getOrGenerateTestQuestions(
  requestedCount: number,
  pool?: StoredStandaloneQuestion[]
): StoredStandaloneQuestion[] {
  const basePool = (pool && pool.length > 0) ? pool : getStoredStandaloneQuestions();
  const count = Math.max(1, Math.min(150, requestedCount));
  
  if (basePool.length >= count) {
    // Shuffle and pick exact count
    const shuffled = [...basePool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = shuffled[i];
      if (tmp && shuffled[j]) {
        shuffled[i] = shuffled[j]!;
        shuffled[j] = tmp;
      }
    }
    return shuffled.slice(0, count);
  }

  // If basePool is smaller, repeat/supplement from DEFAULT_STANDALONE_QUESTIONS to guarantee exact count
  const result: StoredStandaloneQuestion[] = [...basePool];
  let cycle = 0;
  while (result.length < count) {
    const template = DEFAULT_STANDALONE_QUESTIONS[cycle % DEFAULT_STANDALONE_QUESTIONS.length];
    if (template) {
      result.push({
        ...template,
        id: `sq-test-${result.length + 1}-${Date.now()}`,
        title: `${template.title} (Practice Item #${result.length + 1})`
      });
    }
    cycle++;
  }
  return result.slice(0, count);
}

export function saveStoredStandaloneQuestion(question: StoredStandaloneQuestion): StoredStandaloneQuestion[] {
  if (typeof window === "undefined") return DEFAULT_STANDALONE_QUESTIONS;
  try {
    const current = getStoredStandaloneQuestions();
    const existingIndex = current.findIndex((q) => q.id === question.id);
    let updated: StoredStandaloneQuestion[];

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = {
        ...question,
        updatedAt: "Just now"
      };
    } else {
      updated = [
        {
          ...question,
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: "Just now"
        },
        ...current
      ];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers(updated);
    return updated;
  } catch (err) {
    console.error("Failed to save standalone question:", err);
    return getStoredStandaloneQuestions();
  }
}

export function deleteStoredStandaloneQuestion(id: string): StoredStandaloneQuestion[] {
  if (typeof window === "undefined") return DEFAULT_STANDALONE_QUESTIONS;
  try {
    const current = getStoredStandaloneQuestions();
    const filtered = current.filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    notifySubscribers(filtered);
    return filtered;
  } catch (err) {
    console.error("Failed to delete standalone question:", err);
    return getStoredStandaloneQuestions();
  }
}

export function resetStoredStandaloneQuestions(): StoredStandaloneQuestion[] {
  if (typeof window === "undefined") return DEFAULT_STANDALONE_QUESTIONS;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STANDALONE_QUESTIONS));
    notifySubscribers(DEFAULT_STANDALONE_QUESTIONS);
    return DEFAULT_STANDALONE_QUESTIONS;
  } catch (err) {
    console.error("Failed to reset standalone questions:", err);
    return DEFAULT_STANDALONE_QUESTIONS;
  }
}
