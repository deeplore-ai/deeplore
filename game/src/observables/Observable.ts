type Callback = (...data: any[]) => void;

export class Observable<Events extends Record<string, Callback>> {
  observers: Partial<Record<keyof Events, Array<Callback>>> = {};

  on<K extends keyof Events>(event: K, callback: Events[K]) {
    if (!this.observers[event]) {
      this.observers[event] = [];
    }
    this.observers[event]?.push(callback);
  }

  off<K extends keyof Events>(event: K, callback: Events[K]) {
    const index = this.observers[event]?.indexOf(callback);
    if (index !== undefined && index > -1) {
      this.observers[event]?.splice(index, 1);
    }
  }

  emit<K extends keyof Events>(event: K, ...data: Parameters<Events[K]>) {
    this.observers[event]?.forEach((callback) => {
      callback(...data);
    });
  }
}
