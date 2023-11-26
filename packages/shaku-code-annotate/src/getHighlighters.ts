import { Highlighter, HighlighterOptions, getHighlighter } from "shiki";
import { codeToShakuHtml } from "./codeToShakuHtml";

interface ShakuHighlighter extends Highlighter {
  codeToShakuHtml: typeof codeToShakuHtml;
}

const shikiHighlighterFetcherStore = new Map<
  string,
  Promise<Array<ShakuHighlighter>>
>();

export async function getShakuHighlighters(options: HighlighterOptions) {
  const key = JSON.stringify(options);
  if (shikiHighlighterFetcherStore.has(key)) {
    return shikiHighlighterFetcherStore.get(key)!;
  }

  const themes = (options == null ? void 0 : options.themes) ?? [
    (options == null ? void 0 : options.theme) ?? "github-light",
  ];

  const highlighterFetcher = Promise.all(
    themes.map((theme) =>
      getHighlighter({
        ...(options ?? {}),
        theme,
        themes: void 0,
      }).then((highlighter) => {
        return Object.assign(highlighter, {
          codeToShakuHtml,
        });
      })
    )
  );
  shikiHighlighterFetcherStore.set(key, highlighterFetcher);
  return highlighterFetcher;
}
