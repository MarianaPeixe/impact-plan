import SairIcon from './imgs/Canvas/SairIcon.svg';
import RetrocedeEsq from './imgs/Canvas/RetrocedeEsq.svg';
import RetrocedeDir from './imgs/Canvas/RetrocedeDir.svg';
import CanvaLinhaNav from './imgs/Canvas/CanvaLinhaNav.svg';
import CanvasImpactos from './imgs/Canvas/CanvasImpactos.svg';
import GroupIcon from './imgs/Canvas/Group.svg';
import CareerIcon from './imgs/Canvas/career_icon.svg';
import EcIcon from './imgs/Canvas/Ec_Icon.svg';
import EnvIcon from './imgs/Canvas/env_icon.svg';
import SocialIcon from './imgs/Canvas/social_icon.svg';
import Happy from './imgs/Canvas/happy.svg';
import Sad from './imgs/Canvas/sad.svg';

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase.utils";

import Toolbar from './Toolbar';
import ScenarioFilter from './ScenarioFilter';
import { getScenarioLayout } from './layoutUtils';
import OdsModal from './OdsSelectorModal';

import Xarrow from "react-xarrows";
import CanvasDraw from "react-canvas-draw"; 
import StickyNotesContainer from './StickyNote';

function Canvas() {
    const { planId, projectIndex } = useParams();
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(Number(projectIndex) || 0);
    const [plan, setPlan] = useState(null);
    const [activeScenarios, setActiveScenarios] = useState(["Learning", "Career", "Economic", "Environmental", "Social"]);
    const [linkMode, setLinkMode] = useState(false);
    const [drawMode, setDrawMode] = useState(false); // Novo estado para o modo de desenho
    const canvasDrawRefs = useRef({}); // Referências para os componentes CanvasDraw
    const [connections, setConnections] = useState([]); // Estado para armazenar as conexões
    const [redoStack, setRedoStack] = useState([]); // Para armazenar as ações que podem ser refeitas
    const [stickyNoteMode, setStickyNoteMode] = useState(false); // Novo estado para o modo de notas
    const [notes, setNotes] = useState([]);

    // Load sticky notes do Firestore
    useEffect(() => {
        const loadNotes = async () => {
            if (!planId) return;
            try {
                const notesDocRef = doc(db, "plans", planId, "stickyNotes", `project-${selectedProjectIndex}`);
                const notesDocSnap = await getDoc(notesDocRef);
                if (notesDocSnap.exists()) {
                    const data = notesDocSnap.data();
                    setNotes(data.notes || []);
                } else {
                    setNotes([]);
                }
            } catch (error) {
                console.error("Erro ao carregar sticky notes:", error);
            }
        };
        loadNotes();
    }, [planId, selectedProjectIndex]);

    // salva sticky notes no Firestore
    const saveNotesToFirestore = async () => {
        if (!planId) return;
        try {
            if (!notes || notes.length === 0) return;
            // salva as notes como um array num unico document
            const ref = doc(db, "plans", planId, "stickyNotes", `project-${selectedProjectIndex}`);
            await setDoc(ref, { notes: notes }, { merge: true });
            console.log("Sticky notes saved successfully");
        } catch (error) {
            console.error("Erro ao salvar sticky notes:", error);
        }
    };

    // Salva sticky notes através do botao
    const saveStickyNotes = async () => {
        await saveNotesToFirestore();
    };

    // salva as notes, com base nas mudanças feitas
    useEffect(() => {
        const saveNotes = async () => {
            if (!planId) return;
            try {
                if (!notes || notes.length === 0) return;
                const ref = doc(db, "plans", planId, "stickyNotes", `project-${selectedProjectIndex}`);
                await setDoc(ref, { notes: notes }, { merge: true });
                console.log("Sticky notes saved successfully");
            } catch (error) {
                console.error("Erro ao salvar sticky notes:", error);
            }
        };
        const timeout = setTimeout(() => {
            saveNotes();
        }, 1000);
        return () => clearTimeout(timeout);
    }, [notes, planId, selectedProjectIndex]);
     
    const fixedOrder = ["Learning", "Career", "Economic", "Environmental", "Social"];

    //coloca um aordem fixa nos cenários que foram filtrados
    const sortedSetActiveScenarios = (selected) => {
        if (selected.length === 0) {
            setActiveScenarios(fixedOrder);
        } else {
            const sorted = fixedOrder.filter(scenario => selected.includes(scenario));
            setActiveScenarios(sorted);
        }
    };

    const [associatedOds, setAssociatedOds] = useState({ Economic: [], Environmental: [], Social: [] });
    const [showOdsModal, setShowOdsModal] = useState(false);
    const [scenarioForOdsModal, setScenarioForOdsModal] = useState(null);

    const [highImpactDescriptors, setHighImpactDescriptors] = useState({
        Learning: { plus: [], minus: [] },
        Career: { plus: [], minus: [] },
        Economic: { plus: [], minus: [] },
        Environmental: { plus: [], minus: [] },
        Social: { plus: [], minus: [] }
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlan = async () => {
            const docSnap = await getDoc(doc(db, "plans", planId));
            if (docSnap.exists()) {
                setPlan({ id: docSnap.id, ...docSnap.data() });
            }
        };
        fetchPlan();
    }, [planId]);

    useEffect(() => {
        setSelectedProjectIndex(Number(projectIndex) || 0);
    }, [projectIndex]);

    useEffect(() => {
        const fetchResponses = async () => {
            const responseSnap = await getDocs(collection(db, "plans", planId, "responses"));
            const cardSnap = await getDocs(collection(db, "cards"));
            const allCards = cardSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const descriptorsByCategory = {
                Learning: { plus: [], minus: [] },
                Career: { plus: [], minus: [] },
                Economic: { plus: [], minus: [] },
                Environmental: { plus: [], minus: [] },
                Social: { plus: [], minus: [] }
            };

            responseSnap.forEach(docSnap => {
                const key = docSnap.id;
                if (!key.includes(`project-${selectedProjectIndex}-card-`)) return;

                const cardId = key.split('-card-')[1];
                const card = allCards.find(c => c.id === cardId);
                const response = docSnap.data();

                if (card && card.category && response) {
                    Object.entries(response).forEach(([descriptor, value]) => {
                        if (value === 2) descriptorsByCategory[card.category]?.plus.push(descriptor);
                        if (value === -2) descriptorsByCategory[card.category]?.minus.push(descriptor);
                    });
                }
            });

            setHighImpactDescriptors(descriptorsByCategory);
        };

        if (planId && plan?.projects) {
            fetchResponses();
        }
    }, [planId, selectedProjectIndex, plan]);

    useEffect(() => {
    const fetchAssociatedOds = async () => {
        const result = {};
        const allOdsSnap = await getDocs(collection(db, "ods")); // busca todos os ODS
        const allOds = allOdsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        for (const scenario of ["Economic", "Environmental", "Social"]) {
        const ref = doc(db, "plans", planId, "ods", `project-${selectedProjectIndex}-${scenario}`);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            const savedIds = snap.data().ods || [];
            result[scenario] = savedIds.map(saved => {
            if (typeof saved === 'number' || typeof saved === 'string') {
                return allOds.find(o => String(o.id) === String(saved));
            }
            return saved; // já é objeto completo
            }).filter(Boolean); // remove nulls
        } else {
            result[scenario] = [];
        }
        }

        setAssociatedOds(result);
    };

    fetchAssociatedOds();
    }, [planId, selectedProjectIndex, showOdsModal]);


    const scenarioIcons = {
        Learning: GroupIcon,
        Career: CareerIcon,
        Economic: EcIcon,
        Environmental: EnvIcon,
        Social: SocialIcon,
    };

    const handleDescriptorClick = (id) => {
        if (!linkMode) return;
    };

    const saveConnectionsToFirestore = async () => {
        if (!planId) return;
        const ref = doc(db, "plans", planId, "connections", `project-${selectedProjectIndex}`);
        try {
            await setDoc(ref, { connections }, { merge: true });
            console.log("Conexões guardadas com sucesso");
        } catch (error) {
            console.error("Erro ao guardar conexões:", error);
        }
    };

    useEffect(() => {
        const loadConnections = async () => {
            if (!planId) return;
            try {
                const ref = doc(db, "plans", planId, "connections", `project-${selectedProjectIndex}`);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    if (data?.connections) setConnections(data.connections);
                }
            } catch (error) {
                console.error("Erro ao carregar conexões:", error);
            }
        };
        loadConnections();
    }, [planId, selectedProjectIndex]);

    // Função para salvar o desenho
    const saveDrawing = async (scenario) => {
        if (!planId || !canvasDrawRefs.current[scenario]) return; // Verifica se o planId e a referência do canvasDraw estão disponíveis
        const drawingData = canvasDrawRefs.current[scenario].getSaveData(); // Obtém os dados do desenho
        const ref = doc(db, "plans", planId, "drawings", `project-${selectedProjectIndex}-${scenario}`); // Referência para o Firestore
        try {
            await setDoc(ref, { drawingData }, { merge: true }); // Salva os dados no Firestore
            console.log(`Desenho do cenário ${scenario} guardado com sucesso`);
        } catch (error) {
            console.error("Erro ao guardar desenho:", error);
        }
    };

    // Função para carregar o desenho
    const loadDrawing = async (scenario) => {
        if (!planId || !canvasDrawRefs.current[scenario]) return; // Verifica se o planId e a referência do canvasDraw estão disponíveis
        try {
            const ref = doc(db, "plans", planId, "drawings", `project-${selectedProjectIndex}-${scenario}`); // Referência para o Firestore
            const snap = await getDoc(ref); // Obtém os dados do Firestore
            if (snap.exists()) {
                const data = snap.data();
                if (data?.drawingData) {
                    canvasDrawRefs.current[scenario].loadSaveData(data.drawingData, true); // Carrega os dados no canvas
                }
            }
        } catch (error) {
            console.error("Erro ao carregar desenho:", error);
        }
    };

    // useEffect para carregar o desenho quando o modo de desenho é ativado
    useEffect(() => {
        const loadDrawings = async () => {
            if (drawMode) {
                for (const scenario of activeScenarios) {
                    await loadDrawing(scenario);
                }
            }
        };
        loadDrawings();
    }, [drawMode, planId, selectedProjectIndex, activeScenarios]);

    // useEffect para salvar as conexões sempre que elas mudam
    useEffect(() => {
        const saveConnections = async () => {
            if (connections.length > 0) {
                await saveConnectionsToFirestore();
            }
        };
        saveConnections();
    }, [connections]);

    

     const handleStickyNoteToggle = (isActive) => {
        setStickyNoteMode(isActive);
    };


    // Funções de desfazer e refazer
    const undoAction = () => {
        if (linkMode) {
            // Desfazer a última conexão
            setConnections(prev => {
                const newConnections = [...prev];
                const lastConnection = newConnections.pop(); // Remove a última conexão
                if (lastConnection) {
                    setRedoStack(prevRedo => [...prevRedo, lastConnection]); // Adiciona à pilha de refazer
                }
                return newConnections;
            });
        } else {
            // Desfazer o desenho
            activeScenarios.forEach(scenario => {
                if (canvasDrawRefs.current[scenario]) {
                    canvasDrawRefs.current[scenario].undo();
                }
            });
        }
    };

    const redoAction = () => {
        if (redoStack.length > 0) {
            const lastRedo = redoStack.pop(); // Remove a última ação
            setConnections(prev => [...prev, lastRedo]); // Adiciona de volta às conexões
            setRedoStack(redoStack); // Atualiza 
        }
    };

    return (
        <div className="container-fluid m-0 p-0">
            <div className="container col-11 text-dark d-flex align-items-start justify-content-center position-relative">

                <div className="position-absolute top-0 start-0 mt-4 ms-5 d-flex gap-4 z-3" style={{ zIndex: 1000 }}>
                    <img src={SairIcon} alt="Sair" style={{ cursor: 'pointer' }} onClick={() => setActiveScenarios(["Learning", "Career", "Economic", "Environmental", "Social"])} />
                    <img src={RetrocedeEsq} alt="Retroceder" onClick={undoAction} style={{ cursor: 'pointer' }} />
                    <img src={RetrocedeDir} alt="Refazer" onClick={redoAction} style={{ cursor: 'pointer' }} />
                </div>

                {plan?.projects?.length > 1 && (
                    <div className="dropdown-center mt-3" style={{ zIndex: 1001 }}>
                        <button className="btn CanvasDrop dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            {plan.projects[selectedProjectIndex]?.name || `Project ${selectedProjectIndex + 1}`}
                        </button>
                        <ul className="dropdown-menu CanvasDropMenu">
                            {plan.projects.map((proj, index) => (
                                <li key={index}>
                                    <button className="dropdown-item" onClick={() => navigate(`/ip/canvas/${planId}/${index}`)}>
                                        {proj.name || `Project ${index + 1}`}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className='mt-4' >
                    <ScenarioFilter style={{ zIndex: 1004 }} onApply={sortedSetActiveScenarios} />
                    <img src={CanvaLinhaNav} alt="LinhaNav" className="CanvasLimiteNav position-absolute start-0 translate-middle-y ms-5 mt-4 d-block" />
                </div>

                {!(activeScenarios.length < 5) && (
                    <>
                        <img src={CanvasImpactos} alt="NiveisImpacto" className="position-absolute" style={{ left: "5%", width: "89%", top: "100px" }} />
                        <button className="btn CanvasImpactos position-absolute" style={{ left: "5%", width: "35%" }} onClick={() => sortedSetActiveScenarios(["Learning", "Career"])}>IMPACT ON ME</button>
                        <button className="btn CanvasImpactos position-absolute" style={{ left: "41%", width: "53%" }} onClick={() => sortedSetActiveScenarios(["Economic", "Environmental", "Social"])}>IMPACT ON HUMANITY</button>
                    </>
                )}

                {activeScenarios.map((scenario, index) => {
                    const layout = getScenarioLayout(index, activeScenarios.length);
                    const icon = scenarioIcons[scenario];
                    const { height, ...buttonLayout } = layout;
                    const isFiltered = activeScenarios.length < 5;
                    const buttonTop = isFiltered ? "150px" : "195px";
                    const cardTop = isFiltered ? "200px" : "250px";

                    return (
                        <div key={scenario}>
                            <button className={`canvas-btn-${scenario.toLowerCase()}`} style={{ ...buttonLayout, position: "absolute", top: buttonTop }}>
                                <span className="canvas_span">{scenario.toUpperCase()}</span>
                                <img src={icon} alt="Ícone" className="canvas_icons" />
                            </button>

                            <div className="card position-absolute custom-scroll" 
                                style={{
                                    top: cardTop,
                                    ...layout,
                                    backgroundColor: "rgba(0, 0, 0, 0.18)",
                                    borderRadius: "15px",
                                    overflowY: "auto",
                                    padding: "8px",
                                    height: ['Learning', 'Career'].includes(scenario) ? '371px' : '273px'
                                }}>
                                <div className="card-body p-2">
                                    <ul className="list-unstyled m-0">
                                        {highImpactDescriptors[scenario]?.plus.slice(0, 3).map((desc, idx) => {
                                            const id = `plus-${scenario}-${idx}`;
                                            return (
                                                <li key={id} id={id} className="d-flex align-items-start mb-1 atividadesBorda" onClick={() => handleDescriptorClick(id)} style={{ cursor: linkMode ? 'pointer' : 'default' }}>
                                                    <img src={Happy} alt="+2" className="me-2" />
                                                    <span className="small">{desc}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <ul className="list-unstyled m-0">
                                        {highImpactDescriptors[scenario]?.minus.slice(0, 3).map((desc, idx) => {
                                            const id = `minus-${scenario}-${idx}`;
                                            return (
                                                <li key={id} id={id} className="d-flex align-items-start mb-1 atividadesBorda" onClick={() => handleDescriptorClick(id)} style={{ cursor: linkMode ? 'pointer' : 'default' }}>
                                                    <img src={Sad} alt="-2" className="me-2" />
                                                    <span className="small">{desc}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>

                             {['Economic', 'Environmental', 'Social'].includes(scenario) && (
                                <div className="card position-absolute overflow-x-scroll d-flex flex-row custom-scroll" style={{ top: "528px", ...layout, height: "93px", backgroundColor: "#FAF8EF", borderRadius: "15px", border: "3px solid #CDCBC4", overflowY: "hidden", whiteSpace: "nowrap" }}>
                                <div className="card text-center Canvas_Ods" style={{ marginLeft: "3px" }}>
                                    <div className="card-body p-0 d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                                    <span style={{ fontSize: "50px", color: "#6B8E78", cursor: "pointer" }} onClick={() => { setScenarioForOdsModal(scenario); setShowOdsModal(true); }}>+</span>
                                    </div>
                                </div>
                                {associatedOds[scenario]?.map((ods, j) => (
                                <div key={`ods-${scenario}-${j}`} className="card Canvas_Ods" style={j === 5 ? { marginRight: "3px" } : {}}>
                                    {ods.imageUrl ? (
                                    <img src={ods.imageUrl} alt={ods.title || "ODS"} className="img-fluid CanvasODSimg" />
                                    ) : (
                                    <div className="text-muted text-center small">Imagem não disponível</div>
                                    )}
                                </div>
                                ))}

                                </div>
                            )}
                        </div>
                    );
                })}

                {showOdsModal && (
                    <OdsModal
                        show={showOdsModal}
                        onClose={() => setShowOdsModal(false)}
                        scenario={scenarioForOdsModal}
                        planId={planId}
                        projectIndex={selectedProjectIndex}
                    />
                )}

                {(linkMode && activeScenarios.length < 5) && connections.map((conn, idx) => (
                    <Xarrow key={idx} start={conn.start} end={conn.end} strokeWidth={2} color="#6B8E78" />
                ))}

                {linkMode && (
                    <button
                        className="btn btnPrimario position-absolute"
                        style={{ bottom: "0px", right: "0px", zIndex: 1006 }} 
                        onClick={saveConnectionsToFirestore} // Chama a função ao clicar
                    >
                        Save connections
                    </button>
                )}

                {drawMode && activeScenarios.length > 0 && (
                    <div>
                        <CanvasDraw
                            ref={el => canvasDrawRefs.current[activeScenarios[0]] = el} // Armazena a referência do CanvasDraw para o primeiro cenário ativo
                            brushColor="#6B8E78"
                            brushRadius={2}
                            lazyRadius={0}
                            hideGrid={true}
                            canvasWidth={window.innerWidth * 0.9} 
                            canvasHeight={window.innerHeight * 0.9} 
                            style={{
                                position: "absolute",
                                top: "300px", 
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 1,
                                border: "1px solid #ccc",
                                backgroundColor: "rgba(255, 255, 255, 0.5)"
                            }}
                
                        />
                        <div className="position-absolute" style={{ bottom: "0px", right: "0px", zIndex: 1006 }}>
                            <button className="btn btnSecundario me-2" onClick={() => canvasDrawRefs.current[activeScenarios[0]].clear()}>
                                Clean
                            </button>
                            <button className="btn btnPrimario" onClick={() => saveDrawing(activeScenarios[0])}>
                                Save drawing
                            </button>
                        </div>
                    </div>
                )}

                {stickyNoteMode && (
                    <>
                        <StickyNotesContainer
                            notes={notes}
                            setNotes={setNotes}
                        />
                        <div className="position-absolute" style={{ bottom: "0px", right: "0px", zIndex: 1006 }}>
                            <button className="btn btnPrimario" onClick={saveStickyNotes}>
                                Save notes
                            </button>
                        </div>
                    </>
                )}

                {activeScenarios.length < 5 && (
                    <Toolbar 
                        onToggleLinkMode={setLinkMode} 
                        onToggleDrawMode={setDrawMode} 
                        onToggleStickyNoteMode={handleStickyNoteToggle} 
                    />
                )}
            </div>
        </div>
    );
}

export default Canvas;