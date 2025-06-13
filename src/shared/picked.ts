const pick = <T extends Record<string,unknown>, K extends keyof T>(obj:T, keys: K[]) => {
 const picked: Partial<T> = {}; 
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
        picked[key] = obj[key];
    }
  }
  return picked;
};

export default pick;