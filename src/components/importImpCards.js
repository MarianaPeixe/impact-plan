import { importCardsToFirestore } from '../utils/importCards';
//importar as cartas para o firestore, nao está a ser utilizado no momento
function ImportarCartas(){
    return (
        <button onClick={importCardsToFirestore}>Importar Cartas</button>
    )
}

export default ImportarCartas;