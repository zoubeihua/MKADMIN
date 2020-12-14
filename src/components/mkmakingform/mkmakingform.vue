<template>

  <mk-making-form ref="makingForm"
  :basic-fields="['input','textarea','number','units','radio','checkbox','time','date','score','select','text','slider']"
  :advance-fields="['imgupload','table']"
  :layout-fields="['grid','tabs','divider']"
  upload preview generate-code generate-json clearable>
    <template slot="action"></template>
  </mk-making-form>
</template>

<script>
import mkMakingForm from "./components/Container";
export default {
  name: "demo-mkmakingform-new",
  components: {
    mkMakingForm
  },
  mounted() {

  }
};
</script>
