const fs = require('fs');
const chalk = require('chalk');

const addNote = (title, body) => {
  const notes = loadNotes();
  const duplicateNote = notes.find((note) => note.title === title);

  if (!duplicateNote) {
    notes.push({ title, body });
    saveNotes(notes);
    console.log(chalk.green.bold('New note added!'));
  } else {
    console.log(chalk.red.bold('Note title taken!'));
  }
};

const removeNote = (title) => {
  const notes = loadNotes();
  const notesToKeep = notes.filter((note) => note.title !== title);

  if (notesToKeep.length !== notes.length) {
    saveNotes(notesToKeep);
    console.log(chalk.green.bold('Note removed!'));
  } else {
    console.log(chalk.red.bold('No note found!'));
  }
};

const listNotes = () => {
  const notes = loadNotes();
  console.log(chalk.cyan.bold('Your notes: '));
  notes.forEach((note) => {
    console.log(' ' + chalk.cyan.bold('-') + note.title);
  });
};

const readNote = (title) => {
  const notes = loadNotes();
  const noteToRead = notes.find((note) => note.title === title);

  if (noteToRead) {
    console.log(chalk.magenta.bold(noteToRead.title + ': ') + noteToRead.body);
  } else {
    console.log(chalk.red.bold('Note not found'));
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

module.exports = { addNote, removeNote, listNotes, readNote };
