import { useRouteError } from "react-router-dom"
const ErrorPage = () =>{
    const err = useRouteError()
    console.error(err)
    return(
        <>
            <h1>Error!</h1>
            <h2>{err.status} : {err.statusText}</h2>
        </>
    )
}

export default ErrorPage;