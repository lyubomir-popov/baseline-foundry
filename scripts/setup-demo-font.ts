import fs from "node:fs/promises";
import path from "node:path";

interface FontAsset {
  fileName: string;
  url: string;
  localSourcePath?: string;
}

const FONT_ASSETS: FontAsset[] = [
  {
    fileName: "UbuntuSans[wdth,wght].ttf",
    url: "https://github.com/google/fonts/raw/main/ofl/ubuntusans/UbuntuSans%5Bwdth%2Cwght%5D.ttf"
  },
  {
    fileName: "IBMPlexSansVar-Roman.woff",
    url: "https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-sans:vf@latest/latin-wght-normal.woff"
  }
];

async function downloadFile(url: string, destinationPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(destinationPath, Buffer.from(arrayBuffer));
}

async function copyLocalFile(sourcePath: string, destinationPath: string): Promise<void> {
  await fs.copyFile(sourcePath, destinationPath);
}

async function fileExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const fontsDir = path.resolve("assets/fonts");
  await fs.mkdir(fontsDir, { recursive: true });

  for (const asset of FONT_ASSETS) {
    const destinationPath = path.join(fontsDir, asset.fileName);

    if (await fileExists(destinationPath)) {
      console.log(`Using existing font: ${destinationPath}`);
      continue;
    }

    if (asset.localSourcePath && (await fileExists(asset.localSourcePath))) {
      await copyLocalFile(asset.localSourcePath, destinationPath);
      console.log(`Copied local font: ${destinationPath}`);
      continue;
    }

    await downloadFile(asset.url, destinationPath);
    console.log(`Downloaded font: ${destinationPath}`);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
