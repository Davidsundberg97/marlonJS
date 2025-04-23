document.addEventListener('DOMContentLoaded', () => {
    const notesTable = document.getElementById('notesTable');
    const emailContent = document.getElementById('emailContent');

    const updateSelection = async (id, isSelected) => {
        try {
            await fetch(`http://localhost:3000/notes/${id}/selection`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selection: isSelected }),
            });

            if (isSelected) {
                const response = await fetch(`http://localhost:3000/notes/${id}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const note = await response.json();
                const formattedNote = `• ${note.description} <a href="${note.link}" target="_blank">${note.title}</a>\n`;
                emailContent.value += formattedNote;
            } else {
                const response = await fetch(`http://localhost:3000/notes/${id}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const note = await response.json();
                const formattedNote = `• ${note.description} <a href="${note.link}" target="_blank">${note.title}</a>\n`;
                emailContent.value = emailContent.value.replace(formattedNote, '');
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
    window.editNote = (id) => {
        // Redirect to edit.html with the note ID as a query parameter
        window.location.href = `edit.html?id=${id}`;
    };

    window.deleteNote = async (id) => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            const response = await fetch(`http://localhost:3000/notes/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            alert('Note deleted successfully!');
            fetchNotes(); // Refresh the table
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Failed to delete note. Please try again.');
        }
    };

    fetchNotes();
});
