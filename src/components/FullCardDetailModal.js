import { Modal, Button, Form } from 'react-bootstrap';

const FullCardDetailModal = ({ 
    show, 
    handleClose, 
    showCardDetail, 
    handleRatingChange, 
    handleSaveRatings, 
    plan, 
    cards, 
    setShowCardDetail, 
    selectedProjectIndex, 
    setSelectedProjectIndex, 
    projectCount,
    ratings,
    getProjectKey
}) => {
    // Map category to header and button background color classes
    const categoryClassMap = {
        Learning: 'btn-learning',
        Career: 'btn-career',
        Economic: 'btn-economic',
        Environmental: 'btn-environmental',
        Social: 'btn-social'
    };

    // Defensive fallback to uppercase first letter + lowercase rest for category key
    const categoryKey = showCardDetail?.category ? showCardDetail.category.charAt(0).toUpperCase() + showCardDetail.category.slice(1).toLowerCase() : '';
    const headerClass = categoryClassMap[categoryKey] || '';
    const buttonClass = categoryClassMap[categoryKey] || '';

    return (
        <Modal show={show} onHide={handleClose} size="lg" className="pontuar">
            <Modal.Header closeButton className={headerClass}>
                <Modal.Title>
                    {showCardDetail?.category} {' > '} {showCardDetail?.subcategory} {' > '} {showCardDetail?.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {showCardDetail?.descriptors?.map((desc, i) => {
                        const currentRating = ratings[getProjectKey(selectedProjectIndex, showCardDetail.id)]?.[desc];
                        return (
                            <Form.Group key={i} className="mb-3">
                                <Form.Label>{desc}</Form.Label>
                                <div className="d-flex justify-content-between">
                                    {[-2, -1, 0, 1, 2].map((val) => (
                                        <Form.Check
                                            key={val}
                                            inline
                                            name={`likert-${i}`}
                                            id={`likert-${showCardDetail.id}-${i}-${val}`}
                                            label={val}
                                            className={`form-check-inline ${
                                                currentRating === val ? `checked-${showCardDetail?.category?.toLowerCase()}` : ''
                                            }`}
                                            checked={currentRating === val}
                                            onChange={() => handleRatingChange(showCardDetail.id, desc, val)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        );
                    })}
                </Form>
            </Modal.Body>
            <Modal.Footer className="d-flex align-items-center flex-wrap gap-2">
                {plan.cards && plan.cards.length > 1 && (
                    <div>
                        <Button variant="light" onClick={() => {
                            const currentIndex = plan.cards.findIndex(id => id === showCardDetail.id);
                            const prevIndex = (currentIndex - 1 + plan.cards.length) % plan.cards.length;
                            const prevCard = cards.find(c => c.id === plan.cards[prevIndex]);
                            setShowCardDetail(prevCard);
                        }}>← Previous</Button>
                        <Button variant="light" className="ms-2" onClick={() => {
                            const currentIndex = plan.cards.findIndex(id => id === showCardDetail.id);
                            const nextIndex = (currentIndex + 1) % plan.cards.length;
                            const nextCard = cards.find(c => c.id === plan.cards[nextIndex]);
                            setShowCardDetail(nextCard);
                        }}>Next →</Button>
                    </div>
                )}
                {projectCount > 1 && (
                    <div className="dropdown ms-2">
                        <Button className={`btn dropdown-toggle btn-${plan.projects?.[selectedProjectIndex]?.category?.toLowerCase() || 'outline-secondary'}`} type="button" data-bs-toggle="dropdown">
                            {plan.projects?.[selectedProjectIndex]?.name || `Project ${selectedProjectIndex + 1}`}
                        </Button>
                        <ul className="dropdown-menu">
                            {plan.projects.map((proj, idx) => (
                                <li key={idx}>
                                    <Button className="dropdown-item bgBege text-dark" onClick={() => setSelectedProjectIndex(idx)}>
                                        {proj.name || `Project ${idx + 1}`}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="ms-auto">
                    <Button className={buttonClass} onClick={handleSaveRatings}>Done</Button>
                    <Button className={`ms-2 ${buttonClass}`} onClick={handleClose}>Cancel</Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default FullCardDetailModal;