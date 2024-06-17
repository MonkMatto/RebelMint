const findValueByVersionPrefix = (obj: any, version: string) => {
    const prefix = version.split('j')[0]
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && key.startsWith(prefix)) {
            const keyPrefix = key.split('j')[0]
            if (keyPrefix === prefix) {
                return obj[key]
            }
        }
    }
    return null
}

export default findValueByVersionPrefix
