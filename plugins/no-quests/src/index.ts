import { logger } from "@vendetta";
import { findByProps, findByStoreName } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { EMPTY_QUESTS, isQuestAction, isQuestUrl } from "./filter.mjs";

const patches: Array<() => void> = [];

function emptyGet() {
  return Promise.resolve({
    status: 200,
    ok: true,
    body: EMPTY_QUESTS,
    text: JSON.stringify(EMPTY_QUESTS),
  });
}

function emptyOk() {
  return Promise.resolve({
    status: 204,
    ok: true,
    body: {},
    text: "",
  });
}

function patch(unpatch: (() => void) | undefined) {
  if (typeof unpatch === "function") patches.push(unpatch);
}

function restClient() {
  const mod = findByProps("getAPIBaseURL", "get") ?? findByProps("getAPIBaseURL");
  if (!mod) return null;
  if (typeof mod.get === "function" && typeof mod.post === "function") return mod;
  if (mod.HTTP && typeof mod.HTTP.get === "function") return mod.HTTP;
  if (mod.default && typeof mod.default.get === "function") return mod.default;
  return null;
}

function questStore() {
  return (
    findByStoreName("QuestsStore") ||
    findByStoreName("QuestStore") ||
    findByProps("getQuest", "quests")
  );
}

function clearQuests(store: any) {
  const quests = store?.quests;
  if (!quests) return;
  if (typeof quests.clear === "function") quests.clear();
  else if (typeof quests === "object") {
    for (const key of Object.keys(quests)) delete quests[key];
  }
}

export default {
  onLoad() {
    try {
      const FluxDispatcher = findByProps("dispatch", "subscribe");
      if (FluxDispatcher?.dispatch) {
        patch(
          instead("dispatch", FluxDispatcher, (args, orig) => {
            if (isQuestAction(args[0])) return;
            return orig(...args);
          }),
        );
      }

      const http = restClient();
      if (http) {
        for (const method of ["get", "post", "put", "patch", "del", "delete"] as const) {
          if (typeof http[method] !== "function") continue;
          patch(
            instead(method, http, (args, orig) => {
              if (!isQuestUrl(...args)) return orig(...args);
              return method === "get" ? emptyGet() : emptyOk();
            }),
          );
        }
      }

      const store = questStore();
      if (store) {
        clearQuests(store);
        if (typeof store.getQuest === "function") patch(instead("getQuest", store, () => null));
        if (typeof store.getQuests === "function") patch(instead("getQuests", store, () => []));
        if (typeof store.isFetchingCurrentQuests === "function") {
          patch(instead("isFetchingCurrentQuests", store, () => false));
        }
      }

      logger.log("NoQuests: Discord quests disabled");
    } catch (e) {
      logger.error("NoQuests: failed to patch", e);
    }
  },
  onUnload() {
    while (patches.length) patches.pop()?.();
  },
};
