import { CLI_VERSION } from "../constants.js";

const BLUE_FOREGROUND = "\u001b[38;2;37;99;235m";
const BLUE_BACKGROUND = "\u001b[48;2;37;99;235m";
const RESET = "\u001b[0m";

// Hand-traced from the canonical 157 x 244 Creed SVG. The 18 x 14 grid
// compensates for tall terminal cells while retaining the mark's perspective.
const MARK = [
  "  ##############  ",
  "##################",
  "########     #####",
  "########        ##",
  "########        ##",
  "########        ##",
  "########        ##",
  "########        ##",
  "########        ##",
  "########        ##",
  "########        ##",
  "########     #####",
  "##################",
  "  ##############  ",
] as const;

export function supportsColor(): boolean {
  return Boolean(process.stdout.isTTY && !process.env.NO_COLOR && process.env.TERM !== "dumb");
}

function renderColorRow(row: string): string {
  let output = "";
  let index = 0;

  while (index < row.length) {
    if (row[index] === "#") {
      let end = index + 1;
      while (end < row.length && row[end] === "#") end += 1;
      output += `${BLUE_BACKGROUND}${" ".repeat(end - index)}${RESET}`;
      index = end;
      continue;
    }

    output += row[index];
    index += 1;
  }

  return output;
}

function renderPlainRow(row: string): string {
  return row.replaceAll("#", "█");
}

export function renderBrand(columns = process.stdout.columns ?? 80): string {
  const color = supportsColor();
  if (columns < 44) return `${color ? BLUE_FOREGROUND : ""}Creed${color ? RESET : ""} ${CLI_VERSION}`;

  const labelLine = MARK.length - 2;

  return MARK
    .map((row, index) => {
      const renderedMark = color ? renderColorRow(row) : renderPlainRow(row);
      if (index !== labelLine) return renderedMark;

      const label = `Creed ${CLI_VERSION}`;
      return `${renderedMark}     ${color ? BLUE_FOREGROUND : ""}${label}${color ? RESET : ""}`;
    })
    .join("\n");
}
