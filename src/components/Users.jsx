// Let's create Users component using class Components.
import React from 'react'
class Users extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            data : []
        }
    }

    async componentDidMount(){
        const res  = await fetch("")
        const data = await res.json()
        this.setState({data: data})
    }

    render(){
        const {name, login, location} = this.state.data
        return(
            <>
                <h5>{name}</h5>
                <p>{login}</p>
                <p>{location}</p>  
            </>
        )
    }
}
export default Users;