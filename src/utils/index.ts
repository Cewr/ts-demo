export function getIn(data: any, keyArray: (string | number)[] = [], defaultData?: any) {
    const obj = data || {};
    if (typeof obj.getIn === 'function') {
        return obj.getIn(keyArray);
    }
    let current = obj;
    for (let i = 0; i < keyArray.length; i += 1) {
        if (current[keyArray[i]] === undefined || current[keyArray[i]] === null) {
            return undefined || defaultData;
        }
        current = current[keyArray[i]];
    }
    return current || defaultData;
}