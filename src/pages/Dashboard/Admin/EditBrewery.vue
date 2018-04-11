<template>
     
    <div class="row">
        <div class="col-md-12">
            <card class="horizontal-form" title="Edit Brewery">
                <div class="row">
                    <div class="col-8">
                        <fg-input label="Brewery Name"
                                    type="text"
                                    v-model="brewery.brewery_name">
                        </fg-input>
                        <label>Brewery Type</label><br>
                        <el-select class="brewery-type" 
                                    size="large"
                                    v-model="brewery.brewery_type">
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
                                    v-model="brewery.country_name">
                            <el-option v-for="option in breweryCountries"
                                        class="select-warning"
                                        :value="option.value"
                                        :label="option.label"
                                        :key="option.value">
                            </el-option>
                        </el-select>
                        <span v-if="brewery.country_name === 'United States'">
                            <span class="row">
                                <fg-input label="City"
                                        class="col-sm-6"
                                        type="text"
                                        v-model="brewery.brewery_city">
                                </fg-input>
                                <span class="col-sm-6">
                                <label>State</label>
                                <el-select size="large"
                                        v-model="brewery.brewery_state">
                                    <el-option v-for="option in breweryStates"
                                                class="select-warning"
                                                :value="option.value"
                                                :label="option.label"
                                                :key="option.value">
                                    </el-option>
                                </el-select>
                                </span>
                            </span>
                        </span>
                        <fg-input label="Brewery Description">
                            <textarea v-model="brewery.brewery_description" class="form-control" rows="3"></textarea>
                        </fg-input>
                    </div>
                    <div class="col-4">
                        <label>Brewery Logo</label><br>
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            action=""
                            :http-request="handleAction"
                            :on-change="handleChange"
                            :file-list="breweryLogo"
                            list-type="picture">
                            <el-button size="small" type="success">Click to upload new logo</el-button>
                        </el-upload>
                        <br>
                        <label>Partnered</label><br>
                        <l-switch v-model="brewery.brewery_partnered">
                            <i class="fa fa-times" slot="off"></i>
                        </l-switch>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <button class="btn btn-warning btn-fill" @click="updateBrewery(key)">Update Brewery</button>
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
      [Button.name]: Button,
      [Select.name]: Select,
      [Option.name]: Option,
      [Upload.name]: Upload,
      LSwitch
    },
    firebase: function () {
      return {
        _breweries: breweries
      }
    },
    data () {
      return {
        key: this.$route.params.id,
        brewery: [],
        brewery_file: null,
        breweryLogo: [
            {
                url: ''
            }
        ],
        switches: {
          withIconsOn: true,
          withIconsOff: false
        },
        breweryTypes: breweryTypes,
        breweryCountries: breweryCountries,
        breweryStates: breweryStates
      }
    },
    mounted () {
        breweries.orderByKey().equalTo(this.key).once('value')
        .then ((snapshot) => {
            this.brewery = snapshot.child(this.key).val()
            this.breweryLogo[0].url = snapshot.child(this.key).child('brewery_imgUrl').val()
        })
    },
    methods: {
        refreshBrewery () {
            this.brewery = this._breweries.find(obj => obj['.key'] === this.key)
        },
        updateBrewery (key) {
            breweries.child(key).set({
                brewery_name: this.brewery.brewery_name,
                brewery_type: this.brewery.brewery_type,
                country_name: this.brewery.country_name,
                brewery_city: this.brewery.brewery_city,
                brewery_state: this.brewery.brewery_state,
                brewery_description: this.brewery.brewery_description,
                brewery_partnered: this.brewery.brewery_partnered
            })
            this.notifyEdit('top', 'right')
            this.refreshBrewery()
        },
        handleChange(file,fileList) {
            this.breweryLogo[0] = fileList.shift()
        },
        handleAction(file) {
            console.log(file.file)
            this.brewery_file = file.file
        },
        notifyEdit (verticalAlign, horizontalAlign) {
            this.$notify(
            {
                component: {
                template: '<span>Brewery Updated!</span>'
                },
                icon: 'nc-icon nc-check-2',
                horizontalAlign: horizontalAlign,
                verticalAlign: verticalAlign,
                type: 'success',
                showClose: false
            })
        }
    }
  }
</script>

<style scoped>
.edit-btn { padding-right: 25px; }
.swal2-confirm { margin-right: 15px; }
.brewery-logo { width: 100%; }
.brewery-type, .brewery-country {
    margin-bottom: 1rem;
    width: 100%;
}
textarea {
    height: 78px;
}
.el-select { width: 100% }
.el-dialog {
    width: 50%;
  }
  @media (max-width: 800px){
    .el-dialog{
      width: 90%
    }
  }
</style>