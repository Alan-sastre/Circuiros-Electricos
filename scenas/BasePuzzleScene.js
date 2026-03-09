export default class PuzzleBaseScene extends Phaser.Scene {
  constructor(key, nextSceneKey) {
    super(key);
    this.nextSceneKey = nextSceneKey;
    this.completed = false;
  }

  createBackground() {
    const width = this.scale.width;
    const height = this.scale.height;
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x15314b, 0x173857, 0x2f6a8f, 0x2b5f83, 1);
    bg.fillRect(0, 0, width, height);

    const floor = this.add.graphics();
    floor.fillGradientStyle(0x445a44, 0x496149, 0x658261, 0x5f7758, 1);
    floor.fillRect(0, height * 0.72, width, height * 0.28);

    const panel = this.add.graphics();
    panel.fillStyle(0xffffff, 0.08);
    panel.fillRoundedRect(20, 20, width - 40, height - 40, 24);

    const light = this.add.graphics();
    light.fillGradientStyle(0xffffff, 0xffffff, 0x8ac7ff, 0x8ac7ff, 0.14);
    light.fillEllipse(width * 0.5, 120, width * 1.2, 220);

    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0.12);
    vignette.fillRoundedRect(10, 10, width - 20, height - 20, 30);
  }

  createDropSpot(x, y, radius = 55) {
    const ring = this.add
      .circle(x, y, radius, 0xffffff, 0.2)
      .setStrokeStyle(6, 0xd8f0ff, 0.5);
    this.tweens.add({
      targets: ring,
      alpha: { from: 0.25, to: 0.6 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    return ring;
  }

  createGuide() {
    this.guide = this.add
      .text(0, 0, "👆🏻", {
        fontSize: "56px",
      })
      .setOrigin(0.5)
      .setDepth(1000);
    this.tweens.add({
      targets: this.guide,
      scale: { from: 1, to: 1.08 },
      duration: 380,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  guideDrag(fromX, fromY, toX, toY) {
    if (!this.guide) {
      this.createGuide();
    }
    if (this.guideTween) {
      this.guideTween.stop();
    }
    this.guide.x = fromX;
    this.guide.y = fromY - 76;
    this.guideTween = this.tweens.add({
      targets: this.guide,
      x: toX,
      y: toY - 76,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  hideGuide() {
    if (!this.guide) {
      return;
    }
    if (this.guideTween) {
      this.guideTween.stop();
    }
    this.guide.destroy();
    this.guide = null;
    this.guideTween = null;
  }

  makeDraggable(item, startX, startY) {
    item.startX = startX;
    item.startY = startY;
    item.setSize(item.width || 120, item.height || 120);
    item.setInteractive({ useHandCursor: true, draggable: true });
    this.input.setDraggable(item);
    item.on("drag", (pointer, dragX, dragY) => {
      item.x = dragX;
      item.y = dragY;
    });
    item.on("dragend", () => {
      if (item.locked) {
        return;
      }
      this.tweens.add({
        targets: item,
        x: item.startX,
        y: item.startY,
        duration: 240,
        ease: "Back.easeOut",
      });
    });
  }

  lockToTarget(item, x, y, onDone) {
    item.locked = true;
    item.disableInteractive();
    this.tweens.add({
      targets: item,
      x,
      y,
      scaleX: item.scaleX * 1.02,
      scaleY: item.scaleY * 1.02,
      duration: 240,
      ease: "Back.easeOut",
      onComplete: () => {
        this.tweens.add({
          targets: item,
          scaleX: item.scaleX / 1.02,
          scaleY: item.scaleY / 1.02,
          duration: 160,
          ease: "Sine.easeOut",
        });
        onDone();
      },
    });
  }

  confetti(x, y) {
    if (!this.textures.exists("confetti-dot")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff, 1);
      g.fillCircle(5, 5, 5);
      g.generateTexture("confetti-dot", 10, 10);
      g.destroy();
    }
    const particles = this.add.particles(x, y, "confetti-dot", {
      speed: { min: 160, max: 360 },
      angle: { min: 200, max: 340 },
      lifespan: 1800,
      quantity: 6,
      frequency: 40,
      gravityY: 500,
      scale: { start: 1, end: 0.2 },
      alpha: { start: 1, end: 0 },
      tint: [0xffd166, 0x5eead4, 0xff6b6b, 0xa78bfa, 0x7dd3fc, 0x86efac],
      rotate: { min: 0, max: 360 },
    });
    this.time.delayedCall(950, () => particles.stop());
    this.time.delayedCall(2500, () => particles.destroy());
  }

  completePuzzle(focusX, focusY) {
    if (this.completed) {
      return;
    }
    this.completed = true;
    this.hideGuide();
    this.confetti(focusX, focusY);
    this.time.delayedCall(1400, () => {
      if (this.nextSceneKey) {
        this.scene.start(this.nextSceneKey);
      }
    });
  }
}
