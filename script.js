document.addEventListener('DOMContentLoaded', () => {
    const notesTable = document.getElementById('notesTable');
    const quill = window.quill; // Access the global Quill editor instance

    const updateSelection = async (id, isSelected) => {
        try {
            // Update the selection state in the database
            const response = await fetch(`http://localhost:3000/notes/${id}/selection`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selection: isSelected }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
            }

            const noteResponse = await fetch(`http://localhost:3000/notes/${id}`);
            if (!noteResponse.ok) throw new Error(`HTTP error! status: ${noteResponse.status}`);
            const note = await noteResponse.json();

            if (isSelected) {
                const formattedNote = `• ${note.description} - <a href="${note.link}" target="_blank">${note.title}</a>\n`;
                quill.clipboard.dangerouslyPasteHTML(quill.getLength() - 1, formattedNote);
            } else {
                // Handle deselection if needed
                const deselectMessage = `Deselection is not implemented for note ID: ${id}`;
                console.warn(deselectMessage);
                alert(deselectMessage);
            }
        } catch (error) {
            console.error('Error updating selection:', error);
            alert('Failed to update selection. Please try again.');
        }
    };

    const fetchNotes = async () => {
        try {
            const response = await fetch('http://localhost:3000/notes');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const notes = await response.json();
            notesTable.innerHTML = notes.map(note => `
                <tr>
                    <td><input type="checkbox" onchange="updateSelection(${note.id}, this.checked)" ${note.selection ? 'checked' : ''}></td>
                    <td style="max-width: 200px; overflow-wrap: break-word;">
                        ${note.link 
                            ? `<a href="${note.link}" target="_blank" class="note-title">${note.title || 'Untitled'}</a>` 
                            : `<span class="note-title">${note.title || 'Untitled'}</span>`}
                    </td>
                    <td>${note.description || 'No description'}</td>
                    <td>${note.topics ? note.topics.split(',').join(', ') : 'No topics'}</td>
                    <td>${note.levels ? note.levels.split(',').join(', ') : 'No levels'}</td>
                    <td style="white-space: nowrap; text-align: center;">
                        <button onclick="editNote(${note.id})" style="margin-right: 5px;">Edit</button>
                        <button onclick="deleteNote(${note.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching notes:', error);
            alert('Failed to fetch notes. Please try again.');
        }
    };

    window.updateSelection = updateSelection; // Ensure the function is globally accessible
    fetchNotes();
});
