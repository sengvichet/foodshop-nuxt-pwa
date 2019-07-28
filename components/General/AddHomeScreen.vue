<template>
    <div class="add-home-content">
        <span class="add-home-text">Install this webapp to your iPhone: tap <img class="add-home-icon" src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/upload-512.png"/> and then Add to homescreen</span>
    </div>
</template>

<script>
    export default {
        name: 'AddHomeScreen'
    }
</script>

<style>
    .add-home-content {
        width: 100%;
        height: auto;
        text-align: center;
        padding: 15px;
        background: #414241d0;
        margin: auto;
        border-radius: 19px;
        position: fixed;
        bottom: 0px;
    }

    .add-home-text {
        font-size: 14px;
        color: white;
    }

    .add-home-icon {
        width: 20px;
        height: auto;
    }
</style>