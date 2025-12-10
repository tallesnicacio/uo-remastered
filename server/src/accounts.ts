import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

type UserRole = "Owner" | "Admin" | "GM" | "Player";

type Account = {
  name: string;
  password: string;
  role: UserRole;
};

export class AccountStore {
  private accounts = new Map<string, Account>();
  private filePath: string;

  constructor() {
    this.filePath = path.resolve(import.meta.dir, "../data/accounts.json");
    this.loadFromDisk();
  }

  validateOrCreate(name: string, password?: string): { ok: boolean; role: UserRole } {
    if (!name) return { ok: false, role: "Player" };
    const pwd = password?.trim() || "1234";
    const existing = this.accounts.get(name);
    if (existing) {
      return { ok: existing.password === pwd, role: existing.role };
    }
    const role: UserRole = this.accounts.size === 0 ? "Owner" : "Player";
    this.accounts.set(name, { name, password: pwd, role });
    this.persist();
    return { ok: true, role };
  }

  private persist() {
    const arr: Account[] = [...this.accounts.values()];
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
      arr.forEach((acc) => this.accounts.set(acc.name, acc));
      console.log(`[accounts] carregadas ${arr.length} contas`);
    } catch (err) {
      console.warn("[accounts] erro ao carregar", err);
    }
  }
}
