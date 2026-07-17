import { SKILLS_DICTIONARY, STOPWORDS } from '../data/dictionaries';
import { MOCK_DATA } from '../data/mockTemplates';

export interface AnalysisResult {
  score: number;
  formattingScore: number;
  missingKeywords: { text: string; type: string }[];
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedIn: boolean;
  sectionsFound: string[];
  formattingIssues: { issue: string; severity: 'error' | 'warning'; fix: string }[];
  bullets: { id: number; original: string; tailored: string; reason: string }[];
  isSingleColumn: boolean;
  hasStandardHeaders: boolean;
  hasConsistentDates: boolean;
  noGraphicsOrCharts: boolean;
  isInferred: boolean;
  inferredTitle: string | null;
}

export const extractSkills = (text: string): string[] => {
  try {
    const cleanedText = ` ${text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\n\r]/g, " ")} `;
    return SKILLS_DICTIONARY.filter(skill => {
      const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`[\\s\\-\\(\\)]${escapedSkill}[\\s\\-\\(\\),;\\.]`, 'i');
      return regex.test(cleanedText);
    });
  } catch (e) {
    console.error('Error in extractSkills:', e);
    return [];
  }
};

export const computeWordOverlap = (jobText: string, resumeText: string): number => {
  try {
    const getWords = (text: string) => {
      const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3 && !STOPWORDS.has(w));
      return new Set(words);
    };

    const jobWords = getWords(jobText);
    const resumeWords = getWords(resumeText);

    if (jobWords.size === 0) return 0;

    let intersectionSize = 0;
    jobWords.forEach(word => {
      if (resumeWords.has(word)) {
        intersectionSize++;
      }
    });

    return Math.round((intersectionSize / jobWords.size) * 100);
  } catch (e) {
    console.error('Error in computeWordOverlap:', e);
    return 0;
  }
};

