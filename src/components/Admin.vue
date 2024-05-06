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
        <Card @load="handleLoad" :refresh="refresh"/>
    </div>
</template>

<script setup>
import {  ref } from 'vue';
import axios from 'axios';
import Card from './Card.vue';

const templateCode = ref('');
const styleCode = ref('');

const refresh = ref(false);

function handleLoad(template, style){
    templateCode.value = template;
    styleCode.value = style;
}

async function saveTemplate() {
    try {
        await postSettngs(templateCode.value, styleCode.value);
        refresh.value = !refresh.value;
    } catch (error) {
        console.log(error);
    }
}
const postSettngs = async (template, style) => {
    return await axios.post('api/template', {
        template,
        style
    });
};

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