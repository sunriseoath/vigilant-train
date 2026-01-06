const STORAGE_KEY = "timeback-dungeon-timeline";

export const loadTimeline = () => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Failed to parse timeline", error);
    return null;
  }
};

export const saveTimeline = (timeline) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(timeline));
};