export const runLocalFallbackMatching = (jobDescription: string, resumeContent: string): AnalysisResult => {
  const hasEmailLocal = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(resumeContent);
  const hasPhoneLocal = /[\d\-()\+\s]{7,15}/.test(resumeContent);
  const hasLinkedInLocal = /(linkedin\.com|github\.com)/i.test(resumeContent);
  
  const sectionsLocal: string[] = [];
  const resLower = resumeContent.toLowerCase();
  if (/\b(experience|history|employment|work)\b/i.test(resLower)) sectionsLocal.push("experience");
  if (/\b(education|university|college|degree)\b/i.test(resLower)) sectionsLocal.push("education");
  if (/\b(skills|technologies|tools|languages)\b/i.test(resLower)) sectionsLocal.push("skills");
  if (/\b(summary|profile|about)\b/i.test(resLower)) sectionsLocal.push("summary");
  if (/\b(projects|portfolio)\b/i.test(resLower)) sectionsLocal.push("projects");
  if (/\b(certifications|certificates|awards)\b/i.test(resLower)) sectionsLocal.push("certifications");

  const wordCount = resumeContent.trim().split(/\s+/).filter(Boolean).length;
  const isNotResumeLocal = (wordCount < 10) || (!hasEmailLocal && !hasPhoneLocal && sectionsLocal.length === 0);

  const issuesLocal: {issue: string, severity: 'error' | 'warning', fix: string}[] = [];
  let fmtScoreLocal = 100;

  let isSingleColumnLocal = true;
  let hasStandardHeadersLocal = sectionsLocal.includes("experience") && sectionsLocal.includes("education") && sectionsLocal.includes("skills");
  
  const dateRegex = /\b(\d{1,2}\/\d{2,4}|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}|present|current)\b/i;
  let hasConsistentDatesLocal = dateRegex.test(resumeContent);
  
  const hasGraphicsLocal = /(%|[\u2580-\u259F]{3,}|progress|stars|level)/i.test(resumeContent) && /skills/i.test(resumeContent);
  let noGraphicsOrChartsLocal = !hasGraphicsLocal;

  if (isNotResumeLocal) {
    fmtScoreLocal = 0;
    isSingleColumnLocal = false;
    hasStandardHeadersLocal = false;
    hasConsistentDatesLocal = false;
    noGraphicsOrChartsLocal = false;
    issuesLocal.push({
      issue: "Invalid Resume Document",
      severity: "error",
      fix: "The uploaded file does not appear to be a valid resume. Please upload a document that contains your contact information and sections such as Work Experience, Education, or Skills."
    });
  } else {
    if (!hasEmailLocal) {
      issuesLocal.push({
        issue: "Missing Contact Email",
        severity: "error",
        fix: "Add a professional email address (e.g., name@email.com) in the header of your resume."
      });
      fmtScoreLocal -= 15;
    }
    if (!hasPhoneLocal) {
      issuesLocal.push({
        issue: "Missing Phone Number",
        severity: "error",
        fix: "Include a valid contact phone number so recruiters can easily contact you for interviews."
      });
      fmtScoreLocal -= 15;
    }
    if (!hasLinkedInLocal) {
      issuesLocal.push({
        issue: "Missing Professional Profile Link",
        severity: "warning",
        fix: "Add your LinkedIn URL or online portfolio link to provide recruiters with more background."
      });
      fmtScoreLocal -= 10;
    }

    if (!sectionsLocal.includes("experience")) {
      issuesLocal.push({
        issue: "Work Experience Section Missing",
        severity: "error",
        fix: "Create a distinct 'Work Experience' section with standard headers to list your employment history."
      });
      fmtScoreLocal -= 20;
    }
    if (!sectionsLocal.includes("education")) {
      issuesLocal.push({
        issue: "Education Section Missing",
        severity: "error",
        fix: "Add an 'Education' section detailing your degrees, school names, and graduation years."
      });
      fmtScoreLocal -= 15;
    }
    if (!sectionsLocal.includes("skills")) {
      issuesLocal.push({
        issue: "Skills Section Missing",
        severity: "warning",
        fix: "Incorporate a dedicated 'Skills' or 'Core Competencies' section to match resume keywords."
      });
      fmtScoreLocal -= 10;
    }

    if (wordCount < 100 && resumeContent.trim().length > 0) {
      issuesLocal.push({
        issue: "Resume content is too brief",
        severity: "error",
        fix: "Expand your resume bullet points. Provide detailed achievements, duties, and tools for each role."
      });
      fmtScoreLocal -= 15;
    } else if (wordCount > 1500) {
      issuesLocal.push({
        issue: "Resume exceeds typical page count",
        severity: "warning",
        fix: "Your resume is very long. Consider condensing it to under 1000 words (approx 2 pages) for brevity."
      });
      fmtScoreLocal -= 10;
    }

    fmtScoreLocal = Math.max(10, fmtScoreLocal);
  }

  const isJobTitleInput = jobDescription.trim().split(/\s+/).length < 12;
  let matchedFallbackKey: keyof typeof MOCK_DATA | null = null;
  let isInferred = false;
  let inferredTitle: string | null = null;
  
  if (isJobTitleInput) {
    const jdLower = jobDescription.toLowerCase();
    if (/(developer|coder|programmer|software|react|next\.js|frontend|backend|fullstack|devops|web\s+developer|software\s+engineer|web\s+engineer|systems\s+engineer)/i.test(jdLower)) {
      matchedFallbackKey = 'tech';
    } else if (/(marketing|growth|seo|sales|ads|social|media|campaign)/i.test(jdLower)) {
      matchedFallbackKey = 'marketing';
    } else if (/(manager|pm|scrum|agile|product|project|coordinator|lead|leadership|operations)/i.test(jdLower)) {
      matchedFallbackKey = 'management';
    } else if (/(nurse|rn|clinical|medical|healthcare|patient|triage|hospital)/i.test(jdLower)) {
      matchedFallbackKey = 'healthcare';
    }
  }

  let finalScore = 0;
  let missing: {text: string, type: string}[] = [];
  let generatedBullets: any[] = [];

  if (isNotResumeLocal) {
    finalScore = 0;
    missing = [];
    generatedBullets = [];
  } else if (isJobTitleInput && !matchedFallbackKey) {
    finalScore = 0;
    missing = [];
    generatedBullets = [];
  } else {
    const targetJD = matchedFallbackKey ? MOCK_DATA[matchedFallbackKey].jobDescription : jobDescription;
    const jobSkills = extractSkills(targetJD);
    const resumeSkills = extractSkills(resumeContent);
    const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));
    missing = missingSkills.map(term => ({
      text: term.charAt(0).toUpperCase() + term.slice(1),
      type: 'hard'
    }));
    
    if (jobSkills.length > 0) {
      const matchedCount = jobSkills.length - missingSkills.length;
      if (matchedCount === 0) {
        finalScore = 0;
      } else {
        finalScore = Math.round((matchedCount / jobSkills.length) * 100);
        if (finalScore < 40 && computeWordOverlap(targetJD, resumeContent) > 20) {
          finalScore = Math.min(85, finalScore + 25);
        }
      }
    } else {
      const rawOverlap = computeWordOverlap(targetJD, resumeContent);
      if (rawOverlap < 12) {
        finalScore = 0;
      } else {
        finalScore = Math.min(90, Math.max(0, rawOverlap));
      }
    }

    finalScore = Math.max(0, Math.min(100, finalScore));

    const matchedTemplate = Object.values(MOCK_DATA).find(
      template => 
        jobDescription.toLowerCase().includes(template.bullets[0].original.split(' ')[0].toLowerCase()) ||
        resumeContent.toLowerCase().includes(template.bullets[0].original.split(' ')[0].toLowerCase())
    );

    if (matchedTemplate) {
      generatedBullets = matchedTemplate.bullets;
    } else if (matchedFallbackKey) {
      generatedBullets = MOCK_DATA[matchedFallbackKey].bullets;
      isInferred = true;
      inferredTitle = MOCK_DATA[matchedFallbackKey].name;
    } else {
      const missingTextList = missingSkills.map(m => m.toUpperCase());
      generatedBullets = [
        {
          id: 1,
          original: 'Responsible for general day-to-day operations and team support.',
          tailored: `Led cross-functional collaborations and injected ${missingTextList[0] || 'core requirements'} into daily operations to drive project deliveries.`,
          reason: `Directly targets key role expectations and incorporates your missing skill (${missingSkills[0] || 'job requirements'}).`
        },
        {
          id: 2,
          original: 'Worked on projects and helped complete tasks on schedule.',
          tailored: `Managed task lifecycles using ${missingSkills[1] || 'structured workflows'}, delivering key project milestones 15% faster than average.`,
          reason: `Replaces passive verbs with active outcomes and highlights the missing keyword (${missingSkills[1] || 'methodologies'}).`
        }
      ];

      if (missingSkills.length === 0) {
        generatedBullets = [
          {
            id: 1,
            original: 'Helped resolve client tickets and worked on issues.',
            tailored: 'Troubleshot and resolved 40+ technical inquiries weekly, increasing user satisfaction ratings by 12%.',
            reason: 'Adds measurable performance indicators and strong operational verbs.'
          }
        ];
      }
    }
  }

  return {
    score: finalScore,
    formattingScore: fmtScoreLocal,
    missingKeywords: missing,
    hasEmail: hasEmailLocal,
    hasPhone: hasPhoneLocal,
    hasLinkedIn: hasLinkedInLocal,
    sectionsFound: sectionsLocal,
    formattingIssues: issuesLocal,
    bullets: generatedBullets,
    isSingleColumn: isSingleColumnLocal,
    hasStandardHeaders: hasStandardHeadersLocal,
    hasConsistentDates: hasConsistentDatesLocal,
    noGraphicsOrCharts: noGraphicsOrChartsLocal,
    isInferred,
    inferredTitle
  };
};
