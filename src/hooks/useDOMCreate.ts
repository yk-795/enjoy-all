import { onUnmounted } from 'vue'
// 创建DOM节点
function useDOMCreate (nodeID: string) {
  const node = document.createElement('div')
  node.id = nodeID
  document.body.appendChild(node)
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}

export default useDOMCreate
