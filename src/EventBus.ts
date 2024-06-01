class EventBus {
    eventObject: {
        [key: string]: ((...args: any[]) => void)[];
    };
    constructor() {
      // initialize event list
      this.eventObject = {};
    }
    // publish event
    publish(eventName: string, data: any) {
      // Get all the callback functions of the current event
      const callbackList = this.eventObject[eventName];
  
      if (!callbackList) return console.warn(eventName + " not found!");
  
      // execute each callback function
      for (let callback of callbackList) {
        callback(data);
      }
    }
    // Subscribe to events
    subscribe(eventName: string, callback: (...args: any[]) => void) {
      // initialize this event
      if (!this.eventObject[eventName]) {
        this.eventObject[eventName] = [];
      }
  
      // store the callback function of the subscriber
      this.eventObject[eventName].push(callback);
    }
  }

  export default new EventBus();