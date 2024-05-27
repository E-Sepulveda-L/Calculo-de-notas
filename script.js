let currentCalculationType = 'ponderado';

document.querySelectorAll('.calc-method strong').forEach(li => {
    li.addEventListener('click', function() {
        const selectedCalculationType = this.innerText.toLowerCase();
        if (currentCalculationType !== selectedCalculationType) {
            if (document.querySelectorAll('#scores-table > div').length > 0) {
                alert('No puedes mezclar tipos de cálculo. Limpia la tabla antes de cambiar.');
                return;
            }
            currentCalculationType = selectedCalculationType;
            toggleCalculationType(currentCalculationType);
        }
    });
});

function toggleCalculationType(type) {
    const weightedSection = document.querySelector('.scores-weighted');
    const arithmeticalSection = document.querySelector('.scores-arithmetical');

    if (type === 'ponderado') {
        weightedSection.style.display = 'flex';
        arithmeticalSection.style.display = 'none';
    } else {
        weightedSection.style.display = 'none';
        arithmeticalSection.style.display = 'flex';
    }
}

document.getElementById('add-score-weighted-button').addEventListener('click', function() {
    addScore('ponderado');
});

document.getElementById('add-score-arithmetical-button').addEventListener('click', function() {
    addScore('aritmetico');
});

function addScore(type) {
    let nota = type === 'ponderado' 
        ? parseFloat(document.querySelector('.weighted').value)
        : parseFloat(document.querySelector('.arithmetical').value);
    let porcentaje = type === 'ponderado'
        ? parseFloat(document.querySelector('.percentage').value)
        : 100;

    if (nota.toString().includes('.') || nota.toString().includes(',')) {
        alert('Las notas no pueden contener puntos o comas.');
        return;
    }

    let rangoDesde = parseFloat(document.querySelector('.scores-range input:nth-child(2)').value);
    let rangoHasta = parseFloat(document.querySelector('.scores-range input:nth-child(4)').value);

    if ((nota < rangoDesde || nota > rangoHasta) && (!isNaN(rangoDesde) && !isNaN(rangoHasta))) {
        alert(`La nota ${nota} está fuera del rango permitido (${rangoDesde}-${rangoHasta}).`);
        return;
    }

    if (isNaN(nota) || (type === 'ponderado' && isNaN(porcentaje))) return;

    let nuevoDiv = document.createElement('div');
    nuevoDiv.style.display = 'flex';
    nuevoDiv.style.alignItems = 'center';
    nuevoDiv.style.justifyContent = 'space-around';
    nuevoDiv.style.marginBottom = '2px';
    nuevoDiv.style.borderRadius = '5px';
    nuevoDiv.style.backgroundColor = 'rgba(53, 53, 53, 0.148)';

    let notaH1 = document.createElement('h1');
    notaH1.innerText = nota;

    let porcentajeH1 = document.createElement('h1');
    porcentajeH1.innerText = type === 'ponderado' ? `${porcentaje}%` : '';

    let botonEliminar = document.createElement('button');
    botonEliminar.innerText = 'Eliminar';
    botonEliminar.style.backgroundColor = 'rgba(255, 89, 67, 0.76)';
    botonEliminar.style.border = '1px solid #5045E5';
    botonEliminar.style.borderRadius = '3px';
    botonEliminar.style.padding = '.1rem .5rem';

    botonEliminar.addEventListener('mouseover', function() {
        botonEliminar.style.backgroundColor = 'rgba(255, 76, 76, 0.76)'; 
        botonEliminar.style.color = '#ffffff'; 
    });
    botonEliminar.addEventListener('mouseout', function() {
        botonEliminar.style.backgroundColor = 'rgba(255, 89, 67, 0.76)'; 
        botonEliminar.style.color = '#ffffff'; 
    });

    botonEliminar.addEventListener('click', function() {
        nuevoDiv.remove();
        actualizarResultados();
    });

    nuevoDiv.appendChild(notaH1);
    if (type === 'ponderado') nuevoDiv.appendChild(porcentajeH1);
    nuevoDiv.appendChild(botonEliminar);

    document.getElementById('scores-table').appendChild(nuevoDiv);
    actualizarResultados();
}

