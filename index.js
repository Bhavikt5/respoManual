console.clear();

console.show();

console.println("=================================");

console.println(" {VARIABLE} -> ACROFORM ");

console.println("=================================");

var doc = this;

var fieldCounter = 0;

try {
  var pageCount = doc.numPages;

  console.println("TOTAL PAGES: " + pageCount);

  // =====================================================

  // PROCESS ALL PAGES

  // =====================================================

  for (var pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    console.println("");

    console.println("PROCESSING PAGE " + (pageIndex + 1));

    var wordCount = doc.getPageNumWords(pageIndex);

    var words = [];

    // =================================================

    // READ WORDS

    // =================================================

    for (var i = 0; i < wordCount; i++) {
      var word = doc.getPageNthWord(
        pageIndex,

        i,

        false,
      );

      if (word === null || word === undefined) {
        word = "";
      }

      words.push(String(word));
    }

    // =================================================

    // FIND VARIABLES

    // =================================================

    for (var i = 0; i < words.length; i++) {
      if (words[i].indexOf("{") === -1) {
        continue;
      }

      // Ignore {{

      if (words[i].indexOf("{{") !== -1) {
        continue;
      }

      var combined = "";

      var startWord = i;

      var endWord = -1;

      // =================================================

      // COLLECT WORDS UNTIL }

      // =================================================

      for (var j = i; j < Math.min(i + 10, words.length); j++) {
        combined += words[j];

        // Ignore double closing }}

        if (words[j].indexOf("}}") !== -1) {
          endWord = -1;

          break;
        }

        if (words[j].indexOf("}") !== -1) {
          endWord = j;

          break;
        }
      }

      if (endWord === -1) {
        console.println("WARNING: Invalid variable: " + combined);

        continue;
      }

      // =================================================

      // EXTRACT VARIABLE

      // =================================================

      var match = combined.match(/\{([^{}]+)\}/);

      if (!match) {
        continue;
      }

      var variableName = match[1].replace(
        /\s/g,

        "",
      );

      if (variableName === "") {
        continue;
      }

      // Safety check

      if (combined.indexOf("{{") !== -1 || combined.indexOf("}}") !== -1) {
        continue;
      }

      console.println("FOUND VARIABLE: " + variableName);

      // =================================================

      // CREATE FIELD

      // =================================================

      createField(
        doc,

        pageIndex,

        startWord,

        endWord,

        variableName,
      );

      i = endWord;
    }
  }

  console.println("");

  console.println("=================================");

  console.println("DONE - " + fieldCounter + " FIELDS CREATED");

  console.println("=================================");
} catch (e) {
  console.println("FATAL ERROR: " + e);
}

// =========================================================

// CREATE FIELD

// =========================================================

function createField(
  doc,

  pageIndex,

  startWord,

  endWord,

  variableName,
) {
  // =====================================================

  // FIND TEXT POSITION

  // =====================================================

  var left = 999999;

  var right = -999999;

  var top = -999999;

  var bottom = 999999;

  for (var i = startWord; i <= endWord; i++) {
    var quads = null;

    try {
      quads = doc.getPageNthWordQuads(
        pageIndex,

        i,
      );
    } catch (e) {
      continue;
    }

    if (!quads || quads.length === 0) {
      continue;
    }

    for (var qIndex = 0; qIndex < quads.length; qIndex++) {
      var q = quads[qIndex];

      left = Math.min(
        left,

        q[0],

        q[2],

        q[4],

        q[6],
      );

      right = Math.max(
        right,

        q[0],

        q[2],

        q[4],

        q[6],
      );

      bottom = Math.min(
        bottom,

        q[1],

        q[3],

        q[5],

        q[7],
      );

      top = Math.max(
        top,

        q[1],

        q[3],

        q[5],

        q[7],
      );
    }
  }

  // =====================================================

  // VALIDATE POSITION

  // =====================================================

  if (
    left === 999999 ||
    right === -999999 ||
    top === -999999 ||
    bottom === 999999
  ) {
    console.println("POSITION ERROR: " + variableName);

    return;
  }

  // =====================================================

  // ADD PADDING

  // =====================================================

  left -= 2;

  right += 2;

  top += 2;

  bottom -= 2;

  // =====================================================

  // CORRECT ACROBAT RECT

  // [LEFT, BOTTOM, RIGHT, TOP]

  // =====================================================

  var rect = [left, bottom, right, top];

  // =====================================================

  // CHECK EXISTING FIELD

  // =====================================================

  var field = null;

  try {
    field = doc.getField(variableName);
  } catch (e) {
    field = null;
  }

  // =====================================================

  // CREATE NATIVE ACROFORM FIELD

  // =====================================================

  if (!field) {
    try {
      field = doc.addField(
        variableName,

        "text",

        pageIndex,

        rect,
      );
    } catch (e) {
      console.println("ADD FIELD ERROR: " + variableName + " -> " + e);

      return;
    }
  } else {
    console.println("FIELD ALREADY EXISTS: " + variableName);
  }

  if (!field) {
    console.println("FIELD NULL: " + variableName);

    return;
  }

  // =====================================================

  // IMPORTANT FIELD PROPERTIES

  // =====================================================

  try {
    // Standard text field

    field.type = "text";

    // Editable

    field.readonly = false;

    // Single line

    field.multiline = false;

    // No initial value

    field.value = "";

    // Tooltip

    field.userName = variableName;

    // Visible

    field.display = display.visible;

    // Standard font

    field.textFont = "Helv";

    // Font size

    field.textSize = 8;

    // Standard appearance

    field.fillColor = color.white;

    field.strokeColor = color.black;

    // Standard border width

    field.lineWidth = 1;
  } catch (e) {
    console.println("FIELD PROPERTY ERROR: " + variableName + " -> " + e);
  }

  // =====================================================

  // LOG FIELD INFORMATION

  // =====================================================

  fieldCounter++;

  console.println("---------------------------------");

  console.println("SUCCESS");

  console.println("Variable : " + variableName);

  console.println("Field    : " + field.name);

  console.println("Page     : " + (pageIndex + 1));

  console.println("Type     : " + field.type);

  console.println("Readonly : " + field.readonly);

  console.println("Value    : [" + field.value + "]");

  console.println("---------------------------------");
}
