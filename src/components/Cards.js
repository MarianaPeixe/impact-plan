import { useEffect, useState } from "react";
import { db } from "../utils/firebase.utils";
import { collection, getDocs } from "firebase/firestore";

//vai buscar a informação das cartas ao firebase, para se poder ver todas as atividades e depois atribuir pontuações
function Cards() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function fetchCards() {
      const querySnapshot = await getDocs(collection(db, "cards"));
      const loadedCards = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCards(loadedCards);
    }

    fetchCards();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Impact Cards</h2>
      <div className="row">
        {cards.map((card) => (
          <div key={card.id} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <h6 className="card-subtitle text-muted mb-2">
                    {`${card.category} > ${card.subcategory}`}
                </h6>
                <ul className="mt-3">
                  {card.descriptors.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cards;