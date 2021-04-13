<template>
  <v-container class="pt-15">
    <BaseSecure>
      <!-- tabs -->
      <v-tabs v-model="tab">
        <v-tab v-for="tab in tabs" :key="tab.index" :to="tab.route">
          {{ tab.name }}
        </v-tab>

        <!-- health check -->
        <healthCheck class="healthButton" />
      </v-tabs>

      <!-- tab content -->
      <router-view />
    </BaseSecure>
  </v-container>
</template>

<script>
import healthCheck from '@/components/ches/healthCheck';
export default {
  name: 'Email',
  components: {
    healthCheck,
  },
  data: () => ({
    tab: 0,
    tabs: [
      { index: 0, name: 'Email', route: '/email/form' },
      { index: 1, name: 'History', route: '/email/history' },
    ],
  }),
};
</script>

<style scoped>

.v-tabs >>> .v-tabs-bar {
  height: 3.5rem;
  border-bottom: 1px solid #272626;
}

.v-tabs >>> a.v-tab {
  background-color: #f2f2f2;
  text-transform: none;
  margin-right: 3px;
}

.v-tabs >>> a.v-tab--active {
  color: #272626;
  border: 1px solid #272626;
  border-bottom: 1px solid #fff;
  background-color: #fff;
  font-weight: bold;
}

.v-tabs >>> .v-tabs-slider-wrapper {
  display: none;
}

.healthButton{
  position: absolute;
  right: 0;
}
</style>
