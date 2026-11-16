import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import './Signup.css'

import logo from '../Components/assets/Logo.png'


export default function Signup() {

    const [usertype, setUsertype] = useState("user")

    // Redirecting Text
    const [text, setText] = useState("")

    const navigate = useNavigate()

    function handleuserType(e) {
        setUsertype(e.target.value)
    }

    const [userData, setuserData] = useState({
        userName: '',
        age: '',
        mobileNumber: '',
        maritalStatus: '',
        gender: '',
        companionName: '',
        aadharNumber: '',
        email: '',
        password: '',
    })



    const handleChange = (e) => {
        setuserData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }


    function handleUsersubmit(e) {
        e.preventDefault()
        axios.post('http://3.107.161.192/users/createuser', userData)
            .then(res => {
                alert(`Welcome ! ${userData.userName}, Activation Link is send to your Email`)
                // localStorage.setItem('user',JSON.stringify(res.data.newUser))
                setuserData({
                    userName: '',
                    age: '',
                    mobileNumber: '',
                    maritalStatus: '',
                    gender: '',
                    companionName: '',
                    aadharNumber: '',
                    email: '',
                    password: '',
                })
                setText("Please wait You are Redirected to Login ...")
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            })
            .catch(error => {
                if (error.response?.status === 409) {
                    alert("User already exists! Please login.");
                } else {
                    alert("Failed to Register");
                }
            });
    }






    const [orphanageData, setorphanageData] = useState({
        cciRegistrationnumber: '',
        location: '',
        districtCode: '',
        institutionCode: '',
        institutionType: '',
        managingAuthority: '',
        password: '',
    })

    const handleOrphanagechange = (e) => {
        setorphanageData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleOrphanagesubmit(e) {
        e.preventDefault();

        axios.post(
            'http://3.107.161.192/orphanages/createorphanage',
            orphanageData
        )
            .then(res => {

                alert("Orphanage Registered Successfully");

                setorphanageData({
                    cciRegistrationnumber: '',
                    location: '',
                    districtCode: '',
                    institutionCode: '',
                    institutionType: '',
                    managingAuthority: '',
                    password: ''
                });

                setText("Please wait! You are redirected to Login...");

                setTimeout(() => {
                    navigate('/login');
                }, 2000);

            })
            .catch(error => {

                if (error.response?.status === 409) {
                    alert("Orphanage already exists!");
                } else {
                    alert("Oops! Failed to Register. Try Again");
                }

            });
    }








    return (
        <div className='signup-main-container'>

            <div className='signup-overlay'></div>

            <div className='signup-left'>
                <div className='signup-left-content'>

                    {usertype === "user" ?
                        (<form onSubmit={handleUsersubmit} className='signup-form'>
                            <input type='text' placeholder='Name' name='userName' value={userData.userName} onChange={handleChange} required />
                            <input type='number' placeholder='Age' name='age' value={userData.age} onChange={handleChange} required />
                            <input type='number' placeholder='Mobile Number' name='mobileNumber' value={userData.mobileNumber} onChange={handleChange} required />
                            <select name='maritalStatus' value={userData.maritalStatus} onChange={handleChange} required>
                                <option value="">Select Marital Status</option>
                                <option value="Married">Married</option>
                                <option value="Unmarried">Unmarried</option>
                            </select>
                            <div className="gender-container">
                                <h4>Gender:</h4>
                                <label>
                                    <input type="radio" name="gender" value="Male" checked={userData.gender === "Male"} onChange={handleChange} required />
                                    Male
                                </label>

                                <label>
                                    <input type="radio" name="gender" value="Female" checked={userData.gender === "Female"} onChange={handleChange} required />
                                    Female
                                </label>

                                <label>
                                    <input type="radio" name="gender" value="Other" checked={userData.gender === "Other"} onChange={handleChange} required />
                                    Other
                                </label>
                            </div>
                            <input type='text' placeholder={userData.maritalStatus === 'Married' ?
                                userData.gender === 'Male' ? "Wife Name" : userData.gender === 'Female' ? "Husband Name" : " "
                                : " "}
                                name='companionName'
                                value={userData.companionName}
                                onChange={handleChange}
                                disabled={userData.maritalStatus !== "Married" || userData.gender === "Other"}
                                required={userData.maritalStatus === "Married" && (userData.gender === "Male" || userData.gender === "Female")}
                            />
                            <input type='number' placeholder='Aadhar Number' name='aadharNumber' value={userData.aadharNumber} onChange={handleChange} required />
                            <input type='email' placeholder='Email Address' name='email' value={userData.email} onChange={handleChange} required />
                            <input type='password' placeholder='Password' name='password' value={userData.password} onChange={handleChange} required />
                            <button type='submit' className='signin-btn'>Signin</button>
                        </form>) :
                        (<form className='signup-form' onSubmit={handleOrphanagesubmit}>
                            <input type='text' placeholder='CCI Registration Number' name='cciRegistrationnumber' value={orphanageData.cciRegistrationnumber} onChange={handleOrphanagechange} required />
                            <input type='text' placeholder='Location' name='location' value={orphanageData.location} onChange={handleOrphanagechange} required />
                            <input type='number' placeholder='District Code' name='districtCode' value={orphanageData.districtCode} onChange={handleOrphanagechange} required />
                            <input type='text' placeholder='Institution Code' name='institutionCode' value={orphanageData.institutionCode} onChange={handleOrphanagechange} required />
                            <input type='text' placeholder='Institution Type' name='institutionType' value={orphanageData.institutionType} onChange={handleOrphanagechange} required />
                            <input type='text' placeholder='Managing Authority' name='managingAuthority' value={orphanageData.managingAuthority} onChange={handleOrphanagechange} required />
                            <input type='password' placeholder='Password' name='password' value={orphanageData.password} onChange={handleOrphanagechange} required />
                            <button type='submit' className='signin-btn'>Signin</button>
                        </form>)}

                    <h4 style={{ position: 'relative', bottom: '30px', left: '50px', color: 'white' }}>{text}</h4>

                </div>

                <div className='signup-left-semicircle'></div>

            </div>

            <div className='signup-right'>

                <div className='signup-right-semicircle'></div>

                <div className='signup-right-content'>
                    <img src={logo} alt='logo' />
                    <h2>Save Childrens to Save Future</h2>
                    <h4>Create New Account As</h4>
                    <select className='category-selection' value={usertype} onChange={handleuserType}>
                        <option value="user">User</option>
                        <option value="orphanage">Orphanage</option>
                    </select>
                    <p>Already have Account? <a style={{ color: 'white', cursor: 'pointer', textDecoration: 'underline' }} href='/login'>Login</a></p>
                </div>


            </div>



        </div>
    )
}
