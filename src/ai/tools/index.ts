import { ToolCallUnion,  ToolResultUnion } from "ai";
import { GithubProfile } from "./github-profile";
import { fetchHTTP } from "./http-fetch";

export type AIToolSet = ToolCallUnion<typeof tools>;
export type AIToolResult = ToolResultUnion<typeof tools>;

export const tools = {
  GithubProfile,
  fetchHTTP,
};
