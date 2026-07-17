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

    if (!apiKey) {
      return NextResponse.json(
        { 
          fallback: true, 
          message: 'GEMINI_API_KEY is not configured. Cannot generate interview questions.' 
        }
      );
    }

    const prompt = `You are an expert interviewer and technical recruiter.
Based on the following Job Description and Candidate Resume, generate 5 highly realistic interview questions that this candidate is likely to face during a screening or loop.

=== JOB DESCRIPTION ===
${jobDescription}

=== CANDIDATE RESUME ===
${resumeContent}

Instructions:
1. Generate exactly 5 questions.
2. Mix the questions between technical, behavioral, and situational types.
3. For each question, provide an "idealGuidelines" summary outlining what points, structures (e.g. STAR method), frameworks, or skills the candidate should ideally hit to score highly.`;

    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

    const apiResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
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
          temperature: 0.6,
          responseSchema: {
            type: "OBJECT",
            properties: {
              questions: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    id: { type: "INTEGER" },
                    question: { type: "STRING" },
                    type: { type: "STRING", enum: ["technical", "behavioral", "situational"] },
                    idealGuidelines: { type: "STRING" }
                  },
                  required: ["id", "question", "type", "idealGuidelines"]
                }
              }
            },
            required: ["questions"]
          }
        }
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Gemini API Interview Prep Error details:', errorText);
      return NextResponse.json(
        { 
          fallback: true, 
          message: 'Gemini API interview prep request failed.' 
        }
      );
    }

    const data = await apiResponse.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return NextResponse.json(
        { 
          fallback: true, 
          message: 'Empty response from Gemini.' 
        }
      );
    }

    const parsedResult = JSON.parse(responseText.trim());
    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error('Interview Prep API Route Error:', error);
    return NextResponse.json(
      { 
        fallback: true, 
        message: 'Internal server error.' 
      }
    );
  }
}
