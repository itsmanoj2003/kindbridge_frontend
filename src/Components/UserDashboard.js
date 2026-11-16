
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

export default function UserDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));

    const [children, setChildren] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

  
useEffect(() => {

    if (!user) {
        navigate('/login');
        return;
    }

    axios.get('http://3.107.161.192/child/getallchildren')
        .then(res => {
            setChildren(res.data.children);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        });

}, [user, navigate]);


    // Search by name and location
    const filteredChildren = children.filter(child => {

        const name = child.childName?.toLowerCase() || '';
        const location = child.orphanageId?.location?.toLowerCase() || '';

        return (
            name.includes(searchTerm.toLowerCase()) ||
            location.includes(searchTerm.toLowerCase())
        );
    });

    // Adoption Request
    function handleAdopt(child) {

        const adoptionData = {
            childId: child._id,
            orphanageId: child.orphanageId?._id,
            userId: user._id
        };

        axios.post(
            'http://3.107.161.192/adoption/addadoption',
            adoptionData
        )
        .then(res => {
            alert(res.data.message);
        })
        .catch(err => {
            console.log(err);
            alert("Failed to Submit Adoption Request");
        });
    }

    // Logout
    function handleLogout() {

        localStorage.removeItem('user');
        navigate('/login');

    }

    return (

        <div className="user-dashboard">

            {/* Navbar */}

            <nav className="ud-navbar">

                <div className="ud-logo">
                    <span>♥</span>
                    <h2>KindBridge</h2>
                </div>

                <button
                    className="ud-logout-btn"
                    onClick={handleLogout}
                >
                    Logout ↗
                </button>

            </nav>


            {/* Welcome Section */}

            <section className="ud-welcome">

                <div>
                    <span className="ud-welcome-tag">
                        USER DASHBOARD
                    </span>

                    <h1>
                        Welcome Back, {user?.userName || 'User'}!
                    </h1>

                    <p>
                        Together, we can build a brighter future
                        for children.
                    </p>
                </div>

                <div className="ud-welcome-heart">
                    ♥
                </div>

            </section>


            {/* User Profile */}

            <section className="ud-profile-section">

                <div className="ud-profile-heading">
                    <h2>My Profile</h2>
                    <p>Your account information</p>
                </div>

                <div className="ud-profile-card">

                    <div className="ud-profile-avatar">
                        {(user?.name || user?.email || 'U')
                            .charAt(0).toUpperCase()}
                    </div>

                    <div className="ud-profile-details">

                        <h3>{user?.name || 'User'}</h3>

                        <div className="ud-profile-info">

                            <div className="ud-info-item">
                                <span>👤</span>
                                <div>
                                    <small>Name</small>
                                    <p>{user?.userName || 'Not Available'}</p>
                                </div>
                            </div>

                            <div className="ud-info-item">
                                <span>👤</span>
                                <div>
                                    <small>Companion Name</small>
                                    <p>{user?.companionName || 'Not Available'}</p>
                                </div>
                            </div>

                            <div className="ud-info-item">
                                <span>✉</span>
                                <div>
                                    <small>Email Address</small>
                                    <p>{user?.email || 'Not Available'}</p>
                                </div>
                            </div>

                            <div className="ud-info-item">
                                <span>☎</span>
                                <div>
                                    <small>Mobile Number</small>
                                    <p>
                                        {user?.mobileNumber ||
                                         user?.phone ||
                                         'Not Available'}
                                    </p>
                                </div>
                            </div>

                            <div className="ud-info-item">
                                <span>⌖</span>
                                <div>
                                    <small>Aadhar Number</small>
                                    <p>{user?.aadharNumber || 'Not Available'}</p>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="ud-account-status">
                        <span>●</span> Active User
                    </div>

                </div>

            </section>


            {/* Children Section */}

            <section className="ud-children-section" id="children">

                <div className="ud-section-heading">

                    <div>
                        <span className="ud-welcome-tag">
                            MAKE A DIFFERENCE
                        </span>

                        <h2>Meet Our Children</h2>

                        <p>
                            Find a child and take the first step
                            towards building a beautiful family.
                        </p>
                    </div>

                    <div className="ud-child-count">
                        {children.length} Children
                    </div>

                </div>


                {/* Search */}

                <div className="ud-search-box">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search by child name or orphanage location..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />

                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')}>
                            ✕
                        </button>
                    )}

                </div>


                {/* Children Cards */}

                {loading ? (

                    <div className="ud-empty">
                        Loading children...
                    </div>

                ) : filteredChildren.length > 0 ? (

                    <div className="ud-children-grid">

                        {filteredChildren.map(child => (

                            <div className="ud-child-card" key={child._id}>

                                <div className="ud-child-top">

                                    <div className="ud-child-avatar">
                                        {child.childName?.charAt(0).toUpperCase()}
                                    </div>

                                    <span className="ud-available">
                                        Available
                                    </span>

                                </div>

                                <h3>{child.childName}</h3>

                                <div className="ud-child-meta">
                                    <span>{child.age} Years</span>
                                    <span>•</span>
                                    <span>{child.gender}</span>
                                </div>

                                <div className="ud-child-location">
                                    <span>⌖</span>
                                    {child.orphanageId?.location ||
                                     'Location unavailable'}
                                </div>

                                <div className="ud-child-extra">

                                    {child.moleLocation && (
                                        <p>
                                            <strong>Mole:</strong> {child.moleLocation}
                                        </p>
                                    )}

                                    {child.scarLocation && (
                                        <p>
                                            <strong>Scar:</strong> {child.scarLocation}
                                        </p>
                                    )}

                                    {child.otherIdentityMarks && (
                                        <p>
                                            <strong>Other Marks:</strong>{' '}
                                            {child.otherIdentityMarks}
                                        </p>
                                    )}

                                </div>

                                <button
                                    className="ud-adopt-btn"
                                    onClick={() => handleAdopt(child)}
                                >
                                    Adopt <span>→</span>
                                </button>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="ud-empty">
                        <h3>No Children Found</h3>
                        <p>Try searching with another name or location.</p>
                    </div>

                )}

            </section>


            {/* Footer */}

            <footer className="ud-footer">

                <h2>KindBridge ♥</h2>

                <p>
                    Every child deserves love, care and a better future.
                </p>

                <small>
                    © 2026 KindBridge. All Rights Reserved.
                </small>

            </footer>

        </div>

    );
}
