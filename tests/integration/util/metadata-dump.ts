import type { Moment } from "moment";
import type { CachedMetadata } from "obsidian";
import { check, isNotVoid } from "typed-assert";

import { createInMemoryFile, type InMemoryFile } from "../../util/fakes";

const dailyNoteFileNames = ["2025-07-19", "2025-07-20", "2025-07-28"];

const fixturesDirPath = "fixtures";
const dumpPath = `${fixturesDirPath}/metadata-dump/tasks.json`;
const fixtureVaultPath = `${fixturesDirPath}/fixture-vault`;

// Use eval-based require to bypass Vite's browser externalization of Node built-ins.
// The conditions: ["browser"] in vite.config.mts causes Vite to replace node:fs/promises
// and node:path with empty stubs, breaking integration tests that read fixture files.
const fsPromises: typeof import("node:fs/promises") = eval("require")("node:fs/promises");
const posixPath: typeof import("node:path").posix = eval("require")("node:path").posix;
const { join } = posixPath;

export async function loadMetadataDump(props: {
  loadedFixtures?: string[];
}): Promise<{
  inMemoryFiles: InMemoryFile[];
  inMemoryDailyNotes: { path: string; file: InMemoryFile; date: Moment }[];
  cachedMetadata: Record<string, CachedMetadata>;
}> {
  const { loadedFixtures } = props;

  const allFiles = await fsPromises.readdir(fixtureVaultPath);

  const inMemoryFiles = await Promise.all(
    allFiles
      .filter((file) => (loadedFixtures ? loadedFixtures.includes(file) : true))
      .map(async (file) => {
        const filePath = join(fixtureVaultPath, file);

        const stats = await fsPromises.stat(filePath);

        if (!stats.isFile()) {
          throw new TypeError(
            `Only files are supported in fixture vault, not this: ${filePath}`,
          );
        }

        const contents = await fsPromises.readFile(filePath, "utf8");
        return createInMemoryFile({ path: filePath, contents });
      }),
  );

  const rawMetadataDump = await fsPromises.readFile(dumpPath, "utf-8");

  const metadataDump = JSON.parse(rawMetadataDump);
  const { cachedMetadata } = metadataDump;
  const pathToInMemoryFile = Object.fromEntries(
    inMemoryFiles.map((it) => [it.path, it]),
  );

  const inMemoryDailyNotes = dailyNoteFileNames
    .map((it) => {
      const path = join(fixtureVaultPath, `${it}.md`);
      const file = pathToInMemoryFile[path];

      if (!file) {
        return undefined;
      }

      return { path, file, date: window.moment(it) };
    })
    .filter(check(isNotVoid));

  return {
    inMemoryFiles,
    inMemoryDailyNotes,
    cachedMetadata,
  };
}