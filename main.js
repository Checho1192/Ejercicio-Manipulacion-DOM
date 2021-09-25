url = 'https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json'
function getData(url) {
    return (fetch(url)
        .then(response => response.json()));
}

function tieneEventoEnRegistro(evento, registro) {
    return registro.events.indexOf(evento) !== -1;
}

function crearMatrizConfusion(evento, data) {
    let matriz = [0, 0, 0, 0];
    data.forEach((registro) => {
        let index = 0;
        if (tieneEventoEnRegistro(evento, registro)) index += 1;
        if (registro.squirrel) index += 2;
        matriz[index] += 1;
    });
    return matriz;
}

function createRow(text1, text2, text3) {
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    let td = document.createElement('td');
    let td2 = document.createElement('td');
    th.innerText = text1;
    td.innerText = text2;
    td2.innerText = text3;
    tr.appendChild(th);
    tr.appendChild(td);
    tr.appendChild(td2);
    return tr;
}

getData(url).then((data) => {
    let table = document.getElementById("tbody-events");
    let eventos = [];
    let tablaFinal = [];
    let i = 0;
    data.forEach((registro) => {
        let events = "";
        registro.events.forEach(evento => {
            if (eventos.indexOf(evento) === -1) eventos.push(evento);
            events += evento + ", ";
        });
        let tr = createRow(i += 1, events.slice(0, -2), registro.squirrel);
        if (registro.squirrel === true) tr.style.backgroundColor = "#ffc4cc";
        table.appendChild(tr);
    });
    var tablaPorEvento = eventos.map(evento => { return { evento: evento, matriz: crearMatrizConfusion(evento, data) } });
    let tablaCorrelation = document.getElementById("tbody-correlation");
    tablaPorEvento.forEach((actual) => {
        let tn = actual.matriz[0];
        let fn = actual.matriz[1];
        let fp = actual.matriz[2];
        let tp = actual.matriz[3];
        const mcc = ((tp * tn) - (fp * fn)) / Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));
        tablaFinal.push([actual.evento, mcc]);
    });
    tablaFinal.sort(function (a, b) { return b[1] - (a[1]); });
    i = 0;
    tablaFinal.forEach((element) => {
        tablaCorrelation.appendChild(createRow(i += 1, element[0], element[1]));
    });
});