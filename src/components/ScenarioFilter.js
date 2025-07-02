import React, { useState } from "react";
import FiltroIcon from './imgs/Canvas/FiltroIcon.svg';

//filtro dos cenários no Canvas
function ScenarioFilter({ onApply }) {
  const [selected, setSelected] = useState([]);

  const handleToggle = (scenario) => {
    setSelected(prev =>
      prev.includes(scenario)
        ? prev.filter(s => s !== scenario)
        : [...prev, scenario]
    );
  };

  const handleApply = () => {
    onApply(selected); // envia seleção ao componente pai
    document.querySelector('#offcanvasRight .btn-close')?.click(); // fecha offcanvas
  };

  const handleClear = () => {
    setSelected([]);
    onApply([]); // limpa no pai também
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        className="myButtons CanvasbtnFiltro position-absolute top-0 end-0 mt-4 me-5"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
      >
        <img src={FiltroIcon} alt="filtro" />
      </button>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasRightLabel" style={{ color: "#585858" }}>
            FILTER
          </h5>
          <img src={FiltroIcon} alt="filtro" className="filtroIcon" />
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>

        <div className="offcanvas-body">
          <p className="filtroTexto mb-2">IMPACT</p>

          <div className="accordion" id="accordionExample">

            {/* Impact on Me */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                  Impact on Me
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse show">
                <div className="accordion-body">
                  <p className="filtroTexto">SHORT-TERM IMPACT SCENARIOS</p>
                  <ul className="list-group">
                    <li className="list-group-item">
                      <input type="checkbox" className="form-check-input me-1"
                        checked={selected.includes("Learning")}
                        onChange={() => handleToggle("Learning")} />
                      Learning
                    </li>
                  </ul>
                  <p className="filtroTexto mt-3">MID-TERM IMPACT SCENARIOS</p>
                  <ul className="list-group">
                    <li className="list-group-item">
                      <input type="checkbox" className="form-check-input me-1"
                        checked={selected.includes("Career")}
                        onChange={() => handleToggle("Career")} />
                      Career
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Impact on Humanity */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                  Impact on Humanity
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse">
                <div className="accordion-body">
                  <p className="filtroTexto">LONG-TERM IMPACT SCENARIOS</p>
                  <ul className="list-group">
                    {["Economic", "Environmental", "Social"].map(cat => (
                      <li className="list-group-item" key={cat}>
                        <input type="checkbox" className="form-check-input me-1"
                          checked={selected.includes(cat)}
                          onChange={() => handleToggle(cat)} />
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <button
              type="button"
              className="btn btnPrimario mt-3"
              style={{ backgroundColor: "#6B8E78", borderColor: "#6B8E78" }}
              onClick={handleApply}
            >
              Apply
            </button>
            <button
              type="button"
              className="btn btnSecundario mt-3 ms-2"
              onClick={handleClear}
            >
              Clear all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScenarioFilter;