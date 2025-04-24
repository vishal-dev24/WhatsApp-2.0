import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null)

    const fetchUser = async () => {
        const res = await axios.get('http://localhost:3000/profile', { withCredentials: true })
        setUser(res.data)
    }
    useEffect(() => {
        fetchUser()
    }, [])
    const handleLogout = async () => {
        await axios.get('http://localhost:3000/logout', { withCredentials: true })
        navigate('/login')
    }
    return (
        <div className='min-h-screen bg-slate-900 '>
            <nav className='fixed bg-gradient-to-r from-slate-800 to-slate-900 text-xl text-white font-semibold cursor-pointer border-b border-slate-900 px-5 py-4 flex justify-between items-center w-full'>
                <h1 className='font-bold'>TCP</h1>
                <div className='flex gap-4'>
                    <button onClick={() => navigate('/home')} className='px-3.5 py-1.5 bg-gradient-to-r from-blue-800 to-blue-700 text-white font-semibold rounded-full shadow-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95 transition-all duration-200'>Home</button>
                </div>
            </nav>

            <div className='flex flex-col items-center justify-start min-h-screen p-10'>
                <div className='mt-20 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-500  p-4 w-full max-w-xl h-full rounded-3xl shadow-lg  text-center'>
                    {user && (
                        <>
                            <div className='flex  justify-between max-w-lg  items-center'>
                                <img src={`http://localhost:3000/uploads/${user.image}`} className='w-60 h-64 object-cover rounded-xl border-2 border-cyan-300' alt="" />
                                <div className='flex flex-col justify-center items-center'>
                                    <h2 className='text-2xl font-semibold text-white capitalize mt-3'>{user.username}</h2>
                                    <p className='text-gray-200 text-lg mt-2 capitalize'>Email: {user.email}</p>
                                    <div className='flex  gap-4 mt-5 justify-center'>
                                        <button className='px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-full shadow-md hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 active:scale-95 transition-all duration-200' onClick={handleLogout}>
                                            Logout
                                        </button>
                                        <button className='px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-300 active:scale-95 transition-all duration-200'>
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile