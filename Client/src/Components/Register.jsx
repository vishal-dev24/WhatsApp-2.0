import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiox from 'axios'

const Register = () => {
    const navigate = useNavigate()
    const [formdata, setformData] = useState({ username: "", email: "", password: "", image: null })

    const handleChange = (e) => {
        const { name, value, files } = e.target
        setformData({ ...formdata, [name]: files ? files[0] : value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("username", formdata.username)
        formData.append("email", formdata.email)
        formData.append("password", formdata.password)
        formData.append("image", formdata.image)
        await axiox.post("http://localhost:3000/register", formData, { withCredentials: true })
        setformData({ username: "", email: "", password: "", image: null })
        navigate("/login")
    }

    return (
        <div className='min-h-screen bg-slate-900  flex flex-col justify-start items-center'>
            <form onSubmit={handleSubmit} className='bg-slate-800 border border-slate-500 mt-20 rounded-xl px-8 py-5 flex flex-col justify-center items-center gap-4'>
                <h1 className='text-4xl font-semibold text-white mb-5'> Register</h1>
                <input className='bg-slate-900 px-4 py-3 border-2 border-zinc-900 shadow shadow-white/50 w-full rounded-lg focus:outline-none capitalize font-semibold  text-white ' type="text" name="username" value={formdata.username} onChange={handleChange} placeholder='Username' required />
                <input className='bg-slate-900 px-4 py-3 border-2 border-zinc-900 shadow shadow-white/50 w-full rounded-lg focus:outline-none capitalize font-semibold  text-white ' type="email" name="email" value={formdata.email} onChange={handleChange} placeholder='Email' required />
                <input className='bg-slate-900 px-4 py-3 border-2 border-zinc-900 shadow shadow-white/50 w-full rounded-lg focus:outline-none capitalize font-semibold  text-white ' type="password" name="password" value={formdata.password} onChange={handleChange} placeholder='Password' required />
                <input className='bg-slate-900 px-4 py-3 border-2 border-zinc-900 shadow shadow-white/50 w-full rounded-lg focus:outline-none capitalize font-semibold  text-white file:mr-4 file:px-3 file:py-2 file:text-sm file:rounded-lg file:bg-slate-700 file file:text-white file:border file:border-teal-100 ' type="file" name="image" accept='image/*' onChange={handleChange} required />
                <button className='bg-slate-900 px-4 py-3 border-2 border-zinc-900 shadow shadow-white/50 w-full rounded-lg focus:outline-none capitalize font-semibold  text-white  font-bold text-xl' type='submit'>Register</button>
                <p className='text-lg text-white font-semibold cursor-pointer hover:text-cyan-200' onClick={() => navigate('/login')}>If You are Aready Sign-up , Login </p>
            </form>
        </div>
    )
}

export default Register
