# CheckPoint

## Description

The app allows an authorized user to save routes, such as home to work or home to their child's school. Then the user can check traffic on that route to see if there are any traffic incidents.

---
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-ReactJS%2C%20ReactBootstrap%2C%20HERE%20Traffic%20API%2C%20HERE%20Geocode%20API%2C%20HERE%20Route%20API-blue)

## Features
* User can create a new route using the form at the bottom of the page by providing a route title, origin address, and destination address
    * When all fields are complete, the app will automatically calculate and display the users street by street route path
* On Save, the new route will display in the Saved Routes section
* User can click Edit to change the route title, origin address, or destination address
    * User can click View Route Path to see new route based on updated origin and destination
* User can click Check Traffic to view real time traffic incidents; if there are no incidents on their route, the user will see an all clear message
* User can click Delete to remove a route from their Saved Routes

---
## Background

Some time ago it was standard practice for people to leave their houses every day and drive to another location for work. 

When I participated in this practice, it never failed that on the most stressful days, when everything had already gone as wrong as possible, I would be driving home from work and traffic was at a standstill right before my interstate exit. And every time I would ask myself why didn't I just check the traffic before I left!

So, I created CheckPoint so that I can get ahead of traffic incidents instead if always being stuck behind them.

---

## Installation

### Requirements

[json-server](https://www.npmjs.com/package/json-server)

### Instructions for Use
1. Clone or fork this repository to your machine
1. Go to [HERE API](https://developer.here.com), create an account and an API Key for REST API
3. Make a copy of the .env.example file, remove the .example extension, and add your API Key
1. **Make sure `.env` is listed inside your .gitignore file** 
5. Using [json-server](https://www.npmjs.com/package/json-server), serve `db.json` from the `api/` directory
2. run `npm start` from the root directory to launch app

### Note

The current version of the app can only be used when origin and destination are inside the same state. 

---
## Support

* Please fill out an issue ticket if you run into any major issues or bugs that should be addressed.
* If you have access to the Nashville Software School slack, you can send a message to `@Kaitlin Kelley`

---
## Roadmap

### Future features could include:

* Allow a user to choose between multiple route paths when they enter origin and destination
* Implement auto traffic check that updates all routes on page load and then checks periodically as long as the app is open
* Add icons that will display on the route to indicate types of incidents instead of full incident message
* Add Details button that the user can click to display full incident message
* When user clicks Delete they should be prompted to confirm before delete proceeds
* Display duration of route as of the time the user is checking (Drive time will fluctuate depending on incidents)
* Add visual map so the user see their route and incidents on a map
* After visual map implementation, user can click and drag on the map to edit their route without changing origin or destination
---
## Contributing

The more the merrier! Please feel free to fork this repository and create a pull request with any changes or improvements you can think of. 

---
### Authors & Acknowledgements

Created by [Kaitlin Kelley](https://github.com/kjk1325).

Supported by my amazing mentor [Jisie David](https://github.com/jisie) and team members at [Nashville Software School](https://nashvillesoftwareschool.com)

---

## License

Open source.