import { Route, Redirect } from "react-router-dom"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { userStorageKey } from "./auth/authSettings"
import { RoutePage } from "./routes/RoutePage"
import { RouteProvider } from "./routes/RouteProvider"
import { TrafficProvider } from "./routes/TrafficProvider"
// debugger
export const Checkpoint = () => {
  return (
    <>
      <Route render={() => {
        if (sessionStorage.getItem(userStorageKey)) {
          return (
            <>
              <RouteProvider>
                <TrafficProvider>
                  <Route exact path="/">
                    <RoutePage />
                  </Route>
                </TrafficProvider>
              </RouteProvider>
            </>
          )
        } else {
          return <Redirect to="/login" />;
        }
      }} />

      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
    </>
  )
}
