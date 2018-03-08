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
                                placeholder="Brewery Name">
                        </fg-input>
                        <label>Brewery Type</label><br>
                        <el-select class="brewery-type" 
                                   size="large"
                                   placeholder="Brewery Type"
                                   v-model="selects.type">
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
                                   placeholder="Brewery Country"
                                   v-model="selects.country">
                            <el-option v-for="option in selects.countries"
                                        class="select-warning"
                                        :value="option.value"
                                        :label="option.label"
                                        :key="option.value">
                            </el-option>
                        </el-select>
                        <span v-if="selects.country === 'us'">
                            <fg-input label="Address"
                                    type="text"
                                    placeholder="Street Address">
                            </fg-input>
                            <span class="row">
                                <fg-input label="City"
                                        class="col-sm-4"
                                        type="text"
                                        placeholder="City Name">
                                </fg-input>
                                <span class="col-sm-4">
                                <label>State</label>
                                <el-select size="large"
                                        placeholder="State Name"
                                        readonly="!readonly"
                                        v-model="selects.state">
                                    <el-option v-for="option in selects.states"
                                                class="select-warning"
                                                :value="option.value"
                                                :label="option.label"
                                                :key="option.value">
                                    </el-option>
                                </el-select>
                                </span>
                                <fg-input label="Zip"
                                        class="col-sm-4"
                                        type="text"
                                        placeholder="Zip Code">
                                </fg-input>
                            </span>
                        </span>
                        <fg-input label="Brewery Description">
                            <textarea class="form-control" placeholder="Brewery Description" rows="3"></textarea>
                        </fg-input>
                    </div>
                    
                    <div class="col-2">
                        <label>Verified</label><br>
                        <l-switch v-model="switches.withIconsOff">
                            <i class="fa fa-times" slot="off"></i>
                        </l-switch>
                    </div>
                    </div>
                </form>
                <div class="row">
                    <div class="col-md-12">
                    <button type="submit" class="btn btn-fill btn-warning">
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
            switches: {
                withIconsOn: true,
                withIconsOff: false
            },
            selects: {
                type: '',
                country: '',
                state: '',
                types: [
                {value: 'macro', label: 'Macro Brewery (Greater than 6M Barrels / Year)'},
                {value: 'micro', label: 'Micro Brewery (Less than 6M Barrels / Year)'},
                {value: 'nano', label: 'Nano Brewery (Less than 200 Gallons / Year, Sells Commercially)'},
                {value: 'brewpub', label: 'Brew Pub (Brews / Sells on Premise, at least 25%)'},
                {value: 'collab', label: 'Collaboration Brewery (Two breweries brewing where there is no host brewery)'},
                {value: 'cidery', label: 'Cidery / Meadery (Produces Ciders or Meads)'}
                ],
                countries: [
                {value: 'us', label: 'Unites States'},
                {value: 'china', label: 'China'},
                {value: 'japan', label: 'Japan'}
                ],
                states: [
                {value: 'AL', label: 'Alabama'},
                {value: 'AK', label: 'Alaska'},
                {value: 'AZ', label: 'Arizona'},
                {value: 'AR', label: 'Arkansas'},
                {value: 'CA', label: 'California'},
                {value: 'CO', label: 'Colorado'},
                {value: 'CT', label: 'Connecticut'},
                {value: 'DC', label: 'District of Columbia'},
                {value: 'DE', label: 'Delaware'},
                {value: 'FL', label: 'Florida'},
                {value: 'GA', label: 'Georgia'},
                {value: 'HI', label: 'Hawaii'},
                {value: 'ID', label: 'Idaho'},
                {value: 'IL', label: 'Illinois'},
                {value: 'IN', label: 'Indiana'},
                {value: 'IA', label: 'Iowa'},
                {value: 'KS', label: 'Kansas'},
                {value: 'KY', label: 'Kentucky'},
                {value: 'LA', label: 'Louisiana'},
                {value: 'ME', label: 'Maine'},
                {value: 'MD', label: 'Maryland'},
                {value: 'MA', label: 'Massachusetts'},
                {value: 'MI', label: 'Michigan'},
                {value: 'MN', label: 'Minnesota'},
                {value: 'MS', label: 'Mississippi'},
                {value: 'MO', label: 'Missouri'},
                {value: 'MT', label: 'Montana'},
                {value: 'NE', label: 'Nebraska'},
                {value: 'NV', label: 'Nevada'},
                {value: 'NH', label: 'New Hampshire'},
                {value: 'NJ', label: 'New Jersey'},
                {value: 'NM', label: 'New Mexico'},
                {value: 'NY', label: 'New York'},
                {value: 'NC', label: 'North Carolina'},
                {value: 'ND', label: 'North Dakota'},
                {value: 'OH', label: 'Ohio'},
                {value: 'OK', label: 'Oklahoma'},
                {value: 'OR', label: 'Oregon'},
                {value: 'PA', label: 'Pennsylvania'},
                {value: 'RI', label: 'Rhode Island'},
                {value: 'SC', label: 'South Carolina'},
                {value: 'SD', label: 'South Dakota'},
                {value: 'TN', label: 'Tennessee'},
                {value: 'TX', label: 'Texas'},
                {value: 'UT', label: 'Utah'},
                {value: 'VT', label: 'Vermont'},
                {value: 'VA', label: 'Virginia'},
                {value: 'WA', label: 'Washington'},
                {value: 'WV', label: 'West Virginia'},
                {value: 'WI', label: 'Wisconsin'},
                {value: 'WY', label: 'Wyoming'}
                ]
            }
        }
    }
}
</script>

<style scoped>
.brewery-type, .brewery-country {
    margin-bottom: 1rem;
    width: 100%;
}
</style>