import { Observable } from "./Observable";

export const speechObserver = new Observable<{
  speech: (transcript: string) => void;
}>();
