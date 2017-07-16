export default function equals(object1, object2) {
  for(let key in object1) {
    if (object1[key] === object2[key]) {
      continue;
    }

    if (!Array.isArray(object1[key]) || !Array.isArray(object2[key])) {
      return false;
    }

    if (object1[key].length !== object2[key].length) {
        return false;
    }

    for(let i = 0, l = object1[key].length; i < l; i++) {
      if (object1[key][i] !== object2[key][i]) {
        return false;
      }
    }
  }

  return true;
}
