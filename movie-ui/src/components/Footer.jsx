import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate(); 
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* ............sec1.......... */}
        <div>
            <img onClick={()=>{navigate("/")}}  className='mb-5 w-40 cursor-pointer'/>
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>The application allows users to search for movies and get personalized recommendations based on content similarity. It uses a trained ML model that analyzes movie features such as genres, cast, crew, and keywords to find similar movies.

The system also fetches movie posters and details using an external API (like TMDB) to provide a rich and visual user experience.</p>
        </div>
        {/* ...............sec2............... */}
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Contact us</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        {/* ..........sec3.......... */}
        <div  >
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+91 8229844502</li>
                <li>silintsaroj@gmail.com</li>
            </ul>

        </div>
      </div>
      <div>
        {/* ............Copyright Text */}
        <hr/>
        <p className=' py-5 text-sm text-center'>Copyright Saroj Kumar - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
