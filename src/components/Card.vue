<template>
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
import {
  defineAsyncComponent,
  watchEffect,
  shallowRef,
  reactive,
  toRefs,
} from "vue";
import axios from "axios";
import defaultTemplate from "../default.json";

const props = defineProps({
  refresh: Boolean,
})

const emit = defineEmits(['load'])


const dynamicComponent = shallowRef(null);

const data = reactive({
  imageUrl: "",
  cardTitle: "",
  cardText: "",
});

const fetchSettingsAndData = async () => {
  // Fetch settings and data from API
  const templateResponse = await axios.get("api/template");
  const dataResponse = await axios.get("api/data");

  // NOTE: changing to default settings if not found in template.json
  if (!templateResponse.data.template || !templateResponse.data.style) {
    templateResponse.data.template = defaultTemplate.template;
    templateResponse.data.style = defaultTemplate.style;
  }
  attachStyle(templateResponse.data.style);

  // Note: emitting style and template to a parent component to share with code for <Admin/>
  emit('load', templateResponse.data.template, templateResponse.data.style)

  // Setting data
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
      });
    });
  });
};

function attachStyle(style) {
  // Create a new style element
  const styleElement = document.createElement("style");

  // Set the innerHTML of the style element to the style text
  styleElement.innerHTML = style;

  // Append the style element to the head of the document
  document.head.appendChild(styleElement);
}
watchEffect(() => {
    props.refresh
    fetchSettingsAndData();
});
</script>

