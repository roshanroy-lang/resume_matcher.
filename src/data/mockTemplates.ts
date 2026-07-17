export const MOCK_DATA = {
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
