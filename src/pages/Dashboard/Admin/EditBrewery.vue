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
                      placeholder="Search records"
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
                     @click="handleEdit(props.$index, props.row)"><i class="fa fa-2x fa-edit"></i></a>
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
  </div>
</template>

<script>
  import { Table, TableColumn, Select, Option } from 'element-ui'
  import {Pagination as LPagination} from 'src/components/index'
  import { db } from 'src/util/firebase'
  import { breweries } from 'src/util/firebase'
  //import users from 'src/pages/Dashboard/Tables/users'
  import Fuse from 'fuse.js'
  import swal from 'sweetalert2'

  export default {
    components: {
      LPagination,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
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
        //tableData: users,
        fuseSearch: null
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
            swal({
              title: 'Deleted!',
              text: 'Brewery has been deleted.',
              type: 'success',
              confirmButtonClass: 'btn btn-success btn-fill',
              buttonsStyling: false
            })
          }
        })
      },
      handleEdit (index, row) {
        alert(`Your want to edit ${row.brewery_name}`)
      },
      handleDelete (rowkey) {
        this.showSwal(rowkey) //trigger sweet alert confirmation
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
</style>
