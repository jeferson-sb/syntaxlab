<script setup lang="ts">
import { computed } from 'vue';

import type { Block } from '@/types/block';
import type { Connection } from '@/types/connection';

const props = defineProps<{
  blocks: Block[];
  conn: Connection;
}>()

const coords = computed(() => {
  const fromBlock = props.blocks.find(b => b.id === props.conn.fromBlockId)
  const toBlock = props.blocks.find(b => b.id === props.conn.toBlockId)

  if (!fromBlock || !toBlock) {
    return { x1: 0, y1: 0, x2: 0, y2: 0, mx: 0, my: 0 }
  }

  const x1 = fromBlock.x + 120;
  const y1 = fromBlock.y + 80;
  const x2 = toBlock.x + 120;
  const y2 = toBlock.y + 80;
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - 50;

  return { x1, y1, x2, y2, mx, my };
})

</script>

<template>
  <path
    :d="`M ${coords.x1} ${coords.y1} C ${coords.x1} ${coords.my}, ${coords.x2} ${coords.my}, ${coords.x2} ${coords.y2}`"
    stroke-width="2.5" fill="none" stroke-dasharray="6,4" stroke="var(--blue-5)" opacity="0.7" />

</template>
