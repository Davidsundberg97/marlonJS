const database = [
    { title: "Title 1", description: "Description 1", tags: ["tag1", "tag2"] },
    { title: "Title 2", description: "Description 2", tags: ["tag3", "tag4"] },
    { title: "Title 3", description: "Description 3", tags: ["tag1", "tag4"] },
    // ...more data...
];

function displayTable(data) {
    console.log("Title\t\tDescription\t\tTags");
    data.forEach(item => {
        console.log(`${item.title}\t\t${item.description}\t\t${item.tags.join(", ")}`);
    });
}

function searchDatabase(query) {
    return database.filter(item => 
        item.title.includes(query) || 
        item.description.includes(query) || 
        item.tags.some(tag => tag.includes(query))
    );
}

// Example usage:
const searchQuery = "tag1";
const searchResults = searchDatabase(searchQuery);
displayTable(searchResults);
