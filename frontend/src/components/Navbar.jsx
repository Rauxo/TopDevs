import React from 'react'
import logo from "../assets/TopDevs_Logo.png"
import searchIcon from "../assets/search_icon.png"
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className='navBar'>
      <img src={logo} alt="TopDevs Logo" className='NavLogo' />
      <div className="searchBar">
        <input type="text" placeholder='Search user' />
        <div className='searchIcon_div'><img src={searchIcon} alt="Search Icon" className='searchIcon' /></div>
      </div>
      <ul className='navList'>
        <li><Link to="/" className='li'>Home</Link></li>
        <li><Link to="/leaderboard" className='li'>Leaderboard</Link></li>
        <li><Link to="/profile" className='li'>Profile</Link></li>
      </ul>
    </div>
  )
}

export default Navbar