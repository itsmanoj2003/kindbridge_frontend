
import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const [password, showPassword] = useState(false)
    const [activeTab, setActiveTab] = useState("user");
    const [text, setText] = useState("")

    const navigate = useNavigate()

    function handlePassword() {
        showPassword(!password)
    }

    function handleTab(tab) {
        setActiveTab(tab);
        showPassword(false);
    }

    const [userData, setuserData] = useState({
        email: '',
        password: ''
    })

    function handleuserChange(e) {
        setuserData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

function handleUserLogin(e) {
    e.preventDefault();

    axios.post('http://localhost:3001/users/userlogin', userData)
        .then(res => {
            alert("You are logged in Successfully");

            setuserData({
                email: '',
                password: ''
            });

            localStorage.setItem(
                'user',
                JSON.stringify(res.data.updatedUser)
            );

            setText("Please wait you are redirecting...");

            setTimeout(() => {
                navigate('/userdashboard');
            }, 2000);
        })
        .catch(error => {
            if (error.response?.status === 404) {
                alert("User not Found. Please Signup");
            }
            else if (error.response?.status === 401) {
                alert("Oops! Incorrect Password.");
            }
            else if (error.response?.status === 409) {
                alert("Please Verify your Email to Login");
            }
            else {
                alert("Failed to Login");
                console.log(error.response?.data);
            }
        });
}


    const [orphanageData,setOrphanageData] = useState({
        cciRegistrationnumber:'',
        password:''
    })

    function handleOrphanagechange(e){
        setOrphanageData(prev=>({...prev,[e.target.name]:e.target.value}))
    }


    function handleOrphanageLogin(e) {
        e.preventDefault();

        axios.post(
            'http://localhost:3001/orphanages/orphanagelogin',
            orphanageData
        )
            .then(res => {
                alert(res.data.message);

                const orphanage = res.data.updatedOrphanage

                localStorage.setItem(
                    'orphanage',
                    JSON.stringify(res.data.updatedOrphanage)
                );

                navigate(`/orphanageadmin/${orphanage._id}`);
            })
            .catch(error => {
                alert(
                    error.response?.data?.message || "Login Failed"
                );
            });
    }



    function handleSubmit(e) {
    e.preventDefault();

    if (activeTab === "user") {
        handleUserLogin(e);
    } else {
        handleOrphanageLogin(e);
    }
}



    return (
        <div className='login-main-container'>

            <div className='login-bg'></div>
            <div className='login-overlay'></div>

            <div className='login-input-container'>

                <h2 style={{ color: 'white' }}>Login</h2>

                <div className='login-users-btn-container'>

                    <button
                        type="button"
                        className={activeTab === "user" ? "active" : ""}
                        onClick={() => handleTab("user")}
                    >
                        User
                    </button>

                    <button
                        type="button"
                        className={activeTab === "orphanage" ? "active" : ""}
                        onClick={() => handleTab("orphanage")}
                    >
                        Orphanage
                    </button>

                </div>

                <div className='login-form-container'>

                    <form className='login-user-form' onSubmit={handleSubmit}>

                        {activeTab === "user" ? (
                            <>
                                <input
                                    type='email'
                                    placeholder='Enter your Email'
                                    name='email'
                                    value={userData.email}
                                    onChange={handleuserChange}
                                    required
                                />
                                <input
                                    type={password ? 'text' : 'password'}
                                    placeholder='Password'
                                    name='password'
                                    value={userData.password}
                                    onChange={handleuserChange}
                                    required
                                />

                                <button
                                    className='password-btn'
                                    onClick={handlePassword}
                                    type='button'
                                >
                                    {password ? "Hide" : "Show"}
                                </button>
                            </>
                        ) : (
                            <>
                                <input
                                    type='text'
                                    placeholder='Enter CCI Registration Number'
                                    name='cciRegistrationnumber'
                                    value={orphanageData.cciRegistrationnumber}
                                    onChange={handleOrphanagechange}
                                    required
                                />
                                <input
                                    type={password ? 'text' : 'password'}
                                    placeholder='Password'
                                    name='password'
                                    value={orphanageData.password}
                                    onChange={handleOrphanagechange}
                                    required
                                />

                                <button
                                    className='password-btn'
                                    onClick={handlePassword}
                                    type='button'
                                >
                                    {password ? "Hide" : "Show"}
                                </button>
                            </>
                        )}

                        <button type='submit' className='login-btn'>
                            Login
                        </button>

                    </form>

                    <p>{text}</p>

                    <p>Create New Account ? <a style={{ color: 'white', cursor: 'pointer', textDecoration: 'underline' }} href='/signup'>Signup</a></p>

                </div>

            </div>
        </div>
    )
}
