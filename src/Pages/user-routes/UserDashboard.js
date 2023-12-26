import React, { useEffect, useState } from 'react'
import AddPost from '../../Components/AddPost'
import { Col, Container, Row } from 'reactstrap'
import { getCurrentUserDetail } from '../../auth'
import { deletePostsById, getPostsByUser } from '../../Services/post-service.js'
import Post from '../../Components/Post'
import { toast } from 'react-toastify'

const UserDashboard=()=> {
  const [user,setUser]=useState({})
  const [posts,setPosts]=useState([])
  useEffect(()=>{
    setUser(getCurrentUserDetail());
    loadAllPosts()
  },[])
  function loadAllPosts(){
    getPostsByUser(getCurrentUserDetail().id).then(data=>{
      setPosts([...data])
    }).catch(error=>{
      console.log(error)
    })
  }
  //delete post
  function deletePost(post){
    deletePostsById(post.postId).then(res=>{
      toast.success('Post Deleted Successfully !!')
      let newPosts = posts.filter(p=>p.postId!=post.postId)
      setPosts([...newPosts])
    }).catch(error=>{
      console.log(error)
    })
  }
  return (
    
    <div>
    <Container>
    <AddPost/>
    <Row>
      <Col md={{size:10,offset:1}}>
      <h4 className='mt-2'>Posts ({posts ? posts.length : 0})</h4>
      </Col>
    </Row>
    <Row className='mb-3'>
      <Col md={{size:10,offset:1}}>
      {
        posts && posts.map((post,index)=>(
          <Post post={post} key={index} deletePost={deletePost}/>
        ))
      }
      </Col>
    </Row>
      
      </Container>
    </div>
  )
}

export default UserDashboard