import PuzzleBaseScene from "./BasePuzzleScene.js";

export default class Puzzle4Scene extends PuzzleBaseScene {
  constructor() {
    super("Puzzle4Scene", "Puzzle5Scene");
  }

  create() {
    this.createBackground();
    this.createHydroStation();
    this.sequence = ["water", "turbine", "power"];
    this.currentStep = 0;
    this.bindValve("water");
    this.bindValve("turbine");
    this.bindValve("power");
    this.setGuideTo(this.valves.water.x, this.valves.water.y);
  }

  setGuideTo(x, y) {
    if (!this.guide) {
      this.createGuide();
    }
    this.guide.setPosition(x, y - 70);
    if (this.guideTween) {
      this.guideTween.stop();
    }
    this.guideTween = this.tweens.add({
      targets: this.guide,
      y: y - 56,
      duration: 420,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  bindValve(key) {
    const valve = this.valves[key];
    valve.setInteractive({ useHandCursor: true });
    valve.on("pointerdown", () => {
      if (this.completed) {
        return;
      }
      const expected = this.sequence[this.currentStep];
      if (key !== expected) {
        this.tweens.add({
          targets: valve,
          x: valve.x + 8,
          duration: 80,
          yoyo: true,
          repeat: 2,
        });
        return;
      }
      valve.disableInteractive();
      this.activateValve(key);
      this.currentStep += 1;
      if (this.currentStep < this.sequence.length) {
        const nextValve = this.valves[this.sequence[this.currentStep]];
        this.setGuideTo(nextValve.x, nextValve.y);
        return;
      }
      this.startHydro();
    });
  }

  activateValve(key) {
    this.valveLights[key].setStrokeStyle(4, 0x7ef9ff, 0.95);
    this.tweens.add({
      targets: this.valveWheels[key],
      angle: this.valveWheels[key].angle + 180,
      duration: 300,
    });
  }

  startHydro() {
    this.tweens.add({
      targets: this.turbineBlades,
      angle: 360,
      duration: 520,
      repeat: -1,
    });
    this.tweens.add({
      targets: this.energyGlow,
      alpha: { from: 0.2, to: 0.65 },
      duration: 420,
      yoyo: true,
      repeat: -1,
    });
    this.completePuzzle(742, 178);
  }

  createHydroStation() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x415466, 0x304355, 0x1e2c39, 0x2b3b4a, 1);
    g.fillRoundedRect(110, 80, 780, 260, 26);
    g.fillStyle(0x101923, 0.42);
    g.fillRoundedRect(130, 100, 740, 220, 18);
    g.lineStyle(8, 0x7b8a98, 0.92);
    g.strokeRoundedRect(110, 80, 780, 260, 26);
    g.fillStyle(0xffffff, 0.05);
    g.fillRoundedRect(142, 112, 716, 36, 10);

    g.fillGradientStyle(0x2f5f80, 0x22516f, 0x3a89b8, 0x2b739b, 1);
    g.fillRoundedRect(150, 120, 330, 170, 18);
    g.fillStyle(0xffffff, 0.22);
    g.fillRoundedRect(162, 132, 300, 22, 9);
    g.fillStyle(0xffffff, 0.15);
    g.fillRoundedRect(176, 172, 140, 10, 5);
    g.fillRoundedRect(208, 198, 190, 10, 5);

    g.fillGradientStyle(0x526475, 0x415466, 0x2c3b49, 0x445565, 1);
    g.fillRoundedRect(560, 106, 286, 196, 16);
    g.fillStyle(0x6f8192, 1);
    g.fillCircle(742, 178, 76);
    g.fillStyle(0x344657, 1);
    g.fillCircle(742, 178, 62);
    g.fillStyle(0xffffff, 0.07);
    g.fillEllipse(726, 160, 62, 28);
    g.lineStyle(10, 0xa8bac8, 0.92);
    g.strokeCircle(742, 178, 66);
    g.lineStyle(5, 0x4f6071, 0.84);
    g.strokeCircle(742, 178, 52);
    g.fillGradientStyle(0x8c99a6, 0x6f7e8d, 0x5e6d7b, 0x7a8997, 1);
    g.fillRoundedRect(700, 236, 16, 76, 6);
    g.fillStyle(0x000000, 0.22);
    g.fillEllipse(740, 316, 170, 30);
    g.lineStyle(14, 0x4f6478, 0.9);
    g.lineBetween(230, 332, 230, 272);
    g.lineBetween(500, 332, 500, 246);
    g.lineBetween(770, 332, 770, 258);
    g.lineBetween(230, 272, 620, 272);
    g.lineBetween(500, 246, 676, 246);
    g.lineBetween(770, 258, 786, 258);
    g.fillStyle(0x6f8598, 1);
    g.fillCircle(230, 272, 7);
    g.fillCircle(500, 246, 7);
    g.fillCircle(620, 272, 7);
    g.fillCircle(676, 246, 7);
    g.fillCircle(770, 258, 7);
    g.fillCircle(786, 258, 7);
    g.lineStyle(8, 0xb3c6d8, 0.95);
    g.lineBetween(230, 332, 230, 276);
    g.lineBetween(500, 332, 500, 248);
    g.lineBetween(770, 332, 770, 258);
    g.lineBetween(230, 276, 620, 276);
    g.lineBetween(500, 248, 676, 248);
    g.lineBetween(770, 258, 786, 258);

    const turbineCenterX = 742;
    const turbineCenterY = 178;
    this.turbineBlades = this.add.container(turbineCenterX, turbineCenterY);
    const blade1 = this.createBladeShape(0);
    const blade2 = this.createBladeShape(120);
    const blade3 = this.createBladeShape(240);
    this.turbineBlades.add([blade1, blade2, blade3]);
    this.add.circle(turbineCenterX, turbineCenterY, 20, 0xb8c6d3).setStrokeStyle(3, 0x738292, 1);
    this.add.circle(turbineCenterX, turbineCenterY, 8, 0x4c5a67);
    this.add.circle(turbineCenterX, turbineCenterY, 42, 0xffffff, 0.08);
    this.add.circle(turbineCenterX, turbineCenterY, 30, 0x9ab7cc, 0.12);
    this.energyGlow = this.add.circle(742, 258, 40, 0x7ed7ff, 0.18);

    this.valves = {};
    this.valveWheels = {};
    this.valveLights = {};
    this.createValve("water", 230, 390, 0x5cc4ff, "water");
    this.createValve("turbine", 500, 390, 0x97d8ff, "turbine");
    this.createValve("power", 770, 390, 0x76ecff, "power");
  }

  createBladeShape(angle) {
    const blade = this.add.container(0, 0);
    const fin = this.add.triangle(0, -28, 0, -74, 13, -8, -13, -8, 0xe9f1f8, 1);
    const body = this.add.rectangle(0, -24, 9, 34, 0xd2dde8, 0.96);
    const edge = this.add.rectangle(2, -28, 2, 36, 0xb8c7d5, 0.7);
    const shine = this.add.rectangle(-3, -38, 2, 22, 0xffffff, 0.45);
    blade.add([fin, body, edge, shine]);
    blade.setAngle(angle);
    return blade;
  }

  createValve(key, x, y, accent, iconType) {
    const body = this.add
      .circle(x, y, 46, 0x2f4254)
      .setStrokeStyle(4, 0x8aa1b6, 0.98);
    const bodyInner = this.add.circle(x, y, 38, 0x3a5164, 0.95);
    const wheel = this.add.container(x, y);
    const hub = this.add
      .circle(0, 0, 27, 0x5f7081)
      .setStrokeStyle(2, 0xa9b8c8, 0.95);
    const spokeV = this.add.rectangle(0, 0, 6, 36, 0xd9e5ef);
    const spokeH = this.add.rectangle(0, 0, 36, 6, 0xd9e5ef);
    const hubDot = this.add.circle(0, 0, 5, 0x7f93a6);
    wheel.add([hub, spokeV, spokeH]);
    wheel.add(hubDot);
    const light = this.add
      .circle(x, y, 52, accent, 0.03)
      .setStrokeStyle(2, accent, 0.25);
    this.valves[key] = body;
    this.valveWheels[key] = wheel;
    this.valveLights[key] = light;
    this.add.container(0, 0, [bodyInner]);
  }
}
