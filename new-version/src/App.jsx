import React, { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import CreateArea from "./components/CreateArea";
import Note from "./components/Note";
import LoadingSpinner from "./components/LoadingSpinner";
import LoginPrompt from "./components/LoginPrompt";
import Footer from "./components/Footer";
// Removed react-masonry-css
import "./style.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  onAuthStateChange,
  signInWithGoogle,
  signOutUser,
  getErrorMessage,
} from "./services/authService";
import {
  getUserNotes,
  saveNote,
  updateNote,
  deleteNote as deleteNoteFromDB,
} from "./services/noteService";

// Masonry packages (same as CodePen approach by Dave DeSandro)
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";

/**
 * Main App component managing authentication and notes state
 *
 * Features:
 * - Firebase authentication
 * - User-specific notes management
 * - Real-time database operations
 * - Robust Masonry layout using masonry-layout (columnWidth pattern)
 * - Loading states and error handling
 * - Dark theme support
 */

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Masonry refs
  const gridRef = useRef(null);
  const msnryRef = useRef(null);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        setUser(user);
        try {
          const userNotes = await getUserNotes(user.uid);
          setNotes(userNotes);
          setFilteredNotes(userNotes);
        } catch (error) {
          console.error("Error loading notes:", error);
          setNotes([]);
          setFilteredNotes([]);
        }
      } else {
        setUser(null);
        setNotes([]);
        setFilteredNotes([]);
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
      console.error("Sign out error:", error);
    }
  };

  // Add new note
  const addNote = async (newNote) => {
    if (!user) return;

    try {
      const noteId = await saveNote(newNote, user.uid);
      const noteWithId = { ...newNote, id: noteId };
      const next = [noteWithId, ...notes];
      setNotes(next);
      setFilteredNotes(next);
    } catch (error) {
      console.error("Error adding note:", error);
      const fallbackNote = { ...newNote, id: `local-${Date.now()}` };
      const next = [fallbackNote, ...notes];
      setNotes(next);
      setFilteredNotes(next);
    }
  };

  // Edit note
  const editNote = async (updatedNote) => {
    if (!user) return;

    try {
      await updateNote(updatedNote.id, updatedNote);
      const updateArr = (arr) =>
        arr.map((note) =>
          note.id === updatedNote.id
            ? {
                ...note,
                title: updatedNote.title,
                content: updatedNote.content,
                bgColor: updatedNote.bgColor,
                bgImage: updatedNote.bgImage,
                textFormat: updatedNote.textFormat,
                timeStamp: updatedNote.timeStamp,
              }
            : note
        );

      setNotes(updateArr);
      setFilteredNotes(updateArr);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // Helper to strip markdown-like markers for search
  const stripMarkdownSyntax = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/__(.*?)__/g, "$1");
  };

  // Search notes
  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = notes.filter((note) => {
      const cleanTitle = stripMarkdownSyntax(note.title || "").toLowerCase();
      const cleanContent = stripMarkdownSyntax(
        note.content || ""
      ).toLowerCase();
      return cleanTitle.includes(query) || cleanContent.includes(query);
    });
    setFilteredNotes(filtered);
  };

  // Delete note
  const deleteNote = async (id) => {
    if (!user) return;

    try {
      await deleteNoteFromDB(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setFilteredNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Initialize / update Masonry just like the CodePen pattern
  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;

    // helper: read base column width (px) and compute how many columns fit
    const computeAndSetCols = () => {
      // Force single column on small screens (≤612px)
      if (window.innerWidth <= 612) {
        gridEl.style.setProperty("--computed-cols", "1");
        return 1;
      }

      const styles = getComputedStyle(document.documentElement);
      // Base desired column width in px (from --note-col-width), default 260
      const baseColWidthPx = parseFloat(
        styles.getPropertyValue("--note-col-width").replace("px", "").trim() ||
          "260"
      );
      const gutterPx = parseFloat(
        styles.getPropertyValue("--note-gutter").replace("px", "").trim() ||
          "10"
      );

      const gridWidth = gridEl.clientWidth; // available width
      // number of columns that can fit at the base width, minimum 1
      const cols = Math.max(
        1,
        Math.floor((gridWidth + gutterPx) / (baseColWidthPx + gutterPx))
      );

      gridEl.style.setProperty("--computed-cols", String(cols));
      return cols;
    };

    let raf = 0;

    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        computeAndSetCols();
        if (msnryRef.current) {
          msnryRef.current.reloadItems();
          msnryRef.current.layout();
        }
      });
    };

    // Destroy any previous Masonry instance
    if (msnryRef.current) {
      try {
        msnryRef.current.destroy();
      } catch {}
      msnryRef.current = null;
    }

    if (!filteredNotes || filteredNotes.length === 0) return;

    // Set cols before initializing Masonry
    computeAndSetCols();

    // Initialize Masonry using grid/gutter sizers and percent positioning
    msnryRef.current = new Masonry(gridEl, {
      itemSelector: ".note-item",
      columnWidth: ".grid-sizer",
      gutter: ".gutter-sizer",
      percentPosition: true,
      fitWidth: false,
      horizontalOrder: false,
      originTop: true,
      transitionDuration: "0.2s",
    });

    msnryRef.current.reloadItems();
    msnryRef.current.layout();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (msnryRef.current) {
          msnryRef.current.reloadItems();
          msnryRef.current.layout();
        }
      });
    }

    // Relayout after images/media load
    const imgLoad = imagesLoaded(gridEl);
    imgLoad.on("progress", () => {
      if (msnryRef.current) msnryRef.current.layout();
    });
    imgLoad.on("done", () => {
      if (msnryRef.current) msnryRef.current.layout();
    });

    // Update columns and relayout on resize/zoom

    window.addEventListener("resize", onResize);

    // Also observe the grid container size directly (more reliable across zoom and layout shifts)
    let ro;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => {
        computeAndSetCols();
        if (msnryRef.current) msnryRef.current.layout();
      });
      ro.observe(gridEl);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (msnryRef.current) {
        try {
          msnryRef.current.destroy();
        } catch {}
        msnryRef.current = null;
      }
    };
  }, [filteredNotes]);

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
    <ThemeProvider>
      <div className="App">
        <Header user={user} onSignOut={handleSignOut} onSearch={handleSearch} />

        <CreateArea onAdd={addNote} />

        <div className="container">
          {/* Masonry Grid (CodePen-style) */}
          <div className="notes-grid" ref={gridRef}>
            <div className="grid-sizer" aria-hidden="true" />
            <div className="gutter-sizer" aria-hidden="true" />
            {filteredNotes.map((note, index) => (
              <div className="note-item" key={note.id}>
                <Note
                  id={note.id}
                  title={note.title}
                  content={note.content}
                  noteBgClr={note.bgColor}
                  noteBgImg={note.bgImage}
                  textFormat={note.textFormat || "normal"}
                  timeStamp={note.timeStamp ? note.timeStamp : null}
                  onDelete={deleteNote}
                  onEdit={editNote}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
