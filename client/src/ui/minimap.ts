import type { Position } from "@shared/types/position";
import type { MapData } from "../types/map";
import { Palette } from "../renderer/palette";

type MiniMapEntity = Pick<Position, "x" | "y" | "map">;

export class MiniMap {
  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private radius = 68;
  private worldPos: Position = { x: 0, y: 0, map: "Felucca" };
  private entities: MiniMapEntity[] = [];
  private mapData?: MapData;
  private palette: Palette;
  private preRendered: HTMLCanvasElement | null = null;
  private destination: Position | null = null;

  constructor(root: HTMLElement, palette: Palette, mapData?: MapData) {
    this.palette = palette;
    this.mapData = mapData;

    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.top = "12px";
    this.container.style.left = "12px";
    this.container.style.width = `${this.radius * 2 + 16}px`;
    this.container.style.height = `${this.radius * 2 + 16}px`;
    this.container.style.background = "radial-gradient(circle, rgba(26,26,26,0.95), rgba(10,10,10,0.92))";
    this.container.style.border = "2px solid rgba(221,189,130,0.65)";
    this.container.style.borderRadius = "50%";
    this.container.style.boxShadow = "0 0 14px rgba(0,0,0,0.7)";
    this.container.style.overflow = "hidden";

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.radius * 2;
    this.canvas.height = this.radius * 2;
    this.canvas.style.borderRadius = "50%";
    this.canvas.style.mixBlendMode = "screen";
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Minimap context not available");
    }
    this.ctx = ctx;
    this.container.appendChild(this.canvas);
    root.appendChild(this.container);

    this.preRenderMap();
    this.render();
  }

  setPosition(pos: Position) {
    this.worldPos = pos;
    this.render();
  }

  setEntities(entities: MiniMapEntity[]) {
    this.entities = entities;
    this.render();
  }

  setDestination(pos: Position | null) {
    this.destination = pos;
    this.render();
  }

  private preRenderMap() {
    if (!this.mapData) return;
    const base = document.createElement("canvas");
    base.width = this.mapData.width;
    base.height = this.mapData.height;
    const ctx = base.getContext("2d");
    if (!ctx) return;

    const mapColor = (x: number, y: number): string => {
      const row = this.mapData?.tiles[y] ?? "";
      const tile = row[x] ?? "g";
      switch (tile) {
        case "g":
          return this.palette.grass;
        case "s":
          return this.palette.sand;
        case "w":
          return this.palette.water;
        case "r":
          return this.palette.stone;
        default:
          return this.palette.dirt;
      }
    };

    for (let y = 0; y < this.mapData.height; y++) {
      for (let x = 0; x < this.mapData.width; x++) {
        ctx.fillStyle = mapColor(x, y);
        ctx.fillRect(x, y, 1, 1);
      }
    }

    if (this.mapData.blocked) {
      ctx.fillStyle = "rgba(112, 62, 41, 0.6)";
      this.mapData.blocked.forEach(([bx, by]) => ctx.fillRect(bx, by, 1, 1));
    }

    this.preRendered = base;
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.preRendered && this.mapData) {
      this.ctx.drawImage(this.preRendered, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.fillStyle = "#1c2c46";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    const scaleX = this.mapData ? this.canvas.width / this.mapData.width : 1;
    const scaleY = this.mapData ? this.canvas.height / this.mapData.height : 1;

    // Faixa externa de leitura rápida
    this.ctx.strokeStyle = "rgba(10,10,10,0.8)";
    this.ctx.lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.arc(this.radius, this.radius, this.radius - 3, 0, Math.PI * 2);
    this.ctx.stroke();

    // Outros jogadores/NPCs
    this.ctx.fillStyle = "rgba(230,225,215,0.8)";
    this.entities.forEach((e) => {
      if (this.mapData && e.map !== this.worldPos.map) return;
      this.ctx.beginPath();
      this.ctx.arc(e.x * scaleX + 2, e.y * scaleY + 2, 3, 0, Math.PI * 2);
      this.ctx.fill();
    });

    if (this.destination && (!this.mapData || this.destination.map === this.worldPos.map)) {
      this.ctx.strokeStyle = "rgba(102, 194, 255, 0.9)";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(this.destination.x * scaleX + 2, this.destination.y * scaleY + 2, 5, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Indicador do jogador
    this.ctx.fillStyle = "#f5c542";
    this.ctx.beginPath();
    this.ctx.arc(this.worldPos.x * scaleX + 2, this.worldPos.y * scaleY + 2, 4.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Anel exterior para reforçar estilo gump
    this.ctx.strokeStyle = "rgba(255, 230, 186, 0.6)";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(this.radius, this.radius, this.radius - 2, 0, Math.PI * 2);
    this.ctx.stroke();

    this.drawCompass();
  }

  private drawCompass() {
    const labels = [
      { t: "N", x: this.radius, y: 12 },
      { t: "S", x: this.radius, y: this.canvas.height - 4 },
      { t: "W", x: 10, y: this.radius + 4 },
      { t: "E", x: this.canvas.width - 12, y: this.radius + 4 }
    ];
    this.ctx.fillStyle = "#f5e2ba";
    this.ctx.font = "bold 12px Georgia, serif";
    this.ctx.textAlign = "center";
    labels.forEach((l) => this.ctx.fillText(l.t, l.x, l.y));
  }
}
