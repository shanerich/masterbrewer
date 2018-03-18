<template>
    <div class="row">
      <div class="col-12">
      <card title="Edit Breweries">
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
          <div class="col-sm-12">
            <el-table stripe
                      style="width: 100%;"
                      :data="queriedData"
                      border>
              <el-table-column v-for="column in tableColumns"
                               :key="column.label"
                               :min-width="column.minWidth"
                               :prop="column.prop"
                               :label="column.label">
              </el-table-column>
              <el-table-column
                :min-width="75"
                fixed="right"
                label="Actions">
                <template slot-scope="props">
                  <a v-tooltip.top-center="'Edit'" class="btn-warning btn-simple btn-link edit-btn"
                     @click="handleEdit(props.$index, props.row, props.row['.key'])"><i class="fa fa-2x fa-edit"></i></a>
                  <a v-tooltip.top-center="'Delete'" class="btn-danger btn-simple btn-link del-btn"
                     @click="handleDelete(props.row['.key'])"><i class="fa fa-2x fa-times"></i></a>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div slot="footer" class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
          <div class="">
            <p class="card-category">Showing {{from + 1}} to {{to}} of {{total}} entries</p>
          </div>
          <l-pagination class="pagination-no-border"
                        v-model="pagination.currentPage"
                        :per-page="pagination.perPage"
                        :total="pagination.total">
          </l-pagination>
        </div>
      </card>
    </div>
    <!-- MODALS -->
    <el-dialog
      title="Edit Brewery"
      :visible.sync="modals.editBrewery">
      <div class="row">
        <div class="col-md-12">
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
                          class="col-sm-6"
                          type="text"
                          v-model="brewery_city">
                  </fg-input>
                  <span class="col-sm-6">
                  <label>State</label>
                  <el-select size="large"
                          v-model="brewery_state">
                      <el-option v-for="option in selects.states"
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
              <textarea v-model="brewery_description" class="form-control" rows="3"></textarea>
          </fg-input>
          <button class="btn btn-success btn-fill" @click="updateBrewery(upKey)">Update</button>
          <button class="btn btn-danger btn-fill" @click="closeModal('editBrewery')">Cancel</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { Dialog, Table, TableColumn, Select, Option } from 'element-ui'
  import Vue from 'vue'
  import {Pagination as LPagination} from 'src/components/index'
  import { db } from 'src/util/firebase'
  import { breweries } from 'src/util/firebase'
  import Fuse from 'fuse.js'
  import swal from 'sweetalert2'

  export default {
    components: {
      LPagination,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Dialog.name]: Dialog
    },
    computed: {
      pagedData () {
        return this.tableData.slice(this.from, this.to)
      },
      /***
       * Searches through table data and returns a paginated array.
       * Note that this should not be used for table with a lot of data as it might be slow!
       * Do the search and the pagination on the server and display the data retrieved from server instead.
       * @returns {computed.pagedData}
       */
      queriedData () {
        let result = this.tableData
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
        this.pagination.total = this.tableData.length
        return this.tableData.length
      }
    },
    firebase: function () {
      return {
        tableData: breweries
      }
    },
    data () {
      return {
        modals: {
          editBrewery: false
        },
        pagination: {
          perPage: 10,
          currentPage: 1,
          perPageOptions: [10, 25, 50],
          total: 0
        },
        searchQuery: '',
        propsToSearch: ['brewery_name'],
        tableColumns: [
          {
            prop: 'brewery_name',
            label: 'Brewery Name',
            minWidth: 225
          },
          {
            prop: 'brewery_type',
            label: 'Type',
            minWidth: 175
          },
          {
            prop: 'country_name',
            label: 'Country',
            minWidth: 125
          }
        ],
        fuseSearch: null,
        upKey: '',
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
      openModal (name) {
        this.modals[name] = true
      },
      closeModal (name) {
        this.modals[name] = false
      },
      showSwal(key) {
        swal({
          title: 'Delete Brewery?',
          text: `This can't be undone!`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success btn-fill',
          cancelButtonClass: 'btn btn-danger btn-fill',
          confirmButtonText: 'Delete',
          buttonsStyling: false
        }).then((result) => {
          if (result.value) {
            breweries.child(key).remove() //remove brewery from firebase
            /*swal({
              title: 'Deleted!',
              text: 'Brewery has been deleted.',
              type: 'success',
              confirmButtonClass: 'btn btn-success btn-fill',
              buttonsStyling: false
            })*/
            this.notifyDelete('top', 'right')
          }
        })
      },
      handleEdit (index, row, rowkey) {
        this.upKey = rowkey
        this.brewery_name = row.brewery_name
        this.brewery_type = row.brewery_type
        this.country_name = row.country_name
        this.brewery_city = row.brewery_city
        this.brewery_state = row.brewery_state
        this.brewery_description = row.brewery_description
        this.brewery_verified = row.brewery_verified
        this.openModal('editBrewery')
      },
      updateBrewery (key) {
        breweries.child(key).set({
            brewery_name: this.brewery_name,
            brewery_type: this.brewery_type,
            country_name: this.country_name,
            brewery_city: this.brewery_city,
            brewery_state: this.brewery_state,
            brewery_description: this.brewery_description
          }
        )
        this.closeModal('editBrewery')
        this.notifyEdit('top', 'right')
      },
      handleDelete (rowkey) {
        this.showSwal(rowkey) //trigger sweet alert confirmation
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
      },
      notifyDelete (verticalAlign, horizontalAlign) {
        this.$notify(
          {
            component: {
              template: '<span>Brewery Deleted!</span>'
            },
            icon: 'nc-icon nc-check-2',
            horizontalAlign: horizontalAlign,
            verticalAlign: verticalAlign,
            type: 'danger',
            showClose: false
          })
      }
    },
    mounted () {
      this.fuseSearch = new Fuse(this.tableData, {keys: ['brewery_name']})
    }
  }
</script>

<style scoped>
.edit-btn { padding-right: 25px; }
.swal2-confirm { margin-right: 15px; }
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
