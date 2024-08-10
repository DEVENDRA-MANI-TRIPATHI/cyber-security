import React from 'react';

const Home = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96 text-center">
                <h1 className="text-3xl font-bold">Home Page</h1>
                <p className="mt-4">Check your downloads folder for the captured photo.</p>
            </div>
        </div>
    );
};

export default Home;
