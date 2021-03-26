// Returns an array of just street names that the user will follow during their drive

export const getRouteStreetNames = (route, originString) => {
    // route.routes[0].sections[0].turnByTurnActions is an array of action objects like arrive, turn, continue
    const turnByTurnDirections = route.routes[0].sections[0].turnByTurnActions
    console.log("directions", route.routes[0].sections[0])

    // Removes any action that doesn't contain a nextRoad value, because nextRoad conatins the street names that will be rendered
    // Removes things like depart, arrive, continue
    const filteredStreetNames = turnByTurnDirections.filter(name => name.nextRoad !== undefined)

    // Stores only the key/value pairs that start with "name" or "number"
    // const streetNames = filteredStreetNames.map((actionObj) => Object.fromEntries(Object.entries(actionObj.nextRoad).filter(([key, value]) => key.includes('name') || key.includes('number'))))
    const streetNames = []
    filteredStreetNames.forEach((actionObj) => actionObj.nextRoad.name ? streetNames.push(actionObj.nextRoad.name[0].value) : streetNames.push(actionObj.nextRoad.number[0].value))

    // if the key is called "number", rename it to "name", so all properties are consistent
    // const consistentStreetNames = streetNames.map(nameObj => nameObj.number ? nameObj.name = nameObj.number : nameObj.name = nameObj.name)

    // Returns array of just street names
    // const finalStreetNames = consistentStreetNames.map(streetNameObj => streetNameObj[0].value)

    // Creates a new set of street names where each street is only listed once; removes actions like "continue"
    let finalStreetNamesWithoutDuplicates = [... new Set(streetNames)]

    let finalSpecificStreetNames = []
    // debugger

    if (originString) {

        let splitOrigin = originString.split(" ")
        let [originState] = splitOrigin.splice(-2, 1)
        console.log("originState", originState)

        finalStreetNamesWithoutDuplicates.forEach(name => {

            finalSpecificStreetNames.push(name + " " + originState)
        })
        console.log("finalSpecificStreetNames", finalSpecificStreetNames)
        return finalSpecificStreetNames

        // finalStreetNamesWithoutDuplicates.forEach(name => {
        //     if (name.length < 9) {
        //         finalSpecificStreetNames.push(name + " " +originState)
        //     } else {
        //         finalSpecificStreetNames.push(name + " US")
        //     }
        // })

    //     return finalSpecificStreetNames
    } else {
        console.log("finalStreetNamesWithoutDuplicates", finalStreetNamesWithoutDuplicates)
        return finalStreetNamesWithoutDuplicates
    }
    
}