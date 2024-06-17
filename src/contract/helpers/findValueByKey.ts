const findValueByKey = (obj: any, keyName: string) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && key.startsWith(keyName)) {
            const keyPrefix = key.split('j')[0]
            if (keyPrefix === keyName) {
                return obj[key]
            }
        }
    }
    return null
}

export default findValueByKey
