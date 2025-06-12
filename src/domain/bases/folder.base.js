import {Result} from "../result.js";

export class FolderBase {

  constructor(data) {
    this.name = data.name;
    this.path = data.path || '/';
    this.leafs = new Map();
  }

  getName() {
    return this.name;
  }

  getleafs() {
    return this.leafs;
  }

  addNode(node) {
    if (!node || !node.getName()) {
      return Result.fail('[Folder - addNode()] Obrigatorio ter um Node e um Nome');
    }

    this.leafs[node.getName()] = node;

    return Result.ok(this.leafs);
  }
}