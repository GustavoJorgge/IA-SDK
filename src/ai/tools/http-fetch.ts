import { tool } from "ai";
import z from "zod";

export const fetchHTTP = tool({
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
});
