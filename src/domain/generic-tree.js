import { FolderBase } from './folder-base.js';

export class GenericTree {
  constructor() {
    this.root = new FolderBase();
  }

  setRoot(node) {
    this.root = node;
  }

  getRoot() {
    return this.root;
  }

  addNode(node) {
    if (!this.root.leafs) {
      this.root.leafs = new Map();
    }

    this.root.leafs[node.name] = node;
  }

  findNode(path) {
    if (!this.root || !this.root.leafs) {
      return null;
    }

    const parts = path.split('/');
    let currentNode = this.root;

    for (const part of parts) {
      if (!currentNode.leafs || !currentNode.leafs[part]) {
        return null; 
      }

      currentNode = currentNode.leafs[part];
    }

    return currentNode;
  }
}