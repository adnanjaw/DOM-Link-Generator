export class StorageService {
    constructor() {
    }

    getAllStorageLocalData() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(null, (items) => {
                if (chrome.runtime.lastError) {
                    return reject({
                        "message": "Error while getting storage keys.",
                        "reason": chrome.runtime.lastError.message
                    });
                }
                resolve(items);
            });
        });
    }

    setStorageKey(key: any) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(key, () => {
                if (chrome.runtime.lastError) {
                    return reject({
                        "message": "Error while adding new key to storage.",
                        "reason": chrome.runtime.lastError.message
                    });
                }

                resolve(key);
            });
        });
    }
}