import PuzzleBaseScene from "./BasePuzzleScene.js";

export default class PuzzleSolarScene extends PuzzleBaseScene {
  constructor() {
    super("PuzzleSolarScene", "Puzzle2Scene");
  }

  create() {
    this.createBackground();
    this.createSolarPlant();

    const targetX = 755;
    const targetY = 132;
    this.createDropSpot(targetX, targetY, 58);

    const sun = this.createSun(170, 378, 0.95);
    const moon = this.createMoon(320, 382, 1);
    const cloud = this.createCloud(470, 384, 1.1);

    this.makeDraggable(sun, sun.x, sun.y);
    this.makeDraggable(moon, moon.x, moon.y);
    this.makeDraggable(cloud, cloud.x, cloud.y);
    this.guideDrag(sun.x, sun.y, targetX, targetY);

    sun.on("dragend", () => {
      if (this.completed) {
        return;
      }
      if (Phaser.Math.Distance.Between(sun.x, sun.y, targetX, targetY) < 76) {
        this.lockToTarget(sun, targetX, targetY, () =>
          this.completePuzzle(targetX, targetY),
        );
      }
    });
  }

  createSolarPlant() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x3a4e63, 0x243446, 0x1a2633, 0x2a3a4a, 1);
    g.fillRoundedRect(615, 210, 312, 208, 18);
    g.fillStyle(0x121f2c, 1);
    g.fillRoundedRect(634, 232, 274, 166, 14);
    g.fillStyle(0xffffff, 0.05);
    g.fillRoundedRect(646, 244, 248, 52, 10);
    g.lineStyle(2, 0x73c8ff, 0.75);
    for (let i = 1; i < 6; i += 1) {
      g.lineBetween(634 + i * 45, 236, 634 + i * 45, 396);
    }
    for (let j = 1; j < 4; j += 1) {
      g.lineBetween(638, 232 + j * 42, 904, 232 + j * 42);
    }
    g.fillGradientStyle(0x7f8d9b, 0x697785, 0x434f5b, 0x556270, 1);
    g.fillRoundedRect(726, 418, 20, 52, 6);
    g.fillRoundedRect(796, 418, 20, 52, 6);
    g.fillStyle(0x101820, 0.35);
    g.fillEllipse(770, 474, 190, 34);

    const glow = this.add.ellipse(770, 310, 300, 170, 0x7fd3ff, 0.14);
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.1, to: 0.24 },
      duration: 1100,
      yoyo: true,
      repeat: -1,
    });
  }

  createSun(x, y, scale) {
    const c = this.add.container(x, y);
    const aura = this.add.circle(0, 0, 78, 0xffe08a, 0.2);
    const ray = this.add.star(0, 0, 16, 52, 78, 0xffd166, 0.45);
    const coreOuter = this.add
      .circle(0, 0, 54, 0xf59e0b, 1)
      .setStrokeStyle(2, 0xfff3c2, 0.5);
    const coreMid = this.add.circle(0, 0, 42, 0xfbbf24, 0.95);
    const coreInner = this.add.circle(-10, -12, 24, 0xfff7cc, 0.78);
    c.add([aura, ray, coreOuter, coreMid, coreInner]);
    c.setScale(scale);
    return c;
  }

  createMoon(x, y, scale) {
    const c = this.add.container(x, y);
    const halo = this.add.circle(0, 0, 58, 0xdbe4ff, 0.15);
    const m1 = this.add
      .circle(0, 0, 46, 0xcfd9ee, 1)
      .setStrokeStyle(2, 0xe8efff, 0.65);
    const m2 = this.add.circle(16, -10, 44, 0x8da4ce, 0.86);
    const crater1 = this.add.circle(-12, 10, 8, 0xb8c5e5, 0.8);
    const crater2 = this.add.circle(8, -6, 6, 0xaebddb, 0.75);
    c.add([halo, m1, m2, crater1, crater2]);
    c.setScale(scale);
    return c;
  }

  createCloud(x, y, scale) {
    const c = this.add.container(x, y);
    const shadow = this.add.ellipse(8, 26, 146, 40, 0x8ca2bf, 0.35);
    const p1 = this.add.ellipse(-34, 6, 70, 52, 0xe9efff, 1);
    const p2 = this.add.ellipse(0, -10, 94, 68, 0xf7fbff, 1);
    const p3 = this.add.ellipse(42, 8, 76, 54, 0xe6efff, 1);
    const p4 = this.add.ellipse(0, 22, 138, 44, 0xdce8ff, 0.95);
    const light = this.add.ellipse(-6, -8, 62, 24, 0xffffff, 0.35);
    c.add([shadow, p1, p2, p3, p4, light]);
    c.setScale(scale);
    return c;
  }
}
