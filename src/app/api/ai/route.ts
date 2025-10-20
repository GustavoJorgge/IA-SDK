import { NextRequest } from "next/server";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { tools } from "./../../../ai/tools/index";

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const result = streamText({
    model: openrouter.chat("openai/gpt-4o"),
    tools,
    messages,
    maxSteps: 5,
    system: `Sempre responda em Markdown sem aspas no inicio ou fim da mensagem.`,
  });

  return result.toDataStreamResponse();
}
