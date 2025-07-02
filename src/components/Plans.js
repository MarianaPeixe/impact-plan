import { useState, useEffect, useContext } from "react";
import { addDoc, collection, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase.utils";
import { Context } from "../context/AuthContext";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Link, useNavigate } from "react-router-dom";


function Plans() {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("");
  const [projects, setProjects] = useState([{ name: "", beneficiary: "" }]);
  const [plans, setPlans] = useState([]);
  const { user } = useContext(Context);
  const navigate = useNavigate();

  //vai buscar os planos do utilizdor ao firebase
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "plans"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPlans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlans(fetchedPlans);
    });
    return () => unsubscribe();
  }, [user]);

  //fecha e limpa a modal de criar plano
  const handleClose = () => {
    setShow(false);
    setTitle("");
    setTemplate("");
    setProjects([{ name: "", beneficiary: "" }]);
  };

  const handleShow = () => setShow(true);

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const addProjectField = () => {
    setProjects([...projects, { name: "", beneficiary: "" }]);
  };

  //função para salvar plano no firebase
  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      const docRef = await addDoc(collection(db, "plans"), {
        title: title.trim(),
        template,
        projects,
        createdAt: serverTimestamp(),
        uid: user.uid,
      });
      handleClose();
      navigate(`/ip/plandetails/${docRef.id}`);
    } catch (err) {
      console.error("Error adding plan:", err);
    }
  };

  return (
    <div className="container-fluid">
      <nav className="navbar">
        <div className="container-fluid">
          <p className="navbar-brand"></p>
          <form className="d-flex" role="search">
            <input className="form-control me-2 CP_Input" type="search" placeholder="Search" />
            <button className="btn CP_procurar" type="submit">Search</button>
          </form>
        </div>
      </nav>
      <h2 className="mb-0" style={{ marginLeft: "25px" }}>Your Plans</h2>
      <p className="text-muted PStart mb-4">Start a new plan or continue where you left off.</p>
      
      <Row className="gx-4 mb-4">
        <Col xs={3}>
          <Button className="btn btn-primary w-100 Add_Plano" onClick={handleShow}>+</Button>
        </Col>

        {/*lista com os planos do utilizador*/}
        {plans.map(plan => (
          <Col key={plan.id} xs={3}>
            <div className="card shadow-sm w-100 plano_Card mb-4" style={{ minHeight: "220px" }}>
              <div className="card-body d-flex flex-column justify-content-between fundoVerde">
                <div>
                  <h5 className="card-title">
                    <Link to={`/ip/plandetails/${plan.id}`} className="stretched-link text-dark text-decoration-none">
                      Plan: {plan.title}
                    </Link>
                  </h5>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      
      {/*modal para criar plano*/}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton className="fundoVerdeEscuto">
          <Modal.Title>Let’s create your plan!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bgBege">
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Label htmlFor="planTitle">Title</Form.Label>
                <Form.Control
                  className="bgBege"
                  type="text"
                  id="planTitle"
                  placeholder="What's the title of your plan?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Col>
              <Col>
                <Form.Label htmlFor="templateSelect">Template</Form.Label>
                <Form.Select
                  id="templateSelect"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="bgBege"
                >
                  <option>Choose template</option>
                  <option>Academic project</option>
                  <option>Professional project</option>
                  <option>Personal project</option>
                  <option>Travel project</option>
                  <option>I'll define at a later stage</option>
                </Form.Select>
              </Col>
            </Row>

            {projects.map((proj, index) => (
              <Row className="mb-3" key={index}>
                <Col>
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                  className="bgBege"
                    type="text"
                    placeholder="Name your project"
                    value={proj.name}
                    onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Label>Beneficiary</Form.Label>
                  <Form.Control
                    type="text"
                    className="bgBege"
                    placeholder="Who's the beneficiary?"
                    value={proj.beneficiary}
                    onChange={(e) => handleProjectChange(index, "beneficiary", e.target.value)}
                  />
                </Col>
              </Row>
            ))}
            <Button className="btnSecundario" onClick={addProjectField}>+ Add Project</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bgBege">
          <Button className="btnSecundario" onClick={handleClose}>Back</Button>
          <Button className="btnPrimario" onClick={handleSave}>Create plan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Plans;