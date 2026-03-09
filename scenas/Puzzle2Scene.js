import PuzzleBaseScene from "./BasePuzzleScene.js";

export default class Puzzle2Scene extends PuzzleBaseScene {
  constructor() {
    super("Puzzle2Scene", "Puzzle3Scene");
  }

  create() {
    this.createBackground();
    this.createCircuitBoard();

    this.slots = [
      { x: 250, y: 210, key: "battery" },
      { x: 500, y: 210, key: "switch" },
      { x: 750, y: 210, key: "bulb" },
    ];

    this.slots.forEach((slot) => this.createDropSpot(slot.x, slot.y, 52));
    this.placed = { battery: false, switch: false, bulb: false };

    const battery = this.createBattery(170, 390, 1);
    const bulb = this.createBulb(430, 390, 1);
    const sw = this.createSwitch(690, 390, 1);

    this.pieces = { battery, switch: sw, bulb };
    this.updateGuideForPuzzle2();

    this.bindPiece(battery, "battery");
    this.bindPiece(sw, "switch");
    this.bindPiece(bulb, "bulb");
  }

  updateGuideForPuzzle2() {
    const order = ["battery", "switch", "bulb"];
    const nextKey = order.find((key) => !this.placed[key]);
    if (!nextKey) {
      this.hideGuide();
      return;
    }
    const piece = this.pieces[nextKey];
    const slot = this.slots.find((s) => s.key === nextKey);
    this.guideDrag(piece.x, piece.y, slot.x, slot.y);
  }

  createCircuitBoard() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x2d3844, 0x24303c, 0x1d2732, 0x273340, 1);
    g.fillRoundedRect(80, 90, 840, 320, 24);
    g.fillStyle(0x0f1722, 0.32);
    g.fillRoundedRect(96, 108, 808, 284, 20);
    g.lineStyle(8, 0x708090, 0.9);
    g.strokeRoundedRect(80, 90, 840, 320, 24);
    g.lineStyle(4, 0x3b4a57, 0.8);
    g.strokeRoundedRect(100, 110, 800, 280, 20);
    g.fillStyle(0xbfc7d2, 0.9);
    g.fillCircle(106, 116, 6);
    g.fillCircle(894, 116, 6);
    g.fillCircle(106, 384, 6);
    g.fillCircle(894, 384, 6);
    g.lineStyle(12, 0xb7c1cb, 0.9);
    g.lineBetween(250, 210, 500, 210);
    g.lineBetween(500, 210, 750, 210);
    g.lineStyle(4, 0xffffff, 0.2);
    g.lineBetween(250, 202, 500, 202);
    g.lineBetween(500, 202, 750, 202);
  }

  bindPiece(piece, key) {
    this.makeDraggable(piece, piece.x, piece.y);
    piece.on("dragend", () => {
      if (this.completed || piece.locked) {
        return;
      }
      const slot = this.slots.find((s) => s.key === key);
      if (Phaser.Math.Distance.Between(piece.x, piece.y, slot.x, slot.y) < 74) {
        this.lockToTarget(piece, slot.x, slot.y, () => {
          this.placed[key] = true;
          this.updateGuideForPuzzle2();
          this.checkPuzzleDone();
        });
      }
    });
  }

  checkPuzzleDone() {
    if (this.placed.battery && this.placed.switch && this.placed.bulb) {
      const spark = this.add.circle(750, 210, 24, 0xfff59d, 0.9);
      this.tweens.add({
        targets: spark,
        alpha: { from: 0.9, to: 0.2 },
        scale: { from: 0.7, to: 2.2 },
        duration: 500,
      });
      this.completePuzzle(500, 200);
    }
  }

  createBattery(x, y, scale) {
    const c = this.add.container(x, y);
    const shadow = this.add.ellipse(0, 62, 88, 24, 0x000000, 0.28);
    const bodyOuter = this.add
      .rectangle(0, 0, 74, 114, 0x202a35)
      .setStrokeStyle(3, 0x5f7489, 1);
    const bodyMid = this.add.rectangle(0, 0, 66, 104, 0x2f3f50);
    const terminal = this.add
      .rectangle(0, -62, 30, 14, 0xd9e2ea)
      .setStrokeStyle(2, 0x9ca7b4, 1);
    const capTop = this.add.ellipse(0, -69, 24, 7, 0xf8fbff, 0.9);
    const label = this.add.rectangle(0, 34, 64, 34, 0xe75858);
    const labelShade = this.add.rectangle(0, 40, 64, 10, 0xb83f3f, 0.6);
    const shine = this.add.rectangle(-14, -6, 10, 76, 0xa2c7df, 0.42);
    c.add([
      shadow,
      bodyOuter,
      bodyMid,
      terminal,
      capTop,
      label,
      labelShade,
      shine,
    ]);
    c.setScale(scale);
    return c;
  }

  createSwitch(x, y, scale) {
    const c = this.add.container(x, y);
    const shadow = this.add.ellipse(0, 58, 96, 24, 0x000000, 0.25);
    const plate = this.add
      .rectangle(0, 0, 92, 92, 0xf3f6fb)
      .setStrokeStyle(4, 0x9aa3af, 1);
    const bevel = this.add.rectangle(0, -2, 80, 80, 0xffffff, 0.5);
    const base = this.add.rectangle(0, 12, 48, 20, 0x9aa2ac);
    const lever = this.add
      .rectangle(2, -10, 16, 48, 0x5a6370)
      .setRotation(-0.35);
    const tip = this.add
      .circle(10, -30, 12, 0xd6dde6)
      .setStrokeStyle(2, 0x9aa3af, 1);
    c.add([shadow, plate, bevel, base, lever, tip]);
    c.setScale(scale);
    return c;
  }

  createBulb(x, y, scale) {
    const c = this.add.container(x, y);
    const shadow = this.add.ellipse(0, 62, 94, 24, 0x000000, 0.26);
    const glow = this.add.circle(0, -20, 62, 0xfff3b0, 0.25);
    const glass = this.add
      .circle(0, -20, 40, 0xfff0a8, 0.92)
      .setStrokeStyle(3, 0xeeb11f, 1);
    const filament = this.add.rectangle(0, -12, 22, 4, 0xe39d1d);
    const wire1 = this.add.rectangle(-8, -4, 2, 16, 0xb58a47);
    const wire2 = this.add.rectangle(8, -4, 2, 16, 0xb58a47);
    const shine = this.add.ellipse(-12, -34, 14, 22, 0xffffff, 0.5);
    const neck = this.add.rectangle(0, 18, 38, 22, 0xd6dce3);
    const base = this.add.rectangle(0, 44, 42, 24, 0x8f99a5);
    c.add([shadow, glow, glass, filament, wire1, wire2, shine, neck, base]);
    c.setScale(scale);
    return c;
  }
}
