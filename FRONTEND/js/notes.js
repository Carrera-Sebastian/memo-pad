document.getElementById('saveButton').addEventListener('click', function() {
    var noteText = document.getElementById('noteInput').value;
    if (noteText.trim() === '') {
        alert('Por favor, escribe algo en la nota.');
        return;
    }

    // Aquí podrías añadir el código para guardar la nota en tu "ORM"
    // Por simplicidad, vamos a mostrar la nota directamente en la página

    //Creación de nota
    var noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.textContent = noteText;
    document.getElementById('notesContainer').appendChild(noteDiv);

    // Extraer etiquetas (hashtags) y mostrarlas en el sidebar
    var tags = noteText.match(/#[\w]+/g);
    if (tags) {
        tags.forEach(function(tag) {
            var normalizedTag = tag.toLowerCase();
            if (!document.querySelector(`[data-tag-filter="${normalizedTag}"]`)) {
                var tagDiv = document.createElement('div');
                tagDiv.textContent = normalizedTag;
                tagDiv.setAttribute('data-tag-filter', normalizedTag);
                tagDiv.addEventListener('click', function() {
                    filterNotes(normalizedTag);
                });
                document.getElementById('tagsContainer').appendChild(tagDiv);
            }
        });
    }

    // Limpiar el textarea
    document.getElementById('noteInput').value = '';
});

function filterNotes(tag) {
    var notes = document.querySelectorAll('.note');
    notes.forEach(note => {
        if (note.textContent.includes(tag)) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    });
}
