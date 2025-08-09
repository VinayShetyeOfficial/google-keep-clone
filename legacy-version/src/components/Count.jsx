import React from "react";

/**
 * Count component for displaying note counter
 *
 * Props:
 * - count: string - Text to display note count
 */
function Count({ count }) {
  //  Count component to display notes count
  return (
    <div className="count">
      <h4>{count}</h4>
    </div>
  );
}

export default Count;
