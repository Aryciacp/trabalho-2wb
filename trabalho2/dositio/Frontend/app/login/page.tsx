"use client";

import React, { useState, useContext } from "react";
import { useForm } from 'react-hook-form';
import { AuthContext, SignIdData } from "../../context/AuthContext";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignIdData>();
    const { login, authError } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (data: SignIdData) => {
        setLoading(true);
        await login(data);
        setLoading(false);
    }

    return (
        <div className="flex justify-center bg-violet-200 items-center h-screen">
            <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-lg">
                <form className="flex flex-col" onSubmit={handleSubmit(handleLogin)}>
                    <label htmlFor="name" className="mb-2">Usuário</label>
                    <input
                        {...register('name', { required: true })}
                        type="text"
                        id="name"
                        className="px-3 py-2 border rounded-md mb-4"
                        placeholder="Nome"
                    />
                    {errors.name && <span className="text-red-500"> campo é obrigatório</span>}

                    <label htmlFor="password" className="mb-2">Senha</label>
                    <input
                        {...register('password', { required: true })}
                        type="password"
                        id="password"
                        className="px-3 py-2 border rounded-md mb-4"
                        placeholder="Senha"
                    />
                    {errors.password && <span className="text-red-500"> campo é obrigatório</span>}

                    <div className="flex items-center mb-4">
                        <input
                            {...register('admin')}
                            type="checkbox"
                            id="admin"
                            className="mr-2"
                        />
                        <label htmlFor="admin">Admin</label>
                    </div>

                    <button
                        type="submit"
                        className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-violet-800 cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? 'Carregando...' : 'Acessar'}
                    </button>
                </form>
                {authError && <p className="text-red-500 mt-2">{authError}</p>}
            </div>
        </div>
    );
}

export default Login;
