import React, { useContext, useEffect, useState } from 'react'
import Base from '../Components/Base'
import { useParams } from 'react-router-dom'
import { addComment, deleteCommentsById, getPostById } from '../Services/post-service.js';
import { Container, Row, Col, Card, CardBody, CardText, CardImg, Input, Button } from 'reactstrap';
import { BASE_URL } from '../Services/Helper.js';
import { getCurrentUserDetail, isLoggedIn } from '../auth';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';

function PostPage() {
    const userContextData = useContext(UserContext)
    const [user,setUser]=useState(null)
    const { postId } = useParams()
    const [post, setPost] = useState(null);
    const [comment,setComment]=useState({
        content:''
    })
    useEffect(() => {
        setUser(getCurrentUserDetail())
        getPostById(postId).then(data => {   
            setPost({...data});
        }).catch((error) => {
            console.log(error);
        })
    }, [])
    const printDate = (num) => {
        return new Date(num).toLocaleString()
    }
    const submitComment =(e)=>{
        e.preventDefault();
        if(!isLoggedIn()){
            toast.error('Please login to add comment')
            return;
        }
        if(comment.content.trim()===''){
            return;
        }
        addComment(post.postId,comment).then(data=>{
            setPost({
                ...post,
                comments:[...post.comments,data]
            })
            setComment({content:''})
        }).catch((error)=>{
            console.log(error)
        })
    }
    const deleteComment=(val)=>{
        deleteCommentsById(val).then(res=>{
            getPostById(postId).then(data => {   
                setPost({...data});
            }).catch((error) => {
                console.log(error);
            })
        }).catch((error)=>{
            console.log("error",error)
        })
    }
    return (
        <Base>
            <Container>
                <Row>
                    <Col md={{ size: 8,offset:2 }}>
                        <Card className='mt-5'>
                            {
                                (post) && (
                                    <CardBody>
                                        <CardText>Posted By <b>{post.user.name}</b> on <b>{printDate(post.addedDate)}</b></CardText>
                                        <CardText>Category title : <b>{post.category.categoryTitle}</b></CardText>
                                        <div><h1>{post.title}</h1></div>
                                        <CardImg alt='image' src={BASE_URL + '/post/image/' + post.imageName}
                                            width="100%">
                                        </CardImg>
                                        <CardText dangerouslySetInnerHTML={{ __html: post.content }} className='mt-3'>
                                        </CardText>
                                    </CardBody>

                                )
                            }

                        </Card>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col md={{
                        size: 8,
                        offset: 2
                    }}>
                        <h4>Comments ({post ? post.comments.length : 0})</h4>
                        {
                            post && post.comments.map((c, index) => (

                                <Card key={index} className='mb-2 border-0'>
                                    <CardBody>
                                        <CardText>
                                            {c.content}
                                        </CardText>
                                        {
                                            userContextData.user.islogin && (c.user && c.user.id==post.user.id) ? <Button onClick={()=>{deleteComment(c.id)}}>delete</Button>:""
                                        }
                                        
                                    </CardBody>
                                </Card>
                            ))
                        }
                        <Card className='border-0'>
                                    <CardBody>
                                        <Input type='textarea' placeholder='Comment Here...'  value={comment.content} onChange={(e)=>setComment({content:e.target.value})}/>
                                        <Button className='mt-2' onClick={submitComment} color='primary'>Submit</Button>
                                    </CardBody>
                                </Card>
                    </Col>
                </Row>
            </Container>
        </Base>

    )
}

export default PostPage