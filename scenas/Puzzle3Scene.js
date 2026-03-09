import PuzzleBaseScene from "./BasePuzzleScene.js";

export default class Puzzle3Scene extends PuzzleBaseScene {
  constructor() {
    super("Puzzle3Scene", "Puzzle4Scene");
  }

  create() {
    this.createBackground();
    this.createFinalCircuit();
    this.createDropSpot(500, 250, 70);

    const copper = this.createCopperCable(180, 390, 1);
    const wood = this.createWoodPiece(420, 390, 1);
    const plastic = this.createPlasticPiece(700, 390, 1);

    this.makeDraggable(copper, copper.x, copper.y);
    this.makeDraggable(wood, wood.x, wood.y);
    this.makeDraggable(plastic, plastic.x, plastic.y);
    this.guideDrag(copper.x, copper.y, 500, 250);

    copper.on("dragend", () => {
      if (this.completed) {
        return;
      }
      if (Phaser.Math.Distance.Between(copper.x, copper.y, 500, 250) < 84) {
        this.lockToTarget(copper, 500, 250, () => this.powerOn());
      }
    });
  }

  createFinalCircuit() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x2f3d4d, 0x253342, 0x1c2834, 0x273443, 1);
    g.fillRoundedRect(130, 90, 740, 250, 22);
    g.fillStyle(0x0f1923, 0.36);
    g.fillRoundedRect(148, 108, 704, 214, 18);
    g.lineStyle(8, 0x7a8897, 0.9);
    g.strokeRoundedRect(130, 90, 740, 250, 22);
    g.lineStyle(4, 0x435464, 0.9);
    g.strokeRoundedRect(148, 108, 704, 214, 16);

    g.fillStyle(0x1f2c39, 1);
    g.fillRoundedRect(178, 228, 110, 52, 12);
    g.fillRoundedRect(712, 214, 90, 66, 12);
    g.lineStyle(14, 0xa8b2bc, 1);
    g.lineBetween(230, 250, 420, 250);
    g.lineBetween(580, 250, 760, 250);
    g.lineStyle(4, 0xffffff, 0.22);
    g.lineBetween(230, 242, 420, 242);
    g.lineBetween(580, 242, 760, 242);
    g.fillStyle(0x5f6f7f, 1);
    g.fillCircle(420, 250, 11);
    g.fillCircle(580, 250, 11);
    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(500, 328, 430, 36);

    this.finalBulb = this.add.container(760, 190);
    const glow = this.add.circle(0, 0, 76, 0xfff4a3, 0.04);
    const glass = this.add.circle(0, 0, 38, 0xfff0a8, 0.34).setStrokeStyle(2, 0xf3be3e, 0.8);
    const filament = this.add.rectangle(0, 4, 18, 3, 0xc98a1c);
    const wire1 = this.add.rectangle(-7, 10, 2, 12, 0xa37b44);
    const wire2 = this.add.rectangle(7, 10, 2, 12, 0xa37b44);
    const base = this.add.rectangle(0, 44, 40, 22, 0x9ca3af);
    this.finalBulb.add([glow, glass, filament, wire1, wire2, base]);

    this.windmill = this.createWindmill(240, 186, 1.08);
  }

  powerOn() {
    this.tweens.add({
      targets: this.windmillBlades,
      angle: 360,
      duration: 650,
      repeat: -1,
    });

    const bulbGlow = this.finalBulb.list[0];
    const bulbGlass = this.finalBulb.list[1];
    this.tweens.add({
      targets: bulbGlow,
      alpha: { from: 0.2, to: 0.65 },
      scale: { from: 1, to: 1.4 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
    bulbGlass.setFillStyle(0xffef85, 1);
    this.tweens.add({
      targets: this.finalBulb,
      y: 186,
      duration: 420,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    this.completePuzzle(500, 250);
  }

  createWindmill(x, y, scale) {
    const c = this.add.container(x, y);
    const base = this.add.ellipse(0, 86, 88, 20, 0x101820, 0.38);
    const towerShadow = this.add.rectangle(8, 34, 22, 102, 0x8da0b3, 0.35);
    const tower = this.add.rectangle(0, 34, 22, 102, 0xd7dee6).setStrokeStyle(2, 0x9eb0c2, 0.85);
    const nacelle = this.add.rectangle(0, -24, 46, 20, 0xdbe3eb).setStrokeStyle(2, 0x9fb2c4, 0.8);
    const blades = this.add.container(0, -24);
    const bladeA = this.createBlade(0);
    const bladeB = this.createBlade(120);
    const bladeC = this.createBlade(240);
    blades.add([bladeA, bladeB, bladeC]);
    const hubOuter = this.add.circle(0, -24, 13, 0xf4f7fa).setStrokeStyle(2, 0xa5b6c7, 0.9);
    const hubInner = this.add.circle(0, -24, 5, 0x96a9bd);
    c.add([base, towerShadow, tower, nacelle, blades, hubOuter, hubInner]);
    this.windmillBlades = blades;
    c.setScale(scale);
    return c;
  }

  createBlade(angle) {
    const blade = this.add.container(0, 0);
    const wing = this.add.rectangle(0, -34, 14, 58, 0xe6edf4).setStrokeStyle(1, 0xb8c7d6, 0.8);
    const tip = this.add.ellipse(0, -63, 14, 16, 0xf7fbff, 0.98);
    const spine = this.add.rectangle(0, -36, 3, 48, 0xc2d0dd, 0.8);
    blade.add([wing, tip, spine]);
    blade.setAngle(angle);
    return blade;
  }

  createCopperCable(x, y, scale) {
    const c = this.add.container(x, y);
    const shadow = this.add.ellipse(0, 30, 150, 22, 0x000000, 0.22);
    const sleeve = this.add.rectangle(0, 0, 136, 46, 0x3f4a56).setStrokeStyle(2, 0x1f2933, 1);
    const outer = this.add
      .rectangle(0, 0, 126, 40, 0xed8936)
      .setStrokeStyle(4, 0xc05621, 1);
    const capLeft = this.add.rectangle(-66, 0, 10, 24, 0xbfc8d1).setStrokeStyle(2, 0x7f8a96, 1);
    const capRight = this.add.rectangle(66, 0, 10, 24, 0xbfc8d1).setStrokeStyle(2, 0x7f8a96, 1);
    const copperTipLeft = this.add.rectangle(-74, 0, 8, 14, 0xf2a15a).setStrokeStyle(1, 0xc06f2b, 1);
    const copperTipRight = this.add.rectangle(74, 0, 8, 14, 0xf2a15a).setStrokeStyle(1, 0xc06f2b, 1);
    const copperCore = this.add.rectangle(0, 0, 114, 18, 0xf3a35a, 0.78);
    const shine = this.add.rectangle(-26, -5, 22, 24, 0xfbd38d, 0.55);
    c.add([
      shadow,
      sleeve,
      outer,
      capLeft,
      capRight,
      copperTipLeft,
      copperTipRight,
      copperCore,
      shine,
    ]);
    c.setScale(scale);
    return c;
  }

  createWoodPiece(x, y, scale) {
    const c = this.add.container(x, y);
    const shadow = this.add.ellipse(0, 30, 150, 22, 0x000000, 0.22);
    const plank = this.add
      .rectangle(0, 0, 126, 40, 0x8b5a2b)
      .setStrokeStyle(4, 0x6f4518, 1);
    const grain1 = this.add.rectangle(-18, 2, 18, 30, 0xa76f3a, 0.5);
    const grain2 = this.add.rectangle(24, -3, 20, 24, 0xb7793c, 0.4);
    const grain3 = this.add.rectangle(-42, -2, 14, 24, 0x9a6635, 0.4);
    const knot1 = this.add.circle(-8, 4, 5, 0x6e4320, 0.6);
    const knot2 = this.add.circle(36, -4, 4, 0x6e4320, 0.5);
    c.add([shadow, plank, grain1, grain2, grain3, knot1, knot2]);
    c.setScale(scale);
    return c;
  }

  createPlasticPiece(x, y, scale) {
    const c = this.add.container(x, y);
    const shadow = this.add.ellipse(0, 30, 150, 22, 0x000000, 0.22);
    const body = this.add
      .rectangle(0, 0, 126, 40, 0x63b3ed)
      .setStrokeStyle(4, 0x3182ce, 1);
    const shine = this.add.ellipse(-14, -6, 52, 14, 0xffffff, 0.35);
    const edge = this.add.rectangle(0, 10, 120, 12, 0x2f80c9, 0.35);
    const glaze = this.add.ellipse(14, -10, 34, 10, 0xffffff, 0.22);
    c.add([shadow, body, edge, shine, glaze]);
    c.setScale(scale);
    return c;
  }
}
