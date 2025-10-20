import { NextRequest, NextResponse } from "next/server";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText, streamText, tool } from "ai";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const result = streamText({
    model: openrouter.chat("openai/gpt-4o"),
    tools: {
      profileAndUrls: tool({
        description:
          "Esta ferramenta serve para buscar dados de um usuario no github ou acessar URLS da API para outras informações relacionadas ao github.",
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

      organization: tool({
        description:
          "esta ferramenta serve para realizar requisição HTTP em uma URL fornecida e acessar sua resposta.",
        parameters: z.object({
          url: z.string().url().describe("URL a ser acessada"),
        }),
        execute: async ({ url }) => {
          const response = await fetch(url);
          const data = await response.text();

          return JSON.stringify(data);
        },
      }),
    },
    prompt: "Me dê a lista de usuários que o gustavojorgge segue no github?",
    maxSteps: 5,

    onStepFinish({ toolResults }) {
      console.log(toolResults);
    },
  });

  return result.toDataStreamResponse();
}
