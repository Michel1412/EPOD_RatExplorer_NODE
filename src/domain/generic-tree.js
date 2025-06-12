import { FolderBase } from "./bases/folder.base.js";
import {Result} from "./result.js";

export class GenericTree {

  constructor() {
    this.root = new FolderBase('/');
  }

  setRoot(node) {
    this.root = node;
    return this;
  }

  getRoot() {
    if (!this.root) {
      return Result.fail('Pasta inicial não encontrada');
    }

    return this.root;
  }

  async addNode(node) {
    if (!this.root.leafs) {
      this.root.leafs = new Map();
    }

    this.root = await this.setLeaf(node, node.path, this.root);
    return Result.ok(this.root);
  }

  async setLeaf(node, path, currentNode) {
    const parts = path.split('/').slice(1);
    console.log(`[GenericTree - setLeaf] parts: [${parts}]`);

    const currentPart = parts.shift();

    if (!currentPart) {
      currentNode.leafs[node.name] = node;
      return currentNode;
    }

    if (!currentNode.leafs) {
      currentNode.leafs = new Map();
    }

    const nextPart = `/${parts.join('/')}`;
    currentNode.leafs[currentPart] = await this.setLeaf(node, nextPart, currentNode.leafs[currentPart]);

    return currentNode;
  }

  async findRoot(path) {
    if (!this.root || !this.root.leafs) {
      return Result.fail('Pasta inicial nao encontrada ou ela esta vazia');
    }

    const parts = path.split('/').slice(1);
    let currentNode = this.root;

    for (const part of parts) {
      if (!currentNode.leafs || !currentNode.leafs[part]) {
        return Result.fail('Pasta nao encontrada');
      }

      currentNode = currentNode.leafs[part];
    }

    return Result.ok(currentNode);
  }
}