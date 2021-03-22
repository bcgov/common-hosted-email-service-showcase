<template>
  <v-container>
    <BaseSecure>
      <h1 class="my-6 text-center">CHES</h1>
      <healthCheck />
    </BaseSecure>
  </v-container>
</template>

<script>
import healthCheck from '@/components/ches/healthCheck';

export default {
  name: 'Ches',
  components: {
    healthCheck
  }
};
</script>
