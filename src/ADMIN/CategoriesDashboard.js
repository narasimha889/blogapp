import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row, Table } from 'reactstrap'
import { addNewCategory, checkCategory, deleteCategoryById, loadAllCategories } from '../Services/category-service'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

function CategoriesDashboard() {
    const [categories,setCategories]=useState([])
    const [newCategory,setNewCategory]=useState({
        categoryTitle:"",
        categoryDescription:""
    })
    const [error,setError]=useState({
        title:"",
        description:""
    })
    useEffect(()=>{
        loadAllCategories().then(res=>{
            setCategories(res)
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    const handleChange=(e,property)=>{
        setNewCategory({ ...newCategory, [property]: e.target.value });
    }
    const resetData=()=>{
        setNewCategory({
            categoryTitle:"",
            categoryDescription:""
        })
        setError({
            title:"",
            description:""
        })
    }
    const addCategory=(e)=>{
        e.preventDefault();
        if(newCategory.categoryTitle.trim().length<4){
            setError({title:"Title must contain min of 4 characters !!"})
            return
        }
        if(newCategory.categoryDescription.trim().length<10){
            setError({description:"Description must be min of 10 characters !!"})
            return
        }
        const catTitle ={
            email:newCategory.categoryTitle.trim()
        }
        checkCategory(catTitle).then(res=>{
            if(res=="valid"){
                toast.error("Category already exists!!")
                return
            }
            else{
                addNewCategory(newCategory).then(res=>{
                    setCategories([...categories,res])
                    setNewCategory({
                        categoryTitle:"",
                        categoryDescription:""
                    })
                    toast.success("Category added successfully!!")
                    setError({
                        title:"",
                        description:""
                    })
                }).catch((error)=>{
                    console.log(error)
                })
            }
        })    
    }
    const deleteCategory=(categoryId)=>{
        let result=window.confirm(`Do you want to delete category with id ${categoryId}  permanentely!! `)
        if(result){
            deleteCategoryById(categoryId).then(res=>{
                toast.success("Category deleted!!")
                loadAllCategories().then(resp=>{
                    setCategories(resp)
                }).catch((error)=>{
                    console.log(error)
                })
            }).catch((error)=>{
                console.log(error)
            })
        }
        else{

        }

    }
  return (
    <div>
        <Container>
            <Row>
              <Col md={{ size: 8, offset: 2 }} className='my-5'>
                <Card>
                  <CardBody>
                    <h3 className='text-uppercase'>Categories Information</h3>
                    <Table
                      bordered
                      hover
                      responsive
                      striped
                    >
                                          
        <thead>
        <tr>
        <th>CATEGORY_ID</th>
          <th>CATEGORY_TITLE</th>
          <th>CATEGORY_DISCRIPTION</th>
          <th>ACTION</th>
        </tr>
        </thead>
                      <tbody>
                      {
          categories && categories.map((category,index)=>(
            <tr key={index}>
              <td>{category.categoryId}</td>
              <td>{category.categoryTitle}</td>
              <td>{category.categoryDescription}</td>
              <td><Link className='btn btn-warning me-2 my-2' to={`/user/update-category/${category.categoryId}`}>Update</Link>
              <Button color='danger' className='my-2' onClick={()=>{deleteCategory(category.categoryId)}}>Delete</Button></td>
            </tr>
          ))
        }
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
                <Col md={{size:'6',offset:"3"}}>
                <Form className='my-3' onSubmit={addCategory}>
                    <FormGroup>
                    <Label for="categoryTitle">Category Title</Label>
                    <Input
                            id="categoryTitle"
                            name="categoryTitle"
                            type="text"
                            value={newCategory.categoryTitle}
                            onChange={(e) => { handleChange(e, 'categoryTitle') }}
                            invalid={error.title? true : false}
                         />
                         <FormFeedback>
                            {error.title}
                         </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                    <Label for="categoryDescription">Category Description</Label>
                    <Input
                            id="categoryDescription"
                            name="categoryDescription"
                            type="text"
                            value={newCategory.categoryDescription}
                            onChange={(e) => { handleChange(e, 'categoryDescription') }}
                            invalid={error.description? true : false}
                         />
                         <FormFeedback>
                            {error.description}
                         </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                    <Container className='text-center'>
                    <Button color='success' className='me-2'>ADD</Button>
                    <Button color='danger' onClick={resetData}>RESET</Button>
                    </Container>
                    </FormGroup>
                </Form>
                </Col>
            </Row>
          </Container>

    </div>
  )
}

export default CategoriesDashboard