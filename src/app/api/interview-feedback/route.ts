import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { question, userAnswer, jobDescription } = await request.json();

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: 'Question and User Answer are required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { 
          fallback: true, 
          message: 'GEMINI_API_KEY is not configured. Cannot evaluate interview answer.' 
        }
      );
    }

    const prompt = `You are an expert interviewer and career mentor.
Evaluate the candidate's answer to the following interview question. Provide a score, constructive feedback, and a sample model answer they could use.

=== TARGET JOB DESCRIPTION ===
${jobDescription || 'N/A'}

=== QUESTION ===
${question}

=== CANDIDATE ANSWER ===
${userAnswer}

Instructions:
1. Score the answer from 0 to 100 based on detail level, structure (e.g. STAR method for behavioral questions), and matching technical competence.
2. Provide feedback in markdown format outlining: What they did well, What was missing, and How to improve.
3. Generate a strong "modelAnswer" tailored to this question that displays high impact and structure.`;

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
          temperature: 0.4,
          responseSchema: {
            type: "OBJECT",
            properties: {
              score: { 
                type: "INTEGER",
                description: "Integer score from 0 to 100."
              },
              feedback: { 
                type: "STRING",
                description: "Constructive feedback points in markdown."
              },
              modelAnswer: { 
                type: "STRING",
                description: "High-scoring model answer example in markdown."
              }
            },
            required: ["score", "feedback", "modelAnswer"]
          }
        }
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Gemini API Interview Feedback Error details:', errorText);
      return NextResponse.json(
        { 
          fallback: true, 
          message: 'Gemini API interview feedback request failed.' 
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
    console.error('Interview Feedback API Route Error:', error);
    return NextResponse.json(
      { 
        fallback: true, 
        message: 'Internal server error.' 
      }
    );
  }
}
