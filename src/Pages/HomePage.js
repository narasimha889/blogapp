import React, { useContext } from 'react'
import Base from '../Components/Base'
import UserContext from '../context/UserContext'

function HomePage() {
  const userContextData = useContext(UserContext)
  return (
    <Base>
<div>
        <h1>Welcome to Blogs Application <b>{userContextData.user.islogin && userContextData.user.data.name}</b></h1>
    </div>
    </Base>
    
  )
}

export default HomePage