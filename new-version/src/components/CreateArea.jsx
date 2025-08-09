import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import TextareaAutosize from "react-textarea-autosize";
import FormatColorTextSharpIcon from "@mui/icons-material/FormatColorTextSharp";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import BgOptions from "./BgOptions";
import {
  updateInlineFormatButtons,
  applyInlineFormatting,
  renderFormattedContent,
} from "../utils/textFormatting";

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
  const [isBgOptToggled, setIsBgOptToggled] = useState(false); // - used to toggle background options
  const [isFormatOptToggled, setIsFormatOptToggled] = useState(false); // - used to toggle formatting options
  const [focusedField, setFocusedField] = useState(null); // - track which field is focused (title or content)
  const [textFormat, setTextFormat] = useState("normal"); // - track current text format (h1, h2, normal)

  // Inline formatting state
  const [inlineFormats, setInlineFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  // Text selection state
  const [selectedText, setSelectedText] = useState({
    start: 0,
    end: 0,
    text: "",
  });

  const [note, setNote] = useState({
    id: null,
    title: "",
    content: "",
    bgColor: "default",
    bgImage: "default",
    textFormat: "normal", // Add text format to note state
    inlineFormats: {}, // Store inline formatting for the content
  });

  // Set Temporary Notes
  function handleChange(e) {
    const { name, value } = e.target;

    setNote((preValue) => {
      return {
        ...preValue,
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
      textFormat: "normal", // Reset to normal text format
      inlineFormats: {}, // Reset inline formatting
    });
    setTextFormat("normal"); // Reset the formatting state
    setInlineFormats({
      bold: false,
      italic: false,
      underline: false,
    });
    setSelectedText({
      start: 0,
      end: 0,
      text: "",
    });
  }

  // Passes note data to parent useState hook (in App.jsx)
  function submitButton(event) {
    if (event) {
      event.preventDefault();
    }

    console.log("Submit button clicked with note:", note);

    if (note.title.trim() === "" && note.content.trim() === "") {
      console.log("err_msg: empty input fields"); //: err_msg: empty input fields!
      reset();
    } else {
      console.log("Calling onAdd with note:", note);
      onAdd(note);
      reset();
    }
  }

  // Handles Input Area -> Expand / Shrink
  function handleExpanded() {
    setIsExpanded(true);
  }

  // Close popups when clicking on input fields
  function handleInputClick() {
    setIsBgOptToggled(false);
    // Don't close formatting options - let them stay open like a checkbox
    // setIsFormatOptToggled(false);
  }

  // Handle field focus
  function handleFieldFocus(fieldName) {
    setFocusedField(fieldName);

    // If title field is focused, close formatting popup
    if (fieldName === "title") {
      setIsFormatOptToggled(false);
    }
  }

  // Handle field blur
  function handleFieldBlur() {
    // Don't immediately clear focusedField - let it persist for icon state
    // setFocusedField(null);
  }

  // Close tooltips when mouse leaves icon area
  const [isFormatHovered, setIsFormatHovered] = useState(false);
  const [isBgHovered, setIsBgHovered] = useState(false);

  // Toggle Background Options
  function toggleBgOptions() {
    setIsBgOptToggled(!isBgOptToggled);
    // Don't close formatting options - let them stay open
    // setIsFormatOptToggled(false);
    // Don't change focusedField - keep it as is so A icon state remains unchanged
  }

  // Toggle Formatting Options
  function toggleFormatOptions() {
    // Only allow formatting options if content field is focused
    if (focusedField === "content") {
      setIsFormatOptToggled(!isFormatOptToggled);
      setIsBgOptToggled(false); // Close background options when formatting opens
    }
  }

  // Apply text format (H1, H2, Normal)
  function applyTextFormat(format, event) {
    event.preventDefault();
    event.stopPropagation();

    setNote((prevNote) => ({
      ...prevNote,
      textFormat: format,
    }));
    setTextFormat(format);
  }

  // Handle text selection
  function handleTextSelection(e) {
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value.substring(start, end);

    setSelectedText({
      start,
      end,
      text,
    });

    // Update inline format buttons based on selection
    const newInlineFormats = updateInlineFormatButtons(
      note.content,
      start,
      end
    );
    setInlineFormats(newInlineFormats);
  }

  // Apply inline formatting (Bold, Italic, Underline)
  function applyInlineFormat(format, event) {
    event.preventDefault();
    event.stopPropagation();

    if (selectedText.start === selectedText.end) {
      // No text selected, show alert
      alert("Please select some text first to apply formatting.");
      return;
    }

    const result = applyInlineFormatting(note.content, selectedText, format);

    if (result.inlineFormats) {
      setNote((prevNote) => ({
        ...prevNote,
        content: result.content,
        inlineFormats: result.inlineFormats,
      }));

      setInlineFormats(result.inlineFormats);

      // Update selection to include the formatting markers
      setTimeout(() => {
        const textarea = event.target
          .closest("form")
          .querySelector('textarea[name="content"]');
        if (textarea) {
          textarea.setSelectionRange(
            result.newSelection.start,
            result.newSelection.end
          );
          textarea.focus();
        }
      }, 0);
    }
  }

  // Get Background Color
  function getBgColor(color) {
    setNote((prevNote) => ({
      ...prevNote,
      bgColor: color,
    }));
  }

  // Get Background Image
  function getBgImage(image) {
    setNote((prevNote) => ({
      ...prevNote,
      bgImage: image,
    }));
  }

  // Use to reference form
  const formRef = useRef();

  useOnClickOutside(formRef, () => {
    setIsExpanded(false);
    setIsBgOptToggled(false);
    setIsFormatOptToggled(false);
    setFocusedField(null); // Reset focused field when clicking outside

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
    <div
      style={{
        padding: "0px 10px 0px",
      }}
    >
      <form
        ref={formRef}
        className={`inputForm ${isExpanded ? "active" : ""}`}
        onSubmit={(event) => submitButton(event)}
      >
        {/* Top Container - Gets image background */}
        <div
          className={`note-top-container note-bg-${note.bgColor} note-bg-img-${note.bgImage}`}
        >
          {/* Title input area  */}
          {isExpanded && (
            <input
              type="text"
              value={note.title}
              placeholder="Title"
              name="title"
              onChange={handleChange}
              onClick={handleInputClick}
              onFocus={() => handleFieldFocus("title")}
              onBlur={handleFieldBlur}
            />
          )}
          {/* Content input area  */}
          <p>
            <TextareaAutosize
              className={`${isExpanded ? "expanded" : "closed"} text-format-${
                note.textFormat
              }`}
              name="content"
              value={note.content}
              onClick={(e) => {
                handleExpanded();
                handleInputClick();
              }}
              placeholder="Take a note..."
              onChange={handleChange}
              onFocus={() => handleFieldFocus("content")}
              onBlur={handleFieldBlur}
              onSelect={handleTextSelection}
              rows={isExpanded ? 3 : 0}
              minRows={1}
              maxRows={10}
              style={{
                fontFamily: "inherit",
                fontSize: "inherit",
                lineHeight: "inherit",
                border: "none",
                outline: "none",
                resize: "none",
                background: "transparent",
                width: "100%",
                color: "#202124",
                padding: "5px 8px",
                letterSpacing: "0.01428571em",
                fontWeight: "400",
                overflowY: "auto",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                direction: "ltr",
                textAlign: "left",
              }}
            />
          </p>

          {/* Formatting Toolbar - Inside text area */}
          {isFormatOptToggled && (
            <div className={`formatting-toolbar show`}>
              <div className="format-toolbar-content">
                {/* Desktop/Tablet Layout - Single Row */}
                <div className="format-toolbar-row-desktop">
                  <Tooltip
                    title="Heading 1"
                    placement="bottom"
                    arrow={false}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, 2],
                          },
                        },
                      ],
                    }}
                  >
                    <button
                      className={`format-toolbar-btn ${
                        note.textFormat === "h1" ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        applyTextFormat("h1", e);
                      }}
                      type="button"
                    >
                      H1
                    </button>
                  </Tooltip>
                  <Tooltip
                    title="Heading 2"
                    placement="bottom"
                    arrow={false}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, 2],
                          },
                        },
                      ],
                    }}
                  >
                    <button
                      className={`format-toolbar-btn ${
                        note.textFormat === "h2" ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        applyTextFormat("h2", e);
                      }}
                      type="button"
                    >
                      H2
                    </button>
                  </Tooltip>
                  <Tooltip
                    title="Normal text"
                    placement="bottom"
                    arrow={false}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, 2],
                          },
                        },
                      ],
                    }}
                  >
                    <button
                      className={`format-toolbar-btn ${
                        note.textFormat === "normal" ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        applyTextFormat("normal", e);
                      }}
                      type="button"
                    >
                      Aa
                    </button>
                  </Tooltip>
                  <div className="format-separator"></div>
                  <Tooltip
                    title="Bold"
                    placement="bottom"
                    arrow={false}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, 2],
                          },
                        },
                      ],
                    }}
                  >
                    <button
                      className={`format-toolbar-btn ${
                        inlineFormats.bold ? "active" : ""
                      }`}
                      onClick={(e) => applyInlineFormat("bold", e)}
                      type="button"
                    >
                      <FormatBoldIcon />
                    </button>
                  </Tooltip>
                  <Tooltip
                    title="Italic"
                    placement="bottom"
                    arrow={false}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, 2],
                          },
                        },
                      ],
                    }}
                  >
                    <button
                      className={`format-toolbar-btn ${
                        inlineFormats.italic ? "active" : ""
                      }`}
                      onClick={(e) => applyInlineFormat("italic", e)}
                      type="button"
                    >
                      <FormatItalicIcon />
                    </button>
                  </Tooltip>
                  <Tooltip
                    title="Underline"
                    placement="bottom"
                    arrow={false}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, 2],
                          },
                        },
                      ],
                    }}
                  >
                    <button
                      className={`format-toolbar-btn ${
                        inlineFormats.underline ? "active" : ""
                      }`}
                      onClick={(e) => applyInlineFormat("underline", e)}
                      type="button"
                    >
                      <FormatUnderlinedIcon />
                    </button>
                  </Tooltip>
                  <Tooltip
                    title="Clear formatting"
                    placement="bottom"
                    arrow={false}
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, 2],
                          },
                        },
                      ],
                    }}
                  >
                    <button
                      className={`format-toolbar-btn clear-format`}
                      onClick={(e) => applyInlineFormat("clearFormat", e)}
                      type="button"
                    >
                      <FormatClearIcon />
                    </button>
                  </Tooltip>
                </div>

                {/* Mobile Layout - Two Rows */}
                <div className="format-toolbar-row-mobile">
                  {/* First Row - Text Style Buttons */}
                  <div className="format-toolbar-row">
                    <Tooltip
                      title="Heading 1"
                      placement="bottom"
                      arrow={false}
                      PopperProps={{
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, 2],
                            },
                          },
                        ],
                      }}
                    >
                      <button
                        className={`format-toolbar-btn ${
                          note.textFormat === "h1" ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          applyTextFormat("h1", e);
                        }}
                        type="button"
                      >
                        H1
                      </button>
                    </Tooltip>
                    <Tooltip
                      title="Heading 2"
                      placement="bottom"
                      arrow={false}
                      PopperProps={{
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, 2],
                            },
                          },
                        ],
                      }}
                    >
                      <button
                        className={`format-toolbar-btn ${
                          note.textFormat === "h2" ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          applyTextFormat("h2", e);
                        }}
                        type="button"
                      >
                        H2
                      </button>
                    </Tooltip>
                    <Tooltip
                      title="Normal text"
                      placement="bottom"
                      arrow={false}
                      PopperProps={{
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, 2],
                            },
                          },
                        ],
                      }}
                    >
                      <button
                        className={`format-toolbar-btn ${
                          note.textFormat === "normal" ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          applyTextFormat("normal", e);
                        }}
                        type="button"
                      >
                        Aa
                      </button>
                    </Tooltip>
                  </div>

                  {/* Second Row - Formatting Icons */}
                  <div className="format-toolbar-row">
                    <Tooltip
                      title="Bold"
                      placement="bottom"
                      arrow={false}
                      PopperProps={{
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, 2],
                            },
                          },
                        ],
                      }}
                    >
                      <button
                        className={`format-toolbar-btn ${
                          inlineFormats.bold ? "active" : ""
                        }`}
                        onClick={(e) => applyInlineFormat("bold", e)}
                        type="button"
                      >
                        <FormatBoldIcon />
                      </button>
                    </Tooltip>
                    <Tooltip
                      title="Italic"
                      placement="bottom"
                      arrow={false}
                      PopperProps={{
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, 2],
                            },
                          },
                        ],
                      }}
                    >
                      <button
                        className={`format-toolbar-btn ${
                          inlineFormats.italic ? "active" : ""
                        }`}
                        onClick={(e) => applyInlineFormat("italic", e)}
                        type="button"
                      >
                        <FormatItalicIcon />
                      </button>
                    </Tooltip>
                    <Tooltip
                      title="Underline"
                      placement="bottom"
                      arrow={false}
                      PopperProps={{
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, 2],
                            },
                          },
                        ],
                      }}
                    >
                      <button
                        className={`format-toolbar-btn ${
                          inlineFormats.underline ? "active" : ""
                        }`}
                        onClick={(e) => applyInlineFormat("underline", e)}
                        type="button"
                      >
                        <FormatUnderlinedIcon />
                      </button>
                    </Tooltip>
                    <Tooltip
                      title="Clear formatting"
                      placement="bottom"
                      arrow={false}
                      PopperProps={{
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, 2],
                            },
                          },
                        ],
                      }}
                    >
                      <button
                        className={`format-toolbar-btn clear-format`}
                        onClick={(e) => applyInlineFormat("clearFormat", e)}
                        type="button"
                      >
                        <FormatClearIcon />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Container - Gets color background only */}
        <div className={`note-bottom-container note-bg-${note.bgColor}`}>
          <Tooltip title="Add">
            <button type="submit">
              <AddIcon />
            </button>
          </Tooltip>

          {/* Bottom Icons Layout - Only when expanded */}
          {isExpanded && (
            <div className="bottom-icons-container">
              <Tooltip
                title="Formatting options"
                placement="bottom"
                arrow={false}
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, 2],
                      },
                    },
                  ],
                }}
                open={isFormatHovered}
              >
                <div
                  className={`formatting-icon ${
                    focusedField !== "content" ? "disabled" : ""
                  }`}
                  onClick={
                    focusedField === "content" ? toggleFormatOptions : undefined
                  }
                  onMouseEnter={() => setIsFormatHovered(true)}
                  onMouseLeave={() => setIsFormatHovered(false)}
                  style={{
                    cursor:
                      focusedField === "content" ? "pointer" : "not-allowed",
                    opacity: focusedField === "content" ? 0.71 : 0.25,
                  }}
                >
                  <FormatColorTextSharpIcon />
                </div>
              </Tooltip>
              <Tooltip
                title="Background options"
                placement="bottom"
                arrow={false}
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, 2],
                      },
                    },
                  ],
                }}
                open={isBgHovered}
              >
                <div
                  className="palette-icon"
                  onClick={toggleBgOptions}
                  onMouseEnter={() => {
                    console.log("Background icon hovered");
                    setIsBgHovered(true);
                  }}
                  onMouseLeave={() => {
                    console.log("Background icon unhovered");
                    setIsBgHovered(false);
                  }}
                  style={{
                    cursor: "pointer",
                    opacity: 0.71,
                  }}
                >
                  <ColorLensOutlinedIcon />
                </div>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Background Options Popup */}
        {isBgOptToggled && (
          <div className="create-area-bg-options">
            <BgOptions
              selectedBgColor={getBgColor}
              activeBgColor={note.bgColor}
              selectedBgImage={getBgImage}
              activeBgImage={note.bgImage}
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateArea;
