import React, { useContext, useState } from 'react'
import Base from '../Components/Base'
import { Card, CardBody, CardHeader, Container, FormGroup, Form, Label, Input, Button, Row, Col } from 'reactstrap'
import { toast } from 'react-toastify'
import { loginUser } from '../Services/user-service.js'
import { checkCreds, dologin, generateOtpForLogin, getOtpForLogin } from '../auth'
import { Link, useNavigate } from 'react-router-dom'
import UserContext from '../context/UserContext'
function Login() {
    const userContextData = useContext(UserContext)
    const [emailSubmitButton, setEmailSubmitButton] = useState("inline-block")
    const [loginButton, setLoginButton] = useState("none")
    const [resetButton, setResetButton] = useState("inline-block")
    const [otpFieldDisplay, setOtpFieldDisplay] = useState("none")
    const [fieldDisabled, setFieldDisabled] = useState(false)
    const [newOtp, setNewOtp] = useState('')
    const [loginDetails, setLoginDetails] = useState({
        username: "",
        password: ""
    })
    const handleChange = (e, property) => {
        setLoginDetails({ ...loginDetails, [property]: e.target.value });
    }
    const handleReset = () => {
        setLoginDetails({
            username: "",
            password: ""
        })
        setFieldDisabled(false)
    }
    const sendOtp = () => {
        if (loginDetails.username.trim() == '' || loginDetails.password.trim() == '') {
            toast.error("Please Enter the fields");
            return;
        }
        const userInt = {
            email: loginDetails.username
        }
        generateOtpForLogin(userInt).then(res => {
            toast.success("Otp sent successfully")
        }).catch((error) => {
            toast.error("Error in sending otp")
            console.log("Error in sending otp", error)
        })
    }
    const navigate = useNavigate();
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (loginDetails.username.trim() == '' || loginDetails.password.trim() == '') {
            toast.error("Please Enter the fields");
            return;
        }
        checkCreds(loginDetails).then(resp => {
            if (resp == "valid") {
                const userInt = {
                    email: loginDetails.username
                }
                generateOtpForLogin(userInt).then(res => {
                    setFieldDisabled(true)
                    setEmailSubmitButton("none")
                    setResetButton("none")
                    setLoginButton("inline-block")
                    setOtpFieldDisplay("block")
                    toast.success("Otp sent successfully")
                }).catch((error) => {
                    toast.error("Error in sending otp")
                    console.log("Error in sending otp", error)
                })
            }
            else {
                toast.error("Incorrect Password!!")
            }
        }).catch((error) => {
            console.log("Invalid Credentials", error)
            toast.error("Invalid Credentials!!")
        })


    }
    const submitCreds = () => {
        const userIn = {
            email: loginDetails.username
        }
        getOtpForLogin(userIn).then(res => {
            if (res == 'expired') {
                toast.error("Otp has expired!!")
            }
            if (newOtp == res) {
                loginUser(loginDetails).then((data) => {
                    dologin(data, () => {
                        userContextData.setUser({
                            data: data.user,
                            islogin: true
                        })
                    })
                    navigate("/user/dashboard");
                    toast.success("User Loggedin sucessfully!!");
                    setLoginDetails({
                        username: "",
                        password: ""
                    })
                }).catch((error) => {
                    if (error.response.status == 400 || error.response.status == 404) {
                        toast.error(error.response.data.message);
                    }
                    else {
                        toast.error("Something went wrong!!");
                    }

                })
            }
            else {
                toast.error("Please enter valid Otp!!")
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    return (
        <Base>
            <div>
                <Container>
                    <Row>
                        <Col sm={{ size: "6", offset: "3" }}>
                            <Card className='my-5'>
                                <CardHeader>
                                    <h3>Please fill the details to Login</h3>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={handleFormSubmit}>
                                        <FormGroup>
                                            <Label for="email">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={loginDetails.username}
                                                onChange={(e) => { handleChange(e, 'username') }}
                                                disabled={fieldDisabled}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="password">
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={loginDetails.password}
                                                onChange={(e) => { handleChange(e, 'password') }}
                                                disabled={fieldDisabled}
                                            />
                                        </FormGroup>
                                        <Link className='float-end' to={"/forgot-password"} color='orange'>Forgot Password</Link>
                                        <FormGroup style={{ display: otpFieldDisplay }}>
                                            <Label for="otp">
                                                Enter Otp
                                            </Label>
                                            <div className='d-flex justify-content-between'>
                                                <Input
                                                    id="otp"
                                                    name="otp"
                                                    type="text"
                                                    style={{ width: "50%" }}
                                                    onChange={(e) => { setNewOtp(e.target.value) }}
                                                />
                                                <Button color="secondary" onClick={sendOtp}>resend</Button>
                                            </div>

                                        </FormGroup>

                                        <Container className='text-center'>
                                            <Button color="success" className='me-3' style={{ display: emailSubmitButton }} type='submit'>Submit</Button>
                                            <Button color="success" className='me-3' style={{ display: loginButton }} onClick={submitCreds}>Login</Button>
                                            <Button color="danger" type='reset' onClick={handleReset} style={{ display: resetButton }}>Reset</Button>
                                        </Container>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Base>

    )
}

export default Login