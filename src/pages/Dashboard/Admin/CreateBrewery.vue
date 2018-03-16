<template>
    <div class="row">
        <div class="col-md-12">
            <card class="horizontal-form" title="Horizontal Form">
                <template slot="header">
                    <h4 class="card-title">
                    Create Brewery
                    </h4>
                </template>
                <form action="#" method="#" @submit.prevent>
                    <div class="row">
                    <div class="col-8">
                        <fg-input label="Brewery Name"
                                type="text"
                                v-model="brewery_name">
                        </fg-input>
                        <label>Brewery Type</label><br>
                        <el-select class="brewery-type" 
                                   size="large"
                                   v-model="brewery_type">
                            <el-option v-for="option in selects.types"
                                        class="select-warning"
                                        :value="option.value"
                                        :label="option.label"
                                        :key="option.value">
                            </el-option>
                        </el-select>
                        <label>Brewery Country</label><br>
                        <el-select class="brewery-country" 
                                   size="large"
                                   v-model="country_name">
                            <el-option v-for="option in selects.countries"
                                        class="select-warning"
                                        :value="option.value"
                                        :label="option.label"
                                        :key="option.value">
                            </el-option>
                        </el-select>
                        <span v-if="country_name === 'United States'">
                            <span class="row">
                                <fg-input label="City"
                                        class="col-sm-4"
                                        type="text"
                                        v-model="brewery_city">
                                </fg-input>
                                <span class="col-sm-4">
                                <label>State</label>
                                <el-select size="large"
                                        v-model="brewery_state">
                                    <el-option v-for="option in selects.states"
                                                class="select-warning"
                                                :value="option.value"
                                                :label="option.label"
                                                :key="option.label">
                                    </el-option>
                                </el-select>
                                </span>
                            </span>
                        </span>
                        <fg-input label="Brewery Description">
                            <textarea v-model="brewery_description" class="form-control" rows="3"></textarea>
                        </fg-input>
                    </div>
                    
                    <div class="col-2">
                        <label>Verified</label><br>
                        <l-switch v-model="brewery_verified">
                            <i class="fa fa-times" slot="off"></i>
                        </l-switch>
                    </div>
                    </div>
                </form>
                <div class="row">
                    <div class="col-md-12">
                    <button @click="createBrewery()" type="submit" class="btn btn-fill btn-warning">
                        CREATE
                    </button>
                    </div>
                </div>
            </card>
        </div>
    </div>
</template>

<script>
import { Input, Button, Select, Option } from 'element-ui'
import { 
    Switch as LSwitch,
    FormGroupInput as FgInput
} from 'src/components/index'
import { breweries } from 'src/util/firebase'
import swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.css'

