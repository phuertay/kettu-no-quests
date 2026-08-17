import { test } from "node:test";
import assert from "node:assert/strict";
import { isQuestUrl, isQuestAction, urlOf } from "./filter.mjs";

test("matches Discord quest REST paths and ignores unrelated URLs", () => {
  assert.equal(isQuestUrl("/quests/@me"), true);
  assert.equal(isQuestUrl({ url: "/quests/123/enroll" }), true);
  assert.equal(isQuestUrl("https://discord.com/api/v9/quests/@me"), true);
  assert.equal(isQuestUrl("/quests?locale=en-US"), true);
  assert.equal(isQuestUrl("/channels/1/messages"), false);
  assert.equal(isQuestUrl("/guilds/1/preview"), false);
  assert.equal(isQuestUrl({ url: "/users/@me" }), false);
  assert.equal(urlOf({ url: "/quests/@me" }), "/quests/@me");
});

test("matches QUESTS_ Flux actions only", () => {
  assert.equal(isQuestAction({ type: "QUESTS_FETCH_CURRENT_QUESTS_BEGIN" }), true);
  assert.equal(isQuestAction({ type: "QUESTS_ENROLL_SUCCESS" }), true);
  assert.equal(isQuestAction({ type: "MESSAGE_CREATE" }), false);
  assert.equal(isQuestAction({ type: "CONQUEST_UNLOCK" }), false);
  assert.equal(isQuestAction({}), false);
});
