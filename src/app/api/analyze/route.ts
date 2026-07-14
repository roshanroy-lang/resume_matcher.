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

    const prompt = `You are an expert ATS (Applicant Tracking System) optimizer and professional resume writer.
Analyze the following Job Description and Resume:

=== JOB DESCRIPTION ===
${jobDescription}

=== RESUME ===
${resumeContent}

Provide the analysis output in JSON format with the following keys:
- "score": A number between 15 and 98 representing the matching compatibility score percentage.
- "missingKeywords": An array of strings representing key skills, tools, frameworks, certifications, or methodologies that are present in the job description but missing or under-represented in the resume. Limit to top 8 items.
- "bullets": An array of objects representing bullet-point rewrite suggestions for the resume's experience section. Pick the weakest or most general bullet points from the input resume and provide tailored, high-impact rewrites incorporating missing keywords and quantifiable metrics. Each object must have:
  - "id": A unique number.
  - "original": The original weak bullet point from the resume.
  - "tailored": The optimized tailored bullet point rewrite.
  - "reason": A brief explanation of why this change is effective and what keywords it injects.

Ensure the output is valid JSON and matches the requested structure.`;

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
