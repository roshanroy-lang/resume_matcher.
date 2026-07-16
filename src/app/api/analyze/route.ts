import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { jobDescription, resumeContent } = await request.json();

    if (!jobDescription || !resumeContent) {
      return NextResponse.json(
        { error: 'Both Job Description and Resume Content are required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is not configured, inform the client to fallback to local matching
    if (!apiKey) {
      return NextResponse.json(
        { 
          fallback: true, 
          message: 'GEMINI_API_KEY is not configured. Falling back to client-side matching engine.' 
        }
      );
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) optimizer, parser, and professional resume writer.
Analyze the following Job Description and Resume and perform a deep ATS readability, structural, and compatibility audit:

=== JOB DESCRIPTION ===
${jobDescription}

=== RESUME ===
${resumeContent}

Provide the analysis output in JSON format with the following keys:
- "score": A number between 0 and 100 representing the matching compatibility score percentage. If the resume is for a completely different profession than the job description (e.g. software engineer vs doctor), this score MUST be 0 or close to 0. If the content under === RESUME === is not a resume at all (e.g. random code, logs, terms of service, unrelated articles, or blank/garbage text), this score MUST be 0.
- "formattingScore": A number between 0 and 100 representing the ATS formatting readability and structural integrity score based on standard guidelines. This score measures structure (email, phone, headers) and is independent of profession mismatch. If the content under === RESUME === is not a resume at all, this score MUST be 0.
- "missingKeywords": An array of strings representing key skills, tools, frameworks, certifications, or methodologies that are present in the job description but missing or under-represented in the resume. Limit to top 8 items. If the content is not a resume, this must be an empty array.
- "hasEmail": A boolean indicating if an email address was found in the resume.
- "hasPhone": A boolean indicating if a phone number was found in the resume.
- "hasLinkedIn": A boolean indicating if a LinkedIn URL, portfolio link, or social profile was found in the resume.
- "sectionsFound": An array of lowercase strings representing the major resume sections detected (e.g., "experience", "education", "skills", "summary", "projects", "certifications").
- "formattingIssues": An array of objects representing specific ATS formatting or structural issues found in the resume. Each object must have:
  - "issue": A brief description of the issue found (e.g., "Missing LinkedIn Profile", "Unusual section heading 'What I Do' instead of 'Work Experience'"). If the content under === RESUME === is not a resume at all, include an issue like "Invalid Resume Document".
  - "severity": A string: either "error" (for critical issues like missing sections/contact info or invalid resume) or "warning" (for minor formatting/structural suggestions).
  - "fix": A clear, actionable suggestion on how the candidate can fix this formatting/structural issue (e.g. "The uploaded document does not appear to be a resume. Please upload a valid resume in PDF, DOCX, or TXT format.").
- "bullets": An array of objects representing bullet-point rewrite suggestions for the resume's experience section. Pick the weakest or most general bullet points from the input resume and provide tailored, high-impact rewrites incorporating missing keywords and quantifiable metrics. Each object must have:
  - "id": A unique number.
  - "original": The original weak bullet point from the resume.
  - "tailored": The optimized tailored bullet point rewrite.
  - "reason": A brief explanation of why this change is effective and what keywords it injects.
  If the content is not a resume, this must be an empty array.
- "isSingleColumn": A boolean indicating if the resume appears to be formatted in a single-column layout (true) rather than multi-column (false). If the layout has sidebars, multiple columns, or floating text boxes, set this to false.
- "hasStandardHeaders": A boolean indicating if the resume uses standard headings like "Work Experience", "Education", and "Skills" (true) rather than creative titles like "My Story" or "What I Do" (false).
- "hasConsistentDates": A boolean indicating if all employment and education dates are written in a consistent, parser-friendly date format (e.g., MM/YYYY or Month YYYY) (true) or if they are missing/inconsistent (false).
- "noGraphicsOrCharts": A boolean indicating if the resume is free of progress bars, percentage circles, skill charts, star ratings, or graphics (true) or if they are present (false).
- "isInferred": A boolean value. Set this to true ONLY if the provided JOB DESCRIPTION is very short (e.g. less than 12 words or is just a job title/name like "Frontend Engineer", "Project Coordinator", "Registered Nurse", etc.). Set this to false if a detailed job description was provided.
- "inferredTitle": A string representing the inferred job title (e.g., "Frontend Engineer") if "isInferred" is true. If "isInferred" is false, set this to null.

Rule for job titles: If the provided JOB DESCRIPTION appears to be just a job title or a brief keyword query rather than a full job description, you must first dynamically infer the typical skills, responsibilities, tools, and requirements for that job title in the industry. Then, perform the analysis (score, formattingScore, missingKeywords, structural checks, and bullets rewrites) by comparing the Resume against those inferred requirements.

Ensure the output is valid JSON and matches the requested structure.
If the input under === RESUME === is not a valid resume, you MUST set both "score" and "formattingScore" to 0 and report the invalid resume formatting issue.`;

    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Gemini API Error details:', errorText);
      return NextResponse.json(
        { 
          fallback: true, 
          message: 'Gemini API request failed. Falling back to local analysis.' 
        }
      );
    }

    const data = await apiResponse.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return NextResponse.json(
        { 
          fallback: true, 
          message: 'Empty response from Gemini. Falling back to local analysis.' 
        }
      );
    }

    const parsedResult = JSON.parse(responseText.trim());
    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        fallback: true, 
        message: 'Internal server error. Falling back to local analysis.' 
      }
    );
  }
}
