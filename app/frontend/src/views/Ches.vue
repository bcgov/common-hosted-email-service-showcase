<template>
  <v-container>
    <BaseSecure>
      <h1 class="my-6 text-center">CHES</h1>
      <healthCheck />
      <email />
    </BaseSecure>
  </v-container>
</template>

<script>
import healthCheck from '@/components/ches/healthCheck';
import email from '@/components/ches/email';

export default {
  name: 'Ches',
  components: {
    healthCheck,
    email
  }
};
</script>
