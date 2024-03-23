import React from "react";
import Views from "./components/Views.jsx";
import {UserContext} from "./components/AccountContext.jsx";




export default function App () {

    return (
        <UserContext>
          <Views />
        </UserContext>
    )
}
