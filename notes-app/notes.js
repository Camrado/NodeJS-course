const fs = require('fs');
const chalk = require('chalk');

const addNote = (title, body) => {
  const notes = loadNotes();
  const duplicateNotes = notes.filter((note) => note.title === title);
  if (duplicateNotes.length === 0) {
    notes.push({ title, body });
    saveNotes(notes);
    console.log(chalk.green.bold('New note added!'));
  } else {
    console.log(chalk.red.bold('Note title taken!'));
  }
};

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync('notes.json');
    const data = JSON.parse(dataBuffer.toString());
    return data;
  } catch (e) {
    return [];
  }
};

const saveNotes = (notes) => {
  fs.writeFileSync('notes.json', JSON.stringify(notes));
};

module.exports = { addNote };
