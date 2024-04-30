import { useState, useEffect } from 'react';
import { Box, Button, Input, Textarea, SimpleGrid, useToast } from '@chakra-ui/react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const Note = ({ note, onDelete, onEdit }) => (
  <Box borderWidth="1px" borderRadius="lg" p={4} shadow="md">
    <Input value={note.title} isReadOnly />
    <Textarea value={note.content} isReadOnly mt={2} />
    <Button leftIcon={<FaTrash />} colorScheme="red" size="sm" onClick={() => onDelete(note.id)} mt={2}>
      Delete
    </Button>
    <Button leftIcon={<FaEdit />} colorScheme="teal" size="sm" onClick={() => onEdit(note)} mt={2} ml={2}>
      Edit
    </Button>
  </Box>
);

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const toast = useToast();

  useEffect(() => {
    try {
      const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
      setNotes(savedNotes);
    } catch (error) {
      console.error('Failed to load notes from local storage:', error);
      setNotes([]);
    }
  }, []);

  const handleAddNote = () => {
    if (!newNote.title || !newNote.content) {
      toast({
        title: "Error",
        description: "Both title and content are required to add a note.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const newNoteWithId = { ...newNote, id: Date.now() };
    const updatedNotes = [...notes, newNoteWithId];
    setNotes(updatedNotes);
    try {
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to save notes to local storage:', error);
    }
    setNewNote({ title: '', content: '' });
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    try {
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to update local storage after deleting a note:', error);
    }
  };

  const handleEditNote = (note) => {
    setNewNote(note);
    handleDeleteNote(note.id);
  };

  return (
    <Box p={5}>
      <Box mb={4}>
        <Input placeholder="Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
        <Textarea placeholder="Content" value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} mt={2} />
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={handleAddNote} mt={2}>
          Add Note
        </Button>
      </Box>
      <SimpleGrid columns={3} spacing={4}>
        {notes.map(note => (
          <Note key={note.id} note={note} onDelete={handleDeleteNote} onEdit={handleEditNote} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Index;