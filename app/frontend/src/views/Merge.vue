<template>
  <v-container class="pt-10">
    <BaseSecure>
      <!-- alert / message area -->
      <v-alert dense text v-if="alert" :type="alert.type" class="mb-5">
        <span v-html="alert.text" />
      </v-alert>

      <!-- tabs -->
      <v-tabs v-model="tab" class="pt-0">
        <v-tab v-for="tab in tabs" :key="tab.index" :to="tab.route">
          {{ tab.name }}
        </v-tab>

        <!-- health check -->
        <HealthCheck class="healthButton" />
      </v-tabs>

      <!-- tab content -->
      <router-view />
    </BaseSecure>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import HealthCheck from '@/components/ches/HealthCheck';

export default {
  name: 'Merge',
  components: {
    HealthCheck,
  },
  data: () => ({
    tab: 0,
    tabs: [
      { index: 0, name: 'About', route: '/merge/about' },
      { index: 1, name: 'Merge', route: '/merge/send' },
      { index: 2, name: 'History', route: '/merge/history' },
    ],
  }),

  computed: {
    ...mapGetters('alert', ['alert']),
  },
};
</script>

<style scoped>
.v-tabs >>> .v-tabs-bar {
  height: 3rem;
}
.v-tabs >>> .v-slide-group__content {
  border-bottom: 1px solid #606060;
}
.v-tabs >>> .v-tabs-slider-wrapper {
  display: none;
}
.v-tabs >>> a.v-tab {
  background-color: #f2f2f2;
  color: #1a5a96 !important;
  text-transform: none;
  margin-right: 3px;
  border-radius: 3px 3px 0 0;
}
.v-tabs >>> a.v-tab--active {
  color: #272626 !important;
  border: 1px solid #606060;
  background-color: #fff;
  font-weight: bold;
  margin-bottom: -1px;
}
.healthButton {
  position: absolute;
  right: 0;
}
</style>
