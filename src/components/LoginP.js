import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {Link} from 'react-router-dom';

import {Context} from '../context/AuthContext';
import {useContext} from 'react';
import {Navigate} from 'react-router-dom';

import SignIn from './SignIn';

import helloimg from './imgs/hello.svg';
import logoIP from './imgs/logo.svg';



function LoginP(){
    const { user, loading } = useContext(Context);

    if (!loading && user) {
        return <Navigate to="/ip/plans" replace />;
    } //se utilizador estiver com login feito, redireciona para a página de planos

    //página de login
    return (
        <div>
            <header class="d-flex flex-wrap align-items-center justify-content-md-between py-3 mb-4 px-5">
                <div className="col-md-3 mb-2 mb-md-0">
                    <Link to='/' className='d-inline-flex link-body-emphasis text-decoration-none'>
                        <img src={logoIP} alt="logo" />
                    </Link>
                </div> 
            </header>
        
        <Container>
                <Row className=''>
                    <Col xs={6} className=''>
                        <Col className='text-center'>
                            <img src={helloimg} alt='Hello, welcome back!' />
                        </Col>
                    </Col>

                    <Col xs={6}>
                        {user ? (
                            <div>
                                <p className="mb-4 comentarioT">Hi, {user.displayName}!</p> 
                            </div>
                        ) : (
                            <div className='ms-5'>
                                <h1 className='my-5 loginH1'>Welcome back!</h1>
                                <form  className="my-3 row">                
                                    <div class="col-12 mt-4 p-0">
                                        <label for="email" class="form-label formTitulo">E-mail</label>
                                        <input type="email" class="form-control formStyl" id="email"/>
                                        <div class="invalid-feedback">
                                            Necessário um e-mail válido.
                                        </div>
                                    </div>
                                    <div class="col-12 mt-4 p-0">
                                        <label for="email" class="form-label formTitulo">Password</label>
                                        <input type="email" class="form-control formStyl" id="senha"s/>
                                    </div>
                                    <button type="submit" className="botaoForm mt-4">Log in</button>
                                    <SignIn></SignIn>
                                </form>
                                <p>Don’t have an account?<Link to='/register' className='ms-1'>Sign up</Link></p>                           
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default LoginP;