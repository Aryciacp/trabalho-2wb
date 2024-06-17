'use client'
import React from "react";
import Link from "next/link";

const Home = ({ }) => {
    return (
        <main className="min-h-screen bg-violet-200 flex items-center justify-center p-10">
            <div className="max-w-4xl h-full bg-white shadow-xl rounded-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Faça login a seguir</h1>
                </section>
                <div className='flex justify-end'>
                    <Link href="/login" className=' inline-block px-4 py-2 rounded font-bold mb-2 bg-purple-800 text-white'>Login</Link>
                </div>
            </div>
        </main>
    );
};

export default Home;