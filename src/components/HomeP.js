import logoIP from './imgs/logo.svg';
import imgIntro from './imgs/imgIntro.svg';

import { Link } from 'react-router-dom';
import HomeCarousel from './HomeCarrossel';


import ImportarOds from './ImportarOds';

function HomeP(){
    return (
    <div className="App">
      <header class="d-flex flex-wrap align-items-center justify-content-md-between py-3 mb-4 px-5"> 
        <div className="col-md-3 mb-2 mb-md-0"> 
            <Link to='/' className='d-inline-flex link-body-emphasis text-decoration-none'>
                <img src={logoIP} alt="logo"/>      
            </Link>
        </div> 
       
        <div class="col-md-6 text-end"> 
            <Link to="/login" state={{ fromHome: true }}>
                <button type="button" class="myButtons btnPrimario me-2">Login</button>
            </Link>
            <Link to='register'><button type="button" class="myButtons btnSecundario">Register</button></Link>
        </div> 
    </header>

    <article class="container">
        <div class="row my-5 pt-5">
            <div class="col-12 col-lg-6 my-5">
                <h1>When desire means design.</h1>
                <p class="subtitulos">Unlock your potential, develop your best self, and make the world a better place.</p>
                <p class="mb-0">The Impact Plan helps you turn your ideas into meaningful action.</p> 
                <p class="mb-0">Whether you're launching a new project, shaping a thesis, or planning a trip, our Canvas will guide you every step of the way. </p>
                <p class="mb-3 mt-3 bold">Start building impact with intention.</p>
                <Link to="/login" state={{ fromHome: true }}>
                    <button type="button" class="moreButton btnPrimario mt-5">Go to Canvas</button> 
                </Link>
            </div>

            <div class="col-12 col-lg-6 mt-3 text-center align-self-center my-5">
                <img src={imgIntro} className='img-fluid' alt="image with the different scenarios of impact"/>
            </div>
        </div>
    </article>

    <article class="container-fluid fundoVerde text-center py-5">
        <div class="container">
            <h2 class="pt-5">Don’t know where to start?</h2>
            <p class="pArticle2 py-5">We’ll help!</p>
            <div className='ratio ratio-16x9 mb-5'>
                <iframe
                    src="https://www.youtube.com/embed/Dvl9jb92U1s?si=2jac095vJG63z-Kg"
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>                
                </iframe>
            </div>
        </div>
    </article>

    <article class="container py-5">
        <h2 class="py-5">Mapping the value of projects</h2>
        <p >When having to choose between several project briefs, life challenges or work activities, we usually consider the budget, the time frame, the relationship with the people involved, and the essence of each of the projects to select the right one.</p>
        <p>Also, more often than not, we get just one brief, but its problem to solve is so broad and open to so many nuances that one feels overwhelmed, dragged into difficult decisions and anxious moments. The trouble is that without a supporting framework, we are often unaware of the full ramifications of a new project, namely how it can become a more or less pleasurable, meaningful and impactful challenge in the short, mid and long run.</p>
        <p>The Impact Plan helps us identify the value and purpose of projects considering three main moments:</p>
        
        <div class="row text-center pt-5">
            <div class="col-4">
                <p class="mappingNumero">1</p>
                <p class="mappingSub mb-0 pb-0">Self and instant</p>
                <p class='mappingSub mt-0 pt-0'>reward</p>
                <p>Complete your projects anticipating the impact these will have in your short-term plans.</p>
            </div>
            <div class="col-4">
                <p class="mappingNumero">2</p>
                <p class="mappingSub">Independence and esteem outcome</p>
                <p>Look ahead. Anticipate the impact that the activity/project may have on your future situation, career and intentions.</p>
            </div>
            <div class="col-4">
                <p class="mappingNumero">3</p>
                <p class="mappingSub mb-0 pb-0">Humanity-centred</p>
                <p class='mappingSub mt-0 pt-0'>impact</p>
                <p>Let desires, interests and needs take you toward designing and achieving a solution for a wider problem.</p>
            </div>
        </div>
    </article>

    <article class="container-fluid fundoMaisVerde py-5">
        <div class="container py-5">
            <HomeCarousel></HomeCarousel>
        </div>
    </article>

    <footer class="d-flex px-5 flex-wrap justify-content-between align-items-center py-5"> 
        <Link to='/' className='col-md-4 d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none'>
            <img src={logoIP} alt="logo"/>      
        </Link>
        <ul class="nav col-md-4 justify-content-center"> 
            <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary footerLinks">Mobile app</a></li> 
            <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary footerLinks">Community</a></li> 
            <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary footerLinks">Company</a></li>  
        </ul> 
        <p class="col-md-4 mb-0 text-end text-body-secondary justify-content-end footerCred">© Photo, Inc. 2019. We love our users!</p> 
    </footer>
    <ImportarOds></ImportarOds>
    </div>
    )
}

export default HomeP;