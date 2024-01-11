document.getElementById('saveButton').addEventListener('click', function() {
    var noteText = document.getElementById('noteInput').value;
    var categorieId = document.getElementById('categ').value;
    
    if (noteText.trim() === '') {
        alert('Please, escribe algo en la nota.');
        return;
    }

    var tags = noteText.match(/#[\w]+/g);
    var tag = tags ? tags[0] : ''; // Considera el primer hashtag como tag
    
    fetch('http://127.0.0.1:3000/note/', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: noteText, tag: tag, categorie_id: categorieId }),
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
                    if (originalTag && originalTag !== newTag && !hasOtherNotesWithSameTag(originalTag, noteId)){
                        var tagDivToRemove = document.querySelector(`[data-tag-filter="${originalTag}"]`);
                        if (tagDivToRemove){
                            tagDivToRemove.remove();
                        }
                    }
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
            var tagMatches = noteDiv.textContent.match(/#[\w]+/g);
            var tagToRemove = tagMatches ? tagMatches[0].toLowerCase() : null;
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

        }else if (clickedElement.textContent === 'Archivar' || clickedElement.textContent === 'Desarchivar'){
            const archivedStatus = clickedElement.textContent === 'Archivar';


            fetch(`http://127.0.0.1:3000/note/archived/${noteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ archived: archivedStatus })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Nota actualizada:', data);
                clickedElement.textContent = archivedStatus ? 'Archivar' : 'Desarchivar';
                noteDiv.remove();
            })
            .catch(error => console.error('Error:', error));
        }
    }
});

function loadNotes() {
    fetch('http://127.0.0.1:3000/note?archived=false')
        .then(response => response.json())
        .then(data => {
            data.forEach(note => {
                addNoteToDOM(note.id, note.body, note.categorie_id, note.archived);
                updateTagsInSidebar();
            });
        })
        .catch(error => console.error('Error:', error));
}
function loadArchivedNotes() {
    fetch('http://127.0.0.1:3000/note?archived=true')
        .then(response => response.json())
        .then(data => {
            data.forEach(note => {
                addArchivedNoteToDOM(note.id, note.body, note.archived);
                updateTagsInSidebar();
            });
        })
        .catch(error => console.error('Error:', error));
}

//Creación de nota en el DOM
function addNoteToDOM(id, noteText, categoryId, archived = false) { 
    if (archived) return;
    
    var noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.setAttribute('data-note-id', id);
    noteDiv.setAttribute('data-category-id', categoryId); // I add category id to each note

    var noteTextDiv = document.createElement('div');
    noteTextDiv.textContent = noteText;

    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'btn btn-outline-primary';

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-outline-danger';

    var archiveButton = document.createElement('button');
    archiveButton.textContent = 'Archivar'; //archived ? 'Desarchivar':

    noteDiv.appendChild(noteTextDiv);
    noteDiv.appendChild(editButton);
    noteDiv.appendChild(deleteButton);

    archiveButton.addEventListener('click', function(){
        // Envía una solicitud PUT para actualizar el estado archivado de la nota
        fetch(`http://127.0.0.1:3000/note/archived/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ archived: true}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            noteDiv.remove();
            addArchivedNoteToDOM(id, noteText, true)
        })
        .catch(error => console.error('Error:', error));
        })
    archiveButton.className = 'btn btn-outline-warning';
    noteDiv.appendChild(archiveButton);

    document.getElementById('notesContainer').appendChild(noteDiv);
    }

    function addArchivedNoteToDOM(id, noteText, archived = true) {
        if (!archived) return;
        var noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.setAttribute('data-note-id', id);
    
        var noteTextDiv = document.createElement('div');
        noteTextDiv.textContent = noteText;
    
        var unarchiveButton = document.createElement('button');
        unarchiveButton.textContent = 'Desarchivar';
        unarchiveButton.className = 'btn btn-outline-warning'
    
        // Agrega el botón de desarchivar
        unarchiveButton.addEventListener('click', function(){
            fetch(`http://127.0.0.1:3000/note/archived/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ archived: false }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                noteDiv.remove();
                addNoteToDOM(id, noteText, false);
            })
            .catch(error => console.error('Error:', error));
            })
    
        noteDiv.appendChild(noteTextDiv);
        noteDiv.appendChild(unarchiveButton);
    
        document.getElementById('archivedNotesContainer').appendChild(noteDiv);
    }
    