import { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Card } from 'react-bootstrap';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase.utils';

function OdsModal({ show, onClose, scenario, planId, projectIndex }) {
  const [allOds, setAllOds] = useState([]);
  const [selectedOds, setSelectedOds] = useState([]);

  // Carregar ODS do Firestore
  useEffect(() => {
    const fetchOds = async () => {
      const snap = await getDocs(collection(db, 'ods'));
      const odsList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => Number(a.id) - Number(b.id)); 
      setAllOds(odsList);
    };
    fetchOds();
  }, []);

  // Carregar ODS previamente associados
  useEffect(() => {
    const fetchAssociatedOds = async () => {
      if (!planId || !scenario) return;
      const ref = doc(db, "plans", planId, "ods", `project-${projectIndex}-${scenario}`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data?.ods) {
          setSelectedOds(data.ods);
        }
      }
    };
    if (show) fetchAssociatedOds();
  }, [show, scenario, planId, projectIndex]);

  const toggleOds = (id) => {
    setSelectedOds(prev =>
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!planId || !scenario) return;
    const ref = doc(db, "plans", planId, "ods", `project-${projectIndex}-${scenario}`);
    await setDoc(ref, { ods: selectedOds }, { merge: true });
    onClose();
  };

  //modal para adicionar os ODS
  return (
    <Modal size="xl" show={show} onHide={onClose}>
      <Modal.Header closeButton className='text-center fundoVerdeEscuto'>
        <Modal.Title>Select the Sustainable Development Goals aligned with your project.</Modal.Title>
      </Modal.Header>
      <Modal.Body className='bgBege'>
        <Row className="g-3">
          {allOds.map((ods) => (
            <Col md={2} key={ods.id}>
              <Card
                onClick={() => toggleOds(ods.id)}
                className={`card-hover ${selectedOds.includes(ods.id) ? 'border-success border-3' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <Card.Img variant="top" src={ods.imageUrl} />
                
              </Card>
            </Col>
          ))}
        </Row>
      </Modal.Body>
      <Modal.Footer className='bgBege'>
        <Button className='btnPrimario' onClick={handleSave}>Add Selected</Button>
        <Button className='btnSecundario' onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OdsModal;