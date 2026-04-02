import { useEffect, useState } from "react";
import { createNote, getNotes } from "./api";
import type { Note } from "./models";

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");

  const addNote = async () => {
    createNote(text);
    setText("");
    const data = await getNotes();
    console.log("data", data);
    setNotes(data);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const data = await getNotes();
      setNotes(data);
    };

    fetchNotes();
  }, []);

  return (
    <div>
      <h1>Notes</h1>

      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={addNote}>Add</button>

      <ul>
        {notes.map((n) => (
          <li key={n.id}>{n.id + " " + n.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
