import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import CreateArea from "./components/CreateArea";
import Note from "./components/Note";
import LoadingSpinner from "./components/LoadingSpinner";
import LoginPrompt from "./components/LoginPrompt";
import Footer from "./components/Footer";
import Masonry from "react-masonry-css";
import "./style.css";
import { onAuthStateChange, signInWithGoogle, signOutUser, getErrorMessage } from "./services/authService";
import { getUserNotes, saveNote, updateNote, deleteNote as deleteNoteFromDB } from "./services/noteService";

/**
 * Main App component managing authentication and notes state
 *
 * Features:
 * - Firebase authentication
 * - User-specific notes management
 * - Real-time database operations
 * - Responsive masonry grid layout
 * - Loading states and error handling
 */

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        setUser(user);
        // Load user's notes from Firestore
        try {
          const userNotes = await getUserNotes(user.uid);
          setNotes(userNotes);
        } catch (error) {
          console.error('Error loading notes:', error);
        }
      } else {
        setUser(null);
        setNotes([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle Google sign-in
  const handleSignIn = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  };

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Add new note
  const addNote = async (newNote) => {
    if (!user) return;

    try {
      const noteId = await saveNote(newNote, user.uid);
      const noteWithId = { ...newNote, id: noteId };
      setNotes([noteWithId, ...notes]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Edit note
  const editNote = async (updatedNote) => {
    if (!user) return;

    try {
      await updateNote(updatedNote.id, updatedNote);
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
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    if (!user) return;

    try {
      await deleteNoteFromDB(id);
      setNotes((prevNotes) => {
        return prevNotes.filter((note) => note.id !== id);
      });
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Masonry Grid configuration
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return <LoginPrompt onSignIn={handleSignIn} error={authError} />;
  }

  // Show main app if user is authenticated
  return (
    <div className="App">
      <Header user={user} onSignOut={handleSignOut} />
      
      <CreateArea onAdd={addNote} />

      <div className="container">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {notes.map((note, index) => {
            return (
              <Note
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                noteBgClr={note.bgColor}
                noteBgImg={note.bgImage}
                timeStamp={note.timeStamp ? note.timeStamp : null}
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
