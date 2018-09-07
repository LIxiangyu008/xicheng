<template>
  <div id="bubble" class="bubble" style="position: absolute; bottom:0;left: 0;width:400px;z-index: 999;display:none;" >
    <div id="tools" style="text-align : right">
      <span  style="color: rgb(95, 74, 121);padding: 5px;position: absolute;left: 10px;top: 4px;">对象属性</span>
      <span @click="clickClose"  class="fui-cross" title="关闭" id="close" style="color: darkgrey;padding:5px;position: absolute;right: 10px;top: 4px;">关闭</span>
    </div>
    <div style="overflow-y:scroll;height:190px" id="tableContainer">
      <table id="tab"></table>
    </div>
  </div>
</template>
<script>
export default({
    name: 'Tables',
  data(){
    return{
        istableAttr:false
    }
  },
  mounted(){
    EventBus.$emit('clickCols',this.clickClose)
    EventBus.$on('tablevalue',feature=>{
        var table = document.getElementById('tab')
      for (var i = table.rows.length-1;i > -1;i--){
        table.deleteRow(i);
      }
      for(var key in feature ){
        var newRow = table.insertRow();
        var cell1 = newRow.insertCell();
        var cell2 = newRow.insertCell();
        cell1.innerHTML = key;
        cell2.innerHTML = feature[key];
      }
    });
  },
  methods:{
      clickClose(){
        document.getElementById('bubble').style.display='none';
      }
  }

  })
</script>
<style lang="scss" scope>
  .bubble{
    text-align: center;
    position: absolute;
    padding: 15px;
    padding-top:35px;
    margin: 0;
    background: #fff;
  }
  .bubble:after {
    content: "";
    position: absolute;
    bottom: -50px;
    left: 50px;
    border-width: 0 20px 50px 0px;
    border-style: solid;
    border-color: transparent #fff;
    display: block;
    width: 0;
  }
  #tab{
    width: 100%;
  }
  #tab td, #tab th {
    padding: 5px 10px;
    font-size: 12px;
    font-family: Verdana;
    color: rgb(95, 74, 121);
    border: 1px solid rgb(193, 168, 223);
  }
  #tab thead, #tab tr {
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgb(211, 202, 221);
  }
  #tab tr:nth-child(even) {
    background: rgb(223, 216, 232);
  }
  .fui-cross{
    cursor: pointer;
  }
</style>
