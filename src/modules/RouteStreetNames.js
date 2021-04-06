// Returns an array of just street names that the user will follow during their drive

export const getRouteStreetNames = (route, originString) => {
    // route.routes[0].sections[0].turnByTurnActions is an array of action objects like arrive, turn, continue
    const turnByTurnDirections = route.sections[0].turnByTurnActions

    // Removes any action that doesn't contain a nextRoad value, because nextRoad conatins the street names that will be rendered
    // Removes things like depart, arrive, continue
    const filteredStreetNames = turnByTurnDirections.filter(name => name.nextRoad !== undefined)

    // Stores only the key/value pairs that start with "name" or "number"
    const streetNames = []
    filteredStreetNames.forEach((actionObj) => actionObj.nextRoad.name ? streetNames.push(actionObj.nextRoad.name[0].value) : streetNames.push(actionObj.nextRoad.number[0].value))

    // Creates a new set of street names where each street is only listed once; removes actions like "continue"
    let finalStreetNamesWithoutDuplicates = [... new Set(streetNames)]

    let finalSpecificStreetNames = []

    if (originString) {

        let splitOrigin = originString.split(" ")
        let [originState] = splitOrigin.splice(-2, 1)

        finalStreetNamesWithoutDuplicates.forEach(name => {

            finalSpecificStreetNames.push(name + " " + originState)
        })
        console.log('finalSpecificStreetNames: ', finalSpecificStreetNames);
        return finalSpecificStreetNames

    } else {
        console.log('finalStreetNamesWithoutDuplicates: ', finalStreetNamesWithoutDuplicates);
        return finalStreetNamesWithoutDuplicates
    }
    
}