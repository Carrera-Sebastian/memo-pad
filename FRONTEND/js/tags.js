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

function hasOtherNotesWithSameTag(tag, excludingNoteId) {
    var notes = document.querySelectorAll('.note');
    return Array.from(notes).some(note => {
        var noteTag = note.textContent.match(/#[\w]+/g);
        noteTag = noteTag ? noteTag[0].toLowerCase() : '';
        return note.getAttribute('data-note-id') !== excludingNoteId &&
               noteTag === tag;
    });
}

function addTagToSidebar(tag) {
    var tagDiv = document.createElement('div');
    tagDiv.textContent = tag;
    tagDiv.setAttribute('data-tag-filter', tag);
    tagDiv.addEventListener('click', function() {
        filterNotes(tag);
    });
    document.getElementById('tagsContainer').appendChild(tagDiv);
}

function updateTagsInSidebar() {
    var allTags = new Set(); // Usar un Set para evitar etiquetas duplicadas
    var notes = document.querySelectorAll('.note div'); // Seleccionar todos los divs de texto de las notas

    notes.forEach(noteDiv => {
        var tags = noteDiv.textContent.match(/#[\w]+/g);
        if (tags) {
            tags.forEach(tag => allTags.add(tag.toLowerCase()));
        }
    });

    // Actualizar las etiquetas en el sidebar
    var tagsContainer = document.getElementById('tagsContainer');
    tagsContainer.innerHTML = ''; // Limpiar el contenedor actual de etiquetas

    allTags.forEach(tag => {
        var tagDiv = document.createElement('div');
        tagDiv.textContent = tag;
        tagDiv.setAttribute('data-tag-filter', tag);
        tagDiv.addEventListener('click', function() {
            filterNotes(tag);
        });
        tagsContainer.appendChild(tagDiv);
    });
}