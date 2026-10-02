/**
 * 底层持久化存储适配器 (Storage Adapter)
 * 封装浏览器持久化存储，保障异常安全、前缀隔离与配额保护
 */

const STORAGE_PREFIX = 'ai_finance_db_v1_';

class StorageAdapter {
  private memoryStore: Map<string, string> = new Map();
  private isStorageAvailable: boolean = true;

  constructor() {
    this.checkAvailability();
  }

  private checkAvailability(): void {
    try {
      const testKey = `${STORAGE_PREFIX}__test__`;
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      this.isStorageAvailable = true;
    } catch {
      this.isStorageAvailable = false;
      console.warn('LocalStorage 不可用，自动切换至内存缓存持久化模式。');
    }
  }

  public getItem<T>(key: string): T | null {
    const fullKey = `${STORAGE_PREFIX}${key}`;
    try {
      let raw: string | null = null;
      if (this.isStorageAvailable) {
        raw = window.localStorage.getItem(fullKey);
      } else {
        raw = this.memoryStore.get(fullKey) || null;
      }

      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.error(`读取存储项失败 [${key}]:`, err);
      return null;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    const fullKey = `${STORAGE_PREFIX}${key}`;
    try {
      const serialized = JSON.stringify(value);
      if (this.isStorageAvailable) {
        window.localStorage.setItem(fullKey, serialized);
      } else {
        this.memoryStore.set(fullKey, serialized);
      }
      return true;
    } catch (err: any) {
      console.error(`写入存储项失败 [${key}]:`, err);
      // 若遇到配额上限，可暂存内存
      this.memoryStore.set(fullKey, JSON.stringify(value));
      return false;
    }
  }

  public removeItem(key: string): void {
    const fullKey = `${STORAGE_PREFIX}${key}`;
    try {
      if (this.isStorageAvailable) {
        window.localStorage.removeItem(fullKey);
      }
      this.memoryStore.delete(fullKey);
    } catch (err) {
      console.error(`删除存储项失败 [${key}]:`, err);
    }
  }

  public clearAll(): void {
    try {
      if (this.isStorageAvailable) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      }
      this.memoryStore.clear();
    } catch (err) {
      console.error('清空本地财务数据存储失败:', err);
    }
  }

  public getUsedBytes(): number {
    let total = 0;
    try {
      if (this.isStorageAvailable) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(STORAGE_PREFIX)) {
            const val = window.localStorage.getItem(k);
            if (val) {
              total += (k.length + val.length) * 2; // UTF-16 approx 2 bytes
            }
          }
        }
      } else {
        this.memoryStore.forEach((v, k) => {
          total += (k.length + v.length) * 2;
        });
      }
    } catch {
      total = 0;
    }
    return total;
  }

  public getDriverName(): 'localStorage' | 'memory' {
    return this.isStorageAvailable ? 'localStorage' : 'memory';
  }
}

export const storageAdapter = new StorageAdapter();
