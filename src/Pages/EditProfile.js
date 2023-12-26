import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import { getUser, updateUserDetails } from '../Services/user-service.js'
import { toast } from 'react-toastify'

function EditProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  useEffect(() => {
    getUser(userId).then(data => {
      setUser({ ...data })
    }).catch((error) => {
      console.log("Error in retrieving user", error)
    })
  }, [])
  const [error, setError] = useState({
    name: "",
    about: ""
  })
  const handleChange = (e, property) => {
    setUser({ ...user, [property]: e.target.value })
  }
  const submitProfileData = (e) => {
    e.preventDefault();
    if (user.name.trim().length < 4) {
      setError({ name: 'User Name must be minimum of 4 characters !!' })
      return
    }
    if (user.about.trim().length < 1) {
      setError({ about: 'About must not be Blank !!' })
      return
    }
    setError({
      name: "",
      about: ""
    })
    const userDetails = {
      name: '',
      about: ""
    }
    userDetails.name = user.name;
    userDetails.about = user.about;
    updateUserDetails(userDetails, userId).then(data => {
      setUser({ ...data })
      toast.success("user details updated successfully")
      navigate(`/user/profile-info/${userId}`)
    }).catch((error) => {
      console.log("Error in updating user Info", error)
    })
  }
  const resetData = () => {
    setUser({ ...user, name: '', about: "" })
    setError({
      name: "",
      about: ""
    })
  }
  return (
    <div>
      {
        user && (
          <Container>
            <Row>
              <Col sm={{ size: "6", offset: "3" }}>
                <Card className='my-5'>
                  <CardHeader>
                    <h3>Please fill the details to update user</h3>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={submitProfileData}>
                      <FormGroup>
                        <Label for="name">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          onChange={(e) => { handleChange(e, 'name') }}
                          value={user.name}
                          invalid={error.name ? true : false}
                        />
                        <FormFeedback>
                          {error.name}
                        </FormFeedback>
                      </FormGroup>

                      <FormGroup>
                        <Label for="about">
                          About
                        </Label>
                        <Input
                          id="about"
                          name="about"
                          type="textarea"
                          style={{ height: "200px" }}
                          onChange={(e) => { handleChange(e, "about") }}
                          value={user.about}
                          invalid={error.about ? true : false}
                        />
                        <FormFeedback>
                          {error.about}
                        </FormFeedback>
                      </FormGroup>
                      <Container className='text-center'>
                        <Button color="success" className='me-3'>Submit</Button>
                        <Button color="warning" type='reset' onClick={resetData}>Reset</Button>
                      </Container>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        )
      }

    </div>
  )
}

export default EditProfile