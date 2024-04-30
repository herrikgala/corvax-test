<template>
    <h2>Admin</h2>
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

const dynamicComponent = shallowRef(null);
const isLoading = ref(true);

const data = reactive({
    imageUrl: '',
    cardTitle: '',
    cardText: ''
});

const fetchSettingsAndData = async () => {
    // Fetch settings and data from API
    const settingsResponse = await axios.get('api/template');
    const templateResponse = settingsResponse.data.templates[0];
    const dataResponse = await axios.get('api/data');

    attachStyle(templateResponse.style);

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