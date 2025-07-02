import { Modal } from 'react-bootstrap';

const SimpleCardDetailModal = ({ show, handleClose, cardDetail }) => {
    // Map dos cenários para colocar a background color correta
    const categoryClassMap = {
        Learning: 'btn-learning',
        Career: 'btn-career',
        Economic: 'btn-economic',
        Environmental: 'btn-environmental',
        Social: 'btn-social'
    };

    const headerClass = categoryClassMap[cardDetail?.category] || '';

    return (
        <Modal show={show} onHide={handleClose} size="lg" className="pontuar">
            <Modal.Header closeButton className={headerClass}>
                <Modal.Title id="simpleCardDetailLabel">
                    {cardDetail?.category} {' > '} {cardDetail?.subcategory} {' > '} {cardDetail?.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Activities:</h5>
                <ul>
                    {cardDetail?.descriptors?.map((desc, idx) => (
                        <li key={idx}>{desc}</li>
                    ))}
                </ul>
            </Modal.Body>
        </Modal>
    );
};

export default SimpleCardDetailModal;