import Result from "../result";

export class FolderBase {
  constructor(name) {
    this.name = name;
    this.nodes = new Map();
  }

  getName() {
    return this.name;
  }

  getNodes() {
    return this.nodes;
  }

  addNode(node) {
    if (!node || !node.getName()) {
      return Result.fail('[Folder - addNode()] Obrigatorio ter um Node e um Nome');
    }

    this.nodes[node.getName()] = node;

    return Result.ok(this.nodes);
  }
}