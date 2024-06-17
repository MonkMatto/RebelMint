const fetchDataFromUri = async (uri: string) => {
    try {
        const response = await fetch(uri)
        if (!response.ok) {
            throw new Error(
                `Error fetching data from ${uri}: ${response.statusText}`
            )
        }
        return await response.json()
    } catch (error: any) {
        throw new Error(`Error fetching data from ${uri}: ${error.message}`)
    }
}

export default fetchDataFromUri
