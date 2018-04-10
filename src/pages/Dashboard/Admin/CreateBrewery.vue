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
                                <el-option v-for="option in breweryTypes"
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
                                <el-option v-for="option in breweryCountries"
                                            class="select-warning"
                                            :value="option.value"
                                            :label="option.label"
                                            :key="option.value">
                                </el-option>
                            </el-select>
                            <span>
                                <span class="row">
                                    <fg-input label="City"
                                            class="col-sm-4"
                                            type="text"
                                            v-model="brewery_city">
                                    </fg-input>
                                    <span class="col-sm-4" v-if="country_name === 'United States'">
                                    <label>State</label>
                                    <el-select size="large"
                                            v-model="brewery_state">
                                        <el-option v-for="option in breweryStates"
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
                            <label>Brewery Logo</label><br>
                            <el-upload
                                class="upload-demo"
                                ref="upload"
                                action=""
                                :http-request="handleAction"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-success="handleSuccess"
                                list-type="picture">
                                <el-button size="small" type="success">Click to upload</el-button>
                                <!-- <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div> -->
                            </el-upload>
                            <br>
                            <label>Partnered</label><br>
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
import { Input, Button, Select, Option, Upload } from 'element-ui'
import { 
    Switch as LSwitch,
    FormGroupInput as FgInput
} from 'src/components/index'
import breweryTypes from 'src/data/options/brewerytypes'
import breweryCountries from 'src/data/options/brewerycountries'
import breweryStates from 'src/data/options/brewerystates'
import { gs } from 'src/util/firebase'
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
        [Upload.name]: Upload,
        LSwitch
        
    },
    data () {
        return {
            brewery_name: '',
            brewery_imgUrl: '',
            brewery_type: '',
            country_name: '',
            brewery_city: '',
            brewery_state: '',
            brewery_description: '',
            brewery_partnered: false,
            brewery_file: null,
            gskey: '',
            switches: {
                withIconsOn: true,
                withIconsOff: false
            },
            breweryTypes: breweryTypes,
            breweryCountries: breweryCountries,
            breweryStates: breweryStates
        }
    },
    methods: {
        createBrewery() {
            //var _this = this;
            let imageUrl
            let key
            breweries.push({
                brewery_name: this.brewery_name,
                brewery_imgUrl: this.brewery_imgUrl,
                brewery_type: this.brewery_type,
                country_name: this.country_name,
                brewery_city: this.brewery_city,
                brewery_state: this.brewery_state,
                brewery_description: this.brewery_description,
                brewery_verified: this.brewery_verified
            })
            .then((data) => {
                key = data.key
                return key
            })
            .then(key => {
                const filename = this.brewery_file.name
                const ext = filename.slice(filename.lastIndexOf('.'))
                return gs.ref('breweries/' + key + ext).put(this.brewery_file) 
            })
            .then(fileData => {
                imageUrl = fileData.metadata.downloadURLs[0]
                return breweries.child(key).update({brewery_imgUrl: imageUrl})
            })
            .then(() => {
                this.showSwal()
                this.brewery_name = ''
                this.brewery_imgUrl = ''
                this.brewery_type = ''
                this.country_name = ''
                this.brewery_city = ''
                this.brewery_state = ''
                this.brewery_description = ''
                this.brewery_verified = false
                this.$refs.upload.clearFiles()
            })
            .catch((error) => {
                console.log(error)
            })
        },
        showSwal() {
            swal({
                title: `Brewery Created!`,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning btn-fill',
                type: 'success'
            })
        }, // file upload methods
        handleRemove(file, fileList) {
            console.log(file, fileList)
        },
        handlePreview(file) {
            console.log(file)
        },
        handleSuccess(response, file, fileList) {
            console.log(response)
            console.log(file)
            console.log(fileList)
        },
        handleAction(file) {
            //console.log(file.file)
            this.brewery_file = file.file
           
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
