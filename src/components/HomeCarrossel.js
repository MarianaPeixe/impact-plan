import ODSimg from './imgs/ODS.svg';
import sobreNos from './imgs/sobreNos.svg'


function HomeCarousel() {
  return (
    <div id="carouselExampleIndicators" class="carouselPad carousel slide col-8 mx-auto">
        <div class="carousel-indicators mt-5">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner p-5 carTall">
            <div class="carousel-item active card p-5 bgBege rounded-5 h-100 carouselShadow">
                <div class="card-body text-center">
                    <h3 class="carouselH3 card-title">Aligned with global goals</h3>
                    <p class="text-start pt-5">We believe every idea has the power to change the world - especially when aligned with something greater. That’s why our tool lets you connect your project directly with the United Nations Sustainable Development Goals (SDGs).</p>
                    <p className='text-start pt-3'>With this tool, you’ll be able to map your impact and ensure your work contributes to real, measurable change.</p>
                    <img src={ODSimg} className='pt-3' alt="ODS icons"/>
                </div>
            </div>
            <div class="carousel-item card p-5 bgBege rounded-5 carouselShadow h-100">
                <div class="card-body text-center">
                    <h3 class="carouselH3 card-title">Where it all began</h3>
                    <p class="text-start pt-5">The Impact Plan began as a hands-on analog tool created by designer Catarina Lélis, with the goal of helping individuals and teams reflect on impact of their projects. The tool is structured around thematic cards and canvas-based interactions that guide users through critical thinking and ethical decision-making.</p>
                    <p className='text-start pt-3'>All of this is explained in detail in the official Impact Plan book, which offers theoretical foundations, practical exercises, and examples of real-world applications in both academic and professional contexts.</p>
                    <p className='text-start pt-3'>Click the button below to explore the original project and learn more about its methodology, principles, and creative use cases.</p>
                    <button className='btnPrimario p-3 rounded-3 mt-3'>Learn more about the tool</button>
                </div>
            </div>
            <div class="carousel-item card p-5 bgBege rounded-5 carouselShadow h-100">
                <div class="card-body text-center">
                    <h3 class="carouselH3 card-title">Meet our team</h3>
                    <p class="text-start pt-5">This tool was developed within the scope of Multimedia Project, the final curricular unit of the Bachelor's degree in Multimedia and Communication Technologies at the University of Aveiro.</p>
                    <p className='text-start pt-3'>Our team - composed of Eduarda Carvalho, Mafalda Duarte, and Mariana Peixe - was challenged to develop a digital version of the analog tool. This platform was designed with a user-centered approach, combining design, technology, and strategy.</p>
                    <img src={sobreNos} className='pt-3' alt="our team"/>
                </div>
            </div>
        </div>     
    </div>                
  );
}

export default HomeCarousel;