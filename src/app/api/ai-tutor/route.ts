import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, actionType, imageUrl, subject, targetExam } = body;

    const geminiKey = process.env.GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    // If Gemini key is available, call Google Gemini 1.5 Flash
    if (geminiKey && !geminiKey.includes('your-gemini-api-key')) {
      const systemInstruction = `You are StudyVerse AI, an expert exam preparation tutor specializing in ${targetExam || 'Competitive Exams'} (${subject || 'All Subjects'}).
Action requested: ${actionType || 'explain'}.
Tone: Encouraging, precise, pedagogical, structured with formulas, step-by-step logic, and final key takeaways.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\nUser Question:\n${prompt}` }],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
        return NextResponse.json({ reply: replyText, configured: true });
      }
    }

    // If OpenAI key is available, call OpenAI chat completions
    if (openAiKey && !openAiKey.includes('your-openai-api-key')) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are StudyVerse AI, an expert academic tutor for ${targetExam || 'Exams'}. Mode: ${actionType}. Provide structured step-by-step guidance.`,
            },
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.choices?.[0]?.message?.content || 'No response generated.';
        return NextResponse.json({ reply: replyText, configured: true });
      }
    }

    // If no AI key is configured, return the required configuration indicator & fallback tutoring response
    const fallbackResponses: Record<string, string> = {
      solve: `### 📝 Step-by-Step Solution Breakdown:
1. **Identify Given Data**: Extract known variables, physical constraints, and boundary conditions.
2. **Fundamental Governing Principle**: Apply the core theorem (e.g., Einstein's photoelectric law: $K_{max} = h\\nu - \\Phi$ or Newton's second law: $\\Sigma F = ma$).
3. **Algebraic Substitution**: Substitute values ensuring consistent SI units.
4. **Calculated Result**: The evaluated outcome simplifies neatly.
5. **Key Takeaway for Exam**: Note how sign conventions and unit conversions often trap unwary aspirants.`,

      explain: `### ⚡ Conceptual Clarification:
Let's break down this concept from first principles:
- **Intuition**: Think of this as energy conservation across potential barriers.
- **Mathematical Formula**: The rate of change is proportional to the gradient.
- **High-Yield Exam Trap**: Always verify whether the question assumes an ideal or non-ideal scenario!`,

      hint: `### 💡 Strategic Hint:
- Try applying energy conservation between the initial and final states rather than tracking forces over time.
- Check if any symmetry allows canceling out vector components!`,

      summarize: `### 📋 Chapter Summary Cheatsheet:
- **Core Definitions**: 3 primary laws governing the phenomenon.
- **Must-Memorize Formulas**: Check dimensionality and standard limits.
- **Previous Year Frequency**: High yield (appears in 80% of recent papers).`,

      notes: `### 📑 Revision Short Notes:
- **Definition**: Exact NCERT/standard textbook definition.
- **Key Equations**: Master the derivation shortcuts.
- **Common Mistakes**: Forgetting to convert Celsius to Kelvin or cm to meters.`,

      flashcards: `### 🃏 Rapid Flashcard Drill:
**Q1**: What is the threshold frequency?
*A1*: The minimum frequency of incident radiation below which no photoemission occurs.

**Q2**: Is kinetic energy dependent on intensity?
*A2*: No! Maximum KE depends strictly on frequency, while intensity determines current.`,

      quiz: `### ❓ Quick 3-Question Diagnostic:
1. What happens when the wavelength of incident photons is halved?
2. Name the semiconductor device used for voltage stabilization.
3. State Kirchhoff's Current Law and its underlying conservation principle.`,
    };

    const actionKey = (actionType as string) || 'explain';
    const fallbackText = fallbackResponses[actionKey] || fallbackResponses['explain'];

    return NextResponse.json({
      reply: `${fallbackText}\n\n> *Note: AI API Key not configured in .env.local. Add GEMINI_API_KEY or OPENAI_API_KEY to enable live multimodal LLM responses.*`,
      configured: false,
      notice: 'AI API Key not configured in .env.local. To connect real-time Gemini, set GEMINI_API_KEY.',
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