export default {
    components: {
        FgInput,
        [Input.name]: Input,
        [Button.name]: Button,
        [Select.name]: Select,
        [Option.name]: Option,
        LSwitch
    },
    data () {
        return {
            brewery_name: '',
            brewery_type: '',
            country_name: '',
            brewery_city: '',
            brewery_state: '',
            brewery_description: '',
            brewery_verified: false,
            switches: {
                withIconsOn: true,
                withIconsOff: false
            },
            selects: {
                types: [
                {value: 'Macro Brewery', label: 'Macro Brewery (Greater than 6M Barrels / Year)'},
                {value: 'Micro Brewery', label: 'Micro Brewery (Less than 6M Barrels / Year)'},
                {value: 'Nano Brewery', label: 'Nano Brewery (Less than 200 Gallons / Year, Sells Commercially)'},
                {value: 'Brew Pub', label: 'Brew Pub (Brews / Sells on Premise, at least 25%)'},
                {value: 'Collaboration Brewery', label: 'Collaboration Brewery (Two breweries brewing where there is no host brewery)'},
                {value: 'Cidery / Meadery', label: 'Cidery / Meadery (Produces Ciders or Meads)'}
                ],
                countries: [
                {value: 'United States', label: 'United States'},
                {value: 'China', label: 'China'},
                {value: 'Japan', label: 'Japan'}
                ],
                states: [
                {value: 'Alabama', label: 'Alabama'},
                {value: 'Alaska', label: 'Alaska'},
                {value: 'Arizona', label: 'Arizona'},
                {value: 'Arkansas', label: 'Arkansas'},
                {value: 'California', label: 'California'},
                {value: 'Colorado', label: 'Colorado'},
                {value: 'Connecticut', label: 'Connecticut'},
                {value: 'District of Columbia', label: 'District of Columbia'},
                {value: 'Delaware', label: 'Delaware'},
                {value: 'Florida', label: 'Florida'},
                {value: 'Georgia', label: 'Georgia'},
                {value: 'Hawaii', label: 'Hawaii'},
                {value: 'Idaho', label: 'Idaho'},
                {value: 'Illinois', label: 'Illinois'},
                {value: 'Indiana', label: 'Indiana'},
                {value: 'Iowa', label: 'Iowa'},
                {value: 'Kansas', label: 'Kansas'},
                {value: 'Kentucky', label: 'Kentucky'},
                {value: 'Louisiana', label: 'Louisiana'},
                {value: 'Maine', label: 'Maine'},
                {value: 'Maryland', label: 'Maryland'},
                {value: 'Massachusetts', label: 'Massachusetts'},
                {value: 'Michigan', label: 'Michigan'},
                {value: 'Minnesota', label: 'Minnesota'},
                {value: 'Mississippi', label: 'Mississippi'},
                {value: 'Missouri', label: 'Missouri'},
                {value: 'Montana', label: 'Montana'},
                {value: 'Nebraska', label: 'Nebraska'},
                {value: 'Nevada', label: 'Nevada'},
                {value: 'New Hampshire', label: 'New Hampshire'},
                {value: 'New Jersey', label: 'New Jersey'},
                {value: 'New Mexico', label: 'New Mexico'},
                {value: 'New York', label: 'New York'},
                {value: 'North Carolina', label: 'North Carolina'},
                {value: 'North Dakota', label: 'North Dakota'},
                {value: 'Ohio', label: 'Ohio'},
                {value: 'Oklahoma', label: 'Oklahoma'},
                {value: 'Oregon', label: 'Oregon'},
                {value: 'Pennsylvania', label: 'Pennsylvania'},
                {value: 'Rhode Island', label: 'Rhode Island'},
                {value: 'South Carolina', label: 'South Carolina'},
                {value: 'South Dakota', label: 'South Dakota'},
                {value: 'Tennessee', label: 'Tennessee'},
                {value: 'Texas', label: 'Texas'},
                {value: 'Utah', label: 'Utah'},
                {value: 'Vermont', label: 'Vermont'},
                {value: 'Virginia', label: 'Virginia'},
                {value: 'Washington', label: 'Washington'},
                {value: 'West Virginia', label: 'West Virginia'},
                {value: 'Wisconsin', label: 'Wisconsin'},
                {value: 'Wyoming', label: 'Wyoming'}
                ]
            }
        }
    },
    methods: {
        createBrewery() {
            var _this = this;
            breweries.push({
                brewery_name: _this.brewery_name,
                brewery_type: _this.brewery_type,
                country_name: _this.country_name,
                brewery_city: _this.brewery_city,
                brewery_state: _this.brewery_state,
                brewery_description: _this.brewery_description,
                brewery_verified: _this.brewery_verified
            }, function(error) {
                if (error) {
                    console.log('An error has occurred')
                } else {
                    _this.showSwal()
                    _this.brewery_name = ''
                    _this.brewery_type = ''
                    _this.country_name = ''
                    _this.brewery_city = ''
                    _this.brewery_state = ''
                    _this.brewery_description = ''
                    _this.brewery_verified = false;
                }
            })
        },
        showSwal() {
            swal({
                title: `Brewery Created!`,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning btn-fill',
                type: 'success'
            })
        }
    }
}
</script>

<style scoped>
.brewery-type, .brewery-country {
    margin-bottom: 1rem;
    width: 100%;
}
textarea {
    height: 78px;
}
</style>
