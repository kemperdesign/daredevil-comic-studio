const DB_NAME = 'ddr_comics';
const STORE_NAME = 'pdfs';
const COVERS_STORE = 'covers';
const CHECK_STORE = 'checklist';

function getDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 3);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
      if (!db.objectStoreNames.contains(COVERS_STORE)) db.createObjectStore(COVERS_STORE);
      if (!db.objectStoreNames.contains(CHECK_STORE)) db.createObjectStore(CHECK_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function savePdf(id, fileBlob) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(fileBlob, id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getPdf(id) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deletePdf(id) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function saveCover(id, dataUrl) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(COVERS_STORE, 'readwrite');
    const req = tx.objectStore(COVERS_STORE).put(dataUrl, id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getCover(id) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(COVERS_STORE, 'readonly');
    const req = tx.objectStore(COVERS_STORE).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ---- Checklist DB ----
export async function saveChecklist(id, checked) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CHECK_STORE, 'readwrite');
    const store = tx.objectStore(CHECK_STORE);
    const req = store.put(checked, id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function loadChecklist() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CHECK_STORE, 'readonly');
    const store = tx.objectStore(CHECK_STORE);
    const req = store.getAllKeys();
    const reqVals = store.getAll();
    
    reqVals.onsuccess = () => {
       const keys = req.result;
       const vals = reqVals.result;
       const map = {};
       keys.forEach((k, i) => map[k] = vals[i]);
       resolve(map);
    };
    reqVals.onerror = () => reject(reqVals.error);
  });
}
