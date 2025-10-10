import { NextRequest, NextResponse } from "next/server";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText, tool } from "ai";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const result = await generateText({
    model: openrouter.chat("openai/gpt-4o"),
    tools: {
      github: tool({
        description:
          "Esta ferramenta serve para buscar dados de um usuario no github",
        parameters: z.object({
          username: z.string().describe("Nome do usuario no github"),
        }),
        execute: async ({ username }) => {
          const response = await fetch(
            `https://api.github.com/users/${username}`
          );
          const data = await response.json();

          return JSON.stringify(data);
        },
      }),
    },
    prompt: "Quantos repositórios publicos gustavojorgge possui no github?",
    system:
      "Você é um tradutor de textos, sempre retorne da maneira mais sucista possivel",
  });

  return NextResponse.json({ message: result.text, parts: result.toolResults });
}
