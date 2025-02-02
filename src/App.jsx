import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import CreateArea from "./components/CreateArea";
import Note from "./components/Note";
// import Count from "./components/Count";
import Footer from "./components/Footer";
import Masonry from "react-masonry-css";
import "./style.css";
import demo_notes from "./data/demo_notes";

/**
 * Main App component managing notes state and layout
 *
 * Features:
 * - Notes management (add/edit/delete)
 * - Local storage persistence
 * - Responsive masonry grid layout
 * - Demo notes for first-time visitors
 */

// Get Notes from Local Storage or Demo Notes on first visit
function getLocalNotes() {
  let notes = localStorage.getItem("Notes");
  let isFirstVisit = localStorage.getItem("isFirstVisit");

  if (!isFirstVisit) {
    // First time visitor - show demo notes
    localStorage.setItem("isFirstVisit", "false");
    return demo_notes;
  }

  if (notes) {
    return JSON.parse(notes);
  } else {
    return [];
  }
}

function App() {
  const [notes, setNotes] = useState(getLocalNotes());

  // Add notes
  function addNote(newNote) {
    setNotes([newNote, ...notes]);
  }

  // Edit Note
  function editNote(updatedNote) {
    console.log(
      "+---------------------------+\n| Recieved Object to update | \n+---------------------------+\n",
      updatedNote
    );
    console.log("\n");

    setNotes(
      notes.map((note) => {
        if (note.id === updatedNote.id) {
          return {
            ...note,
            title: updatedNote.title,
            content: updatedNote.content,
            bgColor: updatedNote.bgColor,
            bgImage: updatedNote.bgImage,
            timeStamp: updatedNote.timeStamp,
          };
        }
        return note;
      })
    );
  }

  // Delete Notes
  function deleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  // Mansory Grid stuff
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("Notes", JSON.stringify(notes));
  }, [notes]);

  // Returns all the components to be rendered
  return (
    <div className="App">
      {/* Header  */}
      <Header />

      {/* Counter  */}
      {/* <Count
        count={
          notes.legth === 0
            ? "Empty"
            : `Showing ${notes.length} Notes in Database`
        }
      /> */}

      {/* Input area [Title, Content] */}
      <CreateArea onAdd={addNote} />

      {/* Notes Grid Container  */}
      <div className="container">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {/* Individual Notes  */}
          {notes.map((note, index) => {
            return (
              <Note
                // data
                key={index}
                id={note.id}
                title={note.title}
                content={note.content}
                noteBgClr={note.bgColor}
                noteBgImg={note.bgImage}
                timeStamp={note.timeStamp ? note.timeStamp : null}
                // functions
                onDelete={deleteNote}
                onEdit={editNote}
                index={index}
              />
            );
          })}
        </Masonry>
      </div>
      <Footer />
    </div>
  );
}

export default App;
