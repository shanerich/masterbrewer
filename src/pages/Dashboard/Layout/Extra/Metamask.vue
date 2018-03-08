<template>
    <span>{{ web3.coinbase | sliceNeg7 }}</span>
</template>
<script>
export default {
    name: 'metamask',
    computed: {
        web3 () {
            return this.$store.state.web3
        },
    },
    filters: {
        sliceNeg7: function (value) {
            return (!value ? '' : value.slice(-7))
        }
    }
}
</script>
<style scoped>
</style>