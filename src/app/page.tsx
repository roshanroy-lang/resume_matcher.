'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  RefreshCw, 
  Briefcase, 
  Code,
  FileCheck2,
  Plus,
  Mail,
  Phone,
  Link2,
  AlertTriangle,
  X,
  ListChecks
} from 'lucide-react';

// Predefined dictionary of key skills across multiple domains for dynamic extraction
const SKILLS_DICTIONARY = [
  // Tech / Software
  'react', 'next.js', 'nextjs', 'typescript', 'tailwind', 'graphql', 'restful api', 'restful apis', 'rest api', 'rest apis', 'docker', 'ci/cd', 'git', 'javascript', 'html', 'css', 'node.js', 'nodejs', 'python', 'java', 'sql', 'cloud', 'aws', 'kubernetes', 'c++', 'ruby', 'php', 'golang', 'frontend', 'backend', 'fullstack', 'database', 'mongodb', 'postgresql', 'software engineering', 'responsive design',
  // Marketing & Sales
  'seo', 'google ads', 'meta ads', 'email marketing', 'campaign', 'hubspot', 'salesforce', 'analytics', 'copywriting', 'content strategy', 'social media', 'growth hacking', 'user acquisition', 'b2b', 'lead generation', 'marketing strategy',
  // Project Management & Business
  'agile', 'scrum', 'csm', 'jira', 'confluence', 'risk management', 'budget oversight', 'stakeholder management', 'sprint planning', 'leadership', 'operations', 'project management', 'product management', 'business analysis',
  // Healthcare & Medicine
  'registered nurse', 'rn', 'patient assessment', 'triage care', 'emr', 'emr documentation', 'hipaa', 'cpr', 'bls', 'iv therapy', 'clinical', 'medication administration', 'crisis management', 'patient advocacy', 'healthcare', 'emergency department',
  // General & Soft Skills
  'communication', 'collaboration', 'problem solving', 'teamwork', 'critical thinking', 'time management', 'project coordination', 'risk assessment'
];

// Stopwords for generic text matching fallback
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
  'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here',
  'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'im', 'ive', 'if', 'in', 'into',
  'is', 'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that',
  'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd',
  'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres',
  'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd',
  'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves'
]);

