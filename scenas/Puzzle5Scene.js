import PuzzleBaseScene from "./BasePuzzleScene.js";

export default class Puzzle5Scene extends PuzzleBaseScene {
  constructor() {
    super("Puzzle5Scene", null);
  }

  create() {
    this.createBackground();
    this.createControlBoard();
    this.switchState = [false, false, false];
    this.createSwitches();
    this.createFinalButton();
    this.updateGuide();
  }

  createControlBoard() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x3a4b5c, 0x2b3d4f, 0x1f2d39, 0x2c3c4d, 1);
    g.fillRoundedRect(90, 78, 820, 266, 24);
    g.fillStyle(0x101923, 0.35);
    g.fillRoundedRect(110, 98, 780, 226, 18);
    g.lineStyle(8, 0x78899a, 0.94);
    g.strokeRoundedRect(90, 78, 820, 266, 24);

    g.fillStyle(0x2d3c4b, 1);
    g.fillRoundedRect(176, 186, 160, 104, 16);
    g.fillRoundedRect(420, 186, 160, 104, 16);
    g.fillRoundedRect(664, 186, 160, 104, 16);
    g.fillRoundedRect(430, 108, 140, 58, 14);

    g.lineStyle(12, 0xaab4bf, 1);
    g.lineBetween(256, 214, 500, 214);
    g.lineBetween(500, 214, 744, 214);
    g.lineStyle(4, 0xffffff, 0.2);
    g.lineBetween(256, 206, 500, 206);
    g.lineBetween(500, 206, 744, 206);

    this.flowLight1 = this.add.rectangle(378, 214, 92, 10, 0x7dd3fc, 0.18);
    this.flowLight2 = this.add.rectangle(622, 214, 92, 10, 0x7dd3fc, 0.18);
    this.coreGlow = this.add.circle(500, 214, 26, 0x86d6ff, 0.12);
  }

  createSwitches() {
    this.switches = [];
    const xs = [256, 500, 744];
    xs.forEach((x, index) => {
      const y = 238;
      const sw = this.add.container(x, y);
      const plate = this.add.rectangle(0, 0, 88, 94, 0xeef3f8).setStrokeStyle(3, 0x9ba7b5, 1);
      const slot = this.add.rectangle(0, 2, 30, 56, 0x617182);
      const lever = this.add.rectangle(0, 16, 22, 30, 0xd7dee6).setStrokeStyle(2, 0x9ca8b6, 1);
      const led = this.add.circle(0, -34, 10, 0x7c8793, 0.6).setStrokeStyle(2, 0x5a6572, 1);
      sw.add([plate, slot, lever, led]);
      sw.setSize(88, 94);
      sw.setInteractive({ useHandCursor: true });
      sw.on("pointerdown", () => this.toggleSwitch(index));
      this.switches.push({ container: sw, lever, led });
    });
  }

  toggleSwitch(index) {
    if (this.completed || this.endButtonEnabled) {
      return;
    }
    this.switchState[index] = !this.switchState[index];
    const sw = this.switches[index];
    this.tweens.add({
      targets: sw.lever,
      y: this.switchState[index] ? -10 : 16,
      duration: 150,
      ease: "Sine.easeInOut",
    });
    sw.led.setFillStyle(this.switchState[index] ? 0x7ef9ff : 0x7c8793, this.switchState[index] ? 0.95 : 0.6);
    this.updateFlow();
    this.updateGuide();
    if (this.switchState.every(Boolean)) {
      this.enableFinalButton();
    }
  }

  updateFlow() {
    const activeCount = this.switchState.filter(Boolean).length;
    this.flowLight1.setAlpha(activeCount >= 1 ? 0.65 : 0.18);
    this.flowLight2.setAlpha(activeCount >= 2 ? 0.65 : 0.18);
    this.coreGlow.setAlpha(0.12 + activeCount * 0.14);
  }

  createFinalButton() {
    this.endButtonEnabled = false;
    this.endButton = this.add.container(500, 136);
    const body = this.add.rectangle(0, 0, 118, 44, 0x4b5e71).setStrokeStyle(3, 0x9eb1c2, 0.8);
    const lamp = this.add.circle(0, 0, 13, 0x6f7f8f, 0.7);
    this.endButton.add([body, lamp]);
    this.endButtonBody = body;
    this.endButtonLamp = lamp;
  }

  enableFinalButton() {
    this.endButtonEnabled = true;
    this.endButtonBody.setFillStyle(0x2f7f4f, 1);
    this.endButtonLamp.setFillStyle(0x86efac, 0.95);
    this.endButton.setSize(118, 44);
    this.endButton.setInteractive({ useHandCursor: true });
    this.endButton.on("pointerdown", () => this.finishGame());
    this.updateGuide();
  }

  updateGuide() {
    if (!this.guide) {
      this.createGuide();
    }
    let targetX = 256;
    let targetY = 238;
    if (this.endButtonEnabled) {
      targetX = 500;
      targetY = 136;
    } else {
      const idx = this.switchState.findIndex((state) => !state);
      const safeIndex = idx === -1 ? 0 : idx;
      targetX = this.switches[safeIndex].container.x;
      targetY = this.switches[safeIndex].container.y;
    }
    this.guide.setPosition(targetX, targetY - 72);
    if (this.guideTween) {
      this.guideTween.stop();
    }
    this.guideTween = this.tweens.add({
      targets: this.guide,
      y: targetY - 58,
      duration: 420,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  finishGame() {
    if (this.completed) {
      return;
    }
    this.completed = true;
    this.hideGuide();
    this.endButton.disableInteractive();
    this.confetti(500, 170);
    this.showFinalOverlay();
  }

  showFinalOverlay() {
    const overlay = this.add.rectangle(500, 250, 1000, 500, 0x08111a, 0.72).setDepth(1200);
    const panel = this.add.rectangle(500, 240, 520, 250, 0x1f3345, 0.95).setDepth(1201).setStrokeStyle(4, 0x80a9cb, 1);
    const title = this.add
      .text(500, 190, "¡Felicitaciones! 🎉", {
        fontSize: "48px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(1202);
    const subtitle = this.add
      .text(500, 245, "Completaste todos los puzzles", {
        fontSize: "28px",
        color: "#dff2ff",
      })
      .setOrigin(0.5)
      .setDepth(1202);
    const button = this.add
      .rectangle(500, 310, 250, 68, 0x2f9e44, 1)
      .setDepth(1202)
      .setStrokeStyle(3, 0xa7f3d0, 1);
    const buttonText = this.add
      .text(500, 310, "Volver a jugar", {
        fontSize: "34px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(1203);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => {
      overlay.destroy();
      panel.destroy();
      title.destroy();
      subtitle.destroy();
      button.destroy();
      buttonText.destroy();
      this.scene.start("PuzzleSolarScene");
    });
  }
}