function actualizarResultados() {
    let notasDivs = document.querySelectorAll('#scores-table > div');
    let totalNotas = notasDivs.length;
    let sumaNotas = 0;
    let sumaPorcentajes = 0;
    let notasArray = [];

    notasDivs.forEach(div => {
        let nota = parseFloat(div.children[0].innerText);
        let porcentaje = div.children[1] ? parseFloat(div.children[1].innerText) : 100;

        if (currentCalculationType === 'ponderado') {
            sumaNotas += (nota * porcentaje) / 100;
            sumaPorcentajes += porcentaje;
        } else {
            sumaNotas += nota;
        }

        notasArray.push(nota);
    });

    let promedio = currentCalculationType === 'ponderado' 
        ? (sumaPorcentajes > 0 ? sumaNotas / (sumaPorcentajes / 100) : 0)
        : (totalNotas > 0 ? sumaNotas / totalNotas : 0);

    let notaMinimaAprobacion = parseFloat(document.querySelector('.scores-min-aprove input').value);

    document.querySelector('.total').innerText = totalNotas;
    document.querySelector('.average').innerText = promedio.toFixed(2);
    document.querySelector('.aproved').innerText = promedio >= notaMinimaAprobacion ? 'Sí' : 'No';
    
    document.querySelector('.total').dataset.notas = notasArray.join(', ');
}

document.querySelector('.clear-button').addEventListener('click', function() {
    document.getElementById('scores-table').innerHTML = '';
    document.querySelector('.student-name-input').value = '';
    actualizarResultados();
});

document.querySelector('.add-button').addEventListener('click', function() {
    const studentName = document.querySelector('.student-name-input').value.trim();
    if (!studentName) {
        alert('El nombre del alumno es obligatorio.');
        return;
    }

    const notas = document.querySelector('.total').dataset.notas;
    const average = document.querySelector('.average').innerText;
    const aproved = document.querySelector('.aproved').innerText;

    const pdfTableBody = document.getElementById('pdf-table-body');

    let row = pdfTableBody.insertRow();
    row.insertCell(0).innerText = studentName;
    row.insertCell(1).innerText = notas;
    row.insertCell(2).innerText = average;
    row.insertCell(3).innerText = aproved;

    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'Eliminar';
    deleteButton.style.backgroundColor = 'rgba(255, 89, 67, 0.76)';
    deleteButton.style.border = '1px solid #5045E5';
    deleteButton.style.borderRadius = '3px';
    deleteButton.style.padding = '.1rem .5rem';

    deleteButton.addEventListener('mouseover', function() {
        deleteButton.style.backgroundColor = 'rgba(255, 76, 76, 0.76)'; 
        deleteButton.style.color = '#ffffff'; 
    });
    deleteButton.addEventListener('mouseout', function() {
        deleteButton.style.backgroundColor = 'rgba(255, 89, 67, 0.76)'; 
        deleteButton.style.color = '#ffffff'; 
    });
    deleteButton.addEventListener('click', function() {
        row.remove();
    });

    row.insertCell(4).appendChild(deleteButton);
});

document.getElementById('export-pdf-button').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const fileName = document.querySelector('.pdf-filename').value || 'alumnos';
    const additionalText = document.querySelector('.pdf-additional-text').value;

    if (additionalText) {
        doc.text(additionalText, 10, 10);
    }

    doc.autoTable({
        html: '#pdf-table-container table',
        headStyles: { fillColor: [106, 96, 241] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        startY: additionalText ? 20 : 10,
        columns: [
            { header: 'Nombre', dataKey: 'name' },
            { header: 'Notas', dataKey: 'notes' },
            { header: 'Promedio', dataKey: 'average' },
            { header: 'Aprobó', dataKey: 'approved' }
        ],
        body: Array.from(document.querySelectorAll('#pdf-table-container tbody tr')).map(tr => {
            return {
                name: tr.cells[0].innerText,
                notes: tr.cells[1].innerText,
                average: tr.cells[2].innerText,
                approved: tr.cells[3].innerText
            }
        })
    });

    doc.save(`${fileName}.pdf`);
});

document.getElementById('theme-toggle-button').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    this.innerText = isDark ? 'Cambiar a Tema Claro' : 'Cambiar a Tema Oscuro';
});
