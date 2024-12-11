export const pickFunction = (data, keys) => {
    let result = {}
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (
            data &&
            data.hasOwnProperty.call(data, key) &&
            data[key] !== undefined
        ) {
            result[key] = data[key]
        }
    }
    return result
}
