import { useEffect, useState } from "react";
import { createNote, getNotes } from "./api";
import type { Note } from "./models";

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");

  const addNote = async () => {
    const newNote = await createNote({ text: text } as Note);
    setText("");
    setNotes([...notes, newNote]);
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

      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 0,
        }}
      >
        {notes.map((n) => (
          <li
            key={n.id}
            style={{
              padding: "8px 12px",
              margin: "4px 0",
              width: "300px",
              textAlign: "center",
            }}
          >
            <div>
              <span style={{ fontWeight: "bold" }}>Text:</span> {n.text}
            </div>
            <div>
              <span style={{ fontWeight: "bold" }}>ID:</span> {n.id}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
