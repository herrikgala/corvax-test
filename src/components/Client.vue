<template>
  <h2>Client</h2>
  <Suspense>
    <template #default>
      <div>
        <component :is="dynamicComponent" />
      </div>
    </template>
    <template #fallback>
      <div>
        <div style="color: red; font-size: 36px">Loading...</div>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent, ref, watchEffect, watch, shallowRef, reactive, toRefs } from 'vue';
import axios from 'axios';
import defaultTemplate from '../default.json'

const dynamicComponent = shallowRef(null);

const data = reactive({
  imageUrl: '',
  cardTitle: '',
  cardText: ''
});

const fetchSettingsAndData = async () => {
  // Fetch settings and data from API
  const templateResponse = await axios.get('api/template');
  const dataResponse = await axios.get('api/data');

  // NOTE: changing to default settings if not found in template.json
  if (!templateResponse.data.template || !templateResponse.data.style) {
    templateResponse.data.template = defaultTemplate.template;
    templateResponse.data.style = defaultTemplate.style;
  }
  attachStyle(templateResponse.data.style);

  data.imageUrl = dataResponse.data.imageUrl;
  data.cardTitle = dataResponse.data.cardTitle;
  data.cardText = dataResponse.data.cardText;

  // Create dynamic component
  dynamicComponent.value = defineAsyncComponent(() => {
    return new Promise((resolve, reject) => {
      resolve({
        template: templateResponse.data.template,
        data() {
          return {
            ...toRefs(data),
          };
        },
      })
    })
  })
};
function attachStyle(style) {
  // Create a new style element
  const styleElement = document.createElement('style');

  // Set the innerHTML of the style element to the style text
  styleElement.innerHTML = style;

  // Append the style element to the head of the document
  document.head.appendChild(styleElement);
}
watchEffect(() => {
  fetchSettingsAndData();
});

</script>