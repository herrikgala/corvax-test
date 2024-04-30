<template>
    <h2>Admin</h2>
    <div class="admin-wrapper">
        <div class="editing-wrapper">
            <label for="vuejscode">Vue js code</label>
            <textarea id="vuejscode" v-model="templateCode"></textarea>

            <label for="styleCode">CSS code</label>
            <textarea id="styleCode" v-model="styleCode"></textarea>

            <button @click="saveTemplate" class="save-button">Save</button>
        </div>
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
    </div>
</template>

<script setup>
import { defineAsyncComponent, ref, watchEffect, watch, shallowRef, reactive, toRefs, computed } from 'vue';
import axios from 'axios';
import defaultTemplate from '../default.json'

// START: For admin
const templateCode = ref('');
const styleCode = ref('');
// END: For admin


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
    templateCode.value = templateResponse.data.template;
    styleCode.value = templateResponse.data.style;

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
            })
        })
    })
};

async function saveTemplate() {
    try {
        await postSettngs(templateCode.value, styleCode.value);
        // TODO: this is place to improve but it's just for demo so performance is not a big deal
        fetchSettingsAndData();
    } catch (error) {
        console.log(error);
    }
}
const postSettngs = async (template, style) => {
    return await axios.post('api/template', {
        template,
        style
    });
}

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

<style scoped lang="css">
.admin-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.editing-wrapper {
    width: 50%;
    flex-grow: 1;
    flex-shrink: 0;
}

.editing-wrapper>textarea {
    display: block;
    width: 100%;
    margin: 0.5rem 0;
    min-height: 200px;
    padding: 0.5rem;
    resize: none;
    box-sizing: border-box;
}

.save-button {
    margin: 0.5rem 0;
    padding: 0.5rem;
    background-color: purple;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 0.2rem;
}
</style>