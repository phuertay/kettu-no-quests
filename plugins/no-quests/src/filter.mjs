export const QUEST_URL = /(?:^|\/)quests(?:\/|$|\?)/i;
export const QUEST_ACTION = /^QUESTS_/;

export function urlOf(arg) {
  if (typeof arg === "string") return arg;
  if (arg && typeof arg === "object" && "url" in arg) return String(arg.url ?? "");
  return "";
}

export function isQuestUrl(...args) {
  return args.some((arg) => QUEST_URL.test(urlOf(arg)));
}

export function isQuestAction(action) {
  const type = action?.type;
  return typeof type === "string" && QUEST_ACTION.test(type);
}

export const EMPTY_QUESTS = { quests: [], excluded_quests: [] };
