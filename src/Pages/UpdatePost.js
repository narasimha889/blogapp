import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import UserContext from '../context/UserContext'
import { getPostById, updatePosts, uploadImage } from '../Services/post-service.js';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import JoditEditor from 'jodit-react';
import { loadAllCategories } from '../Services/category-service.js';
import { BASE_URL } from '../Services/Helper.js';

function UpdatePost() {
  const editor = useRef(null);
  const [categories, setCategories] = useState([])
  const { blogId } = useParams()
  const [post, setPost] = useState(null)
  const [image,setImage]=useState(null)
  const userContextData = useContext(UserContext);
  const navigate = useNavigate()
  const [error, setError] = useState({
    title: "",
    content: "",
    category: ""
  })
  useEffect(() => {
    loadAllCategories().then((data) => {
      setCategories(data);
    }).catch(error => {
      console.log("Error in loading categories",error)
    })
    getPostById(blogId).then(data => {
      setPost({ ...data, categoryId: data.category.categoryId })
    }).catch(error => {
      console.log("Error in loading post",error)
    })
  }, [])
  useEffect(() => {
    if (post) {
      if (post.user.id != userContextData.user.data.id) {
        toast.error("This is not your post")
        navigate('/feed')
      }
    }
  }, [post])
  const handleChange = (e, filedName) => {

    setPost({
      ...post,
      [filedName]: e.target.value
    })

  }
  const handleFileChange=(e)=>{
    setImage(e.target.files[0])
  }
  const updatedData = (e) => {
    e.preventDefault();
    if (post.title.trim().length < 4) {
      setError({ title: 'Title must be minimum of 4 characters !!' })
      return
    }

    if (post.content.replace( /(<([^>]+)>)/ig, '').trim().length<10) {
      document.getElementById('jodit-editor').style.border = '1px solid red';
      setError({ content: 'content must be minimum of 10 characters !!' });
      document.getElementById('contentError').style.display = 'block';
      return
    }
    if (post.categoryId == '') {
      setError({ category: 'Please Select Valid Category' })
      return
    }
    document.getElementById('contentError').style.display = 'none';
    document.getElementById('jodit-editor').style.border = '0px solid #dadada';
    setError({
      title: "",
      content: "",
      category: ""
    })
    updatePosts({ ...post, category: { categoryId: post.categoryId } }, post.postId)
      .then(res => {
        if(image!=null){
          uploadImage(image,post.postId).then(res=>{
            toast.success("Image uplaoded sucessfully")
          }).catch((error)=>{
            toast.error("Error in uploading file");
          })
        }
        toast.success("post updated sucessfully")
        navigate('/feed')
      }).catch(error => {
        console.log(error)
        toast.error("Error in updating the post !!")
      })
  }
  const resetData =()=>{
    setPost({ ...post, title:"",content:"",categoryId:'' })
  }
  return (
    <Container>
      <div className='wrapper'>
        {
          post && (
            <Row>
              <Col md={{ size: "10", offset: "1" }}>
                <Card className='my-5'>
                  <CardHeader>
                    <h3>Update the Post</h3>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={updatedData}>
                      <FormGroup>
                        <Label for="title">
                          Post Title
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          type="text"
                          value={post.title}
                          onChange={(e) => { handleChange(e, 'title') }}
                          invalid={error.title ? true : false}
                        />
                        <FormFeedback>
                          {error.title}
                        </FormFeedback>
                      </FormGroup>
                      <FormGroup>
                        <Label for="content">
                          Post Content
                        </Label>
                        <div id='jodit-editor'>

                          <JoditEditor
                            ref={editor}
                            name="content"
                            value={post.content}
                            onChange={newContent => setPost({ ...post, content: newContent })}
                          />
                        </div>
                        <FormFeedback id='contentError'>
                          {error.content}
                        </FormFeedback>

                      </FormGroup>
                      <FormGroup>
                        <Label for="image">
                          Post Image
                        </Label>
                        <Input
                          id="image"
                          name="image"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="category">
                          Post Category
                        </Label>
                        <Input
                          id="category"
                          type="select"
                          name="categoryId"
                          value={post.categoryId}
                          onChange={(e) => { handleChange(e, 'categoryId') }}
                          invalid={error.category ? true : false}
                        >
                          <option value="" disabled>
                            --Select Category--
                          </option>
                          {
                            categories.map((category) => (
                              <option value={category.categoryId} key={category.categoryId} >
                                {category.categoryTitle}
                              </option>
                            ))
                          }
                        </Input>
                        <FormFeedback>
                          {error.category}
                        </FormFeedback>
                      </FormGroup>
                      <Container className='text-center'>
                        <Button type='submit' color="success" className='me-3'>Update Post</Button>
                        <Button color="danger" type='reset' onClick={resetData}>Reset Content</Button>
                      </Container>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )
        }

      </div>
    </Container>

  )
}

export default UpdatePost