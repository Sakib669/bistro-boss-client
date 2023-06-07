import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import SocialLogin from "../Shared/SocialLogin/SocialLogin";
import loginImg from '../../assets/others/authentication.gif'


const SignUp = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = data => {

        createUser(data.email, data.password)
            .then(result => {

                const loggedUser = result.user;
                console.log(loggedUser);

                updateUserProfile(data.name, data.photoURL)
                    .then(() => {
                        const saveUser = { name: data.name, email: data.email }
                        fetch('https://bistro-boss-server-delta-drab.vercel.app/users', {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(saveUser)
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.insertedId) {
                                    reset();
                                    Swal.fire({
                                        position: 'top-end',
                                        icon: 'success',
                                        title: 'User created successfully.',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                    navigate('/');
                                }
                            })



                    })
                    .catch(error => {
                        Swal.fire(
                            error.message,
                            'error'
                          )
                    })
            })
    };

    return (
        <>
            <Helmet>
                <title>Bistro Boss | Sign Up</title>
            </Helmet>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col md:flex-row-reverse items-center justify-center">
                    <img src={loginImg} className="w-1/2 rounded-lg shadow-2xl" />
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                            <div className="form-control w-3/4">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    {...register("name", { required: true })}
                                    type="text" placeholder="Name" className="input input-bordered" />
                                {errors.name && <span className='text-red-700'>This field is required</span>}

                            </div>
                            <div className="form-control w-3/4">
                                <label className="label">
                                    <span className="label-text">Photo URL</span>
                                </label>
                                <input
                                    {...register("photoURL", { required: true })}
                                    type="text" placeholder="photoURL" className="input input-bordered" />
                                {errors.photoURL && <span className='text-red-700'>This field is required</span>}

                            </div>
                            <div className="form-control w-3/4">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="text"
                                    {...register("email", { required: true })}
                                    name='email'
                                    placeholder="email" className="input input-bordered" />
                                {errors.email && <span className='text-red-700'>This field is required</span>}

                            </div>
                            <div className="form-control w-3/4">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type="password"
                                    {...register("password", {
                                        required: true,
                                        minLength: 8,
                                        maxLength: 20,
                                        pattern: /^(?=.*[A-Za-z])[A-Za-z\d]{8,}$/
                                    })}
                                    placeholder="password"
                                    name='password'
                                    className="input input-bordered" />
                                {errors.password?.type === 'required' && <p className="text-red-00">Password is required</p>}
                                {errors.password?.type === 'minLength' && <p className="text-red-700">Password must be 6 characters</p>}
                                {errors.password?.type === 'maxLength' && <p className="text-red-700">Password must be less than 20 characters</p>}
                                {errors.password?.type === 'pattern' && <p className="text-red-700">Please set a strong password</p>}
                                <label className="label">
                                    <p>Already User ? 
                                        <Link to='/login' className="underline text-yellow-500"> Login</Link>
                                    </p>
                                </label>
                            </div>
                            <div className="form-control w-3/4 mt-6">
                                <input type='submit'
                                    className="btn btn-warning text-white" value='Register' />
                            </div>
                        </form>
                        <SocialLogin></SocialLogin>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;