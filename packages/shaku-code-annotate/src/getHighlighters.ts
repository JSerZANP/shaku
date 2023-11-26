import { Highlighter, HighlighterOptions, getHighlighter } from "shiki";
import { codeToShakuHtml } from "./codeToShakuHtml";

export interface ShakuHighlighter extends Highlighter {
  codeToShakuHtml: typeof codeToShakuHtml;
  fallbackToShiki?: boolean; // default true
}

const shikiHighlighterFetcherStore = new Map<
  string,
  Promise<Array<ShakuHighlighter>>
>();

export type ShakuHighlighterOptions = HighlighterOptions & {
  fallbackToShiki?: boolean; // default true
};

export async function getShakuHighlighters(options: ShakuHighlighterOptions) {
  const key = JSON.stringify(options);
  if (shikiHighlighterFetcherStore.has(key)) {
    return shikiHighlighterFetcherStore.get(key)!;
  }

  const themes = options.themes ?? [options.theme ?? "github-light"];

  const highlighterFetcher = Promise.all(
    themes.map((theme) =>
      getHighlighter({
        ...(options ?? {}),
        theme,
        themes: undefined,
      }).then((highlighter) => {
        return Object.assign(highlighter, {
          codeToShakuHtml,
          fallbackToShiki: options.fallbackToShiki,
        });
      })
    )
  );
  shikiHighlighterFetcherStore.set(key, highlighterFetcher);
  return highlighterFetcher;
}
