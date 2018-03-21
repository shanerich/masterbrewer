<template>
    <div>
        <div class="row">
            <div v-for="brewery of breweriesObj"
                 :key="brewery['.key']"
                 class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                <card>
                <div class="text-center">
                    <code>{{brewery.brewery_name}}</code>
                </div>
                </card>
            </div>
        </div>
    </div>
</template>

<script>
import { breweries } from 'src/util/firebase'

export default {
    firebase: {
        breweriesObj: breweries
    }
}
</script>

<style scoped>

</style>
