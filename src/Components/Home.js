import React from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'
import { Heart, ShieldCheck, Sprout, Building2, FileCheck2, BookOpen } from 'lucide-react'

// Images (save your photos in Components/assets/)
import bgimage from '../Components/assets/AdoptionBg.png'
import heroimage from '../Components/assets/HeroChild.jpg'
import heroimage2 from '../Components/assets/HeroFamily.png'
import missionimage from '../Components/assets/Mission.jpg'

import './Home.css'

export default function Home() {
    const navigate = useNavigate()

    const goToMission = () => {
        document.getElementById('mission').scrollIntoView({ behavior: 'smooth' })
    }

    const goToLogin = () =>{
        navigate('/signup')
    }

  return (
    <div className='home'>

        {/* Blurred background */}
        <div className='home-bg' style={{ backgroundImage: `url(${bgimage})` }}></div>
        <div className='home-overlay'></div>

        {/* Hero */}
        <div className='home-first'>
            <div className='homecontent'>
                <h1 className='home-title'>Every Child Deserves a Loving Home.</h1>
                <p className='home-description'>Every child deserves love, care and the opportunity to build a brighter future. Together, we can create a world where every child belongs.</p>
                <div className='home-buttons'>
                    <button className='primary-btn' onClick={goToLogin}>Create Account</button>
                    <button className='secondary-btn' onClick={goToMission}>Discover Our Mission</button>
                </div>
            </div>

            <div className='home-images'>
                <img src={heroimage} className='hero-img-main' alt='Happy child'/>
                <img src={heroimage2} className='hero-img-small' alt='Family care'/>
            </div>
        </div>

        {/* About Our Mission */}
        <div className='mission' id='mission'>
            <img src={missionimage} className='mission-img' alt='Child with family'/>
            <div className='mission-content'>
                <h2 className='section-title'>Bringing children and families together</h2>
                <p className='section-text'>Our platform makes adoption clearer, safer and more humane. We bring children in need of care, registered orphanages and prospective families together in one trusted place.</p>
                <p className='section-text'>Behind every profile is a child with a story, and behind every application is a family ready to open its heart.</p>
            </div>
        </div>

        {/* Our Purpose */}
        <h2 className='section-title center'>Our Purpose</h2>
        <div className='purpose'>
            <div className='purpose-card peach'>
                <Heart size={32}/>
                <h3>Finding Loving Homes</h3>
                <p>We carefully match children with caring, prepared families.</p>
            </div>
            <div className='purpose-card sage'>
                <ShieldCheck size={32}/>
                <h3>Protecting Every Child</h3>
                <p>Verified records and clear safeguarding keep every child safe.</p>
            </div>
            <div className='purpose-card beige'>
                <Sprout size={32}/>
                <h3>Building Brighter Futures</h3>
                <p>From health to schooling, we help every child grow with confidence.</p>
            </div>
        </div>

        {/* Child Welfare & Support */}
        <h2 className='section-title center'>Child Welfare & Support</h2>
        <div className='support'>
            <div className='support-card'>
                <Building2 size={26}/>
                <h3>Orphanage Support</h3>
                <p>Care homes can manage child profiles and receive help where it matters most.</p>
            </div>
            <div className='support-card'>
                <FileCheck2 size={26}/>
                <h3>Adoption Procedures</h3>
                <p>Clear steps for documents, home studies and legal approvals.</p>
            </div>
            <div className='support-card'>
                <ShieldCheck size={26}/>
                <h3>Child Protection</h3>
                <p>Every profile and placement is reviewed with safeguarding first.</p>
            </div>
            <div className='support-card'>
                <BookOpen size={26}/>
                <h3>Educational Assistance</h3>
                <p>Sponsorships and learning support help children stay on track.</p>
            </div>
        </div>

        {/* Final Call To Action */}
        <div className='cta' style={{marginTop:'100px', marginBottom:'100px'}}>
            <h2>A Little Love Can Change a Lifetime.</h2>
            <p>Be a part of a better future for every child.</p>
            <button className='primary-btn' onClick={goToLogin}>Create Account</button>
        </div>

    </div>
  )
}