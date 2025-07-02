import { useState } from 'react';
import { Modal, Button, Row, Col, Card } from 'react-bootstrap';

import CareerIcon from './imgs/Canvas/career_icon.svg';
import EcIcon from './imgs/Canvas/Ec_Icon.svg';
import EnvIcon from './imgs/Canvas/env_icon.svg';
import SocialIcon from './imgs/Canvas/social_icon.svg';
import LearnIcon from './imgs/Canvas/Group.svg'

const AddCardModal = ({ show, handleClose, cards, handleAddSelectedCards, selectedCards, toggleCardSelection, associatedCards = [], handleShowSimpleCardDetail }) => {
    const [filteredCategory, setFilteredCategory] = useState(null);

    const categories = ["Learning", "Career", "Economic", "Environmental", "Social"];

    // Icones dos cenários
    const categoryIcons = {
        Learning: LearnIcon,
        Career: CareerIcon,
        Economic: EcIcon,
        Environmental: EnvIcon,
        Social: SocialIcon
    };

    const handleCategoryClick = (category) => {
        setFilteredCategory(category);
    };

    const handleBackClick = () => {
        setFilteredCategory(null);
    };

    // Função para contar as carta associadas em cada categoria
    const countAssociatedCardsByCategory = (category) => {
        return associatedCards.filter(cardId => {
            const card = cards.find(c => c.id === cardId);
            return card && card.category === category;
        }).length;
    };

    // Função para contar o número total de cartas por categoria
    const countTotalCardsByCategory = (category) => {
        return cards.filter(card => card.category === category).length;
    };

    return (
        <Modal size="xl" show={show} onHide={handleClose}>
            <Modal.Header closeButton className='fundoVerdeEscuto'>
                <Modal.Title>Add Cards by Scenario</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bgBege'>
                {!filteredCategory ? (
                    <div className="container">
                        <div className="row justify-content-center g-4">
                            <div className="col-md-6 d-flex flex-column align-items-end gap-4">
                                {categories.map((cat) => (
                                    <div className="d-flex align-items-center" key={cat}>
                                        <Button className={`scenario-btn btn-${cat.toLowerCase()}`} onClick={() => handleCategoryClick(cat)}>
                                            {cat}
                                            <img src={categoryIcons[cat]} alt={`${cat} Icon`} style={{ width: '24px', height: '24px', marginLeft: '8px' }} />
                                        </Button>
                                        <div className={`counter-box counter-${cat.toLowerCase()}`}>
                                            {countAssociatedCardsByCategory(cat)}/{countTotalCardsByCategory(cat)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <Row className="g-3">
                        {cards.filter(c => c.category === filteredCategory).map(card => (
                            <Col md={3} key={card.id} className="position-relative">
                                <Card onClick={() => toggleCardSelection(card.id)} className={`h-100 card-hover ${selectedCards.includes(card.id) ? 'border-primary border-3' : ''}`}>
                                    <Card.Img variant="top" src={card.imageUrl} />
                                </Card>
                                <div
                                    className="card-hitbox"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Abre a modal com a carta em formato simples, quando se clica no hitbox
                                        if (typeof handleShowSimpleCardDetail === 'function') {
                                            handleShowSimpleCardDetail(card);
                                        }
                                    }}
                                >
                                </div>
                            </Col>
                        ))}
                        
                    </Row>
                )}
            </Modal.Body>
            <Modal.Footer className='bgBege'>
                {filteredCategory && <Button variant="secondary" onClick={handleBackClick}>Back</Button>}
                <Button className='btnPrimario' onClick={handleAddSelectedCards}>Add Selected</Button>
                <Button className='btnSecundario' onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddCardModal;