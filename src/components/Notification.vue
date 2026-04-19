<template>
    <div v-if="notifications.length" class="notifications">
        <div
          v-for="notification in notifications"
            :key="notification.id"
            :class="['notification', notification.type]"
            role="alert"
        >
            <span>{{ notification.text }}</span>
            <button type="button" @click="clear(notification.id)">
                x
            </button>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        notifications() {
            return this.$store.state.notifications
        },
    },

    methods: {
        clear(notificationId) {
            this.$store.dispatch('hideNotification', notificationId)
        }
    }
}
</script>

<style scoped>
.notifications {
    /* display: grid;
    padding-bottom: 16px; */
    position: fixed;
    top: 90px;
    left: 16px;
    z-index: 1000;
    display: grid;
    width: min(620px, calc(100vw - 32px));
}
.notification {
    display: flex;
    font-size: 12px;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
    border-radius: 12px;
    border: 1px solid #606060;
    padding: 8px 10px;
}

.notification.error {
    background: #fde8e8;
    color: #8a1c1c;
}

.notification.success {
    background: #e4f5ef;
    color: #14523f;
}

.notification.info {
    background: #e8f0fd;
    color: #1d3f75;
}

.notification button {
    border: none;
    background: transparent;
    color: inherit;
    padding: 0 5px;
}
</style>
