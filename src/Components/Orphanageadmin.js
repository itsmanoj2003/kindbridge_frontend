
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Orphanageadmin.css';

export default function Orphanageadmin() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [orphanageData, setOrphanageData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    // Children states
    const [children, setChildren] = useState([]);
    const [childrenLoading, setChildrenLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Adoption states
    const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [adoptionLoading, setAdoptionLoading] = useState(true);
    const [deletingRequest, setDeletingRequest] = useState(null);

    // Child form data
    const [childData, setChildData] = useState({
        childName: '',
        age: '',
        gender: '',
        moleLocation: '',
        scarLocation: '',
        otherIdentityMarks: ''
    });

    // Fetch orphanage details
    useEffect(() => {

        axios.get(`http://3.107.161.192/orphanages/${id}`)
            .then(res => {
                setOrphanageData(res.data.orphanage);
            })
            .catch(error => {
                console.log(error);
                alert('Failed to Load Orphanage Details');
            })
            .finally(() => {
                setLoading(false);
            });

    }, [id]);


    // Fetch children belonging to this orphanage
    useEffect(() => {

        setChildrenLoading(true);

        axios.get(`http://3.107.161.192/child/getchildren/${id}`)
            .then(res => {
                setChildren(res.data.children);
            })
            .catch(error => {
                console.log(error);
                setChildren([]);
            })
            .finally(() => {
                setChildrenLoading(false);
            });

    }, [id]);


    // Fetch adoption requests belonging to this orphanage
    useEffect(() => {

        setAdoptionLoading(true);

        axios.get(`http://3.107.161.192/adoption/getadoptions/${id}`)
            .then(res => {
                setAdoptionRequests(res.data.adoptionDetails);
            })
            .catch(error => {
                console.log(error);
                setAdoptionRequests([]);
            })
            .finally(() => {
                setAdoptionLoading(false);
            });

    }, [id]);


    // Update child
    function handleUpdate(child) {

        setChildData({
            childName: child.childName,
            age: child.age,
            gender: child.gender,
            moleLocation: child.moleLocation || '',
            scarLocation: child.scarLocation || '',
            otherIdentityMarks: child.otherIdentityMarks || ''
        });

        setEditingId(child._id);
        setShowForm(true);
    }


    // Logout
    function handleLogout() {
        localStorage.removeItem('orphanage');
        navigate('/login');
    }


    // Child form input change
    function handleChildChange(e) {

        setChildData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    }


    // Add or update child
    function handleAddChild(e) {

        e.preventDefault();

        if (orphanageData?.approvalStatus !== true) {
            alert('Your institution is not approved yet!');
            return;
        }

        setSaving(true);

        if (editingId) {

            axios.put(
                `http://3.107.161.192/child/updatechild/${editingId}`,
                childData
            )
                .then(res => {

                    alert('Child Updated Successfully!');

                    setChildData({
                        childName: '',
                        age: '',
                        gender: '',
                        moleLocation: '',
                        scarLocation: '',
                        otherIdentityMarks: ''
                    });

                    setEditingId(null);
                    setShowForm(false);

                    return axios.get(
                        `http://3.107.161.192/child/getchildren/${id}`
                    );

                })
                .then(res => {
                    setChildren(res.data.children);
                })
                .catch(error => {
                    console.log(error);
                    alert('Failed to Update Child');
                })
                .finally(() => {
                    setSaving(false);
                });

        } else {

            axios.post(
                'http://3.107.161.192/child/addchild',
                {
                    ...childData,
                    orphanageId: id
                }
            )
                .then(res => {

                    alert('Child Registered Successfully!');

                    setChildData({
                        childName: '',
                        age: '',
                        gender: '',
                        moleLocation: '',
                        scarLocation: '',
                        otherIdentityMarks: ''
                    });

                    setShowForm(false);

                    return axios.get(
                        `http://3.107.161.192/child/getchildren/${id}`
                    );

                })
                .then(res => {
                    setChildren(res.data.children);
                })
                .catch(error => {
                    console.log(error);
                    alert('Failed to Register Child');
                })
                .finally(() => {
                    setSaving(false);
                });

        }

    }


    // Delete child
    function handleDelete(childId) {

        if (!window.confirm('Are you sure you want to delete this child?')) {
            return;
        }

        axios.delete(`http://3.107.161.192/child/deletechild/${childId}`)
            .then(res => {

                alert('Child Deleted Successfully');

                return axios.get(
                    `http://3.107.161.192/child/getchildren/${id}`
                );

            })
            .then(res => {
                setChildren(res.data.children);
            })
            .catch(error => {
                console.log(error);
                alert('Failed to Delete Child');
            });

    }


    // Delete adoption request
    function handleDeleteAdoption(adoptionId) {

        if (!window.confirm('Are you sure you want to delete this adoption request?')) {
            return;
        }

        setDeletingRequest(adoptionId);

        axios.delete(
            `http://3.107.161.192/adoption/deleteadoption/${adoptionId}`
        )
            .then(res => {

                alert('Adoption Request Deleted Successfully');

                setAdoptionRequests(prev =>
                    prev.filter(request => request.adoptionId !== adoptionId)
                );

            })
            .catch(error => {
                console.log(error);
                alert('Failed to Delete Adoption Request');
            })
            .finally(() => {
                setDeletingRequest(null);
            });

    }


    // Search children by name
    const filteredChildren = children.filter(child =>
        child.childName?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Loading
    if (loading) {

        return (
            <div className="orphanage-loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );

    }


    // Orphanage not found
    if (!orphanageData) {

        return (
            <div className="orphanage-loading">
                <h3>Orphanage Details Not Found</h3>
                <button onClick={() => navigate('/login')}>
                    Go to Login
                </button>
            </div>
        );

    }


    const isApproved = orphanageData.approvalStatus === true;


    return (

        <div className="orphanage-dashboard">

            {/* Navbar */}

            <nav className="orphanage-navbar">

                <div className="orphanage-brand">

                    <div className="brand-icon">
                        <i className="fa-solid fa-hand-holding-heart"></i>
                    </div>

                    <h2>
                        Kind<span>Bridge</span>
                    </h2>

                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                </button>

            </nav>


            {/* Dashboard Welcome */}

            <section className="orphanage-welcome">

                <div>

                    <span className="welcome-tag">
                        <i className="fa-solid fa-heart"></i>
                        ORPHANAGE PORTAL
                    </span>

                    <h1>
                        Welcome to <span>KindBridge</span>
                    </h1>

                    <p>
                        Together, let's create a safer and brighter future
                        for every child.
                    </p>

                </div>

                <div className="welcome-decoration">
                    <i className="fa-solid fa-house-chimney-heart"></i>
                </div>

            </section>


            {/* Institution Details */}

            <section className="institution-section">

                <div className="section-heading">

                    <div>
                        <span className="section-subtitle">
                            YOUR ORGANIZATION
                        </span>

                        <h2>Institution Details</h2>
                    </div>

                    <span className={`approval-badge ${isApproved ? 'approved' : 'pending'}`}>

                        <i className={`fa-solid ${isApproved ? 'fa-circle-check' : 'fa-clock'}`}></i>

                        {isApproved ? 'Approved' : 'Pending Approval'}

                    </span>

                </div>


                <div className="institution-grid">

                    <div className="institution-card">
                        <div className="detail-icon">
                            <i className="fa-solid fa-id-card"></i>
                        </div>
                        <span>CCI Registration Number</span>
                        <h3>{orphanageData.cciRegistrationnumber}</h3>
                    </div>


                    <div className="institution-card">
                        <div className="detail-icon">
                            <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <span>Location</span>
                        <h3>{orphanageData.location}</h3>
                    </div>


                    <div className="institution-card">
                        <div className="detail-icon">
                            <i className="fa-solid fa-building"></i>
                        </div>
                        <span>Institution Code</span>
                        <h3>{orphanageData.institutionCode}</h3>
                    </div>


                    <div className="institution-card">
                        <div className="detail-icon">
                            <i className="fa-solid fa-house"></i>
                        </div>
                        <span>Institution Type</span>
                        <h3>{orphanageData.institutionType}</h3>
                    </div>


                    <div className="institution-card">
                        <div className="detail-icon">
                            <i className="fa-solid fa-map"></i>
                        </div>
                        <span>District Code</span>
                        <h3>{orphanageData.districtCode}</h3>
                    </div>


                    <div className="institution-card">
                        <div className="detail-icon">
                            <i className="fa-solid fa-user-shield"></i>
                        </div>
                        <span>Managing Authority</span>
                        <h3>{orphanageData.managingAuthority}</h3>
                    </div>

                </div>

            </section>


            {/* Child Management */}

            <section className="child-management">

                <div className="child-content">

                    <div className="child-icon">
                        <i className="fa-solid fa-children"></i>
                    </div>

                    <span className="section-subtitle">
                        CHILD CARE MANAGEMENT
                    </span>

                    <h2>Every Child Deserves a Brighter Future</h2>

                    <p>
                        Register children's details and maintain
                        their records securely through KindBridge.
                    </p>

                    {isApproved ? (

                        <button
                            className="add-child-btn"
                            onClick={() => {
                                setEditingId(null);
                                setChildData({
                                    childName: '',
                                    age: '',
                                    gender: '',
                                    moleLocation: '',
                                    scarLocation: '',
                                    otherIdentityMarks: ''
                                });
                                setShowForm(true);
                            }}
                        >
                            <i className="fa-solid fa-user-plus"></i>
                            Add New Child
                        </button>

                    ) : (

                        <div className="approval-warning">
                            <i className="fa-solid fa-lock"></i>
                            Child registration is available after admin approval.
                        </div>

                    )}

                </div>


                <div className="child-decoration">
                    <i className="fa-solid fa-children"></i>
                </div>

            </section>


            {/* Registered Children Section */}

            <section className="registered-children">

                <div className="children-heading">

                    <div>

                        <span className="section-subtitle">
                            CHILD RECORDS
                        </span>

                        <h2>Registered Children</h2>

                        <p>
                            Manage your institution's child records.
                        </p>

                    </div>

                    <span className="children-count">
                        {children.length} Children
                    </span>

                </div>


                {/* Search Bar */}

                <div className="children-search">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Search children by name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />

                    {searchTerm && (

                        <button onClick={() => setSearchTerm('')}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                    )}

                </div>


                {/* Children List */}

                {childrenLoading ? (

                    <div className="no-children">
                        <p>Loading children...</p>
                    </div>

                ) : filteredChildren.length > 0 ? (

                    <div className="children-grid">

                        {filteredChildren.map(child => (

                            <div
                                className="registered-child-card"
                                key={child._id}
                            >

                                <div className="registered-child-icon">
                                    <i className="fa-solid fa-child"></i>
                                </div>

                                <h3>{child.childName}</h3>

                                <div className="child-info">

                                    <p>
                                        <strong>Age:</strong> {child.age}
                                    </p>

                                    <p>
                                        <strong>Gender:</strong> {child.gender}
                                    </p>

                                    <p>
                                        <strong>Mole Location:</strong> {child.moleLocation || 'N/A'}
                                    </p>

                                    <p>
                                        <strong>Scar Location:</strong> {child.scarLocation || 'N/A'}
                                    </p>

                                    <p>
                                        <strong>Other Marks:</strong>{' '}
                                        {child.otherIdentityMarks || 'N/A'}
                                    </p>

                                </div>

                                <div className="crud-actions">

                                    <button
                                        className="crud-btn update-crud-btn"
                                        onClick={() => handleUpdate(child)}
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                        Update
                                    </button>

                                    <button
                                        className="crud-btn delete-crud-btn"
                                        onClick={() => handleDelete(child._id)}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="no-children">

                        <i className="fa-solid fa-children"></i>

                        <h3>
                            {searchTerm
                                ? 'No Matching Children Found'
                                : 'No Children Registered Yet'}
                        </h3>

                        <p>
                            {searchTerm
                                ? 'Try searching with another name.'
                                : 'Register a child to see their details here.'}
                        </p>

                    </div>

                )}

            </section>


            {/* Adoption Requests Section */}

            <section className="adoption-requests-section">

                <div className="adoption-heading">

                    <div>
                        <span className="section-subtitle">
                            ADOPTION MANAGEMENT
                        </span>

                        <h2>Adoption Requests</h2>

                        <p>
                            View the applicants who are interested in adopting
                            children from your institution.
                        </p>
                    </div>

                    <span className="adoption-count">
                        {adoptionRequests.length} Requests
                    </span>

                </div>


                {adoptionLoading ? (

                    <div className="adoption-empty">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <p>Loading adoption requests...</p>
                    </div>

                ) : adoptionRequests.length > 0 ? (

                    <div className="adoption-grid">

                        {adoptionRequests.map(request => (

                            <div
                                className="adoption-card"
                                key={request.adoptionId}
                            >

                                {/* Child Details */}

                                <div className="adoption-child-header">

                                    <div className="adoption-child-icon">
                                        <i className="fa-solid fa-child"></i>
                                    </div>

                                    <div>
                                        <span className="adoption-label">
                                            CHILD DETAILS
                                        </span>

                                        <h3>
                                            {request.child?.childName || 'Child Details Unavailable'}
                                        </h3>
                                    </div>

                                </div>


                                <div className="adoption-child-info">

                                    <p>
                                        <strong>Age:</strong>{' '}
                                        {request.child?.age ?? 'N/A'}
                                    </p>

                                    <p>
                                        <strong>Gender:</strong>{' '}
                                        {request.child?.gender || 'N/A'}
                                    </p>

                                </div>


                                <div className="adoption-divider"></div>


                                {/* Applicant Details */}

                                <span className="adoption-label">
                                    APPLICANT DETAILS
                                </span>

                                <div className="applicant-details">

                                    <div className="applicant-info-row">
                                        <i className="fa-solid fa-user"></i>
                                        <div>
                                            <small>Applicant Name</small>
                                            <p>{request.user?.userName || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="applicant-info-row">
                                        <i className="fa-solid fa-envelope"></i>
                                        <div>
                                            <small>Email Address</small>
                                            <p>{request.user?.email || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="applicant-info-row">
                                        <i className="fa-solid fa-phone"></i>
                                        <div>
                                            <small>Mobile Number</small>
                                            <p>{request.user?.mobileNumber || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="applicant-info-row">
                                        <i className="fa-solid fa-calendar"></i>
                                        <div>
                                            <small>Age</small>
                                            <p>{request.user?.age ?? 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="applicant-info-row">
                                        <i className="fa-solid fa-venus-mars"></i>
                                        <div>
                                            <small>Gender</small>
                                            <p>{request.user?.gender || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="applicant-info-row">
                                        <i className="fa-solid fa-ring"></i>
                                        <div>
                                            <small>Marital Status</small>
                                            <p>{request.user?.maritalStatus || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {request.user?.companionName && (

                                        <div className="applicant-info-row">
                                            <i className="fa-solid fa-user-group"></i>
                                            <div>
                                                <small>Companion Name</small>
                                                <p>{request.user.companionName}</p>
                                            </div>
                                        </div>

                                    )}

                                </div>


                                {/* Delete Request */}

                                <button
                                    className="delete-adoption-btn"
                                    onClick={() => handleDeleteAdoption(request.adoptionId)}
                                    disabled={deletingRequest === request.adoptionId}
                                >
                                    <i className="fa-solid fa-trash"></i>

                                    {deletingRequest === request.adoptionId
                                        ? 'Deleting...'
                                        : 'Delete Request'}
                                </button>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="adoption-empty">

                        <i className="fa-solid fa-inbox"></i>

                        <h3>No Adoption Requests Yet</h3>

                        <p>
                            Adoption requests from users will appear here.
                        </p>

                    </div>

                )}

            </section>


            {/* Add / Update Child Modal */}

            {showForm && (

                <div
                    className="child-modal-overlay"
                    onClick={() => !saving && setShowForm(false)}
                >

                    <div
                        className="child-modal"
                        onClick={e => e.stopPropagation()}
                    >

                        <div className="modal-header">

                            <div>
                                <span>CHILD REGISTRATION</span>

                                <h2>
                                    {editingId ? 'Update Child Details' : 'Add New Child'}
                                </h2>

                                <p>
                                    Enter the child's personal and identification details.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                disabled={saving}
                                onClick={() => setShowForm(false)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                        </div>


                        <form onSubmit={handleAddChild}>

                            <h3 className="form-section-title">
                                <i className="fa-solid fa-user"></i>
                                Personal Information
                            </h3>


                            <div className="child-form-grid">

                                <div className="form-group full-width">

                                    <label>Child Name *</label>

                                    <input
                                        type="text"
                                        name="childName"
                                        placeholder="Enter child's full name"
                                        value={childData.childName}
                                        onChange={handleChildChange}
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>Age *</label>

                                    <input
                                        type="number"
                                        name="age"
                                        placeholder="Enter age"
                                        min="0"
                                        max="18"
                                        value={childData.age}
                                        onChange={handleChildChange}
                                        required
                                    />

                                </div>


                                <div className="form-group full-width">

                                    <label>Gender *</label>

                                    <select
                                        name="gender"
                                        value={childData.gender}
                                        onChange={handleChildChange}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>

                                </div>

                            </div>


                            <h3 className="form-section-title">
                                <i className="fa-solid fa-fingerprint"></i>
                                Identification Marks
                            </h3>


                            <div className="child-form-grid">

                                <div className="form-group">

                                    <label>Mole Location</label>

                                    <input
                                        type="text"
                                        name="moleLocation"
                                        placeholder="Enter mole location"
                                        value={childData.moleLocation}
                                        onChange={handleChildChange}
                                    />

                                </div>


                                <div className="form-group">

                                    <label>Scar Location</label>

                                    <input
                                        type="text"
                                        name="scarLocation"
                                        placeholder="Enter scar location"
                                        value={childData.scarLocation}
                                        onChange={handleChildChange}
                                    />

                                </div>


                                <div className="form-group full-width">

                                    <label>Other Identification Marks</label>

                                    <textarea
                                        name="otherIdentityMarks"
                                        placeholder="Describe any other identification marks..."
                                        rows="3"
                                        value={childData.otherIdentityMarks}
                                        onChange={handleChildChange}
                                    />

                                </div>

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowForm(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-child-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? 'Please Wait...'
                                        : editingId
                                            ? 'Update Child'
                                            : 'Register Child'}

                                    {!saving && (
                                        <i className="fa-solid fa-arrow-right"></i>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}
