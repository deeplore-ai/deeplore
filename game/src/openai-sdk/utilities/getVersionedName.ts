import { version } from "../version";

export function getVersionedName(name: string) {
  return `v${version}__${name}`;
}
