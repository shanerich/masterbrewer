<template>
     
    <div class="row">
        <div class="col-md-12">
            <card class="horizontal-form" title="Edit Beer">
                <div class="row">
                    <div class="col-8">
                        <el-select class="beer-brewery" 
                                    size="large"
                                    placeholder="Brewery Name"
                                    v-model="beer.beer_brewery_name">
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
                                v-model="beer.beer_name">
                        </fg-input>
                        <label>Beer Style</label><br>
                        <el-select class="beer-style" 
                                    size="large"
                                    placeholder="Beer Style"
                                    v-model="beer.beer_style">
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
                                    v-model="beer.beer_abv">
                            </fg-input>
                            <fg-input label="IBU"
                                    class="col-sm-6"
                                    type="text"
                                    placeholder="Beer IBU"
                                    v-model="beer.beer_ibu">
                            </fg-input>
                        </span>
                        <fg-input label="Beer Description">
                            <textarea v-model="beer.beer_description" class="form-control" placeholder="Beer Description" rows="7"></textarea>
                        </fg-input>
                    </div>
                    <div class="col-4">
                        <label>Beer Logo</label><br>
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            action=""
                            :http-request="handleAction"
                            :on-change="handleChange"
                            :file-list="beerLogo"
                            list-type="picture">
                            <el-button size="small" type="success">Click to upload new logo</el-button>
                        </el-upload>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <button class="btn btn-warning btn-fill" @click="updateBeer(key)">Update Beer</button>
                    </div>
                </div>
            </card>
        </div>
    </div>
</template>

<script>
    import { Input, Button, Select, Option, Upload } from 'element-ui'
    import beerStyles from 'src/data/options/beerstyles'
    import { gs } from 'src/util/firebase'
    import { beers } from 'src/util/firebase'
    import { breweries } from 'src/util/firebase'
    import swal from 'sweetalert2'
    import 'sweetalert2/dist/sweetalert2.css'

  export default {
    components: {
      [Button.name]: Button,
      [Select.name]: Select,
      [Option.name]: Option,
      [Upload.name]: Upload
    },
    firebase: function () {
      return {
        _beers: beers,
        _breweries: breweries
      }
    },
    data () {
      return {
        key: this.$route.params.id,
        beer: [],
        beer_file: null,
        beerLogo: [
            {
                url: ''
            }
        ],
        beerStyles: beerStyles
      }
    },
    mounted () {
        beers.orderByKey().equalTo(this.key).once('value')
        .then ((snapshot) => {
            this.beer = snapshot.child(this.key).val()
            this.beerLogo[0].url = snapshot.child(this.key).child('beer_imgUrl').val()
        })
    },
    methods: {
        refreshBeer () {
            this.beer = this._beers.find(obj => obj['.key'] === this.key)
        },
        updateBeer (key) {
            beers.child(key).set({
                beer_brewery_id: this.beer.beer_brewery_id,
                beer_brewery_name: this.beer.beer_brewery_name,
                beer_name: this.beer.beer_name,
                beer_style: this.beer.beer_style,
                beer_abv: this.beer.beer_abv,
                beer_ibu: this.beer.beer_ibu,
                beer_description: this.beer.beer_description
            })
            this.notifyEdit('top', 'right')
            this.refreshBeer()
        },
        handleChange(file,fileList) {
            this.beerLogo[0] = fileList.shift()
        },
        handleAction(file) {
            console.log(file.file)
            this.beer_file = file.file
        },
        notifyEdit (verticalAlign, horizontalAlign) {
            this.$notify(
            {
                component: {
                template: '<span>Beer Updated!</span>'
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
.beer-logo { width: 100%; }
.beer-style {
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