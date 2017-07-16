export default function createEmitter() {
  let listeners = [];
  let isEmitting = false;

  return {
    subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Expected listener to be a function.')
      }

      var isSubscribed = true

      listeners.push(listener)

      return function unsubscribe() {
        if (!isSubscribed) {
          return
        }

        isSubscribed = false

        var index = listeners.indexOf(listener)
        listeners.splice(index, 1)
      }
    },

    emit() {
      if (isEmitting) { return; }

      isEmitting = true;
      for (let i = 0, l=listeners.length; i < l; i++) {
        listeners[i]()
      }
      isEmitting = false;
    }
  };
}


