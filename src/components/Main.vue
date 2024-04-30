<template>
  <Suspense>
    <template #default>
      <component :is="dynamicComponent" />
    </template>
    <template #fallback>
      <div style="color: red; font-size: 36px">Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent, ref, watchEffect, watch, shallowRef, reactive, toRefs } from 'vue';
import axios from 'axios';

const dynamicComponent = shallowRef(null);
const isLoading = ref(true);

const data = reactive({
  imageUrl: 'asd',
  cardTitle: 'asd',
  cardText: ''
});

const fetchSettingsAndData = async () => {
  // Fetch settings and data from API
  const settingsResponse = await axios.get('api/template');
  const templateResponse = settingsResponse.data.templates[0];
  const dataResponse = await axios.get('api/data');

  data.imageUrl = dataResponse.data.imageUrl;
  data.cardTitle = dataResponse.data.cardTitle;
  data.cardText = dataResponse.data.cardText;
  isLoading.value = false;

  // Create dynamic component
  dynamicComponent.value = defineAsyncComponent(() => {
    return new Promise((resolve, reject) => {
      resolve({
        template: templateResponse.template,
        data() {
          return {
            ...toRefs(data),
            isLoading
          };
        },
      })
    })
  })
};

watchEffect(() => {
  fetchSettingsAndData();
});

watch(data, (newData) => {
  if (newData) {
    console.log(newData);
  } else {
    console.log('Loaded!');
  }
});
</script>