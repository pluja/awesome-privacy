export const PLATFORM_FILTERS = [["android", "Android"], ["ios", "iOS"], ["desktop", "Desktop"], ["web", "Web"]] as const;

export const PLATFORM_GROUP = {
  android: "android", ios: "ios", linux: "desktop", macos: "desktop", windows: "desktop", desktop: "desktop", cli: "desktop", web: "web", browser: "web",
} as const;
