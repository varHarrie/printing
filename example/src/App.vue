<template>
  <div id="app">
    <div class="actions">
      <button @click="onPrint('print', false)">print (scan)</button>
      <button @click="onPrint('print', true)">print (global)</button>
    </div>
    <div class="paper" ref="print" data-print-style="width: 100%">
      <img class="logo" src="./logo.png"/>
      <div class="title" data-print-style="width: 100%">Table</div>
      <table data-print-style="width: 100%">
        <thead>
          <tr>
            <th>A</th>
            <th colspan="2">B</th>
            <th colspan="2">C</th>
            <th colspan="2">D</th>
            <th>E</th>
          </tr>
          <tr>
            <th>A</th>
            <th>B1</th>
            <th>B2</th>
            <th>C1</th>
            <th>C2</th>
            <th>D1</th>
            <th>D2</th>
            <th>E</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) of rows" :key="rowIndex">
            <td v-for="(col, colIndex) of row" :key="colIndex">
              <textarea class="text" :value="col"></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import print from 'printing'

  export default {
    data () {
      return {
        rows: []
      }
    },
    mounted () {
      const rows = Array.from({length: 30}).map(() => {
        return Array.from({length: 8}).map((_, i) => i.toString().repeat(Math.random() * 30 + 10))
      })
      this.rows = rows
    },
    methods: {
      onPrint (target, globalCss) {
        const options = globalCss ? {injectGlobalCss: true} : {scanStyles: true}
        print(this.$refs[target], options)
      }
    }
  }
</script>

<style lang="less" scoped>
  #app {
    padding: 10px 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: white;
  }

  .paper {
    position: relative;
    width: 100%;
  }

  .logo {
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
  }

  .title {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
  }

  table {
    width: 100%;
  }

  td {
    white-space: inherit;
    word-break: break-all;
  }

  .text {
    padding: 6px;
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    outline: none;
  }
</style>
