document.getElementById('add-score-button').addEventListener('click', function() {
  let nota = parseFloat(document.querySelector('.score').value);
  let porcentaje = parseFloat(document.querySelector('.percentage').value);

  // Obtener valores de rango
  let rangoDesde = parseFloat(document.querySelector('.scores-range input:nth-child(2)').value);
  let rangoHasta = parseFloat(document.querySelector('.scores-range input:nth-child(4)').value);

  // Validar rango de notas
  if ((nota < rangoDesde || nota > rangoHasta) && (!isNaN(rangoDesde) && !isNaN(rangoHasta))) {
      alert(`La nota ${nota} está fuera del rango permitido (${rangoDesde}-${rangoHasta}).`);
      return;
  }

  if (isNaN(nota) || isNaN(porcentaje)) return;

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
  porcentajeH1.innerText = porcentaje + '%';

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
      this.parentElement.remove();
      actualizarResultados();
  });

  nuevoDiv.appendChild(notaH1);
  nuevoDiv.appendChild(porcentajeH1);
  nuevoDiv.appendChild(botonEliminar);

  document.getElementById('scores-table').appendChild(nuevoDiv);

  document.querySelector('.score').value = '';
  actualizarResultados();
});

function actualizarResultados() {
  let notasDivs = document.querySelectorAll('#scores-table > div');
  let totalNotas = notasDivs.length;
  let sumaPonderada = 0;
  let totalPorcentaje = 0;

  notasDivs.forEach(div => {
      let nota = parseFloat(div.querySelector('h1:nth-child(1)').innerText);
      let porcentaje = parseFloat(div.querySelector('h1:nth-child(2)').innerText);

      sumaPonderada += nota * (porcentaje / 100);
      totalPorcentaje += porcentaje;
  });

  let promedioPonderado = (totalPorcentaje > 0) ? (sumaPonderada / (totalPorcentaje / 100)) : 0;

  document.querySelector('.total').innerText = totalNotas;
  document.querySelector('.average').innerText = promedioPonderado.toFixed(2);

  let notaMinima = parseFloat(document.querySelector('.scores-min-aprove input').value);

  // Validar rango de nota mínima
  let rangoDesde = parseFloat(document.querySelector('.scores-range input:nth-child(2)').value);
  let rangoHasta = parseFloat(document.querySelector('.scores-range input:nth-child(4)').value);

  if ((notaMinima < rangoDesde || notaMinima > rangoHasta) && (!isNaN(rangoDesde) && !isNaN(rangoHasta))) {
      alert(`La nota mínima para aprobar ${notaMinima} está fuera del rango permitido (${rangoDesde}-${rangoHasta}).`);
      return;
  }

  document.querySelector('.aproved').innerText = (promedioPonderado >= notaMinima) ? 'si' : 'no';
}

document.querySelector('.scores-min-aprove input').addEventListener('input', actualizarResultados);

document.querySelector('.add-button').addEventListener('click', function() {
  let nombreAlumno = document.querySelector('.student-name-input').value;
  if (!nombreAlumno) return;

  let notasDivs = document.querySelectorAll('#scores-table > div');
  let notas = [];

  notasDivs.forEach(div => {
      let nota = div.querySelector('h1:nth-child(1)').innerText;
      let porcentaje = div.querySelector('h1:nth-child(2)').innerText;
      notas.push(`${nota}`);
  });

  let notasString = notas.join(', ');

  actualizarResultados();

  let promedio = document.querySelector('.average').innerText;
  let aprobo = document.querySelector('.aproved').innerText;

  let nuevaFila = document.createElement('tr');

  let nombreCell = document.createElement('td');
  nombreCell.innerText = nombreAlumno;

  let notasCell = document.createElement('td');
  notasCell.innerText = notasString;

  let promedioCell = document.createElement('td');
  promedioCell.innerText = promedio;

  let aproboCell = document.createElement('td');
  aproboCell.innerText = aprobo;
  
  let eliminarCell = document.createElement('td');
  let botonEliminarAlumno = document.createElement('button');
  botonEliminarAlumno.innerText = 'Eliminar';

  botonEliminarAlumno.style.backgroundColor = 'rgba(255, 89, 67, 0.76)';
  botonEliminarAlumno.style.border = '1px solid #5045E5';
  botonEliminarAlumno.style.borderRadius = '3px';
  botonEliminarAlumno.style.padding = '.1rem .5rem';

  botonEliminarAlumno.addEventListener('mouseover', function() {
      botonEliminarAlumno.style.backgroundColor = 'rgba(255, 76, 76, 0.76)'; 
      botonEliminarAlumno.style.color = '#ffffff'; 
  });
  botonEliminarAlumno.addEventListener('mouseout', function() {
      botonEliminarAlumno.style.backgroundColor = 'rgba(255, 89, 67, 0.76)'; 
      botonEliminarAlumno.style.color = '#ffffff'; 
  });

  botonEliminarAlumno.addEventListener('click', function() {
      this.parentElement.parentElement.remove();
  });
  eliminarCell.appendChild(botonEliminarAlumno);

  nuevaFila.appendChild(nombreCell);
  nuevaFila.appendChild(notasCell);
  nuevaFila.appendChild(promedioCell);
  nuevaFila.appendChild(aproboCell);
  nuevaFila.appendChild(eliminarCell);

  document.getElementById('pdf-table-body').appendChild(nuevaFila);

  actualizarResultados();
});

document.querySelector('.clear-button').addEventListener('click', function() {
  document.getElementById('scores-table').innerHTML = '';
  document.querySelector('.student-name-input').value = '';
  actualizarResultados();
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
