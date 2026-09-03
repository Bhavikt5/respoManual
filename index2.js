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
      // -------------------------------------------------

      // LOOK FOR SINGLE {

      // Ignore {{

      // -------------------------------------------------

      if (words[i].indexOf("{") === -1) {
        continue;
      }

      // If the word contains {{

      // skip it completely

      if (words[i].indexOf("{{") !== -1) {
        continue;
      }

      var combined = "";

      var startWord = i;

      var endWord = -1;

      // =================================================

      // COLLECT WORDS UNTIL SINGLE }

      // =================================================

      for (
        var j = i;
        j <
        Math.min(
          i + 10,

          words.length,
        );
        j++
      ) {
        combined += words[j];

        // Ignore words containing }}

        if (words[j].indexOf("}}") !== -1) {
          break;
        }

        if (words[j].indexOf("}") !== -1) {
          endWord = j;

          break;
        }
      }

      // =================================================

      // NO CLOSING }

      // =================================================

      if (endWord === -1) {
        console.println("WARNING: { without }");

        continue;
      }

      // =================================================

      // EXTRACT SINGLE-BRACE VARIABLE

      // =================================================

      var match = combined.match(/\{([^{}]+)\}/);

      if (!match) {
        continue;
      }

      var variableName = match[1].replace(
        /\s/g,

        "",
      );

      // =================================================

      // VALIDATE VARIABLE NAME

      // =================================================

      if (variableName === "") {
        continue;
      }

      // Extra protection:

      // Do not process anything that came from {{

      // or }}

      if (combined.indexOf("{{") !== -1 || combined.indexOf("}}") !== -1) {
        console.println("SKIPPED DOUBLE-BRACE VARIABLE: " + combined);

        continue;
      }

      console.println("FOUND: " + variableName);

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

      // Move pointer to the end of variable

      i = endWord;
    }
  }

  // =====================================================

  // COMPLETE

  // =====================================================

  console.println("");

  console.println("=================================");

  console.println("DONE - " + fieldCounter + " locations processed");

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

  // CALCULATE RECTANGLE

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

  // PADDING

  // =====================================================

  left -= 2;

  right += 2;

  top += 2;

  bottom -= 2;

  // =====================================================

  // RECTANGLE

  // =====================================================

  var rect = [left, bottom, right, top];

  // =====================================================

  // COVER ORIGINAL TEXT

  // =====================================================

  try {
    doc.addAnnot({
      page: pageIndex,

      type: "Square",

      rect: rect,

      fillColor: color.white,

      strokeColor: color.white,

      opacity: 1,

      width: 0,
    });
  } catch (e) {
    console.println("COVER ERROR: " + e);
  }

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

  // CREATE FIELD USING EXACT VARIABLE NAME

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

  // =====================================================

  // VALIDATE FIELD

  // =====================================================

  if (!field) {
    console.println("FIELD RETURNED NULL: " + variableName);

    return;
  }

  // =====================================================

  // FIELD SETTINGS

  // =====================================================

  try {
    field.type = "text";

    field.readonly = false;

    field.multiline = false;

    if (field.value === null || field.value === undefined) {
      field.value = "";
    }

    field.userName = variableName;

    field.display = display.visible;

    field.textFont = "Helv";

    field.textSize = 8;

    field.fillColor = color.white;

    field.strokeColor = color.black;

    field.lineWidth = 1;
  } catch (e) {
    console.println("FIELD PROPERTY ERROR: " + variableName + " -> " + e);
  }

  // =====================================================

  // RESULT

  // =====================================================

  fieldCounter++;

  console.println("---------------------------------");

  console.println("SUCCESS");

  console.println("Variable: " + variableName);

  console.println("Field Name: " + field.name);

  console.println("Tooltip: " + field.userName);

  console.println("Page: " + (pageIndex + 1));

  console.println("---------------------------------");
}
