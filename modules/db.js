const fs = require("fs-extra");
const loki = require("lokijs");
const path = require("path");
const TERM = console.log;

/// CONSTANTS & DECLARATIONS //////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const PATH_IMPORT = path.resolve(__dirname, "../data", "init_db.json");
let DB;

/// HELPER METHODS/////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function m_LoadData() {
  TERM("Initializing database from default data");
  // erase collections
  const cnames = DB.listCollections().map((o) => o.name);
  TERM(`... removing ${cnames.length} collections`);
  cnames.forEach((col) => DB.removeCollection(col));

  TERM(`... importing from '${PATH_IMPORT}'`);
  const data = fs.readJsonSync(PATH_IMPORT);
  const datakeys = Object.keys(data);
  // if json file has a key that's in an existing collection, rewrite that
  // collection with its contents (must be an array of doc objs)
  datakeys.forEach((col) => {
    const records = data[col];
    if (!Array.isArray(records)) {
      TERM(`... SKIPPING non-array prop '${col}'`);
      return;
    }
    // create new collection and insert imported collection
    TERM(`... importing collection '${col}' (${records.length} records)`);
    const ncol = DB.addCollection(col, { unique: ["id"] });
    records.forEach((r) => ncol.insert(r));
  });
  DB.saveDatabase();
}

/// API METHODS////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Initialize() {
  DB = new loki("runtime/sridb.loki", {
    autosave: true,
    autosaveInterval: 5000,
    autosaveCallback: () => {
      TERM("autosaved");
    },
    autoload: true,
    autoloadCallback: m_LoadData
  });
}

/// EXPORTS ///////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
module.exports = { Initialize };
