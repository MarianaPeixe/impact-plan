import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

import home from './imgs/Nav/home.svg';
import proj from './imgs/Nav/projetos.svg'
import hist from './imgs/Nav/historico.svg'
import fav from './imgs/Nav/favoritos.svg'
import tut from './imgs/Nav/tutorial.svg'
import perfil from './imgs/Nav/perfil.svg'

import SignOut from './SignOut';

function MainPage() {
  return (
    <Container fluid className="m-0 p-0">
      <Row className="g-0 min-vh-100">

        {/* Sidebar vertical */}
        <Col sm={1} className="fundoMaisVerde d-flex flex-column justify-content-between align-items-center py-4" style={{ width: "80px" }}>
          <div className="d-flex flex-column align-items-center gap-4">
            <Link to='/'><img src={home} alt="Home" className="sidebar-icon" /></Link>
            <Link to='/ip/plans'><img src={proj} alt="Projetos" className="sidebar-icon active" /></Link>
            <img src={hist} alt="Histórico" className="sidebar-icon" />
            <img src={fav} alt="Favoritos" className="sidebar-icon" />
            <img src={tut} alt="Tutorial" className="sidebar-icon" />
          </div>
          <div className="d-flex flex-column align-items-center gap-4">
            <img src={perfil} alt="Perfil" className="sidebar-icon" />
            <SignOut></SignOut>
          </div>
        </Col>

        {/* Área de conteúdo principal */}
        <Col sm={11}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default MainPage;