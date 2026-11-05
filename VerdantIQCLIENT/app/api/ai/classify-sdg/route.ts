import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import { classifyActionToSDG, SDG_GOALS } from '@/lib/constants/sdgGoals';

export async function POST(req: NextRequest) {
  try {
    const { actionDescription, ocrText, locationName, category } = await req.json();

    if (!actionDescription) {
      return NextResponse.json({ error: 'actionDescription is required' }, { status: 400 });
    }

    // Try AI LLM (Gemini or Groq) for deep contextual classification first
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    let aiMappedSDGNumber: number | null = null;
    let aiExplanation: string = '';
    let suggestedEcoPoints: number = 25;
    let co2OffsetKg: number = 1.25;

    const prompt = `You are the VerdantIQ Environmental Stability and UN SDG (Sustainable Development Goals) Classifier.
Analyze the following student sustainability action:
Action Description: "${actionDescription}"
OCR Extracted Text from Proof: "${ocrText || 'None'}"
Location: "${locationName || 'Campus'}"
Category: "${category || 'General'}"

Evaluate the 17 UN Sustainable Development Goals:
1: No Poverty, 2: Zero Hunger, 3: Good Health and Well-Being, 4: Quality Education, 5: Gender Equality, 6: Clean Water and Sanitation, 7: Affordable and Clean Energy, 8: Decent Work and Economic Growth, 9: Industry, Innovation and Infrastructure, 10: Reduced Inequalities, 11: Sustainable Cities and Communities, 12: Responsible Consumption and Production, 13: Climate Action, 14: Life Below Water, 15: Life on Land, 16: Peace, Justice and Strong Institutions, 17: Partnerships for the Goals.

Calculate:
1. The single most accurate SDG Goal Number (1 to 17).
2. A concise 1-sentence explanation of why this action directly serves that SDG target.
3. Recommended EcoPoints reward (integer between 10 and 100 based on effort and measurable environmental impact).
4. Estimated Carbon / CO2 avoided in kg (float between 0.2 and 15.0).

Respond STRICTLY in JSON format with keys:
{
  "sdgNumber": <integer 1-17>,
  "sdgName": "<Goal Name>",
  "explanation": "<one sentence>",
  "ecoPoints": <integer 10-100>,
  "co2Kg": <float>,
  "confidenceScore": <float 0.70-0.99>
}`;

    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const resp = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const text = resp.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.sdgNumber >= 1 && parsed.sdgNumber <= 17) {
            aiMappedSDGNumber = parsed.sdgNumber;
            aiExplanation = parsed.explanation;
            suggestedEcoPoints = Number(parsed.ecoPoints) || 25;
            co2OffsetKg = Number(parsed.co2Kg) || 1.25;
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini SDG classification fallback to Groq/Deterministic:', geminiErr);
      }
    }

    if (!aiMappedSDGNumber && groqKey) {
      try {
        const groq = new Groq({ apiKey: groqKey });
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          response_format: { type: 'json_object' },
        });
        const content = completion.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.sdgNumber >= 1 && parsed.sdgNumber <= 17) {
            aiMappedSDGNumber = parsed.sdgNumber;
            aiExplanation = parsed.explanation;
            suggestedEcoPoints = Number(parsed.ecoPoints) || 25;
            co2OffsetKg = Number(parsed.co2Kg) || 1.25;
          }
        }
      } catch (groqErr) {
        console.warn('Groq SDG classification fallback to deterministic NLP:', groqErr);
      }
    }

    // High precision fallback using our deterministic rule classifier
    const fallback = classifyActionToSDG(actionDescription, ocrText);
    const selectedGoal = aiMappedSDGNumber
      ? SDG_GOALS.find((g) => g.number === aiMappedSDGNumber) || fallback.primaryGoal
      : fallback.primaryGoal;

    return NextResponse.json({
      success: true,
      sdg: {
        number: selectedGoal.number,
        name: selectedGoal.name,
        shortName: selectedGoal.shortName,
        color: selectedGoal.color,
        icon: selectedGoal.icon,
        description: selectedGoal.description,
      },
      explanation: aiExplanation || `Direct alignment detected with ${selectedGoal.name} based on actions: ${fallback.matchReasons.join(', ')}.`,
      ecoPoints: suggestedEcoPoints,
      co2Kg: co2OffsetKg,
      confidenceScore: fallback.confidence,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

