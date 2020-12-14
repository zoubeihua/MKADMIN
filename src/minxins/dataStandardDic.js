import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("d2admin/user", ["info"]),
  },
  methods: {
    getDicStandarDcode(codetype){
      let codeData = this.info.dataStandardDic;
      return codeData.filter(item => item.codetype == codetype);
    },
    //table 标题过滤数据
    GetTablefilters(codeName) {
      let filterArrStatus = [];
      let resData = this.getDicStandarDcode(codeName);
        let Arr = resData;
        Arr.forEach(item => {
          filterArrStatus.push({
            text: item.bzname,
            value: item.bzname
          })
        })
      return filterArrStatus
    }
  },
}
