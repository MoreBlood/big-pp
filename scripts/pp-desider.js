/**
 * (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//==============================================================================

// How to load in modules
const Scene = require("Scene");
const Materials = require("Materials");
const Time = require("Time");
const TouchGestures = require("TouchGestures");
const Random = require("Random");
export const Diagnostics = require("Diagnostics");

const image = Scene.root.find("pp-image");
const tiledMaterial = Materials.get("tiled");

image.material = tiledMaterial;

class PP {
  constructor(plane, material) {
    this.plane = plane;
    this.material = material;
    this.offset = 0;
    this.time = 0;
    this.isPlaying = false;

    this.bind();
  }

  static getRandomArbitrary(min, max) {
    return Random.random() * (max - min) + min;
  }

  start() {
    if (this.isPlaying) return;
    const time = PP.getRandomArbitrary(1, 2);
    const res = [0, 1 / 3].sort(() => Math.random() - 0.5)[0];
    let delta = 0.02;

    this.isPlaying = true;
    this.interval = Time.setInterval(() => {
      const currentOffset = this.offset % (2 / 3);
      image.material.diffuseTextureTransform.offsetU = currentOffset;
      if (this.time > time && Math.abs(currentOffset - res) <= delta) {
        image.material.diffuseTextureTransform.offsetU = res;
        this.stop();
        return;
      }
      if ((this.time > time / 2) & (delta > 0.01)) {
        delta -= 0.0025;
      }
      if ((this.time > time / (2 / 3)) & (delta > 0.005)) {
        delta -= 0.001;
      }
      this.time += 1 / 60;
      this.offset += delta;
    }, 1000 / 60);
  }
  stop() {
    Time.clearInterval(this.interval);
    this.isPlaying = false;
    this.time = 0;
  }
  bind() {
    TouchGestures.onTap().subscribe(() => this.start());
  }
}

export const game = new PP(image, tiledMaterial);
