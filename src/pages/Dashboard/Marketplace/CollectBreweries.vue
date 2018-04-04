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
                                    <img :src="brewery.brewery_imgUrl" alt="Brewery Logo" class="brewery-logo">
                                    <div class="brewery-name">{{brewery.brewery_name}}</div>
                                    <div class="brewery-location">{{brewery.brewery_city}}, {{brewery.brewery_state}}</div>
                                    <div class="brewery-type">{{brewery.brewery_type}}</div>
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
                perPage: 6,
                currentPage: 1,
                perPageOptions: [6, 12, 18],
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
.card {
    width: 100%;
    position: relative;
    margin: 39px 0;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.brewery-logo {
    width: 100%;
    position: relative;
    overflow: hidden;
    margin-top: -39px;
    border-radius: 6px;
    box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
}
.brewery-name {
    font-size: 15px;
    text-align: left;
    width: 100%;
    color: #333;
    padding: 21px 0 0 0;
    font-weight: 600;
    line-height:19px;
}
.brewery-location {
    font-size: 13px;
    line-height: 13px;
}
.brewery-type {
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