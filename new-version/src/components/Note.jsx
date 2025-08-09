import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import BgOptions from "./BgOptions";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import FormatColorTextSharpIcon from "@mui/icons-material/FormatColorTextSharp";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import TextareaAutosize from "react-textarea-autosize";
import {
  updateInlineFormatButtons,
  applyInlineFormatting,
} from "../utils/textFormatting";
import {
  highlightHTMLString,
  highlightPlainTextToHTML,
} from "../utils/searchHighlight";

/**
 * Note component for displaying and editing individual notes
 *
 * Props:
 * - id: string - Unique identifier for the note
 * - title: string - Note title
 * - content: string - Note content
 * - noteBgClr: string - Background color of note
 * - noteBgImg: string - Background image of note
 * - timeStamp: object - Creation/edit timestamp
 * - onEdit: function - Callback for edit action
 * - onDelete: function - Callback for delete action
 * - index: number - Position index for animation
 */
function Note({
  id,
  title,
  content,
  noteBgClr,
  noteBgImg,
  textFormat,
  timeStamp,
  onEdit,
  onDelete,
  index,
  searchQuery,
}) {
  const [updateNote, setUpdateNote] = useState({});
  const [isEditToggled, setIsEditToggled] = useState(false);
  const [isBgOptToggled, setIsBgOptToggled] = useState(false);
  const [isFormatOptToggled, setIsFormatOptToggled] = useState(false);
  const [bgColor, setBgColor] = useState(noteBgClr || "default");
  const [bgImage, setBgImage] = useState(noteBgImg || "default");
  const [editTextFormat, setEditTextFormat] = useState(textFormat || "normal");
  const [editInlineFormats, setEditInlineFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  // Text selection state for inline formatting
  const [selectedText, setSelectedText] = useState({
    start: 0,
    end: 0,
    text: "",
  });

  // Track which field is focused (title or content) - same as CreateArea
  const [focusedField, setFocusedField] = useState(null);

  // Simple animation styles
  const noteStyle = {
    animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`,
  };

  // Reset background states when props change
  React.useEffect(() => {
    setBgColor(noteBgClr || "default");
    setBgImage(noteBgImg || "default");
  }, [noteBgClr, noteBgImg]);

  // Edit Note
  function edit() {
    setUpdateNote({
      id: id,
      title: title,
      content: content,
      bgColor: noteBgClr,
      bgImage: noteBgImg,
    });

    setIsEditToggled(true);
    // Reset all states when opening edit mode
    setFocusedField("content"); // Auto-focus on content
    setIsFormatOptToggled(false); // Close any open formatting popup
    setIsBgOptToggled(false); // Close any open background popup
  }

  // Update Note
  function save(event) {
    if (updateNote.title === "" && updateNote.content === "") {
      console.log("err_msg: empty input fields!"); //: err_msg: empty input fields!
    } else {
      // Fetching date-time data
      const getDate = new Date();
      const getTime = getDate.toLocaleTimeString();
      const formatTime = getTime.substr(0, 5) + " " + getTime.substr(-2);
      const formatDate = getDate.toDateString().substr(4, 6);

      const timeStamp = {
        time: formatTime,
        date: formatDate,
      };

      onEdit({
        ...updateNote,
        bgColor,
        bgImage,
        textFormat: editTextFormat,
        timeStamp,
      });
      setIsEditToggled(false);

      setUpdateNote({
        id: null,
        title: "",
        content: "",
        bgColor: "",
        bgImage: "",
      });
    }

    event.preventDefault();
  }

  // Get BgColor
  function getBgColor(color) {
    setBgColor(color);
  }

  // Get BgImage
  function getBgImage(image) {
    setBgImage(image);
  }

  // Toggle Background Options
  function toggeBgOptions() {
    setIsBgOptToggled(!isBgOptToggled);
    // Close formatting options when background options open
    if (!isBgOptToggled) {
      setIsFormatOptToggled(false);
    }
    // Enable A icon when palette is clicked by setting focusedField to content
    setFocusedField("content");
  }

  // Toggle Formatting Options
  function toggleFormatOptions() {
    setIsFormatOptToggled(!isFormatOptToggled);
    // Close background options when formatting options open
    if (!isFormatOptToggled) {
      setIsBgOptToggled(false);
    }
    // Ensure A icon stays enabled when formatting is toggled
    setFocusedField("content");
    // Also enable A icon when palette is open and user wants to switch to formatting
  }

  // Apply Text Format (H1, H2, Normal)
  function applyTextFormat(format, event) {
    event.preventDefault();
    event.stopPropagation();
    setEditTextFormat(format);
  }

  // Handle text selection for inline formatting
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
      updateNote.content || "",
      start,
      end
    );
    setEditInlineFormats(newInlineFormats);
  }

  // Apply Inline Format (Bold, Italic, Underline)
  function applyInlineFormat(format, event) {
    event.preventDefault();
    event.stopPropagation();

    if (selectedText.start === selectedText.end) {
      // No text selected, show alert
      alert("Please select some text first to apply formatting.");
      return;
    }

    const result = applyInlineFormatting(
      updateNote.content || "",
      selectedText,
      format
    );

    if (result.inlineFormats) {
      setUpdateNote((prev) => ({
        ...prev,
        content: result.content,
      }));
      setEditInlineFormats(result.inlineFormats);

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

  // Close Note
  function close() {
    setBgColor(noteBgClr);
    setBgImage(noteBgImg);

    setIsEditToggled(false);
    // Reset all states when closing edit mode
    setFocusedField(null);
    setIsFormatOptToggled(false); // Close any open formatting popup
    setIsBgOptToggled(false); // Close any open background popup
  }

  // Set Temporary Notes
  function handleChange(e) {
    const { name, value } = e.target;

    setUpdateNote((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  }

  // Render formatted content with inline styling
  function renderFormattedContent(content) {
    if (!content) return "";

    // Simple markdown-like parsing for inline formatting
    let formattedContent = content;

    // Replace markdown-style formatting with HTML spans
    formattedContent = formattedContent.replace(
      /\*\*(.*?)\*\*/g,
      '<span class="text-bold">$1</span>'
    );
    formattedContent = formattedContent.replace(
      /\*(.*?)\*/g,
      '<span class="text-italic">$1</span>'
    );
    formattedContent = formattedContent.replace(
      /__(.*?)__/g,
      '<span class="text-underline">$1</span>'
    );

    return formattedContent;
  }

  // Note Component
  return (
    <>
      <div
        style={noteStyle}
        className={`note note-bg-${bgColor} note-bg-img-${bgImage} note-container`}
      >
        {/* Original note always stays visible */}
        <h1
          dangerouslySetInnerHTML={{
            __html: highlightPlainTextToHTML(title || "", searchQuery || ""),
          }}
        />
        <p
          className={`text-format-${textFormat || "normal"}`}
          dangerouslySetInnerHTML={{
            __html: highlightHTMLString(
              renderFormattedContent(content || ""),
              searchQuery || ""
            ),
          }}
        />
        <Tooltip title="Delete">
          <Button className="btn btn-delete" onClick={() => onDelete(id)}>
            <DeleteIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Edit">
          <Button className="btn btn-edit" onClick={edit}>
            <EditIcon />
          </Button>
        </Tooltip>
      </div>

      {/* Overlay copy of the note when editing */}
      {isEditToggled && (
        <div className="edit_toggled_container">
          <div className={`editNote editNote-bg-${bgColor}`}>
            <form
              className="editForm"
              onSubmit={(event) => {
                save(event);
              }}
            >
              <div className={`input-container editNote-bg-img-${bgImage}`}>
                {/* Title Input Area */}
                <input
                  type="text"
                  value={updateNote.title}
                  placeholder="Title"
                  name="title"
                  onChange={handleChange}
                  onFocus={() => {
                    setFocusedField("title");
                    setIsFormatOptToggled(false); // Close A popup when Title is focused
                  }}
                  onBlur={() => setFocusedField(null)}
                />

                {/* Content Input Area */}
                <TextareaAutosize
                  name="content"
                  value={updateNote.content}
                  placeholder="Note"
                  onChange={handleChange}
                  onSelect={handleTextSelection}
                  onMouseUp={handleTextSelection}
                  onKeyUp={handleTextSelection}
                  onFocus={() => setFocusedField("content")}
                  onBlur={() => {
                    // Don't reset focusedField to null - keep it as "content" so A stays enabled
                    // Only disable A when Title is explicitly focused
                  }}
                  className={`text-format-${editTextFormat}`}
                />

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
                              editTextFormat === "h1" ? "active" : ""
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
                              editTextFormat === "h2" ? "active" : ""
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
                              editTextFormat === "normal" ? "active" : ""
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
                              editInlineFormats.bold ? "active" : ""
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
                              editInlineFormats.italic ? "active" : ""
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
                              editInlineFormats.underline ? "active" : ""
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
                                editTextFormat === "h1" ? "active" : ""
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
                                editTextFormat === "h2" ? "active" : ""
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
                                editTextFormat === "normal" ? "active" : ""
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
                                editInlineFormats.bold ? "active" : ""
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
                                editInlineFormats.italic ? "active" : ""
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
                                editInlineFormats.underline ? "active" : ""
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
                              onClick={(e) =>
                                applyInlineFormat("clearFormat", e)
                              }
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

                {/* Time Stamp  */}
                {
                  <div
                    className={timeStamp ? `time-stamp visible` : `time-stamp`}
                  >
                    <Tooltip title={timeStamp && `Created ${timeStamp.date}`}>
                      <span>Edited {timeStamp && timeStamp.time}</span>
                    </Tooltip>
                  </div>
                }
              </div>

              {/* Buttons [Save, Close]  */}
              <div className="form-btn">
                <Tooltip title="Formatting options">
                  <Button
                    className="btn btn-bgOptions"
                    onClick={
                      focusedField === "content" || isBgOptToggled
                        ? toggleFormatOptions
                        : undefined
                    }
                    style={{
                      cursor:
                        focusedField === "content" || isBgOptToggled
                          ? "pointer"
                          : "not-allowed",
                      opacity:
                        focusedField === "content" || isBgOptToggled
                          ? 0.71
                          : 0.25,
                    }}
                  >
                    <FormatColorTextSharpIcon />
                  </Button>
                </Tooltip>
                <Tooltip title="Background options">
                  <Button
                    className="btn btn-bgOptions"
                    onClick={toggeBgOptions}
                    style={{
                      cursor: "pointer",
                      opacity: 0.71,
                    }}
                  >
                    <ColorLensOutlinedIcon />
                  </Button>
                </Tooltip>
                {isBgOptToggled && (
                  <BgOptions
                    selectedBgColor={getBgColor}
                    activeBgColor={bgColor}
                    selectedBgImage={getBgImage}
                    activeBgImage={bgImage}
                  />
                )}

                <Button type="submit">Save</Button>
                <Button onClick={close}>Close</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Note;
