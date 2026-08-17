# kettu-no-quests

Kettu plugin that disables Discord Quests on mobile (Kettu / Bunny / Vendetta).

It blocks quest REST calls, empties the quest store, and drops `QUESTS_*` Flux events so quest tabs, badges, and prompts have nothing to show.

## Install

In Kettu: **Settings → Plugins → +** and paste one of:

```
https://phuertay.github.io/kettu-no-quests/no-quests
https://cdn.jsdelivr.net/gh/phuertay/kettu-no-quests/dist/no-quests
```

## Develop

```bash
bash scripts/setup-agent-tools.sh
pnpm test
pnpm build
```

Agent tools used by this repo: [ponytail](https://github.com/DietrichGebert/ponytail), [caveman](https://github.com/JuliusBrussee/caveman), [token-savior](https://github.com/Mibayy/token-savior).
