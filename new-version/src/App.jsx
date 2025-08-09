"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import CreateArea from "./components/CreateArea";
import Note from "./components/Note";
import LoadingSpinner from "./components/LoadingSpinner";
import LoginPrompt from "./components/LoginPrompt";
import Footer from "./components/Footer";
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
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const gridRef = useRef(null);
  const msnryRef = useRef(null);
  const lastWidthRef = useRef(0);
  const lastColsRef = useRef(0);
  const layoutRafRef = useRef(0);
  let resizeRaf = null;

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

  const handleSignIn = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

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

  const editNote = async (updatedNote) => {
    if (!user) return;
    try {
      await updateNote(updatedNote.id, updatedNote);
      const updateArr = (arr) =>
        arr.map((note) =>
          note.id === updatedNote.id ? { ...note, ...updatedNote } : note
        );
      setNotes(updateArr);
      setFilteredNotes(updateArr);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const stripMarkdownSyntax = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/__(.*?)__/g, "$1");
  };

  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
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

  const scheduleLayout = () => {
    if (!msnryRef.current) return;
    if (layoutRafRef.current) return;
    layoutRafRef.current = requestAnimationFrame(() => {
      layoutRafRef.current = 0;
      try {
        msnryRef.current.layout();
      } catch {}
    });
  };

  const computeAndSetCols = () => {
    const gridEl = gridRef.current;
    if (!gridEl) return lastColsRef.current || 1;

    if (window.innerWidth <= 612) {
      if (lastColsRef.current !== 1) {
        gridEl.style.setProperty("--computed-cols", "1");
        lastColsRef.current = 1;
      }
      return 1;
    }

    const styles = getComputedStyle(document.documentElement);
    const baseColWidthPx = Number.parseFloat(
      (styles.getPropertyValue("--note-col-width") || "260px")
        .replace("px", "")
        .trim()
    );
    const gutterPx = Number.parseFloat(
      (styles.getPropertyValue("--note-gutter") || "10px")
        .replace("px", "")
        .trim()
    );

    const gridWidth = gridEl.clientWidth;
    const cols = Math.max(
      1,
      Math.floor((gridWidth + gutterPx) / (baseColWidthPx + gutterPx))
    );
    if (cols !== lastColsRef.current) {
      gridEl.style.setProperty("--computed-cols", String(cols));
      lastColsRef.current = cols;
    }
    return cols;
  };

  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl || !filteredNotes.length) return;

    if (msnryRef.current) {
      try {
        msnryRef.current.destroy();
      } catch {}
      msnryRef.current = null;
    }

    computeAndSetCols();

    msnryRef.current = new Masonry(gridEl, {
      itemSelector: ".note-item",
      columnWidth: ".grid-sizer",
      gutter: ".gutter-sizer",
      percentPosition: true,
      fitWidth: false,
      horizontalOrder: false,
      originTop: true,
      transitionDuration: "0s", // prevent bounce
    });

    msnryRef.current.reloadItems();
    msnryRef.current.layout();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => scheduleLayout());
    }

    const imgLoad = imagesLoaded(gridEl);
    imgLoad.on("progress", scheduleLayout);
    imgLoad.on("done", scheduleLayout);

    let ro;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const width = Math.floor(
          entry.contentRect?.width || gridEl.clientWidth || 0
        );
        if (Math.abs(width - lastWidthRef.current) < 1) return;
        lastWidthRef.current = width;

        const prevCols = lastColsRef.current;
        const newCols = computeAndSetCols();
        if (msnryRef.current && newCols !== prevCols) {
          try {
            msnryRef.current.reloadItems();
          } catch {}
        }
        scheduleLayout();
      });
      ro.observe(gridEl);
    }

    const onResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        const prevCols = lastColsRef.current;
        const newCols = computeAndSetCols();
        if (msnryRef.current && newCols !== prevCols) {
          try {
            msnryRef.current.reloadItems();
          } catch {}
        }
        scheduleLayout();
      });
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      if (layoutRafRef.current) cancelAnimationFrame(layoutRafRef.current);
      if (msnryRef.current) {
        try {
          msnryRef.current.destroy();
        } catch {}
        msnryRef.current = null;
      }
    };
  }, [filteredNotes]);

  useEffect(() => {
    scheduleLayout();
  }, [searchQuery]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginPrompt onSignIn={handleSignIn} error={authError} />;
  }

  return (
    <ThemeProvider>
      <div className="App">
        <Header user={user} onSignOut={handleSignOut} onSearch={handleSearch} />

        <CreateArea onAdd={addNote} />

        <div className="container">
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
                  searchQuery={searchQuery}
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
