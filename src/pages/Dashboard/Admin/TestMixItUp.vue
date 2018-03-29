<template>
    <div>
        <div class="row">
            <div class="col-xl-6">
                <el-input placeholder="Filter by Name" v-model="filter"></el-input>
            </div>
            <div class="col-xl-3">
                <el-select v-model="selectedType" placeholder="Type Filter">
                    <el-option
                    v-for="btype in optionsType"
                    :label="btype.label"
                    :value="btype.value"
                    :key="btype.value">
                    </el-option>
                </el-select>
            </div>
            <div class="col-xl-3">
                <el-select v-model="selectedCountry" placeholder="Country Filter">
                    <el-option
                    v-for="country in optionsCountry"
                    :label="country.label"
                    :value="country.value"
                    :key="country.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <card title="Brewery Cards">
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
                                    placeholder="Search Brewery Name"
                                    v-model="searchQuery"
                                    aria-controls="datatables"/>
                        </div>
                        <div class="col-12 d-flex flex-wrap">
                            <div v-for="brewery in queriedData"
                                :key="brewery['.key']"
                                class="col-4">
                                <card>
                                <div class="text-center">
                                    <code>{{brewery.brewery_name}}</code>
                                </div>
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
import { breweries } from 'src/util/firebase'
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
        breweriesObj: breweries
    },
    data () {
        return {
            selectedType: '',
            selectedCountry: '',
            filter: '',
            sort: '',
            pagination: {
                perPage: 1,
                currentPage: 1,
                perPageOptions: [1, 2, 5],
                total: 0
            },
            searchQuery: '',
            propsToSearch: ['brewery_name'],
            fuseSearch: null,
            optionsType: [
                {label: 'Type Filter', value: ''},
                { label: 'Macro', value: 'macro_brewery' },
                { label: 'Micro', value: 'micro_brewery' },
            ],
            optionsCountry: [
                {label: 'Country Filter', value: ''},
                { label: 'United States', value: 'United States' },
                { label: 'Japan', value: 'Japan' },
            ]
        }
    },
    computed: {
        pagedData () {
            return this.breweriesObj.slice(this.from, this.to)
        },
        queriedData () {
            let result = this.breweriesObj
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
            this.pagination.total = this.breweriesObj.length
            return this.breweriesObj.length
        },
        getBreweries: function () {
            let filterType = this.selectedType,
                filterCountry = this.selectedCountry
            return this.breweriesObj.filter((brewery) => {
                let filtered = true
                if (filterType && filterType.length > 0) {
                    filtered = brewery.brewery_type == filterType
                }
                if (filtered) {
                    if(filterCountry && filterCountry.length > 0) {
                        filtered = brewery.country_name == filterCountry
                    }
                }
                return filtered
            })
        }
        /*
        getBreweries() {
      
            var breweriesList = this.breweriesObj.filter((brewery) => {
                return brewery.brewery_name.toLowerCase().includes(this.filter.toLowerCase());
            });
            var breweriesDrop = this.breweriesObj.sort((brewery) => {
                return brewery.brewery_type.toLowerCase().includes(this.sort.toLowerCase());
            });

            return breweriesList
            return breweriesDrop
        }*/
    },
    mounted () {
      this.fuseSearch = new Fuse(this.breweriesObj, {keys: ['brewery_name']})
    }
}

</script>

<style scoped>

</style>