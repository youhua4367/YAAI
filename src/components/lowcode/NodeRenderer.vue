<template>
  <component
    v-if="!renderFailed"
    :is="targetComponent"
    v-bind="bindProps"
    :style="parsedStyle"
  >
    <template v-if="isContainer">
      <NodeRenderer
        v-for="child in node.children"
        :key="child.id"
        :node="child"
      />
    </template>
  </component>
  <UnknownComponent
    v-else
    :component-key="node.componentKey ?? undefined"
    :node-name="node.nodeName ?? undefined"
  />
</template>

<script setup lang="ts">
import { computed, onErrorCaptured, ref, watch } from 'vue'
import type { PageNodeTreeNode } from '@/types/lowcode'
import { safeJsonParse } from '@/utils/safeJsonParse'
import { getComponentByKey, isContainerNode, isKnownComponentKey } from '@/components/lowcode/component-map'
import UnknownComponent from '@/components/lowcode/UnknownComponent.vue'
import NodeRenderer from '@/components/lowcode/NodeRenderer.vue'

const props = defineProps<{
  node: PageNodeTreeNode
}>()

const renderFailed = ref(false)

watch(
  () => props.node.id,
  () => {
    renderFailed.value = false
  }
)

onErrorCaptured((err) => {
  console.warn(
    '[lowcode] NodeRenderer failed:',
    props.node.componentKey,
    props.node.nodeName,
    err
  )
  renderFailed.value = true
  return false
})

const parsedProps = computed(() =>
  safeJsonParse<Record<string, unknown>>(props.node.propsJson, {})
)

const parsedStyle = computed(() =>
  safeJsonParse<Record<string, string>>(props.node.styleJson, {})
)

const parsedLayout = computed(() =>
  safeJsonParse<Record<string, unknown>>(props.node.layoutJson, {})
)

const targetComponent = computed(() => getComponentByKey(props.node.componentKey))

const isContainer = computed(() => isContainerNode(props.node))

const bindProps = computed(() => {
  if (!isKnownComponentKey(props.node.componentKey)) {
    return {
      componentKey: props.node.componentKey ?? undefined,
      nodeName: props.node.nodeName ?? undefined
    }
  }

  return {
    ...parsedProps.value,
    layout: parsedLayout.value,
    dataBindingId: props.node.dataBindingId ?? undefined
  }
})
</script>
