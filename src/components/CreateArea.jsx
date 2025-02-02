import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import TextareaAutosize from "react-textarea-autosize";

/**
 * CreateArea component for adding new notes
 *
 * Props:
 * - onAdd: function - Callback to add new note
 *
 * Features:
 * - Expandable input area
 * - Auto-resizing textarea
 * - Click outside detection
 */
function CreateArea({ onAdd }) {
  // Use State Hooks
  const [isExpanded, setIsExpanded] = useState(false); // - used to expand and shrink input area
  const [note, setNote] = useState({
    id: null,
    title: "",
    content: "",
    bgColor: "default",
    bgImage: "default",
  });

  // Set Temporary Notes
  function handleChange(e) {
    const { name, value } = e.target;

    setNote((preValue) => {
      return {
        ...preValue,
        id: new Date().getTime().toString(),
        [name]: value,
      };
    });
  }

  function reset() {
    setNote({
      id: null,
      title: "",
      content: "",
      bgColor: "default",
      bgImage: "default",
    });
  }

  // Passes note data to parent useState hook (in App.jsx)
  function submitButton(event) {
    if (note.title.trim() === "" && note.content.trim() === "") {
      console.log("err_msg: empty input fields"); //: err_msg: empty input fields!
      reset();
    } else {
      onAdd(note);
      reset();
    }

    event.preventDefault();
  }

  // Handles Input Area -> Expand / Shrink
  function handleExpanded() {
    setIsExpanded(true);
  }

  // Use to reference form
  const formRef = useRef();

  useOnClickOutside(formRef, () => {
    setIsExpanded(false);

    if (isExpanded) {
      submitButton();
    }
  });

  // Hook - to add a note when clicked outsite of input area
  function useOnClickOutside(ref, handler) {
    useEffect(() => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, handler]);
  }

  return (
    <div style={{ padding: "0px 10px 0px" }}>
      <form
        ref={formRef}
        className={isExpanded ? "inputForm active" : "inputForm"}
        onSubmit={(event) => submitButton(event)}
      >
        {/* Title input area  */}
        {isExpanded && (
          <input
            type="text"
            value={note.title}
            placeholder="Title"
            name="title"
            onChange={handleChange}
          />
        )}
        {/* Content input area  */}
        <p>
          <TextareaAutosize
            className={isExpanded ? "expanded" : "closed"}
            name="content"
            value={note.content}
            onClick={handleExpanded}
            placeholder="Take a note..."
            onChange={handleChange}
            rows={isExpanded ? 3 : 0}
          />
        </p>
        <Tooltip title="Add">
          <button type="submit">
            <AddIcon />
          </button>
        </Tooltip>
      </form>
    </div>
  );
}

export default CreateArea;
