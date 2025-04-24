import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiox from 'axios'

const Login = () => {
    const navigate = useNavigate()
    const [formdata, setformData] = useState({ email: "", password: "" })

    const handleChange = (e) => {
        const { name, value } = e.target
        setformData({ ...formdata, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await axiox.post("http://localhost:3000/login", formdata, { withCredentials: true })
        setformData({ email: "", password: "" })
        navigate("/profile")
    }
    return (
        <div className='min-h-screen bg-slate-900  flex flex-col justify-start items-center'>
            <form onSubmit={handleSubmit} className='bg-slate-800 border border-slate-500 mt-20 rounded-xl px-8 py-5 flex flex-col justify-center items-center gap-4'>
                <h1 className='text-4xl font-semibold text-white mb-5'> Login </h1>
                <input className='bg-slate-900 px-4 py-3 border-2 border-zinc-900 shadow shadow-white/50 w-full rounded-lg focus:outline-none capitalize font-semibold  text-white ' type="email" name="email" value={formdata.email} onChange={handleChange} placeholder='Email' required />
                <input className='bg-slate-900 px-4 py-3 border-2 border-zinc-900 shadow shadow-white/50 w-full rounded-lg focus:outline-none capitalize font-semibold  text-white ' type="password" name="password" value={formdata.password} onChange={handleChange} placeholder='Password' required />
                <button className='bg-slate-900 px-4 py-2 border-2 border-zinc-900 shadow shadow-white/50 w-full rounded-lg focus:outline-none capitalize font-semibold  text-white  font-bold text-xl' type='submit'>Login</button>
                <p className='text-lg text-white font-semibold cursor-pointer hover:text-cyan-200' onClick={() => navigate('/')}>If You are Aready Sign-In, Register </p>
            </form>
        </div>
    )
}

export default Login