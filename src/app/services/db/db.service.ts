import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db!: IDBDatabase;
  private dbName = 'projectPlayer';
  private dbVersion = 2;
  private storeName = 'downloadedProjects';
  private storeProject = 'projects';

  constructor() { }
  openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeProject)) {
          db.createObjectStore(this.storeProject, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName,{ keyPath: 'keyid'});
        }
      };
      request.onsuccess = (event: any) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(event.target.result);
      };
      request.onerror = () => {
        console.error('Failed to open the database:', request.error);
        reject(request.error);
      };
    });
  }

  getAllTransactions(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.error('Database not initialized');
        reject('Database not initialized');
        return;
      }
      const transaction = this.db.transaction(this.storeName, 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const query = objectStore.getAll();
      query.onsuccess = () => {
        resolve(query.result);
      };
      query.onerror = () => {
        console.error('Failed to retrieve data:', query.error);
        reject(query.error);
      };
    });
  }

  deleteTransaction(key: any) :Promise<any>{
    return new Promise((resolve, reject) => {
    if (!this.db) {
      console.error('Database not initialized');
      reject('Database not initialized');
      return;
    }
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    const request = store.delete(key);
    request.onsuccess = () => {
      resolve('Transaction has been deleted');
    };
    request.onerror = (event) => {
      console.error('Error deleting item:', request.error);
      reject(request.error)
    };
  });
  }

  getTransaction(key:any)  :Promise<any>{
    return new Promise((resolve, reject) => {
    const transaction = this.db.transaction([this.storeProject],'readonly')
    const store = transaction.objectStore(this.storeProject)
    const request = store.get(key)
    request.onsuccess = () => {
      resolve(request.result)
    }
    request.onerror = () => {
      reject(request.error)
    }
  });
}

updateTransaction(data: any) :Promise<any>{
  return new Promise((resolve, reject) => {
  data.data.isDownload = false;
  const transaction = this.db.transaction([this.storeProject], 'readwrite');
  const store = transaction.objectStore(this.storeProject);
  const request = store.put(data);
  request.onsuccess = (event) => {
    resolve('Data updated successfully')
  };
  request.onerror = (event) => {
    console.error('Error updating Data: ');
    reject(request.error)
  };
});
}

clearDb(db: IDBDatabase, dbName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([dbName], "readwrite");
    const store = transaction.objectStore(dbName);
    const request = store.clear();
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = (event) => {
      console.error(`Failed to clear ${dbName}`);
      reject(event);
    };
  });
}

}
