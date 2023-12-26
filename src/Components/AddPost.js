import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import { loadAllCategories } from '../Services/category-service'
import JoditEditor from 'jodit-react';
import { addPost, uploadImage } from '../Services/post-service';
import { getCurrentUserDetail } from '../auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const AddPost = () => {
  const navigate = useNavigate()
  const editor = useRef(null);
  const [post,setPost]=useState({
    title:"",
    content:"",
    categoryId:""
  })
  const [error,setError]  =useState({
    title:"",
    content:"",
    category:""
})
  const [image,setImage]=useState(null)
  const [user,setUser]=useState(undefined)
  const [categories, setCategories] = useState([])
  useEffect(() => {
    setUser(getCurrentUserDetail());
    loadAllCategories().then((data) => {
      setCategories(data);
    }).catch(error => {
      console.log("Error in Loading categories",error)
      toast.error('Error in Loading categories !!')
    })
  }, [])
  const handleFileChange=(e)=>{
    setImage(e.target.files[0])
  }
  const fieldChanged=(e)=>{
    setPost({...post,[e.target.name]:e.target.value})
  }
  const contentFiledChanged=(e)=>{
    setPost({...post,"content":e})
  }
 
  const createPost =(e)=>{
    e.preventDefault();
    post['userId']=user.id
    //submit data to server
    if(post.title.trim().length<4){
      setError({title:'Title must be minimum of 4 characters !!'})
      return
    }
    if(post.content.replace( /(<([^>]+)>)/ig, '').trim().length<10){
         document.getElementById('jodit-editor').style.border='1px solid red';
         setError({content:'content must be minimum of 10 characters !!'})
         document.getElementById('contentError').style.display='block';
        return
    }
    if(post.categoryId==''){
      setError({category:'Please Select Valid Category'})
      return
    }
    document.getElementById('contentError').style.display='none';
    document.getElementById('jodit-editor').style.border='0px solid #dadada';
    setError({
      title:"",
      content:"",
      category:""
  })
    addPost(post).then(data=>{
      if(image!=null){
        uploadImage(image,data.postId).then(res=>{
          toast.success("Image uplaoded sucessfully")
        }).catch((error)=>{
          toast.error("Error in uploading file");
        })
      }
      setPost({
        title:"",
        content:"",
        categoryId:""
      });
      setImage(null);
      toast.success('Post created successfully !!')
      navigate('/feed')
    }).catch((error)=>{
      console.log("Error in creating post",error)
      toast.error('Error in creating post !!')
    })
  }
  const resetData=()=>{
    setPost({
      title:"",
      content:"",
      categoryId:""
    });
    setImage(null);
  }
  return (
    <div className='wrapper'>
      <Row>
        <Col md={{ size: "10", offset: "1" }}>
          <Card className='my-5'>
            <CardHeader>
              <h3>Add the Post</h3>
            </CardHeader>
            <CardBody>
              <Form onSubmit={createPost}>
                <FormGroup>
                  <Label for="title">
                    Post Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={post.title}
                    onChange={fieldChanged}
                    invalid={error.title?true:false}
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
                    value={post.content}
                    onChange={contentFiledChanged}
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
                    name ="categoryId"
                    value={post.categoryId}
                    onChange={fieldChanged}
                    invalid={error.category?true:false}
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
                  <Button type='submit' color="success" className='me-3'>Create</Button>
                  <Button color="danger" type='reset' onClick={resetData}>Reset Content</Button>
                </Container>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

    </div>
  )
}

export default AddPost