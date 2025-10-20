import { NextRequest, NextResponse } from "next/server";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText, streamText, tool } from "ai";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

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

      fetchHTTP: tool({
        description:
          "esta ferramenta serve para realizar requisição HTTP em uma URL fornecida e acessar sua resposta.",
        parameters: z.object({
          url: z.string().url().describe("URL a ser acessada"),
        }),
        execute: async ({ url }) => {
          const response = await fetch(url);
          const data = await response.text();

          return data;
        },
      }),
    },
    messages,
    maxSteps: 5,
    system: `Sempre responda em Markdown sem aspas no inicio ou fim da mensagem.`,

    onStepFinish({ toolResults }) {
      console.log(toolResults);
    },
  });

  return result.toDataStreamResponse();
}
