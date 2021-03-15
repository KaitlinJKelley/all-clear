import { Route, Redirect } from "react-router-dom"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { userStorageKey } from "./auth/authSettings"
import { RoutePage } from "./routes/RoutePage"
// debugger
export const Checkpoint = () => {
  return (
    <>
      <Route render={() => {
        if (sessionStorage.getItem(userStorageKey)) {
          return (
            <>
              <RoutePage />
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
