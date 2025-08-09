// Shared text formatting utilities
// This file contains all the complex formatting logic that can be reused

// Update inline format buttons based on text selection
export function updateInlineFormatButtons(content, start, end) {
  if (start === end) {
    // No selection, disable inline formatting
    return {
      bold: false,
      italic: false,
      underline: false,
    };
  }

  // Check what formatting is applied to the selected text
  const selectedContent = content.substring(start, end);

  // Check for multiple formats in the selection
  // Use regex to find all formatting patterns
  const boldPattern = /\*\*(.*?)\*\*/g;
  const underlinePattern = /__(.*?)__/g;

  // Check if the selection contains these patterns
  const hasBold = boldPattern.test(selectedContent);

  // For italic, we need to check for single * patterns that are not part of **
  // First reset the bold pattern
  boldPattern.lastIndex = 0;

  // Create a temporary string with bold patterns removed to check for italic
  const tempContent = selectedContent.replace(/\*\*(.*?)\*\*/g, "");
  const hasItalic = /\*(.*?)\*/g.test(tempContent);

  // Check for bold+italic pattern (***)
  const hasBoldItalic = /\*\*\*(.*?)\*\*\*/g.test(selectedContent);

  const hasUnderline = underlinePattern.test(selectedContent);

  // Reset patterns for next use
  boldPattern.lastIndex = 0;
  underlinePattern.lastIndex = 0;

  return {
    bold: hasBold || hasBoldItalic,
    italic: hasItalic || hasBoldItalic,
    underline: hasUnderline,
  };
}

// Apply inline formatting with smart logic
export function applyInlineFormatting(content, selectedText, format) {
  if (selectedText.start === selectedText.end) {
    // No text selected
    return { content, inlineFormats: null };
  }

  const beforeSelection = content.substring(0, selectedText.start);
  const selectedContent = content.substring(
    selectedText.start,
    selectedText.end
  );
  const afterSelection = content.substring(selectedText.end);

  let formattedContent = selectedContent;
  let newInlineFormats = {};

  // Smart formatting logic
  switch (format) {
    case "bold":
      if (
        formattedContent.includes("**") &&
        !formattedContent.includes("***")
      ) {
        // Remove bold formatting (but keep italic if present)
        formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, "$1");
        newInlineFormats.bold = false;
      } else if (formattedContent.includes("***")) {
        // If text is both bold and italic, remove bold only
        formattedContent = formattedContent.replace(
          /\*\*\*(.*?)\*\*\*/g,
          "*$1*"
        );
        newInlineFormats.bold = false;
        newInlineFormats.italic = true;
      } else if (
        formattedContent.includes("*") &&
        !formattedContent.includes("**")
      ) {
        // If text is italic, add bold to make it bold+italic
        formattedContent = formattedContent.replace(/\*(.*?)\*/g, "***$1***");
        newInlineFormats.bold = true;
        newInlineFormats.italic = true;
      } else {
        // Add bold formatting (wrap existing content)
        formattedContent = `**${formattedContent}**`;
        newInlineFormats.bold = true;
      }
      break;

    case "italic":
      if (formattedContent.includes("***")) {
        // If text is both bold and italic, remove italic only
        formattedContent = formattedContent.replace(
          /\*\*\*(.*?)\*\*\*/g,
          "**$1**"
        );
        newInlineFormats.italic = false;
        newInlineFormats.bold = true;
      } else if (
        formattedContent.includes("*") &&
        !formattedContent.includes("**")
      ) {
        // Remove italic formatting
        formattedContent = formattedContent.replace(/\*(.*?)\*/g, "$1");
        newInlineFormats.italic = false;
      } else if (formattedContent.includes("**")) {
        // If text is bold, add italic to make it bold+italic
        formattedContent = formattedContent.replace(
          /\*\*(.*?)\*\*/g,
          "***$1***"
        );
        newInlineFormats.italic = true;
        newInlineFormats.bold = true;
      } else {
        // Add italic formatting (wrap existing content)
        formattedContent = `*${formattedContent}*`;
        newInlineFormats.italic = true;
      }
      break;

    case "underline":
      if (formattedContent.includes("__")) {
        // Remove underline formatting
        formattedContent = formattedContent.replace(/__(.*?)__/g, "$1");
        newInlineFormats.underline = false;
      } else {
        // Add underline formatting (preserve existing bold/italic)
        formattedContent = `__${formattedContent}__`;
        newInlineFormats.underline = true;
      }
      break;

    case "clearFormat":
      // Remove all formatting from selected text
      formattedContent = formattedContent
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
        .replace(/\*(.*?)\*/g, "$1") // Remove italic
        .replace(/__(.*?)__/g, "$1"); // Remove underline
      newInlineFormats = {
        bold: false,
        italic: false,
        underline: false,
      };
      break;

    default:
      return { content, inlineFormats: null };
  }

  const newContent = beforeSelection + formattedContent + afterSelection;

  return {
    content: newContent,
    inlineFormats: newInlineFormats,
    newSelection: {
      start: selectedText.start,
      end: selectedText.start + formattedContent.length,
    },
  };
}

// Render formatted content with inline styling
export function renderFormattedContent(content) {
  if (!content) return "";

  // Simple markdown-like parsing for inline formatting
  let formattedContent = content;

  // Replace markdown-style formatting with HTML spans
  formattedContent = formattedContent.replace(
    /\*\*(.*?)\*\*/g,
    '<span class="text-bold" style="direction: ltr !important; text-align: left !important;">$1</span>'
  );
  formattedContent = formattedContent.replace(
    /\*(.*?)\*/g,
    '<span class="text-italic" style="direction: ltr !important; text-align: left !important;">$1</span>'
  );
  formattedContent = formattedContent.replace(
    /__(.*?)__/g,
    '<span class="text-underline" style="direction: ltr !important; text-align: left !important;">$1</span>'
  );

  return formattedContent;
}
