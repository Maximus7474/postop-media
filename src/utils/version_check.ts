import Logger from "./logger";

const logger = new Logger('VERSION');

function compareVersions(current: string, latest: string): number {
  const parse = (v: string) => {
    const [main, beta] = v.replace('v', '').split('-');
    const parts = (main ?? '0.0.0').split('.').map(Number);

    return {
      parts,
      isBeta: beta?.startsWith('b') ?? false,
    };
  };

  const c = parse(current);
  const l = parse(latest);

  const maxLength = Math.max(c.parts.length, l.parts.length);

  for (let i = 0; i < maxLength; i++) {
    const cPart = c.parts[i] ?? 0;
    const lPart = l.parts[i] ?? 0;

    if (cPart < lPart) return 1;
    if (cPart > lPart) return -1;
  }

  if (c.isBeta && !l.isBeta) return 1;
  if (!c.isBeta && l.isBeta) return -1;

  return 0;
}

export async function checkVersion(currentVersion: string) {
  if (currentVersion === 'dev-build') {
    logger.info(`Running in development mode.`);
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/Maximus7474/postop-media/releases/latest`,
      {
        headers: { 'User-Agent': 'postop-media-updater' },
      },
    );

    if (!response.ok) throw new Error(`${response.status} - ${response.statusText}`);

    const data = (await response.json()) as any;
    const latestVersion = data.tag_name;
    const releaseUrl = data.html_url;

    const comparison = compareVersions(currentVersion, latestVersion);
    const isCurrentBeta = currentVersion.includes('-b');

    if (isCurrentBeta) {
      logger.warn(`Currently running a Beta release: ${currentVersion}`);
      logger.warn(`Latest stable release is: ${latestVersion}`);
      logger.warn(
        `Beta builds are experimental and may contain breaking changes.`,
      );
      logger.warn(`Check for stable updates at: ${releaseUrl}`);
      return;
    }

    if (comparison === 1) {
      logger.warn(
        `You are running an outdated version (v${currentVersion}), a newer stable version is available: ${latestVersion}`,
      );
      logger.warn(`It is highly recommended to update to maintain stability.`);
      logger.warn(`Download: ${releaseUrl}\n`);
    } else if (comparison === 0) {
      logger.success(`Post-OP media is up to date (${currentVersion})`);
    } else {
      logger.info(
        `You are running a development or custom version (${currentVersion})`,
      );
    }
  } catch (err) {
    logger.error(`Could not check for updates:`, (err as Error).message);
  }
}
