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

Provide the analysis output in JSON format matching the schema rules.
Rules for outputs:
1. If the resume is for a completely different profession than the job description (e.g. software engineer vs doctor), the compatibility score MUST be 0 or close to 0. If the resume content is garbage text, unrelated logs, or not a resume, both compatibility score and formattingScore MUST be 0.
2. If the Job Description is very short (less than 12 words), set "isInferred" to true and dynamically infer the industry standard titles/requirements. Otherwise set "isInferred" to false and "inferredTitle" to an empty string.`;

    // Upgrade to gemini-2.0-flash
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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
          temperature: 0.2,
          // Strict schema validation to prevent missing fields or layout shifts
          responseSchema: {
            type: "OBJECT",
            properties: {
              score: { 
                type: "INTEGER", 
                description: "Compatibility score percentage between 0 and 100." 
              },
              formattingScore: { 
                type: "INTEGER", 
                description: "ATS formatting readability score between 0 and 100 based on standard resume guidelines." 
              },
              missingKeywords: { 
                type: "ARRAY", 
                items: { type: "STRING" },
                description: "List of top 8 missing keywords, tools, or frameworks." 
              },
              hasEmail: { type: "BOOLEAN" },
              hasPhone: { type: "BOOLEAN" },
              hasLinkedIn: { type: "BOOLEAN" },
              sectionsFound: { 
                type: "ARRAY", 
                items: { type: "STRING" },
                description: "Major sections found in lowercase."
              },
              formattingIssues: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    issue: { type: "STRING" },
                    severity: { type: "STRING", enum: ["error", "warning"] },
                    fix: { type: "STRING" }
                  },
                  required: ["issue", "severity", "fix"]
                }
              },
              bullets: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    id: { type: "INTEGER" },
                    original: { type: "STRING" },
                    tailored: { type: "STRING" },
                    reason: { type: "STRING" }
                  },
                  required: ["id", "original", "tailored", "reason"]
                }
              },
              isSingleColumn: { type: "BOOLEAN" },
              hasStandardHeaders: { type: "BOOLEAN" },
              hasConsistentDates: { type: "BOOLEAN" },
              noGraphicsOrCharts: { type: "BOOLEAN" },
              isInferred: { type: "BOOLEAN" },
              inferredTitle: { type: "STRING" }
            },
            required: [
              "score", 
              "formattingScore", 
              "missingKeywords", 
              "hasEmail", 
              "hasPhone", 
              "hasLinkedIn", 
              "sectionsFound", 
              "formattingIssues", 
              "bullets", 
              "isSingleColumn", 
              "hasStandardHeaders", 
              "hasConsistentDates", 
              "noGraphicsOrCharts",
              "isInferred", 
              "inferredTitle"
            ]
          }
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
