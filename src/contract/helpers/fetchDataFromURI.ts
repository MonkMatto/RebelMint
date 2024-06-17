const fetchDataFromURI = async (uri: string) => {
    const response = await fetch(uri)
    if (!response.ok) {
        throw new Error(
            `Error fetching data from ${uri}: ${response.statusText}`
        )
    }
    return response.json()
}

export default fetchDataFromURI
