import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';

import getRouter from '@/router';
import Performance from '@/views/Performance.vue';

const router = getRouter();
const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);

describe('Dashboard.vue', () => {
  let vuetify;
  let wrapper;

  beforeEach(() => {
    vuetify = new Vuetify();

    wrapper = mount(Performance, {
      mocks: {
        $config: {
          dashboardUrl: 'test url'
        }
      },
      localVue,
      router,
      vuetify
    });
  });

  it('renders', () => {
    expect(wrapper.html()).toContain('Performance Dashboard');
    expect(wrapper.find('iframe')).toBeTruthy();
  });
});
