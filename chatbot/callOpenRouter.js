const quickPrompt = require("./prompts/quickPrompt");
const deepThinkPrompt = require("./prompts/deepThinkPrompt");
const { generateProjectPrompt } = require("./prompts/projectAssistant");

async function callOpenRouter(
  { mode, prompt: userMessage },
  projectId,
  userId
) {
  let systemPrompt;

  if (mode === "deep") {
    systemPrompt = deepThinkPrompt;
  } else if (mode === "project") {
    if (!projectId) {
      return {
        success: false,
        message: "Project ID is required for project mode.",
      };
    }
    const projectContext = await generateProjectPrompt(userId, projectId);
    systemPrompt = `${projectContext}\n\nUser Query: ${userMessage}`;
  } else {
    systemPrompt = quickPrompt;
  }

  const model = "deepseek/deepseek-chat";

  const payload = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  };

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
        "HTTP-Referer": "http://127.0.0.1:5500",
        "X-Title": "SandyAI",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "No response.";
    return { success: true, reply };
  } catch (err) {
    console.error("OpenRouter error:", err.message);
    return { success: false, message: "AI API request failed." };
  }
}

module.exports = callOpenRouter;
