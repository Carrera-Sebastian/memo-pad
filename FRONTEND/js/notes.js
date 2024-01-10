window.onload = loadNotes;

document.getElementById('saveButton').addEventListener('click', function() {
    var noteText = document.getElementById('noteInput').value;
    if (noteText.trim() === '') {
        alert('Por favor, escribe algo en la nota.');
        return;
    }
    // Lo siguiente guarda la nota en el "ORM"
    var tags = noteText.match(/#[\w]+/g);
    var tag = tags ? tags[0] : ''; // Considera el primer hashtag como tag
    
    fetch('http://127.0.0.1:3000/note/', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: noteText, tag: tag }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Nota guardada:', + data.message);
        console.log(data);
        addNoteToDOM(data.id, noteText);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    // Extraer etiquetas (hashtags) y mostrarlas en el sidebar
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

document.getElementById('notesContainer').addEventListener('click', function(event) {
    var clickedElement = event.target;
    //Capturo el id
    if (clickedElement.tagName === 'BUTTON') {
        var noteDiv = clickedElement.closest('.note');
        var noteId = noteDiv.getAttribute('data-note-id');
        var noteTextDiv = noteDiv.querySelector('div');

        if (clickedElement.textContent === 'Edit') {
            //Logica para editar
            var originalNoteText = noteTextDiv.textContent;
            var originalTag = originalNoteText.match(/#[\w]+/g) ? originalNoteText.match(/#[\w]+/g)[0].toLowerCase() : null;
            
            var newNoteText = prompt("Edit your note:", noteTextDiv.textContent);
            if (newNoteText !== null && newNoteText.trim() !== '') {
                noteTextDiv.textContent = newNoteText;

                var newTags = newNoteText.match(/#[\w]+/g);
                var newTag = newTags ? newTags[0] : '';
                
                fetch(`http://127.0.0.1:3000/note/${noteId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ body: newNoteText, tag: newTag })
                })
                .then(response => response.json())
                .then(data => {
                    alert('Nota actualizada:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
                //Verificar si cambia el tag y agregarlo al sidebar
                if (newTag && !document.querySelector(`[data-tag-filter="${newTag}"]`)){
                    addTagToSidebar(newTag);
                }
            }
        } else if (clickedElement.textContent === 'Delete') {
            var tagToRemove = noteDiv.textContent.match(/#[\w]+/g)[0].toLowerCase();
            //Logica para eliminar
            fetch(`http://127.0.0.1:3000/note/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                alert('Nota eliminada:', data);
                noteDiv.remove();
                // Eliminar el tag del sidebar si no hay otras notas con el mismo tag
                if (!hasOtherNotesWithSameTag(tagToRemove, noteId)) {
                    var tagDivToRemove = document.querySelector(`[data-tag-filter="${tagToRemove}"]`);
                    if (tagDivToRemove) {
                        tagDivToRemove.remove();
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }
});

function loadNotes() {
    fetch('http://127.0.0.1:3000/note') // Asegúrate de que esta URL sea la correcta para tu API
        .then(response => response.json())
        .then(data => {
            data.forEach(note => {
                addNoteToDOM(note.id, note.body);
                updateTagsInSidebar(note.body);
            });
        })
        .catch(error => console.error('Error:', error));
}

//Creación de nota en el DOM
function addNoteToDOM(id, noteText) {
    var noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.setAttribute('data-note-id', id);

    var noteTextDiv = document.createElement('div');
    noteTextDiv.textContent = noteText;

    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    // Añade una clase o id si es necesario para estilos

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    // Añade una clase o id si es necesario para estilos

    noteDiv.appendChild(noteTextDiv);
    noteDiv.appendChild(editButton);
    noteDiv.appendChild(deleteButton);

    document.getElementById('notesContainer').appendChild(noteDiv);
    }

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

function updateTagsInSidebar(noteText) {
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
}
