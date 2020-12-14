<template>
  <el-date-picker
    :key="keys"
    v-model="dataModel"
    :type="widget.options.type"
    :picker-options="pickerBirthdayBefore"
    @change="dateChange"
    :placeholder="widget.options.placeholder"
    :start-placeholder="widget.options.startPlaceholder"
    :end-placeholder="widget.options.endPlaceholder"
    :readonly="widget.options.readonly"
    :disabled="!edit || widget.options.disabled"
    :editable="widget.options.editable"
    :clearable="widget.options.clearable"
    :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
    :format="widget.options.format"
    :style="{width: isTable ? '100%' : widget.options.width}"
  ></el-date-picker>
</template>
<script>
export default {
  name: "m-date",
  props: ["widget", "edit", "value", "isTable"],
  data() {
    return {
      keys: new Date().getTime(),
      dataModel: this.value,
      pickerBirthdayBefore:{
       disabledDate: time => {
        return this.widget.options.daterange ? time.getTime() > new Date().getTime() : ''
       }
      }
    }
  },
  created() {
    if (this.widget.options.isnowdate) {
      if(this.value == ''){
        this.dataModel = new Date();
        this.$emit("input", this.formatTime(this.dataModel));
      }
     
    }
  },
  methods: {
    dateChange(val) {
      this.$emit("input", val);
    },
    formatNumber (n) {
      n = n.toString();
      return n[1] ? n : "0" + n;
    },
    formatTime(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      // const hour = date.getHours();
      // const minute = date.getMinutes();
      // const second = date.getSeconds();
      return (
        [year, month, day].map(this.formatNumber).join("-")
      );
    }
  },
  watch: {
    'widget.options.disabled':{
       handler(val){
        if(this.value != ''){
          let date = new Date(this.value);
          this.$emit("input", this.formatTime(date));
          this.dataModel = this.formatTime(date);
        }else{
          this.dataModel = this.value;
        }
       
        this.keys = new Date().getTime();
      },
      deep:true
    }
  }
};
</script>
