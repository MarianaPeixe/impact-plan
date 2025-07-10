import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Link } from 'react-router-dom';

import { useContext, useState } from 'react';
import { Context } from '../context/AuthContext';
import { Navigate  } from 'react-router-dom';

import SignIn from './SignIn';

import welcimg from './imgs/welcome.svg';
import logoIP from './imgs/logo.svg';
import { createUserWithEmail } from '../utils/firebase.utils';

function Register(){
   const { user, loading } = useContext(Context);

    const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await createUserWithEmail(formData.email, formData.password);
    } catch (err) {
        setError(err.message);
    }
    };

    if (!loading && user) {
        return <Navigate to="/ip/plans" replace />;
    } //se utilizador estiver com login feito, redireciona para a página de planos

    //página de resgister
    return(
        <div>
            <header class="d-flex flex-wrap align-items-center justify-content-md-between py-3 mb-4 px-5">
                <div className="col-md-3 mb-2 mb-md-0">
                    <Link to='/' className='d-inline-flex link-body-emphasis text-decoration-none'>
                        <img src={logoIP} alt="Impact Plan logo" />
                    </Link>
                </div> 
            </header>
        
            <Container fluid>
                <Row className='justify-content-around align-items-center'>
                    <Col xs={12} md={6} lg={5} className='d-md-block d-none'>
                        <Col className='text-center'>
                            <img src={welcimg} alt='Welcome!' className='img-fluid'/>
                        </Col>
                    </Col>

                    <Col xs={12} md={6} lg={5} className='px-5'>
                        {user ? (
                            <div>
                                <p className="mb-4 comentarioT">Hi, {user.displayName}!</p>                        
                            </div>
                        ) : (
                            <div className='ms-5'> 
                                <h1 className='my-5 loginH1'>First time here? Sign up!</h1>
                                <form className="my-3 row justify-content-between" onSubmit={handleSubmit}>
                                    <div className="col-5 p-0">
                                        <label htmlFor="firstName" className="form-label formTitulo">First name</label>
                                        <input type="text" className="form-control formStyl" id="firstName" name="firstName" onChange={handleChange} required />
                                    </div>

                                    <div className="col-5 p-0">
                                        <label htmlFor="lastName" className="form-label formTitulo">Last Name</label>
                                        <input type="text" className="form-control formStyl" id="lastName" name="lastName" onChange={handleChange} required />
                                    </div>

                                    <div className="col-12 mt-4 p-0">
                                        <label htmlFor="email" className="form-label formTitulo">E-mail</label>
                                        <input type="email" className="form-control formStyl" id="email" name="email" onChange={handleChange} required />
                                    </div>

                                    <div className="col-12 mt-4 p-0">
                                        <label htmlFor="senha" className="form-label formTitulo">Password</label>
                                        <input type="password" className="form-control formStyl" id="senha" name="password" onChange={handleChange} required />
                                    </div>

                                    {error && <p className="text-danger mt-2">{error}</p>}

                                    <button type="submit" className="botaoForm mt-4">Sign up</button>
                                    <SignIn />
                                </form>

                                <p>Already have an account?<Link to='/login' className='ms-1'>Log in</Link></p>                           
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Register;