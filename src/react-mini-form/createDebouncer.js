export default function createDebouncer(wait) {
  let timeouts = {};
  return (name, cb) => {
    clearTimeout(timeouts[name]);
    timeouts[name] = setTimeout(() => {
      Reflect.deleteProperty(timeouts, name);
      cb(name);
    }, wait);
  };
}
