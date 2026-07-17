import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { jobDescription, resumeContent, tone } = await request.json();

    if (!jobDescription || !resumeContent) {
      return NextResponse.json(
        { error: 'Both Job Description and Resume Content are required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GeminiAPIKey2 || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { 
          fallback: true, 
          message: 'GEMINI_API_KEY is not configured. Cannot generate Cover Letter.' 
        }
      );
    }

    const prompt = `You are a professional career coach and expert copywriter.
Write a highly tailored Cover Letter on behalf of a candidate applying to a target job.

=== JOB DESCRIPTION ===
${jobDescription}

=== CANDIDATE RESUME ===
${resumeContent}

=== TONE SETTING ===
${tone || 'professional'}

Instructions:
1. Match key achievements and skills from the resume directly to the requirements in the job description.
2. Adopt the selected tone (professional, enthusiastic, concise, or creative).
3. Do not include placeholders like "[Insert Date]" or "[Company Name]". Instead, construct a realistic professional header and closing. If details are missing, write standard corporate headers.
4. Output the result in standard markdown format inside the JSON response.`;

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
          temperature: 0.7,
          responseSchema: {
            type: "OBJECT",
            properties: {
              coverLetter: { 
                type: "STRING", 
                description: "The complete tailored cover letter written in markdown format."
              }
            },
            required: ["coverLetter"]
          }
        }
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Gemini API Cover Letter Error details:', errorText);
      return NextResponse.json(
        { 
          fallback: true, 
          message: 'Gemini API cover letter request failed.' 
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
    console.error('Cover Letter API Route Error:', error);
    return NextResponse.json(
      { 
        fallback: true, 
        message: 'Internal server error.' 
      }
    );
  }
}
