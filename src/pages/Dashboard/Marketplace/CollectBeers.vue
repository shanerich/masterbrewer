<template>
    <div>
        <div class="row">
            <div class="col-12">
                <card title="Beer Cards">
                    <div>
                        <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
                            <el-select
                            class="select-default mb-3"
                            style="width: 200px"
                            v-model="pagination.perPage"
                            placeholder="Per page">
                                <el-option
                                    class="select-default"
                                    v-for="item in pagination.perPageOptions"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                            <el-input type="search"
                                    class="mb-3"
                                    style="width: 275px"
                                    placeholder="Search Beer Name"
                                    v-model="searchQuery"
                                    aria-controls="datatables"/>
                        </div>
                        <div class="col-12 d-flex flex-wrap">
                            <div v-for="beer in queriedData"
                                :key="beer['.key']"
                                class="col-4">
                                <card>
                                    <img :src="beer.beer_imgUrl" alt="Beer Logo" class="beer-logo">
                                    <div class="beer-name">{{beer.beer_name}}</div>
                                    <div class="beer-brewery">{{beer.beer_brewery_name}}</div>
                                    <div class="beer-style">{{beer.beer_style}}</div>
                                    <button type="submit" class="btn btn-fill btn-info collect-btn">Collect &emsp; 0.002 <img class="eth" src="../../../../static/img/eth.png"></button>
                                </card>
                            </div>
                        </div>
                    </div>
                <div slot="footer" class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
                    <div class="">
                        <p class="card-category">Showing {{from + 1}} to {{to}} of {{total}} entries</p>
                    </div>
                    <l-pagination class="pagination-no-border" color="orange"
                                    v-model="pagination.currentPage"
                                    :per-page="pagination.perPage"
                                    :total="pagination.total">
                    </l-pagination>
                    </div>
                </card>
            </div>
        </div>
    </div>
</template>

<script>
import { Input, Select, Option } from 'element-ui'
import { beers } from 'src/util/firebase'
import {Pagination as LPagination} from 'src/components/index'
import Fuse from 'fuse.js'


export default {
    components: {
        LPagination,
        [Input.name]: Input,
        [Select.name]: Select,
        [Option.name]: Option,
    },
    firebase: {
        _beers: beers,
    },
    data () {
        return {
            pagination: {
                perPage: 6,
                currentPage: 1,
                perPageOptions: [6, 12, 18],
                total: 0
            },
            searchQuery: '',
            propsToSearch: ['beer_name'],
            fuseSearch: null,
        }
    },
    computed: {
        pagedData () {
            return this._beers.slice(this.from, this.to)
        },
        queriedData () {
            let result = this._beers
            if (this.searchQuery !== '') {
                result = this.fuseSearch.search(this.searchQuery)
                this.pagination.total = result.length
            }
            return result.slice(this.from, this.to)
        },
        to () {
            let highBound = this.from + this.pagination.perPage
            if (this.total < highBound) {
            highBound = this.total
            }
            return highBound
        },
        from () {
            return this.pagination.perPage * (this.pagination.currentPage - 1)
        },
        total () {
            this.pagination.total = this._beers.length
            return this._beers.length
        }
    },
    mounted () {
      this.fuseSearch = new Fuse(this._beers, {keys: ['beer_name']})
    }
}

</script>

<style scoped>
.card {
    width: 100%;
    position: relative;
    margin: 39px 0;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.beer-logo {
    width: 100%;
    position: relative;
    overflow: hidden;
    margin-top: -39px;
    border-radius: 6px;
    box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
}
.beer-name {
    font-size: 15px;
    text-align: left;
    width: 100%;
    color: #333;
    padding: 21px 0 0 0;
    font-weight: 600;
    line-height:19px;
}
.beer-brewery {
    font-size: 13px;
    line-height: 13px;
}
.beer-style {
    font-size: 13px;
    font-style: italic;
}
.collect-btn {
    width: 100%;
    text-align: center;
    margin: 15px 0 7px 0;
}
.btn-info {
    border: 1px solid #0E65F9;
    background-color: #0E65F9;
}
.eth {
    margin-top: -2px;
}

</style>