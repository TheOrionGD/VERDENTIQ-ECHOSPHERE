import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.server') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

/**
 * Calls Groq API (fast LLaMA 3 inference)
 */
async function callGroqChat(messages, systemPrompt = '') {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages,
    ],
    temperature: 0.3,
    max_tokens: 1024,
  };

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Calls Google Gemini API
 */
async function callGeminiGenerate(prompt, systemInstruction = '') {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1024,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * AI Service Methods for the 8 Roles
 */

// 1. Institution Admin: Explain Scope 2 Emissions & Reduction Strategies
export async function generateEsgActionPlan(campusMetrics) {
  const prompt = `Analyze this campus electricity consumption data and provide 3 concrete, realistic energy efficiency recommendations:
Total Consumption: ${campusMetrics.kwhConsumed} kWh
Billed Amount: $${campusMetrics.totalCost}
Scope 2 Emissions: ${campusMetrics.scope2EmissionsKg} kg CO2e
Grid Emission Factor: ${campusMetrics.regionalGridFactor} kg CO2e/kWh
Return a concise bullet-point summary suitable for an institutional executive board.`;

  try {
    return await callGroqChat([{ role: 'user', content: prompt }], 'You are an institutional sustainability advisor.');
  } catch (err) {
    console.warn('[AI Service] Groq primary failed, falling back to Gemini:', err.message);
    return await callGeminiGenerate(prompt, 'You are an institutional sustainability advisor.');
  }
}

// 2. Department Moderator: AI Verification Assistant for Student Proofs
export async function reviewStudentEcoProof(challengeTitle, studentNotes) {
  const prompt = `A student submitted an EcoPoint challenge proof.
Challenge: "${challengeTitle}"
Student Submission Notes: "${studentNotes}"

Evaluate whether this submission aligns with the challenge intent.
Provide:
1. Recommendation: [APPROVE / REQUEST_MORE_INFO / REJECT]
2. Suggested moderator feedback message (polite and encouraging).`;

  try {
    return await callGroqChat([{ role: 'user', content: prompt }], 'You are a campus sustainability review assistant.');
  } catch (err) {
    console.warn('[AI Service] Groq proof review failed, falling back to Gemini:', err.message);
    return await callGeminiGenerate(prompt);
  }
}

// 3. MLOps: Forecast Anomaly & Model Commentary
export async function explainForecastVariance(actuals, forecasts, metrics) {
  const prompt = `Compare the electricity demand forecast with recorded data:
Model MAE: ${metrics.mae} kWh
Model RMSE: ${metrics.rmse} kWh
Mean Absolute Percentage Error (MAPE): ${metrics.mape}%
Recent Actuals: ${JSON.stringify(actuals.slice(-3))}
Recent Forecasts: ${JSON.stringify(forecasts.slice(-3))}

Provide a brief technical model diagnostic commentary explaining the variance and whether model parameters should be retuned.`;

  try {
    return await callGeminiGenerate(prompt, 'You are an MLOps energy analytics expert.');
  } catch (err) {
    console.warn('[AI Service] Gemini diagnostic failed, falling back to Groq:', err.message);
    return await callGroqChat([{ role: 'user', content: prompt }]);
  }
}

// 4. Standard User / Household: Personalized Energy Saving Advice
export async function generateHouseholdSavingsTips(appliances, tariff) {
  const prompt = `A household user has the following appliances:
${JSON.stringify(appliances)}
Electricity tariff: $${tariff}/kWh

List 3 specific appliance schedule adjustments (such as shifting off-peak hours) that will reduce their estimated electricity bill.`;

  try {
    return await callGroqChat([{ role: 'user', content: prompt }], 'You are a smart home energy efficiency advisor.');
  } catch (err) {
    console.warn('[AI Service] Groq savings tips failed, falling back to Gemini:', err.message);
    return await callGeminiGenerate(prompt);
  }
}
