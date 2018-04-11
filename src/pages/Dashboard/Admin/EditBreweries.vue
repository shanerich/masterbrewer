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
              <el-table-column min-width="75" 
                               label="Logo">
                <template slot-scope="{row}">
                  <img :src="row.brewery_imgUrl" alt="Brewery Logo" class="brewery-logo">
                </template>
              </el-table-column>
              <el-table-column min-width="200"
                               prop="brewery_name"
                               label="Brewery Name">
              </el-table-column>
              <el-table-column min-width="125"
                               prop="brewery_type"
                               label="Type">
              </el-table-column>
              <el-table-column min-width="100"
                               prop="country_name"
                               label="Country">
              </el-table-column>
              <el-table-column
                min-width="75"
                fixed="right"
                label="Actions">
                <template slot-scope="props">
                  <router-link :to="'/admin/editbreweries/'+props.row['.key']" 
                               v-tooltip.top-center="'Edit'"
                               class="edit-btn">
                    <i class="fa fa-2x fa-edit"></i>
                  </router-link>
                  <a v-tooltip.top-center="'Delete'" 
                     class="btn-danger btn-simple btn-link del-btn"
                     @click="handleDelete(props.row['.key'])">
                     <i class="fa fa-2x fa-times"></i>
                  </a>
                </template>
              </el-table-column>
            </el-table>
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
</template>

<script>
  import { Dialog, Table, TableColumn, Select, Option } from 'element-ui'
  import Vue from 'vue'
  import {Pagination as LPagination} from 'src/components/index'
  import breweryTypes from 'src/data/options/brewerytypes'
  import breweryCountries from 'src/data/options/brewerycountries'
  import breweryStates from 'src/data/options/brewerystates'
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
          perPage: 5,
          currentPage: 1,
          perPageOptions: [5, 10, 25],
          total: 0
        },
        searchQuery: '',
        propsToSearch: ['brewery_name'],
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
        breweryTypes: breweryTypes,
        breweryCountries: breweryCountries,
        breweryStates: breweryStates
      }
    },
    
    methods: {
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
