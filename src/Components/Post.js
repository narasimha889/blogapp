import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardText } from 'reactstrap'
import { getCurrentUserDetail, isLoggedIn } from '../auth'
import UserContext from '../context/UserContext.js'

function Post({post={id:-1,title:"This is default post title",content:"This is default title",},deletePost}) {
    const [user,setUser]=useState(null)
    const userContextData = useContext(UserContext)
    const [login,setLogin]=useState(false)
    useEffect(()=>{
        setUser(getCurrentUserDetail())
        setLogin(isLoggedIn())
    },[])
    var dotStr = '';
    if(post.content.replace( /(<([^>]+)>)/ig, '').trim().length>60){
        dotStr='...'
    }
  return (
    <div>
        <Card className='mt-2'>
        <CardHeader>{post.title}</CardHeader>
            <CardBody>
                <CardText dangerouslySetInnerHTML={{__html:post.content.substring(0,60)+dotStr}}>
                 
                </CardText>
                <div>
                    <Link className='btn btn-secondary' to={"/posts/"+post.postId}>Read More</Link>
                    {
                        userContextData.user.islogin && (user && user.id==post.user.id) ? <Button color='warning' className='ms-2' tag={Link} to={`/user/update-post/${post.postId}`}>Update</Button> : ""
                    }
                    {
                        userContextData.user.islogin && (user && user.id==post.user.id) ? <Button color='danger' className='ms-2' onClick={()=>deletePost(post)}>Delete</Button> : ""
                    }
                    
                </div>
            </CardBody>
        </Card>
    </div>
  )
}

export default Post