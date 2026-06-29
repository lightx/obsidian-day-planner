import moment, { type Moment } from "moment";
import { vi, expect } from "vitest";
import yaml from "js-yaml";

// Use eval-based require to bypass Vite's browser externalization of Node built-ins.
// The conditions: ["browser"] in vite.config.mts causes Vite to replace "path"
// with an empty stub when running in jsdom test environment.
const path: typeof import("path") = eval("require")("path");

window.moment = moment;

// Make requestIdleCallback synchronous in tests so the background batch scheduler
// processes tasks immediately rather than racing against waitUntil's 1000ms timeout.
window.requestIdleCallback = (callback) =>
  window.setTimeout(() => callback({ didTimeout: false, timeRemaining: () => Infinity }), 0) as unknown as number;
window.cancelIdleCallback = (id) => window.clearTimeout(id);

vi.mock("obsidian", () => ({
  TFile: vi.fn(),
  normalizePath: (p: string) => path.normalize(p),
  parseYaml: (source: string) => {
    return yaml.load(source);
  },
  stringifyYaml: (source: unknown) => {
    return yaml.dump(source, { forceQuotes: false });
  },
  Modal: class Modal {
    constructor() {
      throw new Error("Modal is not implemented in tests");
    }
  },
  SuggestModal: class SuggestModal {
    constructor() {
      throw new Error("SuggestModal is not implemented in tests");
    }
  },
  Notice: vi.fn(),
}));


function areMomentsEqual(a: Moment, b: Moment) {
  const isAMomment = moment.isMoment(a);
  const isBMomment = moment.isMoment(b);

  if (isAMomment && isBMomment) {
    return a.isSame(b);
  } else if (!isAMomment && !isBMomment) {
    return undefined;
  }

  return false;
}

expect.addEqualityTesters([areMomentsEqual]);
