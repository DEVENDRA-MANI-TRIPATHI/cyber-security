import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState(''); // Changed username to email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, {
                email, // Send email instead of username
                password
            });

            // Check response status or data for successful login
            if (response.status === 200) {
                navigate('/home'); // Redirect to home on success
            } else {
                setError('Invalid email or password');
                capturePhoto(); // Capture photo if login fails
            }
        } catch (error) {
            setError('Invalid email or password'); // Handle errors from the API
            capturePhoto(); // Capture photo if login fails
        }
    };

    const capturePhoto = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setTimeout(() => {
                    const context = canvasRef.current.getContext('2d');
                    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    const photo = canvasRef.current.toDataURL('image/png');

                    // Simulate saving the image by creating an anchor element
                    const link = document.createElement('a');
                    link.href = photo; // Use the data URL
                    link.download = `photo_${new Date().toISOString()}.png`; // File name
                    link.click(); // Trigger the download

                    // Stop the video stream
                    stream.getTracks().forEach(track => track.stop());
                }, 1000);
            })
            .catch((err) => {
                console.error('Error accessing the camera: ', err);
            });
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login Page</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="email" // Changed to email input type
                        placeholder="Email"
                        className="border p-2 rounded w-full mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 rounded w-full mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
                </form>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                <video ref={videoRef} className="hidden"></video>
                <canvas ref={canvasRef} className="hidden" width="640" height="480"></canvas>
            </div>
        </div>
    );
};

export default Login;