// Multi-Industry Template Data (used as fallbacks/templates)
const MOCK_DATA = {
  tech: {
    name: "Technology & Software Engineering",
    jobDescription: `We are looking for a Senior Frontend Engineer with 4+ years of experience building scalable web applications. 

Required Skills:
- Strong experience with React, Next.js, and TypeScript
- Expertise in Tailwind CSS and responsive design
- Experience implementing CI/CD pipelines and Docker
- Knowledge of GraphQL and RESTful APIs
- Strong collaboration and communication skills`,
    resumeContent: `John Doe - Frontend Developer
Experience:
- Built web pages using React and CSS.
- Maintained web applications and worked with APIs.
- Collaborated with QA team to fix bugs.

Skills: React, JavaScript, HTML, CSS, Git.`,
    bullets: [
      {
        id: 1,
        original: 'Built web pages using React and CSS.',
        tailored: 'Architected and built 15+ responsive web pages using React, Next.js, and Tailwind CSS, increasing page load speed by 35%.',
        reason: 'Highlights experience with requested framework (Next.js) and styling tool (Tailwind CSS) while adding quantifiable metrics.'
      },
      {
        id: 2,
        original: 'Maintained web applications and worked with APIs.',
        tailored: 'Integrated complex RESTful and GraphQL APIs with robust error-handling, reducing application runtime exceptions by 18%.',
        reason: 'Addresses the specific requirement for RESTful APIs and GraphQL expertise.'
      },
      {
        id: 3,
        original: 'Collaborated with QA team to fix bugs.',
        tailored: 'Collaborated across cross-functional engineering and QA teams, establishing CI/CD pipeline automation and Docker deployments to streamline release cycles.',
        reason: 'Demonstrates communication, CI/CD experience, and Docker usage as requested.'
      }
    ]
  },
  marketing: {
    name: "Marketing & Growth Sales",
    jobDescription: `We are looking for a Growth Marketing Manager to lead our digital user acquisition campaigns.

Required Skills:
- Experience planning and executing paid campaigns (Google Ads, Meta Ads)
- Strong SEO search optimization and Content Strategy skills
- Ability to track campaigns using Google Analytics (GA4)
- Knowledge of CRM tools like HubSpot or Salesforce
- Data-driven mindset and strong copywriting skills`,
    resumeContent: `Jane Smith - Digital Marketer
Experience:
- Ran email marketing campaigns.
- Wrote blog posts and managed social media.
- Analyzed website traffic data.

Skills: Marketing, Content Writing, SEO, Excel, Social Media.`,
    bullets: [
      {
        id: 1,
        original: 'Ran email marketing campaigns.',
        tailored: 'Designed and executed multi-channel email campaigns for 10k+ subscribers, increasing click-through rates by 18% and generating $12K in revenue.',
        reason: 'Adds direct metrics and demonstrates revenue impact which Google Ads managers look for.'
      },
      {
        id: 2,
        original: 'Wrote blog posts and managed social media.',
        tailored: 'Authored 15+ SEO-optimized blog articles and planned content strategy, boosting organic search traffic by 34% in 6 months.',
        reason: 'Validates requested skills in SEO and content strategy with clear metrics.'
      },
      {
        id: 3,
        original: 'Analyzed website traffic data.',
        tailored: 'Leveraged Google Analytics (GA4) and CRM dashboards to analyze campaign performance, cutting client acquisition costs by 15%.',
        reason: 'Directly targets Google Analytics and CRM tools requirement.'
      }
    ]
  },
  management: {
    name: "Project Management & Leadership",
    jobDescription: `Seeking an Agile Project Manager to coordinate cross-functional software and operations teams.

Required Skills:
- Strong experience with Agile and Scrum methodologies
- Certified Scrum Master (CSM) is preferred
- Expert tracking project sprints in Jira / Confluence
- Risk management and budget oversight (up to $50K)
- Excellent stakeholder communication`,
    resumeContent: `Bob Johnson - Project Assistant
Experience:
- Managed team schedules and deadlines.
- Tracked task progress on boards.
- Reported status updates to managers.

Skills: Management, Excel, Jira, Communication, PowerPoint.`,
    bullets: [
      {
        id: 1,
        original: 'Managed team schedules and deadlines.',
        tailored: 'Facilitated daily standups and sprint planning for a team of 12 using Agile methodologies, increasing task completion rate by 22%.',
        reason: 'Highlights the specific Agile methodology and sprint terminology requested.'
      },
      {
        id: 2,
        original: 'Tracked task progress on boards.',
        tailored: 'Established structured Jira workflows, sprint backlog health tracking, and burndown charts to ensure 95% on-time project delivery.',
        reason: 'Shows advanced Jira coordination capabilities rather than basic tracking.'
      },
      {
        id: 3,
        original: 'Reported status updates to managers.',
        tailored: 'Created stakeholder reports and managed communications, keeping executive leadership informed on budget oversight and risk audits.',
        reason: 'Addresses stakeholder communication and risk management skills directly.'
      }
    ]
  },
  healthcare: {
    name: "Healthcare & Registered Nursing",
    jobDescription: `Seeking a compassionate Registered Nurse (RN) for our busy emergency department.

Required Skills:
- Advanced patient assessment and triage care
- Experience in Electronic Medical Records (EMR) documentation
- CPR and Basic Life Support (BLS) certification
- Medication administration and IV therapy
- Emergency crisis management and patient advocacy`,
    resumeContent: `Alice Brown - Registered Nurse (RN)
Experience:
- Cared for emergency room patients.
- Wrote down patient vital signs.
- Handed out medications and helped doctor.

Skills: Patient care, nursing, CPR, Microsoft Word.`,
    bullets: [
      {
        id: 1,
        original: 'Cared for emergency room patients.',
        tailored: 'Provided emergency patient assessment and triage care for 30+ daily high-acuity patients in a fast-paced environment.',
        reason: 'Upgrades basic patient care terms to specific medical roles like triage and patient assessment.'
      },
      {
        id: 2,
        original: 'Wrote down patient vital signs.',
        tailored: 'Documented accurate treatment charts and vital signs in Electronic Medical Records (EMR), ensuring 100% HIPAA compliance.',
        reason: 'Injects EMR and compliance parameters requested by clinical directors.'
      },
      {
        id: 3,
        original: 'Handed out medications and helped doctor.',
        tailored: 'Managed medication administration and IV therapy, collaborating with physicians during acute emergency crisis interventions.',
        reason: 'Highlights medication administration and crisis management requirements.'
      }
    ]
  }
};

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  // Selected industry key for the loader
  const [industryKey, setIndustryKey] = useState<keyof typeof MOCK_DATA>('tech');

  // Dynamic analysis states
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [missingKeywords, setMissingKeywords] = useState<{text: string, type: string}[]>([]);
  const [bullets, setBullets] = useState<{id: number, original: string, tailored: string, reason: string}[]>([]);
  const [isInferred, setIsInferred] = useState(false);
  const [inferredTitle, setInferredTitle] = useState<string | null>(null);

  // Advanced ATS audit states
  const [formattingScore, setFormattingScore] = useState(0);
  const [animatedFormattingScore, setAnimatedFormattingScore] = useState(0);
  const [hasEmail, setHasEmail] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [hasLinkedIn, setHasLinkedIn] = useState(false);
  const [sectionsFound, setSectionsFound] = useState<string[]>([]);
  const [formattingIssues, setFormattingIssues] = useState<{issue: string, severity: 'error' | 'warning', fix: string}[]>([]);

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Inline keyword editing
  const [newKeyword, setNewKeyword] = useState('');
  const [showAddKeyword, setShowAddKeyword] = useState(false);

  // Load selected industry template
  const handleLoadMockData = (key: keyof typeof MOCK_DATA) => {
    const data = MOCK_DATA[key];
    setJobDescription(data.jobDescription);
    setResumeContent(data.resumeContent);
    setFileName(null);
    setActiveTab('paste');
    setAnalysisCompleted(false);
    setAnimatedScore(0);
    setAnimatedFormattingScore(0);
    setIsInferred(false);
    setInferredTitle(null);
    setFormattingScore(0);
    setHasEmail(false);
    setHasPhone(false);
    setHasLinkedIn(false);
    setSectionsFound([]);
    setFormattingIssues([]);
  };



  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'txt') {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setResumeContent(event.target.result as string);
            setActiveTab('paste');
          }
        };
        reader.readAsText(file);
      } else {
        // PDF/DOCX simulated text extraction
        setIsAnalyzing(true);
        setTimeout(() => {
          setIsAnalyzing(false);
          let nameClean = file.name.split('.')[0].replace(/[-_]/g, ' ');
          nameClean = nameClean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          
          let docText = `${nameClean}\njohn.doe@example.com | (555) 0199 | linkedin.com/in/johndoe\n\n=== Work Experience ===\n- Built web pages using React and CSS.\n- Maintained web applications and worked with APIs.\n- Collaborated on team products.\n\n=== Education ===\nBachelor of Science in Computer Science, State University\n\n=== Skills ===\nHTML, CSS, JavaScript, React, Git, communication.`;
          setResumeContent(docText);
          setActiveTab('paste');
        }, 1200);
      }
    }
  };

  // Helper: Extract skills from text based on our dictionary, with safe escaping for special chars like c++
  const extractSkills = (text: string): string[] => {
    try {
      const cleanedText = ` ${text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\n\r]/g, " ")} `;
      return SKILLS_DICTIONARY.filter(skill => {
        // Safe escape for special characters like +, ?, ., *, /, etc.
        const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`[\\s\\-\\(\\)]${escapedSkill}[\\s\\-\\(\\),;\\.]`, 'i');
        return regex.test(cleanedText);
      });
    } catch (e) {
      console.error('Error in extractSkills:', e);
      return [];
    }
  };

  // Helper: Compute word-overlap similarity if no skills match (Jaccard Index)
  const computeWordOverlap = (jobText: string, resumeText: string): number => {
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

      // Intersection
      let intersectionSize = 0;
      jobWords.forEach(word => {
        if (resumeWords.has(word)) {
          intersectionSize++;
        }
      });

      // Score based on how much of the job requirements are covered
      return Math.round((intersectionSize / jobWords.size) * 100);
    } catch (e) {
      console.error('Error in computeWordOverlap:', e);
      return 0;
    }
  };

  // Perform dynamic analysis based on actual inputs
  const startAnalysis = async () => {
    if (!jobDescription.trim() || (!resumeContent.trim() && !fileName)) {
      alert('Please fill out both the Job Description and your Resume before analyzing.');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisCompleted(false);
    setAnimatedScore(0);
    setAnimatedFormattingScore(0);
    setIsInferred(false);
    setInferredTitle(null);
    setScore(0);
    setFormattingScore(0);
    setMissingKeywords([]);
    setBullets([]);
    setHasEmail(false);
    setHasPhone(false);
    setHasLinkedIn(false);
    setSectionsFound([]);
    setFormattingIssues([]);

    try {
      // 1. Attempt to call real Google Gemini AI Route
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription, resumeContent }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // If Gemini is not set up on Vercel yet, it will return fallback: true
        if (!data.fallback) {
          setScore(data.score);
          setFormattingScore(data.formattingScore || 80);
          setMissingKeywords(data.missingKeywords.map((kw: string) => ({
            text: kw,
            type: 'hard'
          })));
          setHasEmail(!!data.hasEmail);
          setHasPhone(!!data.hasPhone);
          setHasLinkedIn(!!data.hasLinkedIn);
          setSectionsFound(data.sectionsFound || []);
          setFormattingIssues(data.formattingIssues || []);
          setBullets(data.bullets);
          setIsInferred(!!data.isInferred);
          setInferredTitle(data.inferredTitle || null);
          
          setIsAnalyzing(false);
          setAnalysisCompleted(true);
          return;
        }
      }
    } catch (err) {
      console.warn('API Route error, running local fallback algorithm...', err);
    }

    // 2. FALLBACK: Local client-side matching engine (safe from regex bugs)
    setTimeout(() => {
      try {
        // 1. Calculate formatting audits first (always done on resumeContent)
        const hasEmailLocal = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(resumeContent);
        const hasPhoneLocal = /[\d\-()\+\s]{7,15}/.test(resumeContent);
        const hasLinkedInLocal = /(linkedin\.com|github\.com)/i.test(resumeContent);
        
        const sectionsLocal: string[] = [];
        const resLower = resumeContent.toLowerCase();
        if (/(experience|history|employment|work)/i.test(resLower)) sectionsLocal.push("experience");
        if (/(education|university|college|degree)/i.test(resLower)) sectionsLocal.push("education");
        if (/(skills|technologies|tools|languages)/i.test(resLower)) sectionsLocal.push("skills");
        if (/(summary|profile|about)/i.test(resLower)) sectionsLocal.push("summary");
        if (/(projects|portfolio)/i.test(resLower)) sectionsLocal.push("projects");
        if (/(certifications|certificates|awards)/i.test(resLower)) sectionsLocal.push("certifications");

        const issuesLocal: {issue: string, severity: 'error' | 'warning', fix: string}[] = [];
        let fmtScoreLocal = 100;

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

        const wordCount = resumeContent.trim().split(/\s+/).length;
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

        // 2. Perform job classification and match score calculations
        const isJobTitleInput = jobDescription.trim().split(/\s+/).length < 12;
        let matchedFallbackKey: keyof typeof MOCK_DATA | null = null;
        
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

        if (isJobTitleInput && !matchedFallbackKey) {
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

          // Generate templates / suggestions
          const matchedTemplate = Object.values(MOCK_DATA).find(
            template => 
              jobDescription.toLowerCase().includes(template.bullets[0].original.split(' ')[0].toLowerCase()) ||
              resumeContent.toLowerCase().includes(template.bullets[0].original.split(' ')[0].toLowerCase())
          );

          if (matchedTemplate) {
            generatedBullets = matchedTemplate.bullets;
          } else if (matchedFallbackKey) {
            generatedBullets = MOCK_DATA[matchedFallbackKey].bullets;
            setIsInferred(true);
            setInferredTitle(MOCK_DATA[matchedFallbackKey].name);
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

        setScore(finalScore);
        setFormattingScore(fmtScoreLocal);
        setHasEmail(hasEmailLocal);
        setHasPhone(hasPhoneLocal);
        setHasLinkedIn(hasLinkedInLocal);
        setSectionsFound(sectionsLocal);
        setFormattingIssues(issuesLocal);
        setMissingKeywords(missing);
        setBullets(generatedBullets);
      } catch (err) {
        console.error('Local fallback engine error:', err);
        setScore(45);
        setFormattingScore(70);
        setMissingKeywords([{ text: 'Critical Thinking', type: 'hard' }]);
        setBullets([
          {
            id: 1,
            original: 'Worked on projects.',
            tailored: 'Spearheaded critical deliverables, ensuring 100% operational success.',
            reason: 'Strengthens phrasing to show results.'
          }
        ]);
      }

      setIsAnalyzing(false);
      setAnalysisCompleted(true);
    }, 1500);
  };

  // Animate Match Score and Formatting Score from 0 to actual scores
  useEffect(() => {
    if (analysisCompleted) {
      let currentScore = 0;
      let currentFmt = 0;
      const interval = setInterval(() => {
        let updated = false;
        if (currentScore < score) {
          currentScore += 2;
          if (currentScore >= score) {
            setAnimatedScore(score);
          } else {
            setAnimatedScore(currentScore);
            updated = true;
          }
        }
        if (currentFmt < formattingScore) {
          currentFmt += 2;
          if (currentFmt >= formattingScore) {
            setAnimatedFormattingScore(formattingScore);
          } else {
            setAnimatedFormattingScore(currentFmt);
            updated = true;
          }
        }
        if (!updated) {
          clearInterval(interval);
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [analysisCompleted, score, formattingScore]);

  // Copy helper
  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Keyword operations
  const removeKeyword = (idx: number) => {
    setMissingKeywords(missingKeywords.filter((_, i) => i !== idx));
  };

  const addKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      setMissingKeywords([...missingKeywords, { text: newKeyword.trim(), type: 'hard' }]);
      setNewKeyword('');
      setShowAddKeyword(false);
    }
  };

  // SVG parameters for progress ring
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <>
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1A1A1A]/10 bg-[#FAF7F2]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="InterviewReady Logo"
              width={36}
              height={36}
              className="rounded-lg shadow-sm"
            />
            <span className="text-xl font-serif font-black text-[#1A1A1A] tracking-tight">
              InterviewReady
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200/60 px-3 py-1 text-xs font-semibold text-teal-800">
              <Sparkles className="h-3.5 w-3.5 text-[#008080]" />
              <span>Universal Career Matcher</span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 pl-4 border-l border-[#1A1A1A]/10">
              <a href="#" className="text-[#1A1A1A] font-semibold transition-colors">Dashboard</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow flex flex-col gap-10 relative z-10">
        
        {/* Title area */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#1A1A1A]/10 pb-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black text-[#1A1A1A] tracking-tight leading-tight">
              Optimize your resume <br />
              <span className="text-[#008080]">for any industry or profession.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              InterviewReady compares your profile content against key requirements in any field in real-time, delivering compatibility metrics and tailored copywriting improvements.
            </p>
          </div>
          
          {/* Quick industry selector widget */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#1A1A1A]/10 shadow-sm self-start lg:self-auto">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Briefcase className="h-3.5 w-3.5 text-[#008080]" />
              <span>Try an Industry:</span>
            </div>
            <select
              value={industryKey}
              onChange={(e) => {
                const key = e.target.value as keyof typeof MOCK_DATA;
                setIndustryKey(key);
                handleLoadMockData(key);
              }}
              className="bg-white border border-[#1A1A1A]/10 text-xs font-semibold text-[#1A1A1A] rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#008080] cursor-pointer"
            >
              <option value="tech">Technology / Software Dev</option>
              <option value="marketing">Marketing / Growth Sales</option>
              <option value="management">Project Management / Leadership</option>
              <option value="healthcare">Healthcare / Registered Nursing</option>
            </select>
            
            <button
              onClick={() => handleLoadMockData(industryKey)}
              className="flex items-center gap-1.5 rounded-lg border border-[#1A1A1A]/10 bg-white hover:bg-slate-50 px-3 py-2 text-xs text-[#1A1A1A] font-bold transition-all cursor-pointer"
              title="Reset sample data for selected industry"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Load Template</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid split screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="glass-panel rounded-xl p-6 bg-card-bg flex flex-col gap-5 border border-[#1A1A1A]/10">
              <div className="flex items-center gap-2 pb-3 border-b border-[#1A1A1A]/10">
                <Briefcase className="h-5 w-5 text-[#008080]" />
                <h2 className="text-base font-bold text-[#1A1A1A] uppercase tracking-wider text-xs">Inputs</h2>
              </div>

              {/* Job Description Textarea */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Target Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description or role requirements here..."
                  className="w-full h-48 rounded-lg border border-[#1A1A1A]/10 bg-white p-4 text-sm text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#008080] focus:border-[#008080] transition-all resize-none"
                />
              </div>

              {/* Resume Input - Paste or File Tab */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Your Current Resume
                  </label>
                  
                  {/* Tabs */}
                  <div className="flex rounded-lg bg-slate-100 p-0.5 border border-[#1A1A1A]/10">
                    <button
                      onClick={() => setActiveTab('paste')}
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                        activeTab === 'paste' 
                          ? 'bg-white text-[#1A1A1A] shadow-sm border border-[#1A1A1A]/10' 
                          : 'text-slate-500 hover:text-[#1A1A1A]'
                      }`}
                    >
                      Paste Text
                    </button>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                        activeTab === 'upload' 
                          ? 'bg-white text-[#1A1A1A] shadow-sm border border-[#1A1A1A]/10' 
                          : 'text-slate-500 hover:text-[#1A1A1A]'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {/* Tab content */}
                {activeTab === 'paste' ? (
                  <textarea
                    value={resumeContent}
                    onChange={(e) => setResumeContent(e.target.value)}
                    placeholder="Paste the current text of your CV / Resume..."
                    className="w-full h-48 rounded-lg border border-[#1A1A1A]/10 bg-white p-4 text-sm text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#008080] focus:border-[#008080] transition-all resize-none"
                  />
                ) : (
                  <div className="relative group flex flex-col items-center justify-center w-full h-48 border border-dashed border-[#1A1A1A]/20 rounded-lg bg-white hover:bg-slate-50/50 transition-all p-6 text-center cursor-pointer">
                    <input 
                      type="file" 
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    
                    {fileName ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-teal-50 text-[#008080] rounded-lg border border-teal-100">
                          <FileCheck2 className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1A1A1A] truncate max-w-xs">{fileName}</p>
                          <p className="text-xs text-slate-500 mt-1">Successfully attached. Click to replace.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-slate-50 text-slate-400 rounded-lg group-hover:text-[#008080] group-hover:bg-teal-50 transition-colors border border-[#1A1A1A]/10">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Drag &amp; drop your resume, or browse</p>
                          <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, or TXT (Max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="w-full mt-2 group py-3 px-6 rounded-lg font-semibold bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Comparing documents...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze &amp; Match</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel: Analysis View */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="glass-panel rounded-xl p-6 bg-card-bg flex flex-col gap-6 min-h-[516px] relative border border-[#1A1A1A]/10">
              <div className="flex items-center gap-2 pb-3 border-b border-[#1A1A1A]/10">
                <Code className="h-5 w-5 text-[#008080]" />
                <h2 className="text-base font-bold text-[#1A1A1A] uppercase tracking-wider text-xs">Analysis View</h2>
              </div>

              {!isAnalyzing && !analysisCompleted ? (
                // Empty state view
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center my-auto">
                  <div className="h-14 w-14 bg-slate-50 rounded-xl border border-[#1A1A1A]/10 flex items-center justify-center text-slate-400 mb-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Awaiting matching instructions</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
                    Provide the job description and your resume on the left, then click <strong className="text-[#008080]">&quot;Analyze &amp; Match&quot;</strong> to generate your real-time score and keywords optimization suggestions.
                  </p>
                </div>
              ) : isAnalyzing ? (
                // Analyzing state view
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center my-auto gap-4">
                  <div className="relative flex items-center justify-center h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#008080] border-r-[#008080] animate-spin"></div>
                    <Sparkles className="h-5 w-5 text-[#008080] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A]">Running semantic analysis...</h3>
                    <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                      Comparing resume bullets with role requirements to verify ATS compatibility.
                    </p>
                  </div>
                </div>
              ) : (
                // Analysis Completed view
                <div className="flex flex-col gap-6 animate-fadeIn">
                  
                  {/* Job Title Inference Banner */}
                  {isInferred && inferredTitle && (
                    <div className="flex items-start gap-3 rounded-lg border border-teal-100 bg-teal-50/50 p-3.5 text-xs text-slate-700">
                      <Sparkles className="h-4 w-4 text-[#008080] shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <span className="font-bold text-slate-900">Matcher Inference Mode:</span> We detected a brief input and dynamically generated industry requirements for <strong className="text-[#008080] font-bold">"{inferredTitle}"</strong> to compare your resume.
                      </div>
                    </div>
                  )}

                  {/* Top Stats: Dual Score & Summary Card */}
                  <div className="flex flex-col gap-4 bg-slate-50 rounded-xl p-5 border border-[#1A1A1A]/10">
                    <div className="grid grid-cols-2 gap-4 items-center justify-items-center">
                      
                      {/* Keyword Match Score */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="relative flex items-center justify-center">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="40" cy="40" r="34" className="stroke-slate-200" strokeWidth="5" fill="transparent" />
                            <circle
                              cx="40"
                              cy="40"
                              r="34"
                              className="stroke-[#008080] transition-all duration-500 ease-out"
                              strokeWidth="5"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 34}
                              strokeDashoffset={2 * Math.PI * 34 - (animatedScore / 100) * (2 * Math.PI * 34)}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-black text-slate-900">{animatedScore}%</span>
                            <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Match</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Keyword Match</span>
                      </div>

                      {/* Formatting Audit Score */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="relative flex items-center justify-center">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="40" cy="40" r="34" className="stroke-slate-200" strokeWidth="5" fill="transparent" />
                            <circle
                              cx="40"
                              cy="40"
                              r="34"
                              className="stroke-[#006666] transition-all duration-500 ease-out"
                              strokeWidth="5"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 34}
                              strokeDashoffset={2 * Math.PI * 34 - (animatedFormattingScore / 100) * (2 * Math.PI * 34)}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-black text-slate-900">{animatedFormattingScore}%</span>
                            <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Format</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">ATS Format</span>
                      </div>
                    </div>

                    {/* Quick feedback message */}
                    <div className="flex flex-col gap-1 pt-3 border-t border-slate-200/60 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#008080] text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>ATS Audit Completed</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-normal font-normal">
                        {animatedScore >= 80 && animatedFormattingScore >= 80 
                          ? "Excellent! Your resume has very high keyword match alignment and meets standard ATS formatting rules."
                          : "Improve your scoring by addressing the formatting checklist and missing keywords below."}
                      </p>
                    </div>
                  </div>

                  {/* Brag & Share Card */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border border-teal-100 bg-teal-50/30">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#008080] shrink-0" />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-slate-800">Share Scorecard</span>
                        <span className="text-[10px] text-slate-500">Copy referral post for LinkedIn or X/Twitter.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const bragText = `🎯 I just audited my resume using InterviewReady and got a ${animatedScore}% Match & ${animatedFormattingScore}% ATS formatting score! Check your compatibility for free: https://resume-matcher-sepia.vercel.app/ #InterviewReady #ATSChecker`;
                        navigator.clipboard.writeText(bragText);
                        alert("Brag post copied successfully! Paste on LinkedIn or X/Twitter.");
                      }}
                      className="w-full sm:w-auto px-3.5 py-1.5 rounded bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
                    >
                      Brag on Socials
                    </button>
                  </div>

                  {/* Missing Keywords Box */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-[#008080]" />
                        Missing Keywords ({missingKeywords.length})
                      </h3>
                      
                      {!showAddKeyword && (
                        <button
                          onClick={() => setShowAddKeyword(true)}
                          className="text-[10px] text-[#008080] hover:text-[#006666] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" /> Add keyword
                        </button>
                      )}
                    </div>

                    {/* Add Keyword inline form */}
                    {showAddKeyword && (
                      <form onSubmit={addKeyword} className="flex gap-2 mb-1">
                        <input
                          type="text"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="e.g. Communication"
                          className="flex-grow rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#008080] focus:border-[#008080]"
                          autoFocus
                        />
                        <button 
                          type="submit"
                          className="bg-[#008080] hover:bg-[#006666] text-white rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer"
                        >
                          Add
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setShowAddKeyword(false); setNewKeyword(''); }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer border border-[#1A1A1A]/10"
                        >
                          Cancel
                        </button>
                      </form>
                    )}

                    <div className="flex flex-wrap gap-2 p-4 rounded-lg bg-slate-50 border border-slate-200 max-h-36 overflow-y-auto">
                      {missingKeywords.length > 0 ? (
                        missingKeywords.map((kw, idx) => (
                          <div 
                            key={idx} 
                            className="group flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 hover:bg-teal-100/70 px-3 py-0.5 text-xs text-teal-800 transition-all font-medium"
                          >
                            <span>{kw.text}</span>
                            <button
                              onClick={() => removeKeyword(idx)}
                              className="text-teal-600 hover:text-rose-600 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                              title="Delete tag"
                            >
                              &times;
                            </button>
                          </div>
                        ))
                      ) : (
                        score === 0 ? (
                          <p className="text-xs text-slate-400 italic font-normal">
                            No keywords matched. Please enter a detailed job description or configure your Gemini API Key in Vercel settings for dynamic role requirements generation.
                          </p>
                        ) : (
                          <p className="text-xs text-[#008080] italic font-semibold">No missing keywords! You have a full match.</p>
                        )
                      )}
                    </div>
                  </div>

                  {/* ATS Formatting Audit Checklist */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ListChecks className="h-3.5 w-3.5 text-[#008080]" />
                      ATS Readability Checklist ({formattingIssues.length} warnings)
                    </h3>
                    
                    <div className="flex flex-col gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
                      
                      {/* Checklist items */}
                      <div className="grid grid-cols-2 gap-2 pb-3.5 border-b border-slate-200/60">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                          {hasEmail ? <Check className="h-3.5 w-3.5 text-[#008080] font-black" /> : <X className="h-3.5 w-3.5 text-rose-500 font-bold" />}
                          <span>Email address</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                          {hasPhone ? <Check className="h-3.5 w-3.5 text-[#008080] font-black" /> : <X className="h-3.5 w-3.5 text-rose-500 font-bold" />}
                          <span>Phone number</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                          {hasLinkedIn ? <Check className="h-3.5 w-3.5 text-[#008080] font-black" /> : <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                          <span>LinkedIn Link</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                          {sectionsFound.includes('experience') ? <Check className="h-3.5 w-3.5 text-[#008080] font-black" /> : <X className="h-3.5 w-3.5 text-rose-500 font-bold" />}
                          <span>Experience section</span>
                        </div>
                      </div>

                      {/* Formatting issues warnings */}
                      <div className="flex flex-col gap-2.5 max-h-[180px] overflow-y-auto pr-1">
                        {formattingIssues.length > 0 ? (
                          formattingIssues.map((issue, idx) => (
                            <div key={idx} className="flex gap-2 text-xs text-slate-600 bg-white rounded border border-slate-200 p-2.5 shadow-sm">
                              {issue.severity === 'error' ? (
                                <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                              )}
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-slate-900 text-[11px]">{issue.issue}</span>
                                <p className="text-[10px] text-slate-500 leading-normal font-normal">{issue.fix}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-[#008080] italic flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>No formatting warnings found! Document is fully ATS-readable.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tailored Bullet Point Suggestions */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#008080]" />
                      Tailored Bullet Point Suggestions
                    </h3>

                    <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
                      {bullets.map((bullet) => (
                        <div key={bullet.id} className="rounded-lg border border-slate-200 bg-white p-4.5 flex flex-col gap-3 hover:border-slate-300 transition-all">
                          
                          {/* Original line */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              Original
                            </span>
                            <p className="text-xs text-slate-500 pl-2.5 border-l border-rose-200 strike-through line-through opacity-85">
                              {bullet.original}
                            </p>
                          </div>

                          {/* Tailored suggestion */}
                          <div className="flex flex-col gap-1.5 mt-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-[#008080] uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-[#008080]" /> Tailored AI Rewrite
                              </span>
                              <button
                                onClick={() => handleCopy(bullet.id, bullet.tailored)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-[10px] text-slate-600 transition-all cursor-pointer font-medium"
                              >
                                {copiedId === bullet.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-[#008080]" />
                                    <span className="text-[#008080]">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>Copy rewrite</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-xs font-semibold text-slate-800 pl-2.5 border-l-2 border-[#008080]">
                              {bullet.tailored}
                            </p>
                          </div>

                          {/* Rationale explanation */}
                          <div className="text-[11px] text-slate-600 bg-slate-50 rounded-md p-2.5 border border-slate-200">
                            <span className="font-semibold text-slate-900">Why:</span> {bullet.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </div>
              )}
            </div>
          </div>

        </div>

        {/* SEO FAQ & ATS Guidelines Section */}
        <section className="mt-12 border-t border-[#1A1A1A]/10 pt-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-[#1A1A1A] text-center tracking-tight mb-1">
              Frequently Asked Questions &amp; ATS Guidelines
            </h2>
            <p className="text-xs text-slate-500 text-center mb-6">
              Learn how applicant tracking systems read resumes and improve your compatibility rating.
            </p>

            <div className="flex flex-col gap-3">
              {[
                {
                  q: "How does the InterviewReady Checker calculate the scores?",
                  a: "The tool evaluates resumes using two scanning metrics: Keyword Match Rate (which semantically scans your resume content against job qualifications) and ATS Formatting Readiness (which verifies layout structure, section headings, and contact info). Together, they define your overall compatibility rating."
                },
                {
                  q: "Will columns, tables, or graphics cause an ATS to reject my resume?",
                  a: "Yes. Many older parsers (such as Workday, Taleo, or Greenhouse) scan text left-to-right across the page. In multi-column or table layouts, this mixes text from different sections together, resulting in unreadable content. To ensure compatibility, use a standard, single-column text layout without tables."
                },
                {
                  q: "Does Google Careers use an Applicant Tracking System (ATS)?",
                  a: "Google uses its own proprietary applicant tracking and parsing system. Like Workday or other major ATS engines, it is designed to extract professional headers, education history, and key tools. Optimizing your resume format ensures Google's algorithms index your skills correctly."
                },
                {
                  q: "What document format is best for ATS compatibility?",
                  a: "A standard PDF or Microsoft Word (.docx) file is best. Always ensure your PDF has selectable, highlightable text (not scanned as an image). Plain text (.txt) files are also 100% readable but lack visual styling for human reviewers."
                }
              ].map((faq, index) => (
                <div key={index} className="rounded-lg border border-[#1A1A1A]/10 bg-white overflow-hidden transition-all duration-200 hover:border-[#1A1A1A]/20 shadow-sm">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-[#1A1A1A] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#008080] font-extrabold text-base leading-none ml-4 select-none">
                      {expandedFaq === index ? '−' : '+'}
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div className="p-4 pt-0 text-xs text-slate-500 leading-relaxed border-t border-slate-100 bg-slate-50 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#1A1A1A]/10 py-6 bg-[#FAF7F2] mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; 2026 InterviewReady. Built for recruitment engineering.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline hover:text-[#1A1A1A] transition-colors cursor-pointer">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline hover:text-[#1A1A1A] transition-colors cursor-pointer">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
