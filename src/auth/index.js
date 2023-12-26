import { myAxios } from "../Services/Helper";

//isLoggedIn
export const isLoggedIn=()=>{
    let data = localStorage.getItem("data");
    if(data!=null){
        return true;
    }
    else
    {
        return false;
    }
};
//dologin =>data set to local storage
export const dologin=(data,next)=>{
    localStorage.setItem("data",JSON.stringify(data))
    next();
};

//dologout => remove data from local storage
export const doLogout = (next)=>{
    localStorage.removeItem("data");
    next();
}
//get current user
export const getCurrentUserDetail=()=>{
    if(isLoggedIn()){
        return JSON.parse(localStorage.getItem("data")).user;
    }
    else {
        return undefined;
    }
}
//get token
export const getToken=()=>{
    if(isLoggedIn()){
        return JSON.parse(localStorage.getItem('data')).token;
    }
    else{
        return null;
    }
}
//check creds
export const checkCreds=(loginDetail)=>{
    return myAxios.post("/auth/checkcredentials",loginDetail).then(response=>response.data);
}
//generate Otp for login
export const generateOtpForLogin=(userInt)=>{
    return myAxios.post("/auth/generatetoken",userInt).then(response=>response.data);
}
//get Otp for Verification
export const getOtpForLogin=(userIn)=>{
    return myAxios.post("/auth/generatedOtp",userIn).then(response=>response.data);
}

// generate otp to resest password
export const generateOtpForPasswordReset=(userInt)=>{
    return myAxios.post("/auth/resetPassword",userInt).then(response=>response.data);
}
// get Otp for Password Reset
export const getOtpForPasswordReset=(userInt)=>{
    return myAxios.post("/auth/getPasswordOtp",userInt).then(response=>response.data);
}
//save password
export const savePasswordForUser=(userInt)=>{
    return myAxios.post("/auth/savePassword",userInt).then(response=>response.data);
}
// generate otp to change password
export const changePasswordForUser=(userInt)=>{
    return myAxios.post("/auth/changePassword",userInt).then(response=>response.data);
}
