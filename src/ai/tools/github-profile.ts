import { github } from "@/lib/octokit";
import { tool } from "ai";
import { setTimeout } from "timers/promises";
import z from "zod";

export const GithubProfile = tool({
  description:
    "Esta ferramenta serve para buscar dados de um usuario no github ou acessar URLS da API para outras informações relacionadas ao github.",
  parameters: z.object({
    username: z.string().describe("Nome do usuario no github"),
  }),
  execute: async ({ username }) => {
    await setTimeout(2000);

    const response = await github.users.getByUsername({ username });

    return response.data;
  },
});
