import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

type Account = {
  name: string;
  password: string;
};

export class AccountStore {
  private accounts = new Map<string, string>();
  private filePath: string;

  constructor() {
    this.filePath = path.resolve(import.meta.dir, "../data/accounts.json");
    this.loadFromDisk();
  }

  validateOrCreate(name: string, password?: string): boolean {
    if (!name) return false;
    const pwd = password?.trim() || "1234";
    const existing = this.accounts.get(name);
    if (existing) {
      return existing === pwd;
    }
    this.accounts.set(name, pwd);
    this.persist();
    return true;
  }

  private persist() {
    const arr: Account[] = [...this.accounts.entries()].map(([name, password]) => ({ name, password }));
    try {
      writeFileSync(this.filePath, JSON.stringify(arr, null, 2), "utf8");
    } catch (err) {
      console.warn("[accounts] erro ao salvar", err);
    }
  }

  private loadFromDisk() {
    if (!existsSync(this.filePath)) return;
    try {
      const raw = readFileSync(this.filePath, "utf8");
      const arr = JSON.parse(raw) as Account[];
      arr.forEach((acc) => this.accounts.set(acc.name, acc.password));
      console.log(`[accounts] carregadas ${arr.length} contas`);
    } catch (err) {
      console.warn("[accounts] erro ao carregar", err);
    }
  }
}
