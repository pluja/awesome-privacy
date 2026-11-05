import { headingId } from "../../../scripts/labels.ts";

// One logo per project name, shared by every section that lists it.
export const logoId = (name: string) => headingId(name.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\s+/g, " ")).replace(/-+/g, "-");
// Kept apart so a listed project and an avoided service with the same name never share a logo.
export const avoidLogoId = (name: string) => `avoid-${logoId(name)}`;
