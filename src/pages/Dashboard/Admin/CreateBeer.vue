<template>
    <div class="row">
        <div class="col-md-12">
            <card class="horizontal-form" title="Horizontal Form">
                <template slot="header">
                    <h4 class="card-title">
                    Create Beer
                    </h4>
                </template>
                <form action="#" method="#" @submit.prevent>
                    <div class="row">
                        <div class="col-8">
                            <label>Brewery</label><br>
                            <el-select class="beer-brewery" 
                                    size="large"
                                    placeholder="Brewery Name"
                                    v-model="beer_brewery">
                                <el-option v-for="brewery in _breweries"
                                            class="select-warning"
                                            :value="brewery.brewery_name"
                                            :label="brewery.brewery_name"
                                            :key="brewery['.key']">
                                </el-option>
                            </el-select>
                            <fg-input label="Beer Name"
                                    type="text"
                                    placeholder="Beer Name"
                                    v-model="beer_name">
                            </fg-input>
                            <label>Beer Style</label><br>
                            <el-select class="beer-style" 
                                    size="large"
                                    placeholder="Beer Style"
                                    v-model="beer_style">
                                <el-option v-for="style in beerStyles"
                                            class="select-warning"
                                            :value="style.value"
                                            :label="style.label"
                                            :key="style.value">
                                </el-option>
                            </el-select>
                            <span class="row">
                                <fg-input label="ABV"
                                        class="col-sm-6"
                                        type="text"
                                        placeholder="Beer ABV"
                                        v-model="beer_abv">
                                </fg-input>
                                <fg-input label="IBU"
                                        class="col-sm-6"
                                        type="text"
                                        placeholder="Beer IBU"
                                        v-model="beer_ibu">
                                </fg-input>
                            </span>
                            <fg-input label="Beer Description">
                                <textarea v-model="beer_description" class="form-control" placeholder="Beer Description" rows="3"></textarea>
                            </fg-input>
                        </div>
                        <div class="col-2">
                            <label>Beer Logo</label><br>
                            <el-upload
                                class="upload-demo"
                                ref="upload"
                                action=""
                                :http-request="handleAction"
                                list-type="picture">
                                <el-button size="small" type="success">Click to upload</el-button>
                            </el-upload>
                        </div>
                    </div>
                </form>
                <div class="row">
                    <div class="col-md-12">
                    <button @click="createBeer()" type="submit" class="btn btn-fill btn-warning">
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
import beerStyles from 'src/data/options/beerstyles'
import { gs } from 'src/util/firebase'
import { beers } from 'src/util/firebase'
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
    firebase: {
        _breweries: breweries,
    },
    data () {
        return {
            beer_brewery: '',
            beer_brewery_obj: [],
            beer_brewery_name: '',
            beer_name: '',
            beer_imgUrl: '',
            beer_style: '',
            beer_abv: '',
            beer_ibu: '',
            beer_description: '',
            beer_file: null,
            gskey: '',
            beerStyles: beerStyles
        }
    },
    methods: {
        createBeer() {
            var _this = this;
            let imageUrl
            let key
            this.beer_brewery_obj = this._breweries.find((obj) =>
                obj.brewery_name === this.beer_brewery
            )
            this.beer_brewery_id = this.beer_brewery_obj['.key']
            beers.push({
                beer_brewery_id: this.beer_brewery_id,
                beer_brewery_name: this.beer_brewery,
                beer_name: this.beer_name,
                beer_imgUrl: this.beer_imgUrl,
                beer_style: this.beer_style,
                beer_abv: this.beer_abv,
                beer_ibu: this.beer_ibu,
                beer_description: this.beer_description,
            })
            .then((data) => {
                key = data.key
                return key
            })
            .then(key => {
                const filename = this.beer_file.name
                const ext = filename.slice(filename.lastIndexOf('.'))
                return gs.ref('beers/' + key + ext).put(this.beer_file) 
            })
            .then(fileData => {
                imageUrl = fileData.metadata.downloadURLs[0]
                return beers.child(key).update({beer_imgUrl: imageUrl})
            })
            .then(() => {
                this.showSwal()
                this.beer_brewery = ''
                this.beer_name = ''
                this.beer_style = ''
                this.beer_abv = ''
                this.beer_ibu = ''
                this.beer_description = ''
                this.$refs.upload.clearFiles();
            })
            .catch((error) => {
                console.log(error)
            })
        },
        showSwal() {
            swal({
                title: `Beer Created!`,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning btn-fill',
                type: 'success'
            })
        },
        handleAction(file) {
            //console.log(file.file)
            this.beer_file = file.file
        }
    }
}
</script>

<style scoped>
.beer-style, .beer-brewery {
    margin-bottom: 1rem;
    width: 100%;
}
textarea {
    height: 78px;
}
</style>