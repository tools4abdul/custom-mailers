export function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const DEFAULT_INTRO_MESSAGE =
  "Hey neighbor! Election Day is on November 3 but people are already voting everyday. Have you decided who you're voting for in the U.S. Senate race? Here are some of the reasons I'm supporting Dr. Abdul El-Sayed.";

export const DEFAULT_SUPPORTER_QUOTE =
  "Abdul is a candidate who's going to get money out of politics, put money in our pockets, and pass Medicare for All. I want our gas prices down and our grocery bill lowered. And I want my tax dollars spent here on schools and hospitals instead of on other country's wars.";

export function createPosition() {
  return {
    id: createId('position'),
    issueId: null,
    pointIndexes: [],
  };
}

export function createEmptyContent() {
  return {
    templateId: null,
    colorwayId: null,
    logoId: null,
    candidate: {
      photoId: null,
    },
    positions: [createPosition()],
    intro: {
      message: DEFAULT_INTRO_MESSAGE,
    },
    printSettings: {
      safeMargin: false,
    },
    supporter: {
      enabled: true,
      name: '',
      photo: null,
      blurb: DEFAULT_SUPPORTER_QUOTE,
    },
  };
}

function asString(value) {
  return typeof value === 'string' ? value : '';
}

function asPhoto(value) {
  if (value === null || typeof value !== 'object' || typeof value.dataUrl !== 'string') {
    return null;
  }
  return {
    dataUrl: value.dataUrl,
    width: Number(value.width) || 0,
    height: Number(value.height) || 0,
    bytes: Number(value.bytes) || 0,
  };
}

function asPosition(value) {
  if (value === null || typeof value !== 'object') {
    return createPosition();
  }
  const pointIndexes = Array.isArray(value.pointIndexes)
    ? [...new Set(value.pointIndexes.filter((index) => Number.isInteger(index) && index >= 0))].sort(
        (a, b) => a - b
      )
    : [];
  return {
    id: typeof value.id === 'string' ? value.id : createId('position'),
    issueId: typeof value.issueId === 'string' ? value.issueId : null,
    pointIndexes,
  };
}

export function normalizeContent(raw) {
  const defaults = createEmptyContent();
  if (raw === null || typeof raw !== 'object') {
    return defaults;
  }

  const candidate = raw.candidate ?? {};
  const intro = raw.intro ?? {};
  const printSettings = raw.printSettings ?? {};
  const supporter = raw.supporter ?? {};
  const positions = Array.isArray(raw.positions) ? raw.positions.map(asPosition) : [];

  return {
    templateId: typeof raw.templateId === 'string' ? raw.templateId : null,
    colorwayId: typeof raw.colorwayId === 'string' ? raw.colorwayId : null,
    logoId: typeof raw.logoId === 'string' ? raw.logoId : null,
    candidate: {
      photoId: typeof candidate.photoId === 'string' ? candidate.photoId : null,
    },
    intro: {
      message: typeof intro.message === 'string' && intro.message.trim() !== '' ? intro.message : DEFAULT_INTRO_MESSAGE,
    },
    printSettings: {
      safeMargin: printSettings.safeMargin === true,
    },
    positions: positions.length === 0 ? defaults.positions : positions,
    supporter: {
      enabled: supporter.enabled === true,
      name: asString(supporter.name),
      photo: asPhoto(supporter.photo),
      blurb: typeof supporter.blurb === 'string' && supporter.blurb.trim() !== '' ? supporter.blurb : DEFAULT_SUPPORTER_QUOTE,
    },
  };
}

export function isBlankContent(content) {
  const hasCandidate = content.candidate.photoId !== null;
  const hasPositions = content.positions.some((position) => position.issueId !== null);
  const hasIntro = content.intro.message !== DEFAULT_INTRO_MESSAGE;
  const hasSupporter =
    content.supporter.name.trim() !== '' ||
    content.supporter.blurb.trim() !== '' ||
    content.supporter.photo !== null;

  return !hasCandidate && !hasPositions && !hasIntro && !hasSupporter;
}
