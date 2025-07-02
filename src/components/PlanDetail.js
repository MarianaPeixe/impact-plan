import { useParams, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, collection, getDocs, updateDoc, arrayUnion, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase.utils";


import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import SimpleCardDetailModal from "./SimpleCardDetailModal";
import FullCardDetailModal from "./FullCardDetailModal";
import AddCardModal from "./AddCardModal";

function PlanDetail() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedCards, setSelectedCards] = useState([]);
  const [showCardDetail, setShowCardDetail] = useState(null);
  const [showSimpleCardDetail, setShowSimpleCardDetail] = useState(null);

  // função para mostrar a carta selecionada na sua verão simples
  const handleShowSimpleCardDetail = (card) => {
    setShowSimpleCardDetail(card);
  };

  const [ratings, setRatings] = useState({});
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  //vai buscar os dados e updates em tempo real do plano
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "plans", planId), async (snapshot) => {
      if (snapshot.exists()) {
        const planData = { id: snapshot.id, ...snapshot.data() };
        setPlan(planData);

        const responsesSnapshot = await getDocs(collection(db, "plans", planId, "responses"));
        const loadedRatings = {};
        responsesSnapshot.forEach(doc => {
          loadedRatings[doc.id] = doc.data();
        });
        setRatings(loadedRatings);
      }
    });

    return () => unsubscribe();
  }, [planId]);

  //vai buscar todas as cartas que existem no firebase
  useEffect(() => {
    async function fetchCards() {
      const snapshot = await getDocs(collection(db, "cards"));
      const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCards(loaded);
    }
    fetchCards();
  }, []);

  //adiciona as cartas selecionadas ao plano no firebase
  const handleAddSelectedCards = async () => {
    if (selectedCards.length === 0) return;

    const planRef = doc(db, "plans", planId);
    await updateDoc(planRef, {
      cards: arrayUnion(...selectedCards)
    });

    setSelectedCards([]);
    setShowModal(false);
  };

  const toggleCardSelection = (id) => {
    setSelectedCards(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

//cria um id unico para as pontuações por projeto e carta
  const getProjectKey = (projectIndex, cardId) => {
    return `project-${projectIndex}-card-${cardId}`;
  };

  //pontuar cartas
  const handleRatingChange = (cardId, descriptor, value) => {
    const key = getProjectKey(selectedProjectIndex, cardId);
    const updated = {
      ...ratings,
      [key]: {
        ...ratings[key],
        [descriptor]: value
      }
    };
    setRatings(updated);
  };

  //salvar as pontuaçoes das cartas no firestore
  const handleSaveRatings = async () => {
    if (!showCardDetail) return;

    const key = getProjectKey(selectedProjectIndex, showCardDetail.id);
    const currentRatings = ratings[key] || {};

    const responseRef = doc(db, "plans", planId, "responses", key);
    await setDoc(responseRef, currentRatings, { merge: true });
    setShowCardDetail(null);
  };

  const projectCount = plan?.projects?.length || 1;

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
  };

  //calcula pontuação total dos projetos
  const getProjectScoreSum = (projectIndex) => {
    if (!plan?.cards) return 0;

    // Soma para este projeto
    let sum = 0;

    plan.cards.forEach(cardId => {
      const key = `project-${projectIndex}-card-${cardId}`;
      const ratingObj = ratings[key];
      if (ratingObj) {
        // somar todos os valores numéricos dentro de ratingObj (que são as pontuações)
        Object.values(ratingObj).forEach(val => {
          if (typeof val === "number") {
            sum += val;
          }
        });
      }
    });

    return sum;
  };

 
  return (
     <div className="container-fluid p-0">
      {plan ? (
        <>
          <div className="PlanoHeader">
            <div><small>Plan</small></div>
            <p className="PlanoHeaderTitulo">{plan.title}</p>
          </div>

          <div className="section-title">
            <h2 style={{ fontSize: '40px', marginTop: '-30px', marginBottom: '0px' }}>Your cards</h2>
            <p style={{ fontSize: '15px' }}>Add cards to your plan</p>
          </div>

          <div className="cards-section">
            <div className="d-flex flex-row align-items-start flex-nowrap" style={{ overflowX: 'auto' }}>
              <button className="card-placeholder me-2 flex-shrink-0" onClick={() => setShowModal(true)}>+</button>
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                {/*carrossel com as cartas associadas ao plano*/}
                <Carousel responsive={responsive} infinite keyBoardControl containerClass="carousel-container carousel slide flex-grow-1" style={{flex: "1 1 auto", minWidth: "0"}}>
                  {(plan.cards || []).map((cardId) => {
                    const card = cards.find(c => c.id === cardId);
                    return card ? (
                      <div key={card.id} onClick={() => setShowCardDetail(card)} style={{ cursor: "pointer", padding: "0 10px" }}>
                        <img  src={card.imageUrl} alt="card image"/>
                      </div>
                    ) : null;
                  })}                
                </Carousel>
              </div>
            </div>

            <div className="dropdown-button mt-4">
              <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Choose template
              </button>
              <ul className="dropdown-menu">
                {["Academic project", "Professional project", "Personal project", "Travel project", "Sustainable innovation project", "None"].map((template, idx) => (
                  <li key={idx}><button className="dropdown-item">{template}</button></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="section-title mt-4">
            <h2 style={{ fontSize: '40px', marginBottom: '0px' }}>Your projects</h2>
            <p style={{ fontSize: '15px' }}>Here are the final scores for each project. You can click on them to access their canvas.</p>
          </div>

          <div className="px-3 d-flex flex-wrap">
            {plan.projects?.map((proj, idx) => (
              <div className="project-box" key={idx} onClick={() => navigate(`/ip/canvas/${planId}/${idx}`)}>
                <strong>{proj.name || `Project ${idx + 1}`}</strong>
                <div className="score-box">{getProjectScoreSum(idx)}</div>
              </div>
            ))}
          </div>

           {/* Add Card Modal */}
            <AddCardModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                cards={cards}
                handleAddSelectedCards={handleAddSelectedCards}
                selectedCards={selectedCards}
                toggleCardSelection={toggleCardSelection}
                associatedCards={plan?.cards || []}
                handleShowSimpleCardDetail={handleShowSimpleCardDetail}
            />

          {/* Simple Card Detail Modal */}
          <SimpleCardDetailModal
            show={!!showSimpleCardDetail}
            handleClose={() => setShowSimpleCardDetail(null)}
            cardDetail={showSimpleCardDetail}
          />


          {/* Full Card Detail Modal */}
          <FullCardDetailModal
              show={!!showCardDetail}
              handleClose={() => setShowCardDetail(null)}
              showCardDetail={showCardDetail}
              handleRatingChange={handleRatingChange}
              handleSaveRatings={handleSaveRatings}
              plan={plan}
              cards={cards}
              setShowCardDetail={setShowCardDetail}
              selectedProjectIndex={selectedProjectIndex}
              setSelectedProjectIndex={setSelectedProjectIndex}
              projectCount={projectCount}
              ratings={ratings} 
              getProjectKey={getProjectKey} 
          />

        </>
      ) : (
        <p>Loading plan...</p>
      )}
      
    </div>
  );
}

export default PlanDetail;