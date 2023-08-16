declare namespace Analyser {
  type treeObjectNodeList = {
    dependencies: treeObjectNode
    devDependencies: treeObjectNode
    version: string
  }
  type treeMapNode = Map<treeObjectNode, treeAnalyser>
  type treeAnalyser = Map<string, treeMapNode | treeObjectNode>
  type treeObjectNode = {
    [key: string]: string
  }
}
